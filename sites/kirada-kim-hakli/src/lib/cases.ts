import rawCases from "../data/cases.json";
import rawFrames from "../data/frames.json";

export type Side = "kiraci" | "evsahibi" | "ikisi";

export interface Basis { law: string; article: string; note: string }
export interface Frame {
  topic: string; short: string; basis: Basis[];
  explain: string; where: string; deadline: string;
}

interface RawCase {
  slug: string; title: string; question: string; verdict: Side; frame: string;
  surprising: boolean; aliases: string[];
  kiraci: string; evsahibi: string;
  summary: string; situation: string; legal: string; tip: string;
  related?: string[]; updated?: string;
}
export interface Case extends Omit<RawCase, "related" | "updated"> {
  topic: string; related: string[]; updated: string;
}

export const frames = rawFrames as Record<string, Frame>;
const DEFAULT_UPDATED = "2026-09-11";

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

export const sideLabel: Record<Side, string> = {
  kiraci: "Kiracı haklı",
  evsahibi: "Ev sahibi haklı",
  ikisi: "İkisi de kısmen haklı",
};
export const sideShort: Record<Side, string> = {
  kiraci: "KİRACI",
  evsahibi: "EV SAHİBİ",
  ikisi: "KISMEN",
};

export function related(c: Case): Case[] {
  return c.related.map((s) => bySlug.get(s)).filter((x): x is Case => Boolean(x));
}
export function neighbours(c: Case) {
  const i = cases.findIndex((x) => x.slug === c.slug);
  return { prev: i > 0 ? cases[i - 1] : null, next: i < cases.length - 1 ? cases[i + 1] : null };
}

export const surprising = cases.filter((c) => c.surprising);
export const byVerdict = (v: Side) => cases.filter((c) => c.verdict === v);

export const searchIndex = cases.map((c) => ({
  s: c.slug, t: c.title, q: c.question, c: c.topic, v: c.verdict, a: c.aliases.join(" "),
}));
