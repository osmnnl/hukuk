#!/usr/bin/env node
import { readFileSync } from "node:fs";
const read = (f) => JSON.parse(readFileSync(new URL(`../src/data/${f}`, import.meta.url), "utf8"));
const cases = read("cases.json");
const frames = read("frames.json");

const REQ = ["slug","title","question","verdict","frame","surprising","aliases","kiraci","evsahibi","summary","situation","legal","tip"];
const VERDICTS = new Set(["kiraci","evsahibi","ikisi"]);
const errors = [], warns = [];
const slugs = new Set(), titles = new Map();

for (const [id, f] of Object.entries(frames))
  for (const k of ["topic","short","basis","explain","where","deadline"])
    if (!(k in f)) errors.push(`çerçeve ${id}: "${k}" eksik`);

for (const [i, c] of cases.entries()) {
  const id = c.slug || `#${i}`;
  for (const k of REQ) if (!(k in c)) errors.push(`${id}: "${k}" eksik`);
  if (!/^[a-z0-9-]+$/.test(c.slug || "")) errors.push(`${id}: slug yalnız a-z, 0-9 ve - içerebilir`);
  if (slugs.has(c.slug)) errors.push(`${id}: slug tekrar ediyor`);
  slugs.add(c.slug);
  if (!VERDICTS.has(c.verdict)) errors.push(`${id}: verdict kiraci|evsahibi|ikisi olmalı`);
  if (!frames[c.frame]) errors.push(`${id}: tanımsız çerçeve "${c.frame}"`);
  if (typeof c.surprising !== "boolean") errors.push(`${id}: surprising boolean olmalı`);
  if (!c.question?.includes("?")) errors.push(`${id}: question soru işareti içermeli`);
  if ((c.summary || "").length < 40) errors.push(`${id}: summary çok kısa`);
  if ((c.situation || "").length < 60) errors.push(`${id}: situation çok kısa`);
  if ((c.legal || "").length < 60) errors.push(`${id}: legal çok kısa`);
  if ((c.tip || "").length < 30) errors.push(`${id}: tip çok kısa`);
  if ((c.kiraci || "").length < 15 || (c.evsahibi || "").length < 15) errors.push(`${id}: taraf iddiaları çok kısa`);
  const key = (c.title || "").toLocaleLowerCase("tr").trim();
  if (titles.has(key)) warns.push(`${id}: başlık "${c.title}" ${titles.get(key)} ile çakışıyor`);
  else titles.set(key, c.slug);
}
for (const c of cases) for (const r of c.related || []) if (!slugs.has(r)) errors.push(`${c.slug}: kırık related → ${r}`);



if (warns.length) console.warn(`⚠ ${warns.length} uyarı:\n` + warns.map((w) => "  - " + w).join("\n"));
if (errors.length) { console.error(`✖ ${errors.length} hata:\n` + errors.map((e) => "  - " + e).join("\n")); process.exit(1); }

const v = {}; for (const c of cases) v[c.verdict] = (v[c.verdict] || 0) + 1;
console.log(`✓ ${cases.length} senaryo · ${Object.keys(frames).length} başlık`);
console.log(`  kiracı:${v.kiraci || 0}  ev sahibi:${v.evsahibi || 0}  kısmen:${v.ikisi || 0}  · şaşırtıcı:${cases.filter((c) => c.surprising).length}`);
