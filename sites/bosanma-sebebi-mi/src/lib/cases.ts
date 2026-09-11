import rawCases from "../data/cases.json";
import rawFrames from "../data/frames.json";

export type Verdict = "kusur" | "degil" | "kosullu";

export interface Basis { law: string; article: string; note: string }

export interface Frame {
  category: string;
  short: string;
  basis: Basis[];
  explain: string;
  evidence: string;
  deadline: string;
  consequence: string;
}

interface RawCase {
  slug: string; title: string; question: string; verdict: Verdict;
  frame: string; weight: number; surprising: boolean;
  alone: "tek" | "birlikte";
  aliases: string[]; summary: string; situation: string; legal: string;
  related?: string[]; updated?: string;
}

export interface Case extends Omit<RawCase, "related" | "updated"> {
  category: string;
  related: string[];
  updated: string;
}

export const frames = rawFrames as Record<string, Frame>;
const DEFAULT_UPDATED = "2026-09-11";

export const cases: Case[] = (rawCases as RawCase[])
  .map((c) => {
    const f = frames[c.frame];
    if (!f) throw new Error(`"${c.slug}" için çerçeve yok: ${c.frame}`);
    return { ...c, category: f.category, related: c.related ?? [], updated: c.updated ?? DEFAULT_UPDATED };
  })
  .sort((a, b) => a.title.localeCompare(b.title, "tr"));

export const bySlug = new Map(cases.map((c) => [c.slug, c]));
export const categories = [...new Set(cases.map((c) => c.category))];

/** İlişkili senaryolar: elle verilmemişse aynı çerçeveden komşular. */
const byFrame = new Map<string, Case[]>();
for (const c of cases) {
  const l = byFrame.get(c.frame) ?? [];
  l.push(c);
  byFrame.set(c.frame, l);
}
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

export const verdictLabel: Record<Verdict, string> = {
  kusur: "Kusur sayılır",
  degil: "Kusur sayılmaz",
  kosullu: "Duruma göre değişir",
};

export const verdictShort: Record<Verdict, string> = {
  kusur: "KUSUR",
  degil: "KUSUR DEĞİL",
  kosullu: "DURUMA GÖRE",
};

export const aloneLabel: Record<Case["alone"], string> = {
  tek: "Tek başına dava sebebi olabilir",
  birlikte: "Diğer olgularla birlikte değerlendirilir",
};

export function related(c: Case): Case[] {
  return c.related.map((s) => bySlug.get(s)).filter((x): x is Case => Boolean(x));
}

export function neighbours(c: Case) {
  const i = cases.findIndex((x) => x.slug === c.slug);
  return { prev: i > 0 ? cases[i - 1] : null, next: i < cases.length - 1 ? cases[i + 1] : null };
}

export const surprising = cases.filter((c) => c.surprising);
export const notFault = cases.filter((c) => c.verdict === "degil");
export const aloneEnough = cases.filter((c) => c.alone === "tek" && c.verdict === "kusur");

/** Quiz havuzu: net verdict'i olan, usul dışı senaryolar. */
export const quizPool = cases.filter((c) => c.frame !== "usul");

/** Terazi: ağırlığı farklı olan çiftler, deterministik eşleştirme. */
export const scalePairs = (() => {
  const pool = cases.filter((c) => c.frame !== "usul" && c.verdict !== "degil");
  const sorted = [...pool].sort((a, b) => a.weight - b.weight || a.slug.localeCompare(b.slug));
  const pairs: { a: Case; b: Case }[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i];
    const b = sorted[(i + 7) % sorted.length];
    if (a.weight !== b.weight && !pairs.some((p) => p.a.slug === b.slug && p.b.slug === a.slug)) {
      pairs.push({ a, b });
    }
  }
  return pairs.slice(0, 20);
})();

export const searchIndex = cases.map((c) => ({
  s: c.slug, t: c.title, q: c.question, c: c.category, v: c.verdict, a: c.aliases.join(" "),
}));
