'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Check, Shapes } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DISCIPLINES, findDisciplineByProgram, findProgramByValue } from './discipline-data';

type DisciplineDialogProps = {
  selectedProgram?: string;
  onApply: (programSlug: string) => void;
};

export function DisciplineDialog({ selectedProgram, onApply }: Readonly<DisciplineDialogProps>) {
  const initialProgram = selectedProgram ?? '';
  const selectedDiscipline = selectedProgram
    ? (findDisciplineByProgram(selectedProgram) ?? DISCIPLINES[0])
    : DISCIPLINES[0];
  const initialDisciplineValue = selectedDiscipline?.value;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [draftDiscipline, setDraftDiscipline] = useState(initialDisciplineValue);
  const [draftProgram, setDraftProgram] = useState(initialProgram);

  //   This doesnt look right
  useEffect(() => {
    if (open) {
      setDraftDiscipline(initialDisciplineValue);
      setDraftProgram(initialProgram);
      setStep(1);
    }
  }, [open, initialDisciplineValue, initialProgram]);

  const discipline = useMemo(
    () => DISCIPLINES.find((item) => item.value === draftDiscipline) ?? DISCIPLINES[0],
    [draftDiscipline],
  );

  const selectedProgramName = useMemo(
    () => (selectedProgram ? (findProgramByValue(selectedProgram)?.label ?? '') : ''),
    [selectedProgram],
  );

  function handleDisciplineSelect(value: string) {
    setDraftDiscipline(value);
    setDraftProgram('');
    setStep(2);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white hover:bg-white/85 w-full text-left text-sm">
          <Shapes /> {selectedProgramName ? selectedProgramName : 'Select Discipline'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            {step === 2 ? (
              <Button variant="ghost" size="icon" onClick={() => setStep(1)} type="button">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <div className="h-10 w-10" />
            )}
            <DialogTitle className="text-xl font-semibold text-foreground">
              {step === 1 ? 'Select Discipline' : discipline.label}
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {step === 1
              ? 'Select your area of specialization from the available disciplines.'
              : 'Choose your specific program within the selected discipline.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {step === 1 ? (
            <div className="grid gap-3">
              {DISCIPLINES.map((item) => (
                <Button
                  key={item.value}
                  variant={item.value === draftDiscipline ? 'secondary' : 'outline'}
                  className="group flex w-full flex-col items-start gap-2 rounded-3xl border px-4 py-4 text-left shadow-sm transition-all hover:border-primary/70 hover:bg-primary/5"
                  onClick={() => handleDisciplineSelect(item.value)}
                  type="button"
                >
                  <span className="text-base font-semibold text-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground">
                    Explore programs in {item.label}.
                  </span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {discipline.programs.map((program) => {
                const selected = program.value === draftProgram;
                return (
                  <button
                    key={program.value}
                    type="button"
                    onClick={() => setDraftProgram(program.value)}
                    className={`flex w-full items-center justify-between rounded-3xl border px-4 py-4 text-left transition-all ${
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-foreground hover:border-primary/70 hover:bg-muted/80'
                    }`}
                  >
                    <div>
                      <p
                        className={`text-base font-semibold ${selected ? 'text-primary-foreground' : 'text-foreground'}`}
                      >
                        {program.label}
                      </p>
                      <p
                        className={`text-sm ${selected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
                      >
                        {selected ? 'Highly recommended' : 'Select this program'}
                      </p>
                    </div>
                    {selected ? <Check className="h-5 w-5" /> : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            disabled={step === 2 ? draftProgram.length === 0 : false}
            onClick={() => {
              if (step === 1) {
                setStep(2);
                return;
              }

              if (draftProgram) {
                onApply(draftProgram);
                setOpen(false);
              }
            }}
            className="w-full rounded-3xl bg-foreground text-background"
          >
            {step === 1 ? 'Continue' : 'View Universities'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
