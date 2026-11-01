// Runs before every component test (decision 0020). Not part of the package.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only cleans up by itself when test functions are global, and here they are imported.
afterEach(() => {
  cleanup();
});
