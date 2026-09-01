import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DEFAULT_OUTPUT_DIR } from "./config.js";
import { GENERATED_ASSETS } from "./assets.js";
import { validateSvg } from "./validation/svg-validator.js";

for (const filename of GENERATED_ASSETS) {
  validateSvg(await readFile(resolve(DEFAULT_OUTPUT_DIR, filename), "utf8"), filename);
}
console.log(`SVG validation: ${GENERATED_ASSETS.length} arquivos válidos.`);
