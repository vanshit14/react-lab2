import { build } from "esbuild";

await build({
  entryPoints: ["src/practice/Exercises.jsx"],
  bundle: true,
  write: false,
  packages: "external",
  format: "esm",
  define: { "import.meta.env": "{}" },
});
console.log("Practice module and its local imports bundle successfully.");
