import rawCases from "../data/cases.json";
import rawFrames from "../data/frames.json";
import meta from "../data/meta.json";

export type Verdict = "a" | "b" | "c";
export interface Basis { law: string; article: string; note: string }
export interface Frame { topic: string; short: string; basis: Basis[]; explain: string; deadline: string; where: string }

interface RawCase {
  slug: string; title: string; question: string; verdict: Verdict; frame: string;
  surprising: boolean; aliases: string[]; summary: string; situation: string;
  legal: string; tip: string; rights: string[]; related?: string[]; updated?: string;
}
export interface Case extends Omit<RawCase, "related" | "updated"> { topic: string; related: string[]; updated: string }

export const site = meta as {
  name: string; tagline: string; unit: string;
  verdicts: Record<Verdict, { label: string; short: string }>;
};
export const frames = rawFrames as Record<string, Frame>;
const DEFAULT_UPDATED = "2026-09-12";

export const cases: Case[] = (rawCases as RawCase[])
  .map((c) => {
    const f = frames[c.frame];
    if (!f) throw new Error(`"${c.slug}" için çerçeve yok: ${c.frame}`);
    return { ...c, topic: f.topic, related: c.related ?? [], updated: c.updated ?? DEFAULT_UPDATED };
  })
  .sort((a, b) => a.title.localeCompare(b.title, "tr"));

export const bySlug = new Map(cases.map((c) => [c.slug, c]));
export const topics = [...new Set(cases.map((c) => c.topic))];

const byFrame = new Map<string, Case[]>();
for (const c of cases) { const l = byFrame.get(c.frame) ?? []; l.push(c); byFrame.set(c.frame, l); }
for (const c of cases) {
  if (c.related.length) continue;
  const sib = byFrame.get(c.frame) ?? [];
  const i = sib.findIndex((x) => x.slug === c.slug);
  const out: string[] = [];
  for (let s = 1; out.length < 4 && s < sib.length; s++) {
    const n = sib[(i + s) % sib.length];
    if (n.slug !== c.slug) out.push(n.slug);
  }
  c.related = out;
}

export const verdictLabel = (v: Verdict) => site.verdicts[v].label;
export const verdictShort = (v: Verdict) => site.verdicts[v].short;
export function related(c: Case): Case[] { return c.related.map((s) => bySlug.get(s)).filter((x): x is Case => Boolean(x)); }
export function neighbours(c: Case) {
  const i = cases.findIndex((x) => x.slug === c.slug);
  return { prev: i > 0 ? cases[i - 1] : null, next: i < cases.length - 1 ? cases[i + 1] : null };
}
export const surprising = cases.filter((c) => c.surprising);
export const searchIndex = cases.map((c) => ({
  s: c.slug, t: c.title, q: c.question, c: c.topic, v: c.verdict, a: c.aliases.join(" "),
}));
