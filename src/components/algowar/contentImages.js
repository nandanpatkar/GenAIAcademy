// Article images extracted from the theory levels, bundled by Vite. Statements reference
// them as `algowar-content:<hash>.webp`, which resolves to a hashed asset URL here.
const modules = import.meta.glob("../../assets/algowar/content/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const BY_NAME = Object.fromEntries(
  Object.entries(modules).map(([p, url]) => [p.split("/").pop(), url]),
);

export const contentImage = (name) => BY_NAME[name] ?? null;
