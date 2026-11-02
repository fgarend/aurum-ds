// Reads tokens.json into what the compiler writes (decision 0026), checking each token against the artifact type's
// grammar. A token the artifact would leave out fails here instead, naming its family and name.

import { readFamilies, readStyles, type TextStyle } from "./typography.ts";
import {
  fail,
  isRecord,
  namePattern,
  readLength,
  readName,
  records,
} from "./validate.ts";

interface Token {
  name: string;
  value: string;
}

interface Tokens {
  theme: string;
  colors: Token[];
  shadows: Token[];
  others: Token[];
  families: [string, string][];
  styles: TextStyle[];
}

const hexColor = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/iu;
const functionColor =
  /^(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([\sA-Za-z0-9.,%/+-]*\)$/u;
const aliasPattern = /^\{(?<target>[A-Za-z0-9][A-Za-z0-9_.-]{0,63})\}$/u;
const plainValue = /^[A-Za-z0-9 #%(),./+_-]{1,200}$/u;
const shadowValue = /^[A-Za-z0-9 #%(),./+_-]{1,400}$/u;
const varOrUrl = /\b(?:var|url)\(/u;
const maxAliasDepth = 16;
const fixedKeys = new Set([
  "name",
  "version",
  "color",
  "type",
  "spacing",
  "radius",
  "shadow",
]);

function balanced(value: string): boolean {
  let depth = 0;
  for (const character of value) {
    depth += character === "(" ? 1 : 0;
    depth -= character === ")" ? 1 : 0;
    if (depth < 0) {
      return false;
    }
  }
  return depth === 0;
}

function readTheme(color: Record<string, unknown>): string {
  const themes = records(color["themes"], "color themes");
  const [theme] = themes;
  if (themes.length !== 1 || theme === undefined) {
    fail("color", "only one theme is supported");
  }
  const id = theme["id"];
  if (!(typeof id === "string" && namePattern.test(id))) {
    fail("color", "bad theme id");
  }
  return id.toLowerCase();
}

// A plain value, or one value per theme, of which only the first theme's is read.
function themed(raw: Record<string, unknown>, theme: string): unknown {
  const value = raw["value"];
  return isRecord(value) ? value[theme] : value;
}

function readColor(
  raw: Record<string, unknown>,
  theme: string,
  used: Set<string>,
): Token {
  const name = readName(raw, "color", used);
  const value = themed(raw, theme);
  if (typeof value === "string" && hexColor.test(value)) {
    return { name, value: value.toLowerCase() };
  }
  if (
    typeof value === "string" &&
    (functionColor.test(value) || aliasPattern.test(value))
  ) {
    return { name, value };
  }
  return fail(`color "${name}"`, "bad value");
}

function aliasTarget(value: string): string | undefined {
  return value.match(aliasPattern)?.groups?.["target"];
}

// Every alias must lead to a color that is not an alias, with no cycle and at most 16 steps.
function checkAliases(colors: Token[]): void {
  const byName = new Map(colors.map((color) => [color.name, color.value]));
  for (const { name, value } of colors) {
    const seen = [name];
    let target = aliasTarget(value);
    while (target !== undefined) {
      const next = byName.get(target);
      if (next === undefined) {
        fail(`color "${name}"`, `alias {${target}} names no color`);
      }
      if (seen.includes(target)) {
        fail(`color "${name}"`, "alias cycle");
      }
      if (seen.length > maxAliasDepth) {
        fail(`color "${name}"`, "alias chain too deep");
      }
      seen.push(target);
      target = aliasTarget(next);
    }
  }
}

function readShadow(
  raw: Record<string, unknown>,
  theme: string,
  used: Set<string>,
): Token {
  const name = readName(raw, "shadow", used);
  const value = themed(raw, theme);
  if (
    !(
      typeof value === "string" &&
      shadowValue.test(value) &&
      !varOrUrl.test(value) &&
      balanced(value)
    )
  ) {
    fail(`shadow "${name}"`, "bad value");
  }
  return { name, value };
}

function readLengthToken(
  raw: Record<string, unknown>,
  family: string,
  used: Set<string>,
): Token {
  const name = readName(raw, family, used);
  const value = readLength(raw["value"]);
  if (value === undefined) {
    fail(`${family} "${name}"`, "bad value");
  }
  return { name, value };
}

function readPlainToken(
  raw: Record<string, unknown>,
  family: string,
  used: Set<string>,
): Token {
  const name = readName(raw, family, used);
  const value = raw["value"];
  if (
    !(
      typeof value === "string" &&
      plainValue.test(value) &&
      !varOrUrl.test(value) &&
      balanced(value)
    )
  ) {
    fail(`${family} "${name}"`, "bad value");
  }
  return { name, value };
}

function tokenList(
  source: Record<string, unknown>,
  family: string,
): Record<string, unknown>[] {
  const entry = source[family];
  if (entry === undefined) {
    return [];
  }
  if (!isRecord(entry)) {
    fail(family, "not a token family");
  }
  return records(entry["tokens"], family);
}

// Spacing and radius, then every other family with tokens, in the file's order.
function readOthers(
  source: Record<string, unknown>,
  used: Set<string>,
): Token[] {
  const lengths = ["spacing", "radius"].flatMap((family) =>
    tokenList(source, family).map((raw) => readLengthToken(raw, family, used)),
  );
  const plain = Object.keys(source)
    .filter((key) => !fixedKeys.has(key))
    .flatMap((family) =>
      tokenList(source, family).map((raw) => readPlainToken(raw, family, used)),
    );
  return [...lengths, ...plain];
}

function readTokens(source: unknown): Tokens {
  if (
    !(isRecord(source) && isRecord(source["color"]) && isRecord(source["type"]))
  ) {
    return fail("tokens", "no color or type family");
  }
  const { color, type } = source;
  if (records(type["fonts"], "type fonts").length > 0) {
    fail("type", "font files are not supported yet");
  }
  const theme = readTheme(color);
  const used = new Set<string>();
  const colors = records(color["tokens"], "color").map((raw) =>
    readColor(raw, theme, used),
  );
  checkAliases(colors);
  const shadows = tokenList(source, "shadow").map((raw) =>
    readShadow(raw, theme, used),
  );
  const others = readOthers(source, used);
  const families = readFamilies(type);
  const styles = readStyles(type, new Set(families.map(([key]) => key)));
  return { theme, colors, shadows, others, families, styles };
}

export { aliasTarget, readTokens, type Token, type Tokens };
