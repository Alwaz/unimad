export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode: number;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SearchParams {
  query?: string;
  page?: string;
  programs?: string;
  degree?: string;
  mode?: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
}

export interface University {
  short_name: string;
  full_name: string;
  city: string;
  logo_url: string;
}

// Define as const for MODE
export const MODE = {
  ON_CAMPUS: 'ON_CAMPUS',
  ONLINE: 'ONLINE',
  HYBRID: 'HYBRID',
} as const;

export type ModeType = (typeof MODE)[keyof typeof MODE];

export type TestDate =
  | {
      type: 'fixed';
      date: Date;
    }
  | {
      type: 'range';
      start: Date;
      end: Date;
    }
  | {
      type: 'tentative';
      note?: string;
      expected_range?: {
        start: Date;
        end: Date;
      };
    };

export interface Program {
  name: string;
  program_slug: string;

  university: University;

  important_dates: {
    application_deadline: Date;
    test_date: TestDate;
  };

  program_meta: {
    degree: 'bachelor' | 'master' | 'phd';
    degree_type: string;
    duration_years: number;
    mode: ModeType;
    series: string;
    description?: string;
  };

  fee_structure: {
    tuition_fee: number; // per semester
    admission_fee: number; // non refundable
  };
}
