import fs from "node:fs";
import { execSync } from "node:child_process";

const winPath = (p) =>
  process.platform === "win32" && p.startsWith("/")
    ? execSync(`cygpath -w "${p}"`).toString().trim().replace(/\\/g, "/")
    : p;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
};

const url = process.argv[2];
const out = process.argv[3];

const res = await fetch(url, {
  method: "GET",
  headers: HEADERS,
  redirect: "follow",
  cache: "no-store",
  signal: AbortSignal.timeout(15000),
});
const html = await res.text();
fs.writeFileSync(winPath(out), html);
console.log(
  JSON.stringify({
    status: res.status,
    finalUrl: res.url,
    bytes: html.length,
    hasProductTitle: html.includes('id="productTitle"'),
    hasAprice: html.includes('a-price'),
    hasOgTitle: html.includes('og:title'),
    title: (html.match(/<title>([^<]*)</) || [])[1]?.slice(0, 80),
    looksLikeCaptcha: /api-services-support@amazon|Enter the characters you see|automated access/i.test(html),
  })
);
