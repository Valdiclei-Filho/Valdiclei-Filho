import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { parse as parseYaml } from "yaml";
import { GENERATED_ASSETS } from "../assets.js";
import { renderContributionBeam } from "../contribution-beam/renderer.js";
import { contributionCoordinates, selectBeamTargets } from "../contribution-beam/target-selector.js";
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

void test("Contribution Targeting preserva a matriz e remove a varredura horizontal", () => {
  const svg = renderContributionBeam(loadMockProfile(), getTheme("dark"));
  validateSvg(svg, "targeting.svg");
  assert.equal((svg.match(/<title>\d{4}-\d{2}-\d{2}:/g) ?? []).length, 371);
  assert.match(svg, /TARGET LOCKED/);
  assert.match(svg, /CORE CHARGE/);
  assert.match(svg, /IMPACT/);
  assert.doesNotMatch(svg, /M120 139H|stroke-dashoffset="809"|CICLO DE ENERGIA/);
  assert.doesNotMatch(svg, /snake|cobra/i);
});

void test("seleção de alvos é determinística e usa somente contribuições reais", () => {
  const profile = loadMockProfile();
  const first = selectBeamTargets(profile);
  const second = selectBeamTargets(profile);
  assert.deepEqual(first, second);
  assert.equal(first.length, 4);
  const activeDates = new Set(profile.contributionWeeks.flatMap(({ days }) => days.filter(({ count }) => count > 0).map(({ date }) => date)));
  assert.ok(first.every(({ date, count }) => count > 0 && activeDates.has(date)));
  assert.ok(new Set(first.map(({ weekIndex }) => Math.floor(weekIndex / 13))).size >= 3);
});

void test("coordenadas apontam para o centro exato da célula", () => {
  assert.deepEqual(contributionCoordinates(0, 0), { x: 255, y: 101 });
  assert.deepEqual(contributionCoordinates(52, 6), { x: 931, y: 179 });
});

void test("feixes terminam exatamente nos alvos e mudam de ângulo", () => {
  const profile = loadMockProfile();
  const targets = selectBeamTargets(profile);
  const svg = renderContributionBeam(profile, getTheme("dark"));
  for (const target of targets) assert.match(svg, new RegExp(`x2="${target.x}" y2="${target.y}"`));
  assert.ok(new Set(targets.map(({ y }) => y)).size > 1);
});

void test("matriz sem atividade exibe fallback sem coordenadas inválidas", () => {
  const profile = loadMockProfile();
  const empty = { ...profile, contributionWeeks: profile.contributionWeeks.map((week) => ({ ...week, days: week.days.map((day) => ({ ...day, count: 0, level: 0 as const })) })) };
  assert.deepEqual(selectBeamTargets(empty), []);
  const svg = renderContributionBeam(empty, getTheme("light"));
  assert.match(svg, /NO ACTIVE TARGET/);
  assert.doesNotMatch(svg, /NaN|undefined/);
});

void test("dashboard rotula linguagens por bytes, nunca por commits", () => {
  const svg = renderDashboard(loadMockProfile(), getTheme("dark"));
  validateSvg(svg, "dashboard.svg");
  assert.match(svg, /BYTES DOS REPOSITÓRIOS/);
  assert.doesNotMatch(svg, /LINGUAGENS POR COMMITS/);
});

void test("validador bloqueia recursos inseguros", () => {
  assert.throws(() => validateSvg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><title>x</title><desc>x</desc><script/></svg>'));
  assert.throws(() => validateSvg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><title>x</title><desc>A & B</desc></svg>'));
});

void test("workflow de publicação possui YAML válido e gatilhos seguros", async () => {
  const source = await readFile(".github/workflows/generate-profile.yml", "utf8");
  const workflow = parseYaml(source) as { name?: string; on?: Record<string, unknown>; jobs?: Record<string, unknown> };
  assert.equal(workflow.name, "VF Contribution Engine");
  assert.ok(workflow.on?.schedule);
  assert.ok(workflow.on?.workflow_dispatch !== undefined);
  assert.ok(workflow.jobs?.["generate-and-publish"]);
  assert.match(source, /secrets\.SUMMARY_GITHUB_TOKEN \|\| github\.token/);
  assert.match(source, /cp dist\/\*\.svg publication\//);
});

void test("README referencia exatamente os assets gerados e não usa headings redundantes", async () => {
  const readme = await readFile("README.md", "utf8");
  const referenced = [...new Set([...readme.matchAll(/output\/([^" ]+\.svg)/g)].map((match) => match[1]))].sort();
  assert.deepEqual(referenced, [...GENERATED_ASSETS].sort());
  assert.doesNotMatch(readme, /^##\s/m);
  assert.doesNotMatch(readme, /img\.shields\.io|\| Integração & dados/);
});

void test("geração mock publica quatorze SVGs dark e light após validação", async () => {
  const directory = await mkdtemp(join(tmpdir(), "vf-profile-test-"));
  try {
    await generate(true, directory);
    for (const filename of GENERATED_ASSETS) {
      const svg = await readFile(join(directory, filename), "utf8");
      validateSvg(svg, filename);
      assert.match(svg, /viewBox="0 0 1000 /);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
