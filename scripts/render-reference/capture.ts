// What the two renders share (decisions 0033 and 0035): the design's CSS with its fonts served locally, running a
// page's scripts, and the capture at the size the content needs.

import geist from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import geistMono from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url";
import { page } from "vitest/browser";

const googleFonts =
  /^@import url\("https:\/\/fonts\.googleapis\.com[^"]*"\);\n/u;
const fontFaces = `
@font-face { font-family: Geist; src: url(${geist}) format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Geist Mono"; src: url(${geistMono}) format("woff2"); font-weight: 100 900; }
`;

// The design's CSS with Google Fonts' import replaced by Geist from Fontsource, the same files: nothing is fetched.
function withLocalFonts(css: string, file: string): string {
  if (!googleFonts.test(css)) {
    throw new Error(`${file} no longer imports Google Fonts as expected`);
  }
  return `${fontFaces}${css.replace(googleFonts, "")}`;
}

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

// Waits for the page to draw, grows the window to fit its content, and saves the screenshot at a path relative to
// the render that calls it.
async function capture(
  width: number,
  height: number,
  path: string,
): Promise<void> {
  await document.fonts.ready;
  await nextFrames();
  const { scrollWidth, scrollHeight } = document.documentElement;
  await page.viewport(
    Math.max(width, scrollWidth),
    Math.max(height, scrollHeight),
  );
  await nextFrames();
  await page.screenshot({ path });
}

export { capture, runScript, withLocalFonts };
