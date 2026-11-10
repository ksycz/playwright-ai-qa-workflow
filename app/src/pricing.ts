// Pricing rules for the ticket calculator. All money is in whole euro cents.

export const BASE_CENTS = 1890;
export const MAX_TICKETS = 10;
export const GROUP_SIZE = 8;
export const SENIOR_AGE = 65;

export type Category = 'free' | 'child' | 'adult' | 'senior';
export type Line = { age: number; category: Category; cents: number };

const MAX_AGE = 120;
const AGE_PERCENT: Record<Category, number> = { free: 0, child: 50, adult: 100, senior: 70 };
const GROUP_PERCENT = 90;

export function parseAge(raw: string): { age: number } | { error: string } {
  const text = raw.trim();
  if (text === '') return { error: 'Enter an age' };
  if (!/^\d+$/.test(text) || Number(text) > MAX_AGE) {
    return { error: 'Age must be a whole number from 0 to 120' };
  }
  return { age: Number(text) };
}

export function addVisitor(ages: number[], age: number): { ages: number[] } | { error: string } {
  if (ages.length >= MAX_TICKETS) return { error: 'An order can have at most 10 tickets' };
  return { ages: [...ages, age] };
}

export function categoryFor(age: number): Category {
  if (age < 6) return 'free';
  if (age < 18) return 'child';
  if (age < SENIOR_AGE) return 'adult';
  return 'senior';
}

// Every ticket counts toward the group size, free ones included.
export function ticketCents(age: number, ticketCount: number): number {
  const groupPercent = ticketCount >= GROUP_SIZE ? GROUP_PERCENT : 100;
  return Math.round((BASE_CENTS * AGE_PERCENT[categoryFor(age)] * groupPercent) / 10000);
}

export function quote(ages: number[]): {
  lines: Line[];
  totalCents: number;
  groupDiscount: boolean;
} {
  const lines = ages.map((age) => ({
    age,
    category: categoryFor(age),
    cents: ticketCents(age, ages.length),
  }));
  return {
    lines,
    totalCents: lines.reduce((sum, line) => sum + line.cents, 0),
    groupDiscount: ages.length >= GROUP_SIZE,
  };
}

export function formatEuro(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}
