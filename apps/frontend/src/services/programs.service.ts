import { api } from '@/lib/api';
import type { PaginatedResponse, Program, SearchParams } from '@repo/shared';

export { ApiError } from '@/lib/api';

const PAGE_SIZE = 24;

class ProgramsService {
  async getPrograms(searchParams?: SearchParams): Promise<PaginatedResponse<Program>> {
    const queryString = this.buildQueryString(searchParams);
    const path = `/programs?${queryString}`;

    const res = await api.get<PaginatedResponse<Program>>(path);
    return res.data;
  }

  private buildQueryString(params?: SearchParams): string {
    const searchParams = new URLSearchParams({ pageSize: String(PAGE_SIZE) });
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') searchParams.set(key, value);
      }
    }
    return searchParams.toString();
  }
}

export const programsService = new ProgramsService();
