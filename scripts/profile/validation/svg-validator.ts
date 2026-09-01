import { Buffer } from "node:buffer";
import { XMLParser } from "fast-xml-parser";
import { SVG_MAX_BYTES } from "../config.js";

const parser = new XMLParser({ ignoreAttributes: false, allowBooleanAttributes: false });
const forbiddenPatterns = [
  /<script\b/i,
  /<foreignObject\b/i,
  /\son[a-z]+\s*=/i,
  /javascript\s*:/i,
  /(?:href|xlink:href)\s*=\s*["']https?:/i
];

export function validateSvg(svg: string, filename = "asset.svg"): void {
  if (!svg.trim()) throw new Error(`${filename}: SVG vazio.`);
  if (Buffer.byteLength(svg, "utf8") > SVG_MAX_BYTES) throw new Error(`${filename}: SVG excede ${SVG_MAX_BYTES} bytes.`);
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(svg)) throw new Error(`${filename}: conteúdo incompatível ou inseguro (${pattern.source}).`);
  }
  if (!svg.includes("<title") || !svg.includes("<desc")) throw new Error(`${filename}: title e desc são obrigatórios.`);
  if (!/viewBox="0 0 \d+ \d+"/.test(svg)) throw new Error(`${filename}: viewBox responsivo ausente.`);
  if (!svg.includes('xmlns="http://www.w3.org/2000/svg"')) throw new Error(`${filename}: namespace SVG ausente.`);

  let document: unknown;
  try {
    document = parser.parse(svg);
  } catch (error) {
    throw new Error(`${filename}: XML inválido.`, { cause: error });
  }
  if (!document || typeof document !== "object" || !("svg" in document)) throw new Error(`${filename}: elemento raiz SVG ausente.`);
}
