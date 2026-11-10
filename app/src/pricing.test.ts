import { describe, expect, it } from 'vitest';
import {
  addVisitor,
  type Category,
  categoryFor,
  formatEuro,
  parseAge,
  quote,
  ticketCents,
} from './pricing';

describe('pricing', () => {
  it('reads ages', () => {
    expect(parseAge(' 30 ')).toEqual({ age: 30 });
    expect(parseAge('0')).toEqual({ age: 0 });
    expect(parseAge('120')).toEqual({ age: 120 });
    expect(parseAge('')).toEqual({ error: 'Enter an age' });
    for (const bad of ['7.5', '-1', 'abc', '121'])
      expect(parseAge(bad)).toEqual({ error: 'Age must be a whole number from 0 to 120' });
  });

  it('allows at most 10 tickets', () => {
    expect(addVisitor(Array(9).fill(30), 40)).toEqual({ ages: [...Array(9).fill(30), 40] });
    expect(addVisitor(Array(10).fill(30), 40)).toEqual({
      error: 'An order can have at most 10 tickets',
    });
  });

  it('puts each age in its category', () => {
    const cases: [number, Category][] = [
      [0, 'free'],
      [5, 'free'],
      [6, 'child'],
      [17, 'child'],
      [18, 'adult'],
      [64, 'adult'],
      [65, 'senior'],
      [120, 'senior'],
    ];
    for (const [age, cat] of cases) expect(categoryFor(age)).toBe(cat);
  });

  it('prices single tickets', () => {
    expect(ticketCents(30, 1)).toBe(1890);
    expect(ticketCents(5, 1)).toBe(0);
    expect(ticketCents(6, 1)).toBe(945);
    expect(ticketCents(65, 1)).toBe(1323);
  });

  it('applies the group discount from 8 tickets, rounding half up', () => {
    expect(ticketCents(30, 7)).toBe(1890);
    expect(ticketCents(30, 8)).toBe(1701);
    expect(ticketCents(6, 8)).toBe(851);
    expect(ticketCents(65, 8)).toBe(1191);
  });

  it('quotes an order', () => {
    expect(quote([])).toEqual({ lines: [], totalCents: 0, groupDiscount: false });
    const q = quote([3, 4, 30, 30, 30, 30, 30, 30]);
    expect(q.groupDiscount).toBe(true);
    expect(q.totalCents).toBe(6 * 1701);
    expect(quote([3]).totalCents).toBe(0);
  });

  it('formats euros', () => {
    expect(formatEuro(851)).toBe('€8.51');
    expect(formatEuro(0)).toBe('€0.00');
  });
});

// Cases derived from requirements/ by the derive-test-data skill (docs/reviews/m2-derive-test-data.md).
// Titles start with the requirement id (docs/conventions.md).
describe('requirements: age input (REQ-1.2)', () => {
  const invalid = { error: 'Age must be a whole number from 0 to 120' };

  it('[REQ-1.2] accepts leading zeros and reads the number', () => {
    expect(parseAge('007')).toEqual({ age: 7 });
    expect(parseAge('000')).toEqual({ age: 0 });
    expect(parseAge('0120')).toEqual({ age: 120 });
  });

  it('[REQ-1.2] rejects a zero-padded number above 120', () => {
    expect(parseAge('0121')).toEqual(invalid);
  });

  it('[REQ-1.2] ignores spaces around the digits, on one or both sides', () => {
    expect(parseAge('  12  ')).toEqual({ age: 12 });
    expect(parseAge(' 5')).toEqual({ age: 5 });
    expect(parseAge('5 ')).toEqual({ age: 5 });
  });

  it('[REQ-1.2] treats a field with only spaces as empty', () => {
    expect(parseAge('   ')).toEqual({ error: 'Enter an age' });
  });

  it('[REQ-1.2] rejects anything that is not only digits', () => {
    for (const bad of ['5.0', '+5', '-5', '1e1', '12a', '3 0', 'abc', '1000'])
      expect(parseAge(bad)).toEqual(invalid);
  });

  it('[REQ-1.2] accepts the values next to the edges 0 and 120', () => {
    expect(parseAge('1')).toEqual({ age: 1 });
    expect(parseAge('119')).toEqual({ age: 119 });
    expect(parseAge('-1')).toEqual(invalid);
  });
});

describe('requirements: ticket limit (REQ-1.3)', () => {
  it('[REQ-1.3] counts free tickets toward the limit of 10', () => {
    expect(addVisitor(Array(9).fill(0), 30)).toEqual({ ages: [...Array(9).fill(0), 30] });
    expect(addVisitor(Array(10).fill(0), 30)).toEqual({
      error: 'An order can have at most 10 tickets',
    });
  });
});

describe('requirements: group discount and totals (REQ-2.5, REQ-3.1, REQ-1.4)', () => {
  const adults = (n: number) => Array<number>(n).fill(30);

  it('[REQ-2.5] counts a free ticket toward the 8 tickets', () => {
    const seven = quote([0, ...adults(6)]);
    expect(seven.groupDiscount).toBe(false);
    expect(seven.totalCents).toBe(6 * 1890);
    const eight = quote([0, ...adults(7)]);
    expect(eight.groupDiscount).toBe(true);
    expect(eight.lines[0]?.cents).toBe(0);
    expect(eight.totalCents).toBe(7 * 1701);
  });

  it('[REQ-2.5] takes the 10% from the price after the age discount', () => {
    expect(quote([12, ...adults(6)]).totalCents).toBe(945 + 6 * 1890);
    expect(quote([12, ...adults(7)]).totalCents).toBe(851 + 7 * 1701);
    expect(quote([80, ...adults(6)]).totalCents).toBe(1323 + 6 * 1890);
    expect(quote([80, ...adults(7)]).totalCents).toBe(1191 + 7 * 1701);
  });

  it('[REQ-2.5] keeps the group price at 9 and 10 tickets', () => {
    expect(quote(adults(9)).totalCents).toBe(9 * 1701);
    expect(quote(adults(10)).totalCents).toBe(10 * 1701);
  });

  it('[REQ-3.1] adds up the rounded ticket prices, not the unrounded ones', () => {
    // Two children at 8 tickets: 8.505 each rounds to 8.51, so the pair is 17.02 (not 17.01).
    const q = quote([12, 12, ...adults(6)]);
    expect(q.lines[0]?.cents).toBe(851);
    expect(q.totalCents).toBe(2 * 851 + 6 * 1701);
  });

  it('[REQ-1.4] drops the group discount when the order falls below 8 tickets', () => {
    expect(quote(adults(8)).totalCents).toBe(8 * 1701);
    const afterRemoval = quote(adults(7));
    expect(afterRemoval.groupDiscount).toBe(false);
    expect(afterRemoval.totalCents).toBe(7 * 1890);
  });

  it('[REQ-3.1] shows two decimals and keeps the trailing zero', () => {
    expect(formatEuro(1890)).toBe('€18.90');
    expect(formatEuro(945)).toBe('€9.45');
    expect(formatEuro(13098)).toBe('€130.98');
  });
});
