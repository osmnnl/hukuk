#!/usr/bin/env node
/**
 * Şablondan yeni site iskeleti üretir.
 *   node scripts/new-site.mjs <slug>
 * Şablondaki ortak dosyalar kopyalanır; site yalnız kendi verisini,
 * paletini ve özel araç sayfalarını yazar.
 */
import { cpSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const slug = process.argv[2];
if (!slug) { console.error("Kullanım: node scripts/new-site.mjs <slug>"); process.exit(1); }

const dir = join(root, "sites", slug);
if (existsSync(dir)) { console.error(`✖ sites/${slug} zaten var`); process.exit(1); }

mkdirSync(dir, { recursive: true });
cpSync(join(root, "template"), dir, { recursive: true });

writeFileSync(join(dir, "package.json"), JSON.stringify({
  name: slug, version: "0.1.0", private: true, type: "module",
  scripts: { dev: "astro dev", validate: "node scripts/validate.mjs", build: "node scripts/validate.mjs && astro build", preview: "astro preview" },
  dependencies: { astro: "^5.13.0" },
}, null, 2) + "\n");

writeFileSync(join(dir, "astro.config.mjs"),
`// @ts-check
import { defineConfig } from "astro/config";
const site = process.env.SITE_URL || "https://osmnnl.github.io";
const base = process.env.BASE_PATH || "/";
export default defineConfig({ site, base, trailingSlash: "always", build: { format: "directory" }, compressHTML: true });
`);
writeFileSync(join(dir, "tsconfig.json"), `{ "extends": "astro/tsconfigs/strict" }\n`);
mkdirSync(join(dir, "public"), { recursive: true });
writeFileSync(join(dir, "public/.nojekyll"), "");

console.log(`✓ sites/${slug} oluşturuldu.
  Doldurulacaklar:
    src/data/meta.json    → ad, slogan, birim, verdict etiketleri
    src/data/nav.json     → menü
    src/data/frames.json  → konu başlıkları ve dayanaklar
    src/data/cases.json   → kayıtlar
    src/styles/theme.css  → palet
    src/pages/index.astro → ana sayfa ve araçlar
    public/favicon.svg`);
