import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const searchScript = fileURLToPath(
  new URL("../universe-notes/scripts/search.js", import.meta.url),
);

function runSearch(...args) {
  return spawnSync(process.execPath, [searchScript, ...args], {
    encoding: "utf8",
  });
}

test("search matches titles case-insensitively", () => {
  const result = runSearch("OVERVIEW");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /AI overview tab/);
});

test("search matches summaries and prints their highlights", () => {
  const result = runSearch("participation boundaries");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Contribution controls/);
  assert.match(result.stdout, /Set participation boundaries/);
});

test("search reports no matches and requires a search term", () => {
  const noMatches = runSearch("no matching highlight");
  assert.equal(noMatches.status, 0);
  assert.match(noMatches.stdout, /No highlights found/);

  const missingTerm = runSearch();
  assert.equal(missingTerm.status, 1);
  assert.match(missingTerm.stderr, /Usage: npm run search -- <word>/);
});
