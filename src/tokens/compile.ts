// Compiles tokens.json into tokens.css (decisions 0025 and 0026): the artifact type's own output, with every name
// prefixed.
import { aliasTarget, readTokens, type Token } from "./read.js";
import type { TextStyle } from "./type.js";

const prefix = "au-";
const leadingDigit = /^[0-9]/u;
const allDots = /\./gu;

// The artifact's escape: a dot is escaped, and so is a leading digit.
function escapeName(name: string): string {
  const escaped = name.replace(allDots, "\\.");
  return leadingDigit.test(escaped)
    ? `\\3${escaped.slice(0, 1)} ${escaped.slice(1)}`
    : escaped;
}

function property(name: string): string {
  return `--${prefix}${escapeName(name)}`;
}

function colorLine({ name, value }: Token): string {
  const target = aliasTarget(value);
  return `  ${property(name)}: ${target === undefined ? value : `var(${property(target)})`};`;
}

function styleRule(style: TextStyle): string[] {
  return [
    `.${prefix}${escapeName(style.name)} {`,
    ...(style.family === ""
      ? []
      : [`  font-family: var(${property(`font-${style.family}`)});`]),
    `  font-size: ${style.fontSize};`,
    `  line-height: ${style.lineHeight};`,
    `  font-weight: ${style.fontWeight};`,
    `  letter-spacing: ${style.letterSpacing};`,
    ...(style.fontStyle === "normal"
      ? []
      : [`  font-style: ${style.fontStyle};`]),
    ...(style.opticalSize === undefined
      ? []
      : [`  font-variation-settings: 'opsz' ${style.opticalSize};`]),
    "}",
  ];
}

function compileTokens(source: unknown): string {
  const { theme, colors, shadows, others, families, styles } =
    readTokens(source);
  const themeLines = [
    ...colors.map(colorLine),
    ...shadows.map(({ name, value }) => `  ${property(name)}: ${value};`),
  ];
  const root = [
    ...others.map(({ name, value }) => `  ${property(name)}: ${value};`),
    ...families.map(
      ([key, stack]) => `  ${property(`font-${key}`)}: ${stack};`,
    ),
  ];
  const lines = [
    ...(themeLines.length > 0
      ? [`:root, [data-theme="${theme}"] {`, ...themeLines, "}"]
      : []),
    ...(root.length > 0 ? [":root {", ...root, "}"] : []),
    ...styles.flatMap(styleRule),
  ];
  return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}

export { compileTokens };
