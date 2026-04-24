import { type Program } from '@repo/shared';

export const TAB_VALUES = {
  DIRECTORY: 'directory',
  COMPARE: 'compare',
} as const;

// update Program type in shared package and add these fields to it,

export const PROGRAMS: Program[] = [
  {
    name: 'Software Engineering',
    program_slug: 'software-engineering',

    university: {
      short_name: 'MUET',
      full_name: 'Mehran University of Engineering & Technology',
      city: 'Jamshoro',
      logo_url: 'https://admissions.muet.edu.pk/wp-content/uploads/2025/09/cropped-muetlogo.png',
    },

    important_dates: {
      application_deadline: new Date('2026-05-05T00:00:00.000Z'),
      test_date: {
        type: 'fixed',
        date: new Date('2026-05-22T00:00:00.000Z'),
      },
    },

    program_meta: {
      degree: 'bachelor',
      degree_type: 'B.E.',
      duration_years: 4,
      mode: 'ON_CAMPUS',
      series: 'Phase I',
    },

    fee_structure: {
      tuition_fee: 25000,
      admission_fee: 27800,
    },
  },

  {
    name: 'Software Engineering',
    program_slug: 'software-engineering',

    university: {
      short_name: 'NUST SEECS',
      full_name: 'School of Electrical Engineering and Computer Science',
      city: 'Islamabad',
      logo_url:
        'https://seecs.nust.edu.pk/wp-content/uploads/2025/01/xNUST-Emblem.png.pagespeed.ic.NKfrdIdJ1-.png',
    },

    important_dates: {
      application_deadline: new Date('2026-04-05T00:00:00.000Z'),
      test_date: {
        type: 'tentative',
        note: 'Tentative reschedule, subject to confirmation',
        expected_range: {
          start: new Date('2026-05-05T00:00:00.000Z'),
          end: new Date('2026-05-08T00:00:00.000Z'),
        },
      },
    },

    program_meta: {
      degree: 'bachelor',
      degree_type: 'B.E.',
      duration_years: 4,
      mode: 'ON_CAMPUS',
      series: 'Series – 4',
    },

    fee_structure: {
      tuition_fee: 197050,
      admission_fee: 35000,
    },
  },

  {
    name: 'Computer Science',
    program_slug: 'computer-science',

    university: {
      short_name: 'QAU',
      full_name: 'Quaid-i-Azam University',
      city: 'Islamabad',
      logo_url: 'https://qau.edu.pk/wp-content/uploads/2026/02/logo.png',
    },

    important_dates: {
      application_deadline: new Date('2026-08-10T00:00:00Z'),
      test_date: {
        type: 'fixed',
        date: new Date('2026-08-15T00:00:00Z'),
      },
    },

    program_meta: {
      degree: 'bachelor',
      degree_type: 'B.S.',
      duration_years: 4,
      mode: 'ON_CAMPUS',
      series: 'Natural Sciences',
      description:
        'Undergraduate BS program in Computer Science offered by the Faculty of Natural Sciences.',
    },

    fee_structure: {
      tuition_fee: 60860,
      admission_fee: 2860,
    },
  },

  {
    name: 'Software Engineering',
    program_slug: 'software-engineering',

    university: {
      short_name: 'FAST',
      full_name: 'National University of Computer and Emerging Sciences',
      city: 'Islamabad',
      logo_url: 'https://crystalpng.com/wp-content/uploads/2025/08/Fast-University-Logo.png',
    },

    important_dates: {
      application_deadline: new Date('2026-01-03T00:00:00.000Z'),
      test_date: {
        type: 'tentative',
        note: 'Test date not announced yet',
      },
    },

    program_meta: {
      degree: 'bachelor',
      degree_type: 'B.S.',
      duration_years: 4,
      mode: 'ON_CAMPUS',
      series: 'Fall Intake',
    },

    fee_structure: {
      tuition_fee: 210000,
      admission_fee: 30000,
    },
  },
];
