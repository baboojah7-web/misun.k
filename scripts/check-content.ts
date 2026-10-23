// NFR-MT-03. 내용 검사 스크립트
//   pnpm check:content            개발 모드 (TODO: 는 경고)
//   pnpm check:content --release  공개 모드 (TODO: 는 오류)
// Vercel Production 빌드(VERCEL_ENV=production)에서는 자동으로 공개 모드가 됩니다.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { site } from "../src/config/site";
import { BANNED_OK_MARKER, blockedTerms, warnTerms } from "./banned-terms";

const root = join(import.meta.dirname, "..");
const release = process.argv.includes("--release") || process.env.VERCEL_ENV === "production";

const errors: string[] = [];
const warnings: string[] = [];
const notes: string[] = [];

// ① TODO: 잔존 · 모든 문자열 수집
const strings: { path: string; value: string }[] = [];
function walk(value: unknown, path: string) {
  if (typeof value === "string") strings.push({ path, value });
  else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
  }
}
walk(site, "");

for (const { path, value } of strings) {
  if (value.includes("TODO:")) {
    (release ? errors : warnings).push(`[TODO] ${path}: ${value}`);
  }
}

// ② 필수 필드
const required: [string, string][] = [
  ["brand.company", site.brand.company],
  ["brand.name", site.brand.name],
  ["brand.title", site.brand.title],
  ["contact.phone", site.contact.phone],
  ["contact.email", site.contact.email],
  ["contact.kakaoOpenChat", site.contact.kakaoOpenChat],
  ["seo.title", site.seo.title],
  ["seo.description", site.seo.description],
  ["hero.headline", site.hero.headline],
  ["form.consentLabel", site.form.consentLabel],
];
for (const [path, value] of required) {
  if (!value || !value.trim()) errors.push(`[필수] ${path} 값이 비어 있습니다.`);
}
if (!/^01[016789]-\d{3,4}-\d{4}$/.test(site.contact.phone)) {
  errors.push(`[필수] contact.phone 형식이 올바르지 않습니다: ${site.contact.phone}`);
}
if (!site.contact.kakaoOpenChat.startsWith("https://open.kakao.com/")) {
  errors.push("[필수] contact.kakaoOpenChat 은 https://open.kakao.com/ 으로 시작해야 합니다.");
}
if (!site.url.startsWith("https://") && release) {
  errors.push(`[필수] 공개 빌드에는 NEXT_PUBLIC_SITE_URL(https 주소)이 필요합니다. 현재: ${site.url}`);
}

// ③ 금칙어 (site.ts 원문을 줄 단위로 검사 → banned-ok 주석 확인)
const siteSource = readFileSync(join(root, "src/config/site.ts"), "utf8").split("\n");
siteSource.forEach((line, i) => {
  const code = line.replace(/\s\/\/\s.*$/, ""); // 줄 끝 주석 제외 (URL 의 // 는 유지)
  if (code.trim().startsWith("//")) return;
  // 같은 줄 또는 위쪽 3줄 안의 banned-ok 주석을 승인으로 봅니다 (자동 정렬로 줄이 나뉘는 경우 대비)
  const approved = siteSource.slice(Math.max(0, i - 3), i + 1).some((l) => l.includes(BANNED_OK_MARKER));
  for (const term of blockedTerms) {
    if (!code.includes(term)) continue;
    const msg = `site.ts:${i + 1} "${term}" → ${code.trim()}`;
    if (approved) notes.push(`[승인된 예외] ${msg}`);
    else errors.push(`[차단어] ${msg}`);
  }
  for (const term of warnTerms) {
    if (code.includes(term)) warnings.push(`[경고어 확인] site.ts:${i + 1} "${term}" → ${code.trim()}`);
  }
});

// ④ 분야 id와 신청서 주제 id 일치
const topicIds = new Set(site.form.topics.map((t) => t.id));
for (const field of site.fields.items) {
  if (!topicIds.has(field.id)) errors.push(`[id] fields.items "${field.id}" 가 form.topics 에 없습니다.`);
}

// ⑤ 컴포넌트·페이지의 한글 문자열 (설정 파일 외에는 한글을 쓰지 않음, 주석 제외)
const HANGUL = /\p{Script=Hangul}/u;
function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : /\.(tsx?|jsx?)$/.test(name) ? [full] : [];
  });
}
const scanDirs = ["src/app", "src/components", "src/lib"].map((d) => join(root, d));
for (const file of scanDirs.flatMap(listFiles)) {
  const src = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")) // 블록 주석
    .split("\n");
  src.forEach((line, i) => {
    const code = line.replace(/(^|\s)\/\/.*$/, "");
    if (HANGUL.test(code)) errors.push(`[한글 리터럴] ${relative(root, file)}:${i + 1} → ${code.trim()}`);
  });
}

// ⑥ 숫자 카드와 자격 배열 길이 일치
const credentialStat = site.about.stats.find((s) => s.kind === "credentials");
if (credentialStat && credentialStat.value !== String(site.about.credentials.length)) {
  warnings.push(
    `[숫자 카드] 자격 숫자(${credentialStat.value})와 자격 목록 개수(${site.about.credentials.length})가 다릅니다.`,
  );
}

// ⑦ 후기·칼럼의 개인 식별 의심 정보
const PII = [
  { name: "전화번호", re: /01[016789][-\s.]?\d{3,4}[-\s.]?\d{4}/ },
  { name: "이메일", re: /[\w.+-]+@[\w-]+\.[\w.]+/ },
  { name: "주민등록번호", re: /\d{6}\s*-\s*[1-8]\d{6}/ },
];
const piiTargets = [
  ...site.reviews.items.flatMap((r, i) =>
    [r.summary, r.quote, r.label, r.meta].map((v) => ({ path: `reviews.items[${i}]`, v })),
  ),
  ...site.columns.items.flatMap((c, i) => [c.title, c.summary].map((v) => ({ path: `columns.items[${i}]`, v }))),
];
for (const { path, v } of piiTargets) {
  for (const { name, re } of PII) {
    if (re.test(v)) warnings.push(`[개인정보 의심] ${path} 에 ${name}로 보이는 값이 있습니다.`);
  }
}
for (const [i, c] of site.columns.items.entries()) {
  if (c.href && !c.href.startsWith("https://"))
    errors.push(`[칼럼] columns.items[${i}].href 는 https 주소여야 합니다.`);
}

// 결과 출력
const mode = release ? "공개(release)" : "개발(dev)";
console.log(`\n내용 검사 · ${mode} 모드\n`);
for (const n of notes) console.log(`  ✓ ${n}`);
for (const w of warnings) console.log(`  ⚠ ${w}`);
for (const e of errors) console.log(`  ✖ ${e}`);
console.log(`\n오류 ${errors.length}건 · 경고 ${warnings.length}건 · 승인된 예외 ${notes.length}건\n`);
process.exit(errors.length > 0 ? 1 : 0);
