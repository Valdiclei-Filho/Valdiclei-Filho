import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { parse as parseYaml } from "yaml";
import { renderContributionBeam } from "../contribution-beam/renderer.js";
import { renderDashboard } from "../dashboard/renderer.js";
import { loadMockProfile } from "../fixtures/load-mock.js";
import { normalizeLevel } from "../github/load-profile.js";
import { generate } from "../generate.js";
import { getTheme } from "../theme.js";
import { validateSvg } from "../validation/svg-validator.js";

void test("normaliza os níveis oficiais de contribuição", () => {
  assert.equal(normalizeLevel("NONE"), 0);
  assert.equal(normalizeLevel("SECOND_QUARTILE"), 2);
  assert.equal(normalizeLevel("FOURTH_QUARTILE"), 4);
});

void test("fixture representa 53 semanas completas", () => {
  const profile = loadMockProfile();
  assert.equal(profile.contributionWeeks.length, 53);
  assert.equal(profile.contributionWeeks.flatMap(({ days }) => days).length, 371);
  assert.ok(profile.contributionWeeks.every(({ days }) => days.length === 7));
});

void test("Energy Beam preserva cada dia da matriz e contém o ciclo original", () => {
  const svg = renderContributionBeam(loadMockProfile(), getTheme("dark"));
  validateSvg(svg, "beam.svg");
  assert.equal((svg.match(/<title>\d{4}-\d{2}-\d{2}:/g) ?? []).length, 371);
  assert.match(svg, /CARREGAR/);
  assert.match(svg, /DISPARAR/);
  assert.match(svg, /ENERGIZAR/);
  assert.doesNotMatch(svg, /snake|cobra/i);
});

void test("dashboard rotula linguagens por bytes, nunca por commits", () => {
  const svg = renderDashboard(loadMockProfile(), getTheme("dark"));
  validateSvg(svg, "dashboard.svg");
  assert.match(svg, /DISTRIBUIÇÃO POR BYTES/);
  assert.doesNotMatch(svg, /LINGUAGENS POR COMMITS/);
});

void test("validador bloqueia recursos inseguros", () => {
  assert.throws(() => validateSvg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><title>x</title><desc>x</desc><script/></svg>'));
});

void test("workflow de publicação possui YAML válido e gatilhos seguros", async () => {
  const source = await readFile(".github/workflows/generate-profile.yml", "utf8");
  const workflow = parseYaml(source) as { name?: string; on?: Record<string, unknown>; jobs?: Record<string, unknown> };
  assert.equal(workflow.name, "VF Contribution Engine");
  assert.ok(workflow.on?.schedule);
  assert.ok(workflow.on?.workflow_dispatch !== undefined);
  assert.ok(workflow.jobs?.["generate-and-publish"]);
  assert.match(source, /secrets\.SUMMARY_GITHUB_TOKEN \|\| github\.token/);
});

void test("geração mock publica quatro SVGs apenas após validação", async () => {
  const directory = await mkdtemp(join(tmpdir(), "vf-profile-test-"));
  try {
    await generate(true, directory);
    for (const filename of ["profile-dashboard-dark.svg", "profile-dashboard-light.svg", "contribution-beam-dark.svg", "contribution-beam-light.svg"]) {
      validateSvg(await readFile(join(directory, filename), "utf8"), filename);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
