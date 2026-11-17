// Planted bugs for Milestone 4. Each one is a known defect, switched on with
// PLANTED_BUG=<name> (forwarded to the app as VITE_PLANTED_BUG). They prove the
// Playwright tests catch real defects. pricing.ts stays correct, so the Vitest
// unit tests are not affected; only the screen shows the bug.
import { type Category, GROUP_SIZE, type Line, quote, ticketCents } from './pricing';

export const PLANTED_BUGS = ['child-free-6', 'senior-over-65', 'group-from-9'] as const;
export type PlantedBug = (typeof PLANTED_BUGS)[number];

// One age per category, used to look up that category's correct price.
const SAMPLE_AGE: Record<Category, number> = { free: 0, child: 10, adult: 30, senior: 70 };

function activeBug(): PlantedBug | undefined {
  const name = import.meta.env.VITE_PLANTED_BUG;
  return PLANTED_BUGS.find((bug) => bug === name);
}

function wrongCategory(bug: PlantedBug | undefined, line: Line): Category {
  // child-free-6: age 6 is still treated as free (the free range ends one year late).
  if (bug === 'child-free-6' && line.age === 6) return 'free';
  // senior-over-65: the senior discount starts after 65 instead of at 65.
  if (bug === 'senior-over-65' && line.age === 65) return 'adult';
  return line.category;
}

// The order as the screen shows it: correct, unless a planted bug is switched on.
export function shownQuote(ages: number[]): ReturnType<typeof quote> {
  const order = quote(ages);
  const bug = activeBug();
  if (!bug) return order;

  // group-from-9: the group discount starts at 9 tickets instead of 8.
  const groupDiscount = bug === 'group-from-9' ? ages.length > GROUP_SIZE : order.groupDiscount;
  const countForPrice = groupDiscount ? GROUP_SIZE : 1;
  const lines = order.lines.map((line) => {
    const category = wrongCategory(bug, line);
    return { ...line, category, cents: ticketCents(SAMPLE_AGE[category], countForPrice) };
  });
  return {
    lines,
    totalCents: lines.reduce((sum, line) => sum + line.cents, 0),
    groupDiscount,
  };
}
