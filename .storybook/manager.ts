// The look of Storybook's own interface (decision 0057): the light side of Aurum, as its screens' content has it,
// with every value read from the tokens. The canvas behind white panels, thin lines, Aurum's radii and fonts, its
// gold accent, and its brand mark.
import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
import tokens from "../src/tokens/tokens.json" with { type: "json" };

function color(name: string): string {
  const token = tokens.color.tokens.find((entry) => entry.name === name);
  if (token === undefined) {
    throw new Error(`src/tokens/tokens.json has no color ${name}`);
  }
  return token.value;
}

function radius(name: string): number {
  const token = tokens.radius.tokens.find((entry) => entry.name === name);
  if (token === undefined) {
    throw new Error(`src/tokens/tokens.json has no radius ${name}`);
  }
  return Number.parseInt(token.value, 10);
}

// Aurum's brand mark: an A on a gold square, beside the name.
const brand = `<span style="display: inline-flex; align-items: center; gap: 10px; font-weight: 600;">
  <span style="display: inline-grid; place-items: center; width: 24px; height: 24px; border-radius: ${radius("radius-md")}px; background: ${color("gold")}; color: ${color("on-gold")}; font-size: 13px;">A</span>
  Aurum DS
</span>`;

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: brand,
    fontBase: '"Geist Variable", system-ui, sans-serif',
    fontCode: '"Geist Mono Variable", ui-monospace, monospace',
    colorPrimary: color("gold"),
    // Storybook writes white on this color, in the selected story, so it is Aurum's dark grey, where white reads.
    colorSecondary: color("ink-muted"),
    appBg: color("canvas"),
    appContentBg: color("surface"),
    appHoverBg: color("surface-hover"),
    appPreviewBg: color("canvas"),
    appBorderColor: color("line"),
    appBorderRadius: radius("radius-lg"),
    textColor: color("ink"),
    textInverseColor: color("on-gold"),
    textMutedColor: color("ink-muted"),
    barBg: color("surface"),
    barTextColor: color("ink-muted"),
    barHoverColor: color("gold-ink"),
    barSelectedColor: color("gold-ink"),
    buttonBg: color("surface"),
    buttonBorder: color("control-border"),
    inputBg: color("surface"),
    inputBorder: color("control-border"),
    inputTextColor: color("ink"),
    inputBorderRadius: radius("radius-md"),
  }),
});
