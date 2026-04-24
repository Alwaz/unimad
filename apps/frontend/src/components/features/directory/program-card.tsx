import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency, formatDate, formatMode } from '@/lib/utils';
import { type Program } from '@repo/shared';
import { Banknote, Clock } from 'lucide-react';
import Image from 'next/image';

function ProgramCard({ program }: Readonly<{ program: Program }>) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex flex-1 flex-col items-start gap-3">
            <div className="flex h-14 w-14 rounded-xl border border-border bg-muted overflow-hidden">
              <Image
                src={program?.university?.logo_url || ''}
                alt={(program?.university?.short_name || '') + ' logo'}
                width={56}
                height={56}
                objectFit="contain"
              />
            </div>

            <div className="flex items-center gap-1">
              <Badge variant="secondary">{program?.program_meta?.degree_type}</Badge>
              <Badge variant="outline">{formatMode(program?.program_meta?.mode)}</Badge>
            </div>

            <div>
              <CardTitle className="text-base leading-tight">{program?.name}</CardTitle>
              <CardDescription>
                {program?.university?.short_name} • {program?.university?.city}
              </CardDescription>
            </div>
          </div>

          <CardAction>
            <Badge variant="destructive">
              {formatDate(program?.important_dates?.application_deadline)}
            </Badge>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <p className="flex font-light items-center gap-1 text-foreground">
            <Clock size={14} /> {program?.program_meta?.duration_years} years
          </p>
          <p className="flex font-light items-center gap-1 text-foreground">Admission Fee</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 font-medium text-foreground">
            <Banknote size={14} />
            PKR {formatCurrency(program?.fee_structure?.tuition_fee)} / Sem
          </p>

          <p className="flex items-center gap-1 font-medium text-foreground">
            <Banknote size={14} />
            PKR {formatCurrency(program?.fee_structure?.admission_fee)}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button size="lg" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProgramCard;
