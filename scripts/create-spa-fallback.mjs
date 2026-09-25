import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");
const fallbackPath = path.join(distDir, "404.html");

if (!fs.existsSync(indexPath)) {
  console.warn("Skipping GitHub Pages SPA fallback: dist/index.html does not exist.");
  process.exit(0);
}

fs.copyFileSync(indexPath, fallbackPath);
console.log("Created dist/404.html as a GitHub Pages SPA fallback.");
