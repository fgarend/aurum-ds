// Reads the type family of tokens.json (decision 0026): font family stacks and text styles, with the artifact type's
// defaults.
import {
  fail,
  isRecord,
  lengthPattern,
  namePattern,
  readLength,
  readName,
  records,
} from "./validate.ts";

interface TextStyle {
  name: string;
  family: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing: string;
  fontStyle: string;
  opticalSize: number | undefined;
}

const stackForbidden = /[;{}<>\\()]/u;
const twoWeights = /^(?<low>\d+) (?<high>\d+)$/u;
const maxUnitlessLineHeight = 10;
const lightestWeight = 1;
const boldestWeight = 1000;
const maxStackLength = 200;
const namedWeights: Record<string, string> = { normal: "400", bold: "700" };

function readFamilies(type: Record<string, unknown>): [string, string][] {
  const families = type["families"];
  if (!isRecord(families)) {
    fail("type", "no families");
  }
  return Object.entries(families).map(([key, stack]) => {
    const valid =
      namePattern.test(key) &&
      typeof stack === "string" &&
      stack.length <= maxStackLength &&
      !stackForbidden.test(stack) &&
      (stack.split('"').length - 1) % 2 === 0;
    if (!valid) {
      fail(`type family "${key}"`, "bad value");
    }
    return [key.toLowerCase(), stack];
  });
}

function readWeight(value: unknown): string | undefined {
  const inRange = (weight: number): boolean =>
    weight >= lightestWeight && weight <= boldestWeight;
  if (value === undefined) {
    return namedWeights["normal"];
  }
  if (typeof value === "number") {
    return inRange(value) ? String(value) : undefined;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const { low, high } = value.match(twoWeights)?.groups ?? {};
  if (low !== undefined && high !== undefined) {
    return inRange(Number(low)) && inRange(Number(high)) ? value : undefined;
  }
  return (
    namedWeights[value] ?? readWeight(value === "" ? Number.NaN : Number(value))
  );
}

function readLineHeight(value: unknown): string | undefined {
  if (value === undefined) {
    return "1.4";
  }
  const unitless = typeof value === "number" ? value : Number.NaN;
  if (unitless >= 0 && unitless < maxUnitlessLineHeight) {
    return String(unitless);
  }
  return typeof value === "string" && lengthPattern.test(value)
    ? value
    : undefined;
}

function styleFamily(
  raw: Record<string, unknown>,
  groupFamily: string,
  families: Set<string>,
  where: string,
): string {
  const own = raw["family"];
  if (own === undefined) {
    return groupFamily;
  }
  if (!(typeof own === "string" && families.has(own.toLowerCase()))) {
    fail(where, `no family "${String(own)}"`);
  }
  return own.toLowerCase();
}

function required(
  value: string | undefined,
  where: string,
  field: string,
): string {
  return value ?? fail(where, `bad ${field}`);
}

function readStyle(
  raw: Record<string, unknown>,
  groupFamily: string,
  families: Set<string>,
  used: Set<string>,
): TextStyle {
  const name = readName(raw, "text style", used);
  const where = `text style "${name}"`;
  const fontStyle = raw["fontStyle"] ?? "normal";
  const opticalSize = raw["opticalSize"];
  if (fontStyle !== "normal" && fontStyle !== "italic") {
    fail(where, "bad fontStyle");
  }
  if (
    !(
      opticalSize === undefined ||
      (typeof opticalSize === "number" && Number.isFinite(opticalSize))
    )
  ) {
    fail(where, "bad opticalSize");
  }
  return {
    name,
    family: styleFamily(raw, groupFamily, families, where),
    fontSize: required(readLength(raw["fontSize"]), where, "fontSize"),
    lineHeight: required(
      readLineHeight(raw["lineHeight"]),
      where,
      "lineHeight",
    ),
    fontWeight: required(readWeight(raw["fontWeight"]), where, "fontWeight"),
    letterSpacing: required(
      raw["letterSpacing"] === undefined
        ? "0"
        : readLength(raw["letterSpacing"]),
      where,
      "letterSpacing",
    ),
    fontStyle,
    opticalSize,
  };
}

function readStyles(
  type: Record<string, unknown>,
  families: Set<string>,
): TextStyle[] {
  const used = new Set<string>();
  return records(type["groups"], "type groups").flatMap((group) => {
    const family = group["family"];
    if (!(typeof family === "string" && families.has(family.toLowerCase()))) {
      fail(
        `type group "${String(group["name"])}"`,
        `no family "${String(family)}"`,
      );
    }
    return records(group["styles"], "type styles").map((raw) =>
      readStyle(raw, family.toLowerCase(), families, used),
    );
  });
}

export { readFamilies, readStyles, type TextStyle };
