import { load } from "cheerio";
import fs from "node:fs";
import { execSync } from "node:child_process";

// Git Bash hands us /tmp/... which Node (win32) resolves against the
// current drive — ask cygpath for the real Windows location.
const winPath = (p) => {
  if (process.platform !== "win32" || !p.startsWith("/")) return p;
  try {
    return execSync(`cygpath -w "${p}"`).toString().trim().replace(/\\/g, "/");
  } catch {
    return p;
  }
};

const specs = process.argv.slice(2);
const targets = {};
for (const spec of specs) {
  const [name, file] = spec.split("=");
  targets[name] = winPath(file);
}

for (const [name, file] of Object.entries(targets)) {
  if (!fs.existsSync(file)) {
    console.log(`\n=== ${name}: MISSING ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const $ = load(html);
  const text = (sel) => ($(sel).first().text() || "").trim().slice(0, 70);
  const attr = (sel, a) => ($(sel).first().attr(a) || "").slice(0, 70);

  const ld = [];
  $('script[type*="ld+json"]').each((_, el) => {
    const raw = ($(el).html() || "").trim();
    try {
      const j = JSON.parse(raw);
      ld.push(JSON.stringify(j).slice(0, 220));
    } catch (e) {
      ld.push(`PARSE_FAIL(${raw.length}): ${String(e.message).slice(0, 60)} :: ${raw.slice(0, 260)}`);
    }
  });

  console.log(`\n=== ${name} (${html.length} bytes)`);
  console.log(" title:", text("title").slice(0, 90));
  console.log(" og:title:", attr('meta[property="og:title"]', "content"));
  console.log(" ld+json blocks:", ld.length, ld.slice(0, 3));
  console.log(" #productTitle:", text("#productTitle"));
  console.log(" h1:", text("h1"));
  console.log(" pdp-name:", text('[class*="pdp-name"]'));
  console.log(" a-offscreen:", text(".a-price .a-offscreen"), "|", text("#corePrice_feature_div .a-offscreen"));
  console.log(" itemprop price:", attr('[itemprop="price"]', "content") || text('[itemprop="price"]'));
  console.log(" pdp-price:", text('[class*="pdp-price"]'));
  console.log(" any class*=price (first):", text('[class*="price"]').slice(0, 60));
  const m = html.match(/(?:₹|Rs\.?\s?|INR\s?)\s?[\d,]+(?:\.\d+)?/);
  if (m) {
    const at = m.index;
    console.log(
      " currency match ctx:",
      JSON.stringify(html.slice(Math.max(0, at - 160), at + 60).replace(/\s+/g, " "))
    );
  } else {
    console.log(" currency match: none");
  }
}
