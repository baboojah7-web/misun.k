// D-20. 링크 미리보기 이미지(public/og.png, 1200×630)와 아이콘을 만듭니다.
// 문구는 site.ts에서 읽습니다. 팀장님이 직접 만든 이미지가 있으면 public/og.png 를 덮어쓰면 됩니다.
//   pnpm make:images
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";
import { site } from "../src/config/site";

const root = join(import.meta.dirname, "..");
const font = readFileSync(join(root, "src/app/fonts/PretendardVariable.subset.woff2")).toString("base64");
const photo = site.hero.photo ? readFileSync(join(root, "public", site.hero.photo)).toString("base64") : null;

const base = `
  @font-face { font-family: P; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 45 920; }
  * { margin: 0; box-sizing: border-box; }
  body { font-family: P, sans-serif; color: #1E2B4A; background: #FBF7EF; word-break: keep-all; }
`;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// 핵심 글자는 가운데 안전 영역(좌우 10%, 상하 15%) 안에만 둡니다.
const og = `<!doctype html><html><head><style>${base}
  .wrap { position: relative; width: 1200px; height: 630px; overflow: hidden; }
  .circle { position: absolute; right: -120px; top: -160px; width: 560px; height: 560px; border-radius: 50%; background: #DCEBF7; }
  .dot { position: absolute; left: -80px; bottom: -120px; width: 300px; height: 300px; border-radius: 50%; background: #F8EDC8; }
  .safe { position: absolute; left: 120px; right: 120px; top: 95px; bottom: 95px; display: flex; align-items: center; gap: 48px; }
  .text { flex: 1; }
  .company { font-size: 34px; font-weight: 600; color: #4B5563; }
  .name { font-size: 76px; font-weight: 800; margin-top: 10px; letter-spacing: -0.02em; }
  .slogan { font-size: 64px; font-weight: 800; margin-top: 18px; color: #C2410C; letter-spacing: -0.03em; line-height: 1.2; }
  .photo { width: 300px; height: 300px; border-radius: 50%; background: #DCEBF7 center/cover; display: flex; align-items: center; justify-content: center; font-size: 150px; font-weight: 800; color: rgba(30,43,74,.8); border: 10px solid #fff; }
</style></head><body><div class="wrap"><div class="circle"></div><div class="dot"></div>
  <div class="safe"><div class="text">
    <div class="company">${esc(site.brand.company)}</div>
    <div class="name">${esc(`${site.brand.name} ${site.brand.title}`)}</div>
    <div class="slogan">${esc(site.marquee.text)}</div>
  </div>
  <div class="photo" ${photo ? `style="background-image:url(data:image/jpeg;base64,${photo})"` : ""}>${photo ? "" : esc(site.hero.monogram)}</div>
  </div></div></body></html>`;

const icon = (size: number, radius: string) => `<!doctype html><html><head><style>${base}
  body { background: transparent; }
  .i { width: ${size}px; height: ${size}px; border-radius: ${radius}; background: #1E2B4A; color: #FBF7EF; display: flex; align-items: center; justify-content: center; font-size: ${Math.round(size * 0.58)}px; font-weight: 800; }
</style></head><body><div class="i">${esc(site.hero.monogram)}</div></body></html>`;

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH ?? undefined,
  });
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  async function shot(html: string, width: number, height: number, path: string, transparent = false) {
    await page.setViewportSize({ width, height });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: join(root, path),
      omitBackground: transparent,
      type: "png",
    });
    console.log(`✓ ${path}`);
  }

  await shot(og, 1200, 630, "public/og.png");
  await shot(icon(512, "50%"), 512, 512, "src/app/icon.png", true);
  await shot(icon(180, "0"), 180, 180, "src/app/apple-icon.png");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
