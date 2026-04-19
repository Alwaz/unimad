'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
        <DialogHeader>
          <div className="flex items-center">
            {step === 2 && (
              <Button variant="ghost" size="icon" onClick={() => setStep(1)} type="button">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle asChild className="text-left">
              <h3>{step === 1 ? 'Select Discipline' : discipline?.label}</h3>
            </DialogTitle>
          </div>
          <DialogDescription asChild>
            <p>
              {step === 1
                ? 'Select your area of specialization from the available disciplines.'
                : 'Choose your specific program within the selected discipline.'}
            </p>
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Body */}
        <ScrollArea className="max-h-75 w-full rounded-md border p-4">
          <div className="space-y-3">
            {step === 1 ? (
              <div className="grid gap-3">
                {DISCIPLINES.map((item) => (
                  <Button
                    type="button"
                    size="xl"
                    key={item.value}
                    variant={item.value === draftDiscipline ? 'secondary' : 'outline'}
                    onClick={() => handleDisciplineSelect(item.value)}
                    className="group flex w-full flex-col items-start 
                   "
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="grid gap-3">
                {discipline?.programs.map((program) => {
                  const selected = program.value === draftProgram;
                  return (
                    <Button
                      size="lg"
                      key={program.value}
                      type="button"
                      onClick={() => setDraftProgram(program.value)}
                      className={`flex w-full 
                      items-center justify-between  border 
                      text-left  ${
                        selected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary/70 hover:bg-muted/80'
                      }`}
                    >
                      {program.label}
                      {selected ? <Check className="h-5 w-5" /> : null}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            type="button"
            variant="default"
            size="xl"
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
            className="w-full"
          >
            {step === 1 ? 'Continue' : 'View Universities'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
