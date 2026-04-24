import type { ModeType } from '@repo/shared';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('en-PK');
}

export function formatMode(mode: ModeType): string {
  switch (mode) {
    case 'ON_CAMPUS':
      return 'On Campus';
    case 'ONLINE':
      return 'Online';
    case 'HYBRID':
      return 'Hybrid';
    default:
      return mode;
  }
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return '';

  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();

  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return `${month} ${day}${getOrdinal(day)}, ${year}`;
}
