// Renders each screen of the prototype into reference/screenshots/prototype, for review (decision 0035). Run by
// make reference, never by make test. The screens run on the files the export ships, React 18 included, and nothing
// is fetched: Google Fonts' import gives way to Geist from Fontsource, the same files.

import geist from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import geistMono from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url";
import { beforeAll, it } from "vitest";
import { page } from "vitest/browser";

const assets = import.meta.glob<string>(
  "../reference/prototype/assets/*.{css,js}",
  { query: "?raw", import: "default", eager: true },
);
const screens = import.meta.glob<string>("../reference/prototype/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});
const asset = (name: string): string =>
  assets[`../reference/prototype/assets/${name}`] ?? "";
const googleFonts =
  /^@import url\("https:\/\/fonts\.googleapis\.com[^"]*"\);\n/u;
const previewSize =
  /"\$preview":\{"width":(?<width>\d+),"height":(?<height>\d+)\}/u;
const screenName = /prototype\/(?<name>[^/]+)\.html$/u;
// The canvas's own frame for a Web Desktop screen, when a screen does not say.
const defaultWidth = 1440;
const defaultHeight = 900;

const fontFaces = `
@font-face { font-family: Geist; src: url(${geist}) format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Geist Mono"; src: url(${geistMono}) format("woff2"); font-weight: 100 900; }
`;

function runScript(code: string): void {
  const script = document.createElement("script");
  script.textContent = code;
  document.body.append(script);
}

function nextFrames(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

// What every screen loads in its head: the tokens, Aurum's components, and React 18.
beforeAll(() => {
  const aurumCss = asset("aurum.css");
  if (!googleFonts.test(aurumCss)) {
    throw new Error("aurum.css no longer imports Google Fonts as expected");
  }
  const style = document.createElement("style");
  style.textContent = `${fontFaces}${asset("tokens.css")}${aurumCss.replace(googleFonts, "")}`;
  document.head.append(style);
  document.documentElement.lang = "pt-BR";
  document.documentElement.dataset["theme"] = "light";
  for (const name of [
    "react.production.min.js",
    "react-dom.production.min.js",
    "aurum.js",
  ]) {
    runScript(asset(name));
  }
});

const entries = Object.entries(screens)
  .map(([path, html]) => ({
    name: path.match(screenName)?.groups?.["name"] ?? path,
    html,
  }))
  .filter(({ name }) => name !== "index");

it.each(entries)("renders the $name screen", async ({ name, html }) => {
  const screen = new DOMParser().parseFromString(html, "text/html");
  const { width = defaultWidth, height = defaultHeight } =
    html.match(previewSize)?.groups ?? {};
  document.body.replaceChildren();
  for (const node of [...screen.body.childNodes]) {
    // The screen's data stays as an inert element, for screen.js to read; scripts with a source are in the head.
    if (!(node instanceof HTMLScriptElement && node.src !== "")) {
      document.body.append(document.importNode(node, true));
    }
  }
  await page.viewport(Number(width), Number(height));
  runScript(asset("screen.js"));
  await document.fonts.ready;
  await nextFrames();
  const { scrollWidth, scrollHeight } = document.documentElement;
  await page.viewport(
    Math.max(Number(width), scrollWidth),
    Math.max(Number(height), scrollHeight),
  );
  await nextFrames();
  await page.screenshot({
    path: `../reference/screenshots/prototype/${name}.png`,
  });
});
