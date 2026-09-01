import { mkdir, mkdtemp, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { DEFAULT_OUTPUT_DIR, PROFILE_LOGIN } from "./config.js";
import { renderContributionBeam } from "./contribution-beam/renderer.js";
import { renderDashboard } from "./dashboard/renderer.js";
import { loadMockProfile } from "./fixtures/load-mock.js";
import { loadProfileData } from "./github/load-profile.js";
import { getTheme } from "./theme.js";
import { validateSvg } from "./validation/svg-validator.js";

const outputNames = [
  "profile-dashboard-dark.svg",
  "profile-dashboard-light.svg",
  "contribution-beam-dark.svg",
  "contribution-beam-light.svg"
] as const;

export async function generate(useMock: boolean, outputDirectory = DEFAULT_OUTPUT_DIR): Promise<void> {
  const token = process.env.GITHUB_TOKEN ?? "";
  const data = useMock ? loadMockProfile() : await loadProfileData(PROFILE_LOGIN, token);
  const rendered = new Map<string, string>();
  for (const themeName of ["dark", "light"] as const) {
    const theme = getTheme(themeName);
    rendered.set(`profile-dashboard-${themeName}.svg`, renderDashboard(data, theme));
    rendered.set(`contribution-beam-${themeName}.svg`, renderContributionBeam(data, theme));
  }

  for (const [filename, svg] of rendered) validateSvg(svg, filename);

  const stagingDirectory = await mkdtemp(resolve(tmpdir(), "vf-profile-"));
  try {
    await Promise.all([...rendered].map(([filename, svg]) => writeFile(resolve(stagingDirectory, filename), svg, "utf8")));
    await mkdir(outputDirectory, { recursive: true });
    await Promise.all(outputNames.map(async (filename) => {
      const staged = resolve(stagingDirectory, filename);
      validateSvg(await readFile(staged, "utf8"), filename);
      await copyFile(staged, resolve(outputDirectory, filename));
    }));
  } finally {
    await rm(stagingDirectory, { recursive: true, force: true });
  }

  console.log(`VF Contribution Engine: ${outputNames.length} SVGs gerados em ${outputDirectory} (${useMock ? "mock" : "GitHub"}).`);
}

const isDirectExecution = process.argv[1]?.replaceAll("\\", "/").endsWith("scripts/profile/generate.ts") ?? false;
if (isDirectExecution) {
  generate(process.argv.includes("--mock"), process.env.PROFILE_OUTPUT_DIR ?? DEFAULT_OUTPUT_DIR).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
