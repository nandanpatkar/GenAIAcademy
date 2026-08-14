import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  ...coreWebVitals,
  ...typescript,
  // public/ holds vendored MediaPipe wasm loaders — 8000-column generated JS
  // that is not ours to lint.
  { ignores: [".next/**", "out/**", "node_modules/**", "public/**"] },
];

export default config;
