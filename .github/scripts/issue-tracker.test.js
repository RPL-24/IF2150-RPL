// Jalankan: node --test .github/scripts/
const test = require('node:test');
const assert = require('node:assert');
const { issueDirujuk, susunTracker } = require('./issue-tracker');

test('issueDirujuk mengenali kata kunci penutup GitHub', () => {
  assert.deepStrictEqual(issueDirujuk('Closes #12\nfixes: #3, resolved #12'), [12, 3]);
  assert.deepStrictEqual(issueDirujuk('lihat #5, bukan penutup'), []);
  assert.deepStrictEqual(issueDirujuk(null), []);
});

test('susunTracker mengelompokkan per modul dan menandai status', () => {
  const issues = [
    { number: 1, title: 'UC01', state: 'closed', labels: ['modul-A'], assignees: ['a'] },
    { number: 2, title: 'UC16 | chat', state: 'open', labels: ['modul-D'], assignees: [] },
    { number: 3, title: 'Lain', state: 'open', labels: [], assignees: [] },
  ];
  const prs = [
    { number: 9, title: 'feat', state: 'closed', user: 'a', base: 'develop', merged_at: '2026-11-09T01:00:00Z', refs: [1] },
    { number: 10, title: 'wip', state: 'open', user: 'b', base: 'develop', merged_at: null, refs: [2] },
  ];
  const md = susunTracker(issues, prs, '2026-11-09T02:00:00Z');
  assert.match(md, /\| A\. Akun & Otentikasi \| 1 \| 1 \|/);
  assert.match(md, /\| #1 \| UC01 \| `a` \| ✅ Selesai \| #9 ✔️ → `develop` \| `a`, /);
  assert.match(md, /\| #2 \| UC16 \\\| chat \| - \| 👀 Review \| #10 \(open\)/);
  assert.match(md, /Lainnya/);
  assert.doesNotMatch(md, /@a/);
});
