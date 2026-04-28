import mongoose, { type Document, Schema } from 'mongoose';
import type { Program } from '@repo/shared';

export interface IProgram extends Document, Program {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<IProgram>(
  {
    name: { type: String, required: true, trim: true },
    program_slug: { type: String, required: true, trim: true, index: true },

    university: {
      short_name: { type: String, required: true },
      full_name: { type: String, required: true },
      city: { type: String, required: true },
      logo_url: { type: String, required: true },
    },

    important_dates: {
      application_deadline: { type: Date, required: true },
      // TestDate is a discriminated union (fixed/range/tentative) — stored as Mixed
      test_date: { type: Schema.Types.Mixed, required: true },
    },

    program_meta: {
      degree: { type: String, required: true, enum: ['bachelor', 'master', 'phd'] },
      degree_type: { type: String, required: true },
      duration_years: { type: Number, required: true },
      mode: { type: String, required: true, enum: ['ON_CAMPUS', 'ONLINE', 'HYBRID'] },
      series: { type: String, required: true },
      description: { type: String },
    },

    fee_structure: {
      tuition_fee: { type: Number, required: true },
      admission_fee: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = String(ret['_id']);
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
  },
);

export const ProgramModel = mongoose.model<IProgram>('Program', programSchema);
