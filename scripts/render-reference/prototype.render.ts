// Renders each screen of the prototype into reference/screenshots/prototype, for review (decision 0035). Run by
// make reference, never by make test. The screens run on the files the export ships, React 18 included.
import { beforeAll, it } from "vitest";
import { page } from "vitest/browser";
import { capture, runScript, withLocalFonts } from "./capture.ts";

const assets = import.meta.glob<string>(
  "../../reference/prototype/assets/*.{css,js}",
  { query: "?raw", import: "default", eager: true },
);
const screens = import.meta.glob<string>("../../reference/prototype/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});
const asset = (name: string): string =>
  assets[`../../reference/prototype/assets/${name}`] ?? "";
const previewSize =
  /"\$preview":\{"width":(?<width>\d+),"height":(?<height>\d+)\}/u;
const screenName = /prototype\/(?<name>[^/]+)\.html$/u;
// The canvas's own frame for a Web Desktop screen, when a screen does not say.
const defaultWidth = 1440;
const defaultHeight = 900;

// What every screen loads in its head: the tokens, Aurum's components, and React 18.
beforeAll(() => {
  const style = document.createElement("style");
  style.textContent = `${asset("tokens.css")}${withLocalFonts(asset("aurum.css"), "aurum.css")}`;
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
  await capture(
    Number(width),
    Number(height),
    `../../reference/screenshots/prototype/${name}.png`,
  );
});
