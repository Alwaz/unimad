'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MODE, type ModeType } from '@repo/shared';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { DisciplineDialog } from './discipline-dialog';

const degreeOptions = [
  { value: 'bachelor', label: 'Bachelor' },
  { value: 'master', label: 'Master' },
  { value: 'phd', label: 'PhD' },
];

const studyModeOptions: { value: ModeType; label: string }[] = [
  { value: MODE.ON_CAMPUS, label: 'On Campus' },
  { value: MODE.ONLINE, label: 'Online' },
  { value: MODE.HYBRID, label: 'Hybrid' },
];

type FilterParamValue = string | null;

export function FilterGroup() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentProgram = searchParams.get('programs') ?? '';
  const currentDegree = searchParams.get('degree') ?? '';
  const currentStudyMode = searchParams.get('mode') ?? '';

  const validDegreeValue = useMemo(
    () =>
      degreeOptions.some((option) => option.value === currentDegree) ? currentDegree : undefined,
    [currentDegree],
  );

  const validStudyModeValue = useMemo(
    () =>
      studyModeOptions.some((option) => option.value === currentStudyMode)
        ? currentStudyMode
        : undefined,
    [currentStudyMode],
  );

  const hasActiveFilter = !!(currentProgram || validDegreeValue || validStudyModeValue);

  function buildUrl(params: URLSearchParams) {
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }

  function replaceParams(params: URLSearchParams) {
    params.set('page', '1');
    router.replace(buildUrl(params));
  }

  function updateParam(key: string, value: FilterParamValue) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    replaceParams(params);
  }

  function handleApplyProgram(programSlug: string) {
    updateParam('programs', programSlug);
  }

  function handleClearFilters() {
    const params = new URLSearchParams(searchParams);
    params.delete('programs');
    params.delete('degree');
    params.delete('mode');
    replaceParams(params);
  }

  return (
    <div className="bg-muted rounded-lg p-3">
      <div className="flex  flex-wrap  items-end gap-3">
        <div className="max-w-xs  flex-1">
          <div className="space-y-2">
            <Label
              className="text-[0.65rem] uppercase tracking-wider
             text-accent-foreground"
            >
              Discipline
            </Label>
            <DisciplineDialog
              selectedProgram={currentProgram || undefined}
              onApply={handleApplyProgram}
            />
          </div>
        </div>

        <div className="max-w-xs  flex-1">
          <div className="space-y-2">
            <Label
              htmlFor="degree"
              className="text-[0.65rem] uppercase  tracking-wider 
            text-accent-foreground"
            >
              Degree type
            </Label>
            <Select
              value={validDegreeValue ?? undefined}
              onValueChange={(value: string) => updateParam('degree', value || null)}
            >
              <SelectTrigger
                id="degree"
                className="bg-white
                w-full text-sm"
              >
                <SelectValue placeholder="Bachelor's" />
              </SelectTrigger>
              <SelectContent>
                {degreeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="max-w-xs  flex-1">
          <div className="space-y-2">
            <Label
              htmlFor="mode"
              className="text-[0.65rem] uppercase  tracking-wider
               text-accent-foreground"
            >
              Study mode
            </Label>
            <Select
              value={validStudyModeValue ?? undefined}
              onValueChange={(value: string) => updateParam('mode', value || null)}
            >
              <SelectTrigger id="mode" className="bg-white w-full text-sm">
                <SelectValue placeholder="All modes" />
              </SelectTrigger>
              <SelectContent>
                {studyModeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilter && (
          <div className="flex items-center justify-center ">
            <Button
              variant="ghost"
              className="h-10 px-3  text-sm font-semibold"
              onClick={handleClearFilters}
              type="button"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
