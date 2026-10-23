// 상담 신청서 검증 규칙. 화면(FR-13)과 서버(FR-14)가 같은 스키마를 씁니다.
// 오류는 코드로만 표시하고, 실제 문구는 site.ts의 form.validation에서 가져옵니다.
import { z } from "zod/mini";

export const TOPIC_IDS = ["protect", "retirement", "care", "business", "tax", "other"] as const;
export const METHOD_IDS = ["phone", "kakao", "sms"] as const;
export const TIME_IDS = ["any", "morning", "afternoon", "evening"] as const;

export const MESSAGE_MAX = 200;

export const ErrorCode = {
  name: "name",
  nameFormat: "nameFormat",
  phone: "phone",
  topic: "topic",
  method: "method",
  consent: "consent",
  messageTooLong: "messageTooLong",
  sensitive: "sensitive",
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const NAME_PATTERN = /^[A-Za-z\p{Script=Hangul} ]+$/u;
const PHONE_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;
/** 주민등록번호로 보이는 패턴 (숫자 6자리-숫자 7자리) */
const RRN_PATTERN = /\d{6}\s*-?\s*[1-8]\d{6}/;

export function sanitize(value: string): string {
  return value.replace(CONTROL_CHARS, "").trim();
}

/** 줄바꿈을 뺀 글자 수 */
export function countMessageChars(value: string): number {
  return value.replace(/\r?\n/g, "").length;
}

/** 숫자만 뽑아 010-1234-5678 형태로 바꿉니다. */
export function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

/** 문자열 → 제어 문자 제거·trim → 이어지는 검사 */
const text = (code: ErrorCode, next: z.ZodMiniType<string, string>) =>
  z.pipe(z.pipe(z.string({ error: code }), z.transform(sanitize)), next);

export const inquirySchema = z.object({
  name: text(
    ErrorCode.name,
    z.string().check(
      z.minLength(1, { error: ErrorCode.name, abort: true }),
      z.refine(
        (v) => {
          const len = v.replace(/\s/g, "").length;
          return len >= 2 && len <= 20 && NAME_PATTERN.test(v);
        },
        { error: ErrorCode.nameFormat },
      ),
    ),
  ),
  phone: text(ErrorCode.phone, z.string().check(z.regex(PHONE_PATTERN, { error: ErrorCode.phone }))),
  topic: z.enum(TOPIC_IDS, { error: ErrorCode.topic }),
  message: z.optional(
    text(
      ErrorCode.messageTooLong,
      z.string().check(
        z.refine((v) => countMessageChars(v) <= MESSAGE_MAX, { error: ErrorCode.messageTooLong }),
        z.refine((v) => !RRN_PATTERN.test(v), { error: ErrorCode.sensitive }),
      ),
    ),
  ),
  method: z.enum(METHOD_IDS, { error: ErrorCode.method }),
  time: z._default(z.enum(TIME_IDS), "any"),
  consent: z.literal(true, { error: ErrorCode.consent }),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;

/** 서버로 함께 보내는 스팸 방어 값 */
export const antiSpamSchema = z.object({
  website: z._default(z.string().check(z.maxLength(200)), ""),
  elapsedMs: z._default(z.int().check(z.gte(0)), 0),
});

export type InquiryRequest = Inquiry & z.infer<typeof antiSpamSchema>;
