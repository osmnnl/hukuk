import type { APIRoute } from "astro";
import { searchIndex } from "../lib/cases";
export const GET: APIRoute = () =>
  new Response(JSON.stringify(searchIndex), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
