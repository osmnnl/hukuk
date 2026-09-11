#!/usr/bin/env node
import { readFileSync } from "node:fs";
const read = (f) => JSON.parse(readFileSync(new URL(`../src/data/${f}`, import.meta.url), "utf8"));
const cases = read("cases.json");
const frames = read("frames.json");

const REQ = ["slug","title","question","verdict","frame","weight","surprising","alone","aliases","summary","situation","legal"];
const VERDICTS = new Set(["kusur","degil","kosullu"]);
const ALONE = new Set(["tek","birlikte"]);
const errors = [], warns = [];
const slugs = new Set(), titles = new Map();

for (const [id, f] of Object.entries(frames))
  for (const k of ["category","short","basis","explain","evidence","deadline","consequence"])
    if (!(k in f)) errors.push(`çerçeve ${id}: "${k}" eksik`);

for (const [i, c] of cases.entries()) {
  const id = c.slug || `#${i}`;
  for (const k of REQ) if (!(k in c)) errors.push(`${id}: "${k}" eksik`);
  if (!/^[a-z0-9-]+$/.test(c.slug || "")) errors.push(`${id}: slug yalnız a-z, 0-9 ve - içerebilir`);
  if (slugs.has(c.slug)) errors.push(`${id}: slug tekrar ediyor`);
  slugs.add(c.slug);
  if (!VERDICTS.has(c.verdict)) errors.push(`${id}: verdict kusur|degil|kosullu olmalı`);
  if (!ALONE.has(c.alone)) errors.push(`${id}: alone tek|birlikte olmalı`);
  if (!frames[c.frame]) errors.push(`${id}: tanımsız çerçeve "${c.frame}"`);
  if (!Number.isInteger(c.weight) || c.weight < 1 || c.weight > 5) errors.push(`${id}: weight 1-5 arası tam sayı olmalı`);
  if (typeof c.surprising !== "boolean") errors.push(`${id}: surprising boolean olmalı`);
  if (!c.question?.includes("?")) errors.push(`${id}: question soru işareti içermeli`);
  if ((c.summary || "").length < 40) errors.push(`${id}: summary çok kısa`);
  if ((c.situation || "").length < 60) errors.push(`${id}: situation çok kısa`);
  if ((c.legal || "").length < 60) errors.push(`${id}: legal çok kısa`);
  if (c.verdict === "degil" && c.weight > 2) warns.push(`${id}: kusur değil ama ağırlık ${c.weight}`);
  const key = (c.title || "").toLocaleLowerCase("tr").trim();
  if (titles.has(key)) warns.push(`${id}: başlık "${c.title}" ${titles.get(key)} ile çakışıyor`);
  else titles.set(key, c.slug);
}
for (const c of cases) for (const r of c.related || []) if (!slugs.has(r)) errors.push(`${c.slug}: kırık related → ${r}`);

// quiz ve terazi için yeterli havuz var mı
const pool = cases.filter((c) => c.frame !== "usul");
if (pool.length < 12) errors.push(`quiz havuzu yetersiz: ${pool.length} (en az 12 gerekli)`);

if (warns.length) console.warn(`⚠ ${warns.length} uyarı:\n` + warns.map((w) => "  - " + w).join("\n"));
if (errors.length) { console.error(`✖ ${errors.length} hata:\n` + errors.map((e) => "  - " + e).join("\n")); process.exit(1); }

const v = {}; for (const c of cases) v[c.verdict] = (v[c.verdict] || 0) + 1;
console.log(`✓ ${cases.length} senaryo · ${Object.keys(frames).length} çerçeve · quiz havuzu ${pool.length}`);
console.log(`  kusur:${v.kusur || 0}  duruma göre:${v.kosullu || 0}  değil:${v.degil || 0}  · şaşırtıcı:${cases.filter((c) => c.surprising).length}`);
