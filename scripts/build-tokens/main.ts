// Writes src/tokens/tokens.css from src/tokens/tokens.json (decision 0026). Run by make tokens: the CSS is never
// edited by hand.
import { readFile, writeFile } from "node:fs/promises";
import { compileTokens } from "./compile.ts";

const tokensFolder = new URL("../../src/tokens/", import.meta.url);

async function main(): Promise<void> {
  const source: unknown = JSON.parse(
    await readFile(new URL("tokens.json", tokensFolder), "utf8"),
  );
  await writeFile(new URL("tokens.css", tokensFolder), compileTokens(source));
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
