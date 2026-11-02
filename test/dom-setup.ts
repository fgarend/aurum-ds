// Runs before every component test (decisions 0020 and 0039).
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only cleans up by itself when test functions are global, and here they are imported.
afterEach(() => {
  cleanup();
});
