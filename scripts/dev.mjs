#!/usr/bin/env node
/** Tek bir siteyi geliştirme modunda açar: npm run dev -- <slug> */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sites = JSON.parse(readFileSync(join(root, "sites.json"), "utf8"));
const slug = process.argv[2];

if (!slug) {
  console.log("Kullanım: npm run dev -- <slug>\n\nSiteler:");
  sites.forEach((s) => console.log(`  ${s.slug.padEnd(22)} ${s.name}`));
  console.log(`  ${"hub".padEnd(22)} Kapak sayfası`);
  process.exit(0);
}
const dir = slug === "hub" ? join(root, "hub") : join(root, "sites", slug);
execSync("npx astro dev", { cwd: dir, stdio: "inherit", env: { ...process.env, BASE_PATH: "/" } });
