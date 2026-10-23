// 신청 메일 전송 추상화 (FR-14). 네이버 메일 SMTP로 팀장님 메일함에 보냅니다 (D-01).
// 개인정보(이름·연락처·메모)는 절대 로그에 남기지 않습니다.
import "server-only";
import nodemailer from "nodemailer";
import { site } from "@/config/site";
import type { Inquiry } from "@/lib/schema";

export class MailConfigError extends Error {
  constructor() {
    super("MAIL_NOT_CONFIGURED");
  }
}

export class MailSendError extends Error {
  constructor() {
    super("MAIL_SEND_FAILED");
  }
}

const kstFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** 한국 표준시 YYYY-MM-DD HH:mm */
export function formatKst(date: Date): string {
  return kstFormatter.format(date).replace("T", " ");
}

function labelOf<T extends string>(options: { id: T; label: string }[], id: T | undefined): string {
  return options.find((o) => o.id === id)?.label ?? site.mail.empty;
}

export function buildMail(inquiry: Inquiry, receivedAt: Date) {
  const m = site.mail;
  const f = site.form;
  const topic = labelOf(f.topics, inquiry.topic);
  const at = formatKst(receivedAt);

  const subject = `${m.subjectPrefix} ${inquiry.name} / ${topic}`;
  const text = [
    `${m.receivedAt}: ${at}`,
    `${m.name}: ${inquiry.name}`,
    `${m.phone}: ${inquiry.phone}`,
    `${m.topic}: ${topic}`,
    `${m.message}: ${inquiry.message ? inquiry.message : m.empty}`,
    `${m.method}: ${labelOf(f.methods, inquiry.method)}`,
    `${m.time}: ${labelOf(f.times, inquiry.time)}`,
    `${m.consent}: ${m.consentYes}`,
    `${m.consentAt}: ${at}`,
  ].join("\n");

  return { subject, text };
}

export async function sendInquiryMail(inquiry: Inquiry, receivedAt = new Date()): Promise<void> {
  const { subject, text } = buildMail(inquiry, receivedAt);

  // 로컬 확인용: MAIL_DRIVER=dryrun 이면 실제로 보내지 않습니다. (내용은 출력하지 않음)
  if (process.env.MAIL_DRIVER === "dryrun") {
    console.info("[inquiry] dry-run: mail skipped");
    return;
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new MailConfigError();
  const port = Number(process.env.SMTP_PORT ?? 465);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.naver.com",
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    logger: false,
  });

  try {
    await transporter.sendMail({
      // 네이버는 보내는 주소가 로그인한 계정과 같아야 합니다.
      from: { name: site.mail.fromName, address: process.env.INQUIRY_FROM ?? user },
      to: process.env.INQUIRY_TO ?? user,
      subject,
      text,
    });
  } catch {
    // 원래 오류 객체에는 요청 내용이 들어 있을 수 있어 버리고 새 오류만 던집니다.
    throw new MailSendError();
  }
}
