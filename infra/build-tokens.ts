// Writes src/tokens/tokens.css from src/tokens/tokens.json (decision 0026). Run by make tokens: the CSS is never
// edited by hand. Vite loads the compiler, since Node alone does not resolve the .js imports of the sources.
import { readFile, writeFile } from "node:fs/promises";
import { runnerImport } from "vite";

type Compile = (source: unknown) => string;

const tokensFolder = new URL("../src/tokens/", import.meta.url);

if (import.meta.main) {
  try {
    const { module } = await runnerImport<{ compileTokens: Compile }>(
      new URL("compile.ts", tokensFolder).pathname,
      { configFile: false, logLevel: "silent" },
    );
    const source: unknown = JSON.parse(
      await readFile(new URL("tokens.json", tokensFolder), "utf8"),
    );
    await writeFile(
      new URL("tokens.css", tokensFolder),
      module.compileTokens(source),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
