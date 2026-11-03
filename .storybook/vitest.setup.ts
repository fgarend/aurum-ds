// Gives the tests that import stories what every story runs in (decision 0057): the decorators and parameters of
// .storybook/preview.tsx.
import { setProjectAnnotations } from "@storybook/react-vite";
import * as preview from "./preview.js";

setProjectAnnotations([preview]);
