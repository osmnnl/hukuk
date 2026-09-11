import type { APIRoute } from "astro";
import { cases } from "../lib/cases";
import nav from "../data/nav.json";

const SITE = (import.meta.env.SITE ?? "").replace(/\/$/, "");
const BASE = import.meta.env.BASE_URL;
const abs = (p: string) => SITE + (BASE + p.replace(/^\/+/, "")).replace(/\/{2,}/g, "/");

export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const statics = [...(nav as { href: string }[]).map((n) => n.href), "/hakkinda/"];
  const urls = [
    ...statics.map((p) => ({ loc: abs(p), lastmod: today, pri: p === "/" ? "1.0" : "0.8" })),
    ...cases.map((c) => ({ loc: abs(`/${c.slug}/`), lastmod: c.updated, pri: "0.8" })),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.pri}</priority></url>`)
      .join("\n")}\n</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
};
