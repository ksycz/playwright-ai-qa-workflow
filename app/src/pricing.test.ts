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
