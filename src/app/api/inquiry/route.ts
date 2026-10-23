// FR-14. 신청서 전송 API. 저장하지 않고 팀장님 이메일로만 보냅니다.
// 이름·연락처·메모는 어떤 로그에도 남기지 않습니다.
import { createHash } from "node:crypto";
import { antiSpamSchema, inquirySchema } from "@/lib/schema";
import { MailConfigError, sendInquiryMail } from "@/lib/mail";

const MAX_BODY_BYTES = 8 * 1024;
const MIN_ELAPSED_MS = 3000;
const RATE_LIMIT = 5; // 같은 IP에서 1분에 5회
const RATE_WINDOW_MS = 60_000;
const DUPLICATE_WINDOW_MS = 60_000;

// 서버리스에서는 인스턴스끼리 공유되지 않는 베스트에포트 방식입니다 (README 참고).
const hits = new Map<string, number[]>();
const recent = new Map<string, number>();

const headers = { "Cache-Control": "no-store" };

function json(status: number, body: unknown) {
  return Response.json(body, { status, headers });
}

function allowedOrigins(): Set<string> {
  const list = [
    process.env.NEXT_PUBLIC_SITE_URL,
    ...(process.env.ALLOWED_ORIGINS ?? "").split(","),
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.NODE_ENV !== "production" && "http://localhost:3000",
  ];
  const origins = new Set<string>();
  for (const value of list) {
    if (!value) continue;
    try {
      origins.add(new URL(value.trim()).origin);
    } catch {
      // 잘못된 값은 무시
    }
  }
  return origins;
}

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function prune(now: number) {
  for (const [key, times] of hits) {
    const kept = times.filter((t) => now - t < RATE_WINDOW_MS);
    if (kept.length) hits.set(key, kept);
    else hits.delete(key);
  }
  for (const [key, t] of recent) if (now - t >= DUPLICATE_WINDOW_MS) recent.delete(key);
}

function rateLimited(ip: string, now: number): boolean {
  prune(now);
  const times = hits.get(ip) ?? [];
  times.push(now);
  hits.set(ip, times);
  return times.length > RATE_LIMIT;
}

export async function POST(req: Request) {
  // 1. 콘텐츠 타입·본문 크기
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json(415, { ok: false, code: "UNSUPPORTED_MEDIA_TYPE" });
  }
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json(413, { ok: false, code: "PAYLOAD_TOO_LARGE" });
  }

  // 2. 출처 확인
  const origin = req.headers.get("origin");
  if (!origin || !allowedOrigins().has(origin)) {
    return json(403, { ok: false, code: "FORBIDDEN" });
  }

  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return json(413, { ok: false, code: "PAYLOAD_TOO_LARGE" });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, errors: {} });
  }

  // 3. 서버 검증 (화면과 같은 스키마)
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      errors[field] ??= issue.message;
    }
    return json(400, { ok: false, errors });
  }
  const spam = antiSpamSchema.safeParse(body);

  // 4. 스팸 판정: 성공처럼 응답하고 메일은 보내지 않음
  if (!spam.success || spam.data.website !== "" || spam.data.elapsedMs < MIN_ELAPSED_MS) {
    return json(200, { ok: true });
  }

  // 5. 요청 제한 · 중복 방지
  const now = Date.now();
  if (rateLimited(clientIp(req), now)) {
    return json(429, { ok: false, code: "TOO_MANY_REQUESTS" });
  }
  const fingerprint = createHash("sha256")
    .update(`${parsed.data.phone}|${parsed.data.topic}|${parsed.data.message ?? ""}`)
    .digest("hex");
  if (recent.has(fingerprint)) {
    // 같은 신청이 1분 안에 반복되면 메일은 다시 보내지 않고 접수된 것으로 응답
    return json(200, { ok: true });
  }

  // 6. 메일 발송
  try {
    await sendInquiryMail(parsed.data, new Date(now));
    recent.set(fingerprint, now);
  } catch (error) {
    // 오류 종류만 남김 (입력값 없음)
    console.error(`[inquiry] ${error instanceof MailConfigError ? "MAIL_NOT_CONFIGURED" : "MAIL_SEND_FAILED"}`);
    return json(500, { ok: false, code: "SEND_FAILED" });
  }

  // 7. 응답
  return json(200, { ok: true });
}
