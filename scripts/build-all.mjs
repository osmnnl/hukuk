#!/usr/bin/env node
/**
 * Her siteyi kendi alt dizinine derler, çıktıları tek dist/ altında birleştirir.
 * Hub kökte, siteler dist/<slug>/ altında yayınlanır.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sites = JSON.parse(readFileSync(join(root, "sites.json"), "utf8"));
const validateOnly = process.argv.includes("--validate-only");

const SITE_URL = process.env.SITE_URL || "https://osmnnl.github.io";
const ROOT_BASE = process.env.BASE_PATH || "/hukuk";
const dist = join(root, "dist");

const run = (cmd, cwd, env) =>
  execSync(cmd, { cwd, stdio: "inherit", env: { ...process.env, ...env } });

console.log(`\n📦 ${sites.length} site · kök: ${SITE_URL}${ROOT_BASE}\n`);

// --- doğrulama ---
let failed = 0;
for (const s of sites) {
  const dir = join(root, "sites", s.slug);
  if (!existsSync(dir)) { console.error(`✖ ${s.slug}: dizin yok`); failed++; continue; }
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  if (!pkg.scripts?.validate) continue;
  try { run("npm run validate --silent", dir); }
  catch { console.error(`✖ ${s.slug}: doğrulama başarısız`); failed++; }
}
if (failed) { console.error(`\n✖ ${failed} sitede doğrulama hatası`); process.exit(1); }
if (validateOnly) { console.log("\n✓ Tüm siteler geçerli"); process.exit(0); }

// --- derleme ---
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const s of sites) {
  const dir = join(root, "sites", s.slug);
  const base = `${ROOT_BASE}/${s.slug}`.replace(/\/{2,}/g, "/");
  console.log(`\n▶ ${s.slug}  →  ${base}/`);
  run("npx astro build", dir, { SITE_URL, BASE_PATH: base });
  cpSync(join(dir, "dist"), join(dist, s.slug), { recursive: true });
}

// --- tüm sitelerin arama indekslerini birleştir (hub'ın çapraz araması için) ---
const merged = [];
for (const s of sites) {
  const f = join(dist, s.slug, "search-index.json");
  if (!existsSync(f)) { console.warn(`  ⚠ ${s.slug}: search-index.json yok, birleşik aramaya girmedi`); continue; }
  for (const row of JSON.parse(readFileSync(f, "utf8"))) {
    merged.push({ s: row.s, t: row.t, q: row.q, a: row.a ?? "", site: s.slug, siteName: s.name, color: s.accent });
  }
}
writeFileSync(join(dist, "arama.json"), JSON.stringify(merged));
console.log(`\n🔎 birleşik arama indeksi: ${merged.length} kayıt`);

console.log(`\n▶ hub  →  ${ROOT_BASE}/`);
run("npx astro build", join(root, "hub"), { SITE_URL, BASE_PATH: ROOT_BASE });
cpSync(join(root, "hub", "dist"), dist, { recursive: true });

// Jekyll'in _astro gibi alt çizgili dizinleri yok saymaması için
writeFileSync(join(dist, ".nojekyll"), "");

console.log(`\n✓ Tamamlandı — dist/ altında ${sites.length} site + hub\n`);
