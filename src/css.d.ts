// A component imports its own CSS (decision 0055): TypeScript checks every import, and this tells it what a .css
// file is, without bringing Vite's types into the package's code (decision 0013).
declare module "*.css";
