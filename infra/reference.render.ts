// Renders each of the artifact's previews into reference/screenshots, for review (decision 0033). Run by
// make reference, never by make test. Nothing is fetched: React is the package's own, exposed as the globals the
// artifact's bundle expects, and Geist comes from Fontsource, the same files Google Fonts serves.
import geist from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import geistMono from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url";
import { createElement, useEffect, useId, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { beforeAll, it } from "vitest";
import { page } from "vitest/browser";
import tokens from "../reference/artifact/tokens.json?raw";
import { compileTokens } from "../src/tokens/compile.js";

const previews = import.meta.glob<string>(
  "../reference/artifact/components/*/preview.html",
  { query: "?raw", import: "default", eager: true },
);
const bundle = import.meta.glob<string>(
  "../reference/artifact/components/bundle.{css,js}",
  { query: "?raw", import: "default", eager: true },
);
const bundleCss = bundle["../reference/artifact/components/bundle.css"] ?? "";
const bundleJs = bundle["../reference/artifact/components/bundle.js"] ?? "";
const googleFonts =
  /^@import url\("https:\/\/fonts\.googleapis\.com[^"]*"\);\n/u;
const cardHeight = /@dsCard[^>]*\bheight=(?<height>\d+)/u;
const previewName = /components\/(?<name>[^/]+)\/preview\.html$/u;
// The artifact gives no width: the tokens' content-max, grown when the content is wider.
const width = 1200;
const defaultHeight = 120;

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

// What the artifact's frame loads before a preview: its tokens, its components' CSS and script, and React.
beforeAll(() => {
  if (!googleFonts.test(bundleCss)) {
    throw new Error("bundle.css no longer imports Google Fonts as expected");
  }
  const style = document.createElement("style");
  style.textContent = `${fontFaces}${compileTokens(JSON.parse(tokens), "")}${bundleCss.replace(googleFonts, "")}`;
  document.head.append(style);
  document.documentElement.dataset["theme"] = "light";
  // The React the artifact's bundle and previews call, from the package's React 19.
  Object.assign(globalThis, {
    // biome-ignore lint/style/useNamingConvention: the global names the artifact's bundle reads.
    React: { createElement, useEffect, useId, useRef, useState },
    // biome-ignore lint/style/useNamingConvention: the global names the artifact's bundle reads.
    ReactDOM: { createRoot },
  });
  runScript(bundleJs);
});

const entries = Object.entries(previews).map(([path, html]) => ({
  name: path.match(previewName)?.groups?.["name"] ?? path,
  html,
}));

it.each(entries)("renders the $name preview", async ({ name, html }) => {
  const preview = new DOMParser().parseFromString(html, "text/html");
  const height = Number(
    html.match(cardHeight)?.groups?.["height"] ?? defaultHeight,
  );
  document.body.replaceChildren();
  for (const style of preview.head.querySelectorAll("style")) {
    document.body.append(style);
  }
  for (const node of [...preview.body.childNodes]) {
    if (!(node instanceof HTMLScriptElement)) {
      document.body.append(document.importNode(node, true));
    }
  }
  await page.viewport(width, height);
  for (const script of preview.body.querySelectorAll("script")) {
    runScript(script.textContent);
  }
  await document.fonts.ready;
  await nextFrames();
  const { scrollWidth, scrollHeight } = document.documentElement;
  await page.viewport(
    Math.max(width, scrollWidth),
    Math.max(height, scrollHeight),
  );
  await nextFrames();
  await page.screenshot({ path: `../reference/screenshots/${name}.png` });
});
