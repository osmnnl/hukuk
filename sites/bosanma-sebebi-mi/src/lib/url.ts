const BASE = import.meta.env.BASE_URL;

export function url(path: string): string {
  return (BASE + path.replace(/^\/+/, "")).replace(/\/{2,}/g, "/");
}

export function absUrl(path: string): string {
  const site = import.meta.env.SITE?.replace(/\/$/, "") ?? "";
  return site + url(path);
}

export { BASE };
