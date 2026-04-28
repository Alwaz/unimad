import type { ApiResponse, PaginatedResponse, Program, SearchParams } from '@repo/shared';
import { clampPageSize, DEFAULT_PAGE_SIZE, HTTP_STATUS, MAX_PAGE_SIZE } from '@repo/shared';
import { Router, type Router as RouterType } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { AppError } from '../middleware/error-handler.js';
import { validate } from '../middleware/validate.js';
import { ProgramModel } from '../models/program.model.js';
import { cache } from '../services/cache.js';

const router: RouterType = Router();

type ProgramResponse = Program & { id: string; createdAt: string; updatedAt: string };

function toProgram(doc: { toJSON: () => Record<string, unknown> }): ProgramResponse {
  return doc.toJSON() as unknown as ProgramResponse;
}

const testDateSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('fixed'), date: z.coerce.date() }),
  z.object({ type: z.literal('range'), start: z.coerce.date(), end: z.coerce.date() }),
  z.object({
    type: z.literal('tentative'),
    note: z.string().optional(),
    expected_range: z.object({ start: z.coerce.date(), end: z.coerce.date() }).optional(),
  }),
]);

const universitySchema = z.object({
  short_name: z.string().min(1),
  full_name: z.string().min(1),
  city: z.string().min(1),
  logo_url: z.string().url(),
});

const createProgramSchema = z.object({
  name: z.string().min(1),
  program_slug: z.string().min(1),
  university: universitySchema,
  important_dates: z.object({
    application_deadline: z.coerce.date(),
    test_date: testDateSchema,
  }),
  program_meta: z.object({
    degree: z.enum(['bachelor', 'master', 'phd']),
    degree_type: z.string().min(1),
    duration_years: z.number().positive(),
    mode: z.enum(['ON_CAMPUS', 'ONLINE', 'HYBRID']),
    series: z.string().min(1),
    description: z.string().optional(),
  }),
  fee_structure: z.object({
    tuition_fee: z.number().nonnegative(),
    admission_fee: z.number().nonnegative(),
  }),
});

const updateProgramSchema = createProgramSchema.partial();

router.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query['page']) || 1;
    const pageSize = Number(req.query['pageSize']) || DEFAULT_PAGE_SIZE;
    const clampedSize = clampPageSize(pageSize, MAX_PAGE_SIZE);
    const skip = (page - 1) * clampedSize;

    const { query, programs, degree, mode } = req.query as unknown as SearchParams;

    const filter: Record<string, unknown> = {};

    if (query) {
      const q = new RegExp(query, 'i');
      filter['$or'] = [
        { name: q },
        { 'university.short_name': q },
        { 'university.full_name': q },
        { 'university.city': q },
      ];
    }
    if (programs) filter['program_slug'] = programs;
    if (degree) filter['program_meta.degree'] = degree;
    if (mode) filter['program_meta.mode'] = mode;

    const [total, docs] = await Promise.all([
      ProgramModel.countDocuments(filter),
      ProgramModel.find(filter)
        .sort({ 'important_dates.application_deadline': 1 })
        .skip(skip)
        .limit(clampedSize),
    ]);

    const items = docs.map(toProgram);
    const pageCount = Math.ceil(total / clampedSize);
    const data: PaginatedResponse<ProgramResponse> = {
      items,
      totalCount: total,
      currentPage: page,
      pageCount,
      isFirstPage: page === 1,
      isLastPage: page >= pageCount,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < pageCount ? page + 1 : null,
    };

    res.json({ success: true, data } as ApiResponse<PaginatedResponse<ProgramResponse>>);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = String(req.params['id']);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid program ID');
    }

    const cached = await cache.get<ProgramResponse>(`program:${id}`);
    if (cached) {
      res.json({ success: true, data: cached, _cached: true } as ApiResponse<ProgramResponse> & {
        _cached: boolean;
      });
      return;
    }

    const doc = await ProgramModel.findById(id);
    if (!doc) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'Program not found');
    }

    const program = toProgram(doc);
    await cache.set(`program:${id}`, program);

    res.json({ success: true, data: program } as ApiResponse<ProgramResponse>);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate({ body: createProgramSchema }), async (req, res, next) => {
  try {
    const body = req.body as z.infer<typeof createProgramSchema>;
    const doc = await ProgramModel.create(body);
    const program = toProgram(doc);

    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, data: program } as ApiResponse<ProgramResponse>);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validate({ body: updateProgramSchema }), async (req, res, next) => {
  try {
    const id = String(req.params['id']);
    const updates = req.body as z.infer<typeof updateProgramSchema>;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid program ID');
    }

    const doc = await ProgramModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!doc) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'Program not found');
    }

    const program = toProgram(doc);
    await cache.del(`program:${id}`);

    res.json({ success: true, data: program } as ApiResponse<ProgramResponse>);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = String(req.params['id']);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid program ID');
    }

    const doc = await ProgramModel.findByIdAndDelete(id);
    if (!doc) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'Program not found');
    }

    await cache.del(`program:${id}`);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
});

export { router as programsRouter };
