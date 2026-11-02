// Renders each of the artifact's previews into reference/screenshots, for review (decision 0033). Run by
// make reference, never by make test. React is the package's own, exposed as the globals the artifact's bundle
// expects.
import { createElement, useEffect, useId, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { beforeAll, it } from "vitest";
import { page } from "vitest/browser";
import tokens from "../../reference/artifact/tokens.json?raw";
import { compileTokens } from "../build-tokens/compile.ts";
import { capture, runScript, withLocalFonts } from "./capture.ts";

const previews = import.meta.glob<string>(
  "../../reference/artifact/components/*/preview.html",
  { query: "?raw", import: "default", eager: true },
);
const bundle = import.meta.glob<string>(
  "../../reference/artifact/components/bundle.{css,js}",
  { query: "?raw", import: "default", eager: true },
);
const bundleCss =
  bundle["../../reference/artifact/components/bundle.css"] ?? "";
const bundleJs = bundle["../../reference/artifact/components/bundle.js"] ?? "";
const cardHeight = /@dsCard[^>]*\bheight=(?<height>\d+)/u;
const previewName = /components\/(?<name>[^/]+)\/preview\.html$/u;
const pixels = /^(?<number>\d+)px$/u;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// The artifact gives no width: its tokens' content-max, grown when the content is wider.
function contentMax(source: string): number {
  const parsed: unknown = JSON.parse(source);
  const layout = isRecord(parsed) ? parsed["layout"] : undefined;
  const list = isRecord(layout) ? layout["tokens"] : undefined;
  const token = Array.isArray(list)
    ? list.find((entry) => isRecord(entry) && entry["name"] === "content-max")
    : undefined;
  const value = isRecord(token) ? token["value"] : undefined;
  const width = typeof value === "string" ? value.match(pixels) : null;
  if (width?.groups === undefined) {
    throw new Error("The artifact's tokens.json has no content-max in pixels");
  }
  return Number(width.groups["number"]);
}

const width = contentMax(tokens);
const defaultHeight = 120;

// What the artifact's frame loads before a preview: its tokens, its components' CSS and script, and React.
beforeAll(() => {
  const style = document.createElement("style");
  style.textContent = `${compileTokens(JSON.parse(tokens), "")}${withLocalFonts(bundleCss, "bundle.css")}`;
  document.head.append(style);
  document.documentElement.dataset["theme"] = "light";
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
  await capture(width, height, `../../reference/screenshots/${name}.png`);
});
