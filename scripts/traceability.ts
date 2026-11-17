// Traceability report: maps every requirement id in requirements/ to the
// tests whose titles carry it, and names each requirement no test covers.
// Run with `npm run trace`. Writes reports/traceability.md and prints it.
import { appendFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

export type Requirement = { id: string; text: string };
export type TestCase = { file: string; title: string; ids: string[] };
export type Level = 'browser' | 'unit';

const REQ_DEFINITION = /^- \*\*(REQ-\d+\.\d+)\*\* (.+)$/gm;
// A title in single, double or back quotes, with escaped quotes inside.
const TEST_TITLE = /\b(?:test|it)\(\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1/g;
const TITLE_ID = /\[(REQ-\d+\.\d+)\]/g;

export function parseRequirements(markdown: string): Requirement[] {
  return [...markdown.matchAll(REQ_DEFINITION)].map(([, id, text]) => ({
    id,
    text: firstSentence(text),
  }));
}

export function parseTests(file: string, source: string): TestCase[] {
  return [...source.matchAll(TEST_TITLE)]
    .map(([, , title]) => ({ file, title, ids: [...title.matchAll(TITLE_ID)].map(([, id]) => id) }))
    .filter((test) => test.ids.length > 0);
}

function firstSentence(text: string): string {
  const end = text.search(/\.(\s|$)/);
  return end === -1 ? text : text.slice(0, end + 1);
}

function byId(a: string, b: string): number {
  const [a1, a2] = a.slice(4).split('.').map(Number);
  const [b1, b2] = b.slice(4).split('.').map(Number);
  return a1 - b1 || a2 - b2;
}

export function buildReport(
  requirements: Requirement[],
  tests: Record<Level, TestCase[]>,
): { markdown: string; gaps: string[]; unknownIds: string[] } {
  const known = new Set(requirements.map((r) => r.id));
  const all = [...tests.browser, ...tests.unit];
  const unknownIds = [...new Set(all.flatMap((t) => t.ids).filter((id) => !known.has(id)))].sort(
    byId,
  );
  const count = (level: Level, id: string) => tests[level].filter((t) => t.ids.includes(id));

  const rows = [...requirements]
    .sort((a, b) => byId(a.id, b.id))
    .map((req) => {
      const browser = count('browser', req.id);
      const unit = count('unit', req.id);
      const status = browser.length > 0 ? 'covered' : unit.length > 0 ? 'unit only' : '**GAP**';
      const files = [...new Set(browser.map((t) => t.file.replace(/^tests\//, '')))].join(', ');
      return { req, browser, unit, status, files };
    });
  const gaps = rows.filter((r) => r.browser.length === 0).map((r) => r.req.id);

  const lines = [
    '# Traceability report',
    '',
    `${requirements.length} requirements, ${rows.length - gaps.length} covered by browser tests, ${gaps.length} not.`,
    'A requirement is covered when a test title carries its id, for example `[REQ-2.2]`.',
    '',
    '| Requirement | Browser tests | Unit tests | Status | Browser test files |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map(
      (r) =>
        `| **${r.req.id}** ${r.req.text} | ${r.browser.length} | ${r.unit.length} | ${r.status} | ${r.files || '-'} |`,
    ),
  ];
  if (gaps.length > 0) {
    lines.push(
      '',
      `**Gaps (no browser test):** ${gaps.join(', ')}. The roadmap in the README says which are planned for later.`,
    );
  }
  if (unknownIds.length > 0) {
    lines.push('', `**Unknown ids in test titles:** ${unknownIds.join(', ')}. Fix the title.`);
  }
  return { markdown: `${lines.join('\n')}\n`, gaps, unknownIds };
}

function filesIn(dir: string, suffix: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((name) => name.endsWith(suffix))
    .map((name) => join(dir, name))
    .sort();
}

function readTests(dir: string, suffix: string): TestCase[] {
  return filesIn(dir, suffix).flatMap((file) =>
    parseTests(relative('.', file), readFileSync(file, 'utf8')),
  );
}

function main(): void {
  const requirements = filesIn('requirements', '.md').flatMap((file) =>
    parseRequirements(readFileSync(file, 'utf8')),
  );
  const report = buildReport(requirements, {
    browser: readTests('tests', '.spec.ts'),
    unit: readTests('app/src', '.test.ts'),
  });

  mkdirSync('reports', { recursive: true });
  writeFileSync('reports/traceability.md', report.markdown);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, report.markdown);
  }
  console.log(report.markdown);

  // Gaps are expected and named in the report. A title with an id that no
  // requirement defines is a mistake, so it fails the run.
  if (report.unknownIds.length > 0) process.exitCode = 1;
}

if (process.argv[1]?.endsWith('traceability.ts')) main();
