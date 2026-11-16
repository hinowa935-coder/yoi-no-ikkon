import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {recommendationViewDay} from '../src/data/recommendationDate.js';
import {reviewedCutoverPreflight} from './lib/reviewed-cutover-preflight.mjs';

test('production and unspecified builds always ignore arbitrary URL date overrides', () => {
  for (const mode of ['production', undefined, 'preview']) {
    for (const day of ['2020-01-01', '2099-12-31', 'invalid', null]) {
      assert.equal(recommendationViewDay(day, '2026-10-27', mode), '2026-10-27');
    }
  }
});

test('development and test may explicitly choose a valid day, never an impossible date', () => {
  for (const mode of ['development', 'test']) {
    assert.equal(recommendationViewDay('2026-10-23', '2026-10-27', mode), '2026-10-23');
    assert.equal(recommendationViewDay('2026-02-30', '2026-10-27', mode), '2026-10-27');
    assert.equal(recommendationViewDay(null, '2026-10-27', mode), '2026-10-27');
  }
});

test('new review accepts only the three date-policy files and exact reviewed bytes', () => {
  const review = JSON.parse(fs.readFileSync('docs/netlify-cutover-preflight/source-changes.json', 'utf8'));
  for (const row of review.changes) {
    assert(reviewedCutoverPreflight(row.file, row.beforeSha256, row.afterSha256));
    assert(!reviewedCutoverPreflight(row.file, row.beforeSha256, 'tampered'));
    assert(!reviewedCutoverPreflight('src/data/discoveryCatalog.json', row.beforeSha256, row.afterSha256));
    assert(!reviewedCutoverPreflight('src/commerce/localSakana.json', row.beforeSha256, row.afterSha256));
  }
});
