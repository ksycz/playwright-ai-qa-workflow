import { describe, expect, it } from 'vitest';
import { buildReport, parseRequirements, parseTests } from './traceability';

describe('traceability', () => {
  it('reads requirement ids and their first sentence', () => {
    const markdown =
      '- **REQ-1.1** A visitor can be added. More text.\n- **REQ-1.2** An age is 0 to 120.';
    expect(parseRequirements(markdown)).toEqual([
      { id: 'REQ-1.1', text: 'A visitor can be added.' },
      { id: 'REQ-1.2', text: 'An age is 0 to 120.' },
    ]);
  });

  it('reads every REQ id from test titles and skips titles without one', () => {
    const source = `test('[REQ-1.3][REQ-1.2] risk 2: x', async () => {});
it('formats euros', () => {});
test("[REQ-3.4] 'Free' only as a label", async () => {});
  test(
    '[REQ-2.5] y', async () => {});`;
    expect(parseTests('tests/a.spec.ts', source)).toEqual([
      {
        file: 'tests/a.spec.ts',
        title: '[REQ-1.3][REQ-1.2] risk 2: x',
        ids: ['REQ-1.3', 'REQ-1.2'],
      },
      { file: 'tests/a.spec.ts', title: "[REQ-3.4] 'Free' only as a label", ids: ['REQ-3.4'] },
      { file: 'tests/a.spec.ts', title: '[REQ-2.5] y', ids: ['REQ-2.5'] },
    ]);
  });

  it('names gaps, unit-only coverage and unknown ids', () => {
    const report = buildReport(
      [
        { id: 'REQ-1.10', text: 'c.' },
        { id: 'REQ-1.2', text: 'b.' },
        { id: 'REQ-1.1', text: 'a.' },
      ],
      {
        browser: [{ file: 'tests/x.spec.ts', title: '', ids: ['REQ-1.1', 'REQ-9.9'] }],
        unit: [{ file: 'app/src/y.test.ts', title: '', ids: ['REQ-1.2'] }],
      },
    );
    expect(report.gaps).toEqual(['REQ-1.2', 'REQ-1.10']);
    expect(report.unknownIds).toEqual(['REQ-9.9']);
    expect(report.markdown).toContain('| **REQ-1.1** a. | 1 | 0 | covered | x.spec.ts |');
    expect(report.markdown).toContain('| **REQ-1.2** b. | 0 | 1 | unit only | - |');
    expect(report.markdown).toContain('| **REQ-1.10** c. | 0 | 0 | **GAP** | - |');
  });
});
