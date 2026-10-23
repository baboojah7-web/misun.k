// FR-19. 전화·이메일·카카오톡 링크를 한 곳에서 만듭니다.

/** "010-9930-1828" → "tel:+821099301828" */
export function toTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const national = digits.startsWith("0") ? digits.slice(1) : digits;
  return `tel:+82${national}`;
}

export function toMailHref(email: string): string {
  return `mailto:${email}`;
}

const KAKAO_OPEN_CHAT_PREFIX = "https://open.kakao.com/";

export function isValidOpenChatUrl(url: string): boolean {
  return url.startsWith(KAKAO_OPEN_CHAT_PREFIX);
}

/** 잘못된 주소가 들어오면 링크를 만들지 않습니다(빈 문자열). */
export function toOpenChatHref(url: string): string {
  return isValidOpenChatUrl(url) ? url : "";
}

export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
