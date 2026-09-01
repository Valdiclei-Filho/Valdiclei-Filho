import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DEFAULT_OUTPUT_DIR } from "./config.js";
import { validateSvg } from "./validation/svg-validator.js";

const filenames = ["profile-dashboard-dark.svg", "profile-dashboard-light.svg", "contribution-beam-dark.svg", "contribution-beam-light.svg"];
for (const filename of filenames) {
  validateSvg(await readFile(resolve(DEFAULT_OUTPUT_DIR, filename), "utf8"), filename);
}
console.log(`SVG validation: ${filenames.length} arquivos válidos.`);
