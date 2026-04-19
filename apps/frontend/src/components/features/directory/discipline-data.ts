export type ProgramOption = {
  value: string;
  label: string;
};

export type DisciplineOption = {
  value: string;
  label: string;
  programs: ProgramOption[];
};

export const DISCIPLINES: DisciplineOption[] = [
  {
    value: 'engineering',
    label: 'Engineering',
    programs: [
      { value: 'software-engineering', label: 'Software Engineering' },
      { value: 'computer-engineering', label: 'Computer Engineering' },
      { value: 'civil-engineering', label: 'Civil Engineering' },
    ],
  },
  {
    value: 'business',
    label: 'Business',
    programs: [
      { value: 'business-administration', label: 'Business Administration' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'accounting', label: 'Accounting' },
    ],
  },
  {
    value: 'science',
    label: 'Science',
    programs: [
      { value: 'forestry', label: 'Forestry' },
      { value: 'biology', label: 'Biology' },
      { value: 'chemistry', label: 'Chemistry' },
    ],
  },
  {
    value: 'arts',
    label: 'Arts',
    programs: [
      { value: 'fine-arts', label: 'Fine Arts' },
      { value: 'music', label: 'Music' },
      { value: 'graphic-design', label: 'Graphic Design' },
    ],
  },
  // Add more disciplines and programs to test scrollability
  {
    value: 'health',
    label: 'Health',
    programs: [
      { value: 'nursing', label: 'Nursing' },
      { value: 'public-health', label: 'Public Health' },
      { value: 'pharmacy', label: 'Pharmacy' },
    ],
  },
  {
    value: 'law',
    label: 'Law',
    programs: [{ value: 'criminal-law', label: 'Criminal Law' }],
  },
];

export function findDisciplineByProgram(programSlug: string) {
  return DISCIPLINES.find((discipline) =>
    discipline.programs.some((program) => program.value === programSlug),
  );
}

export function findProgramByValue(programSlug: string) {
  return DISCIPLINES.flatMap((discipline) => discipline.programs).find(
    (program) => program.value === programSlug,
  );
}
