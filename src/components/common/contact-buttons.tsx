import { ClipboardPen, Mail, MessageCircle, Phone } from "lucide-react";
import { site } from "@/config/site";
import { externalLinkProps, toMailHref, toOpenChatHref, toTelHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

// FR-19. 모든 연락 버튼은 이 파일의 부품을 재사용합니다.

type LinkProps = { className?: string; label?: string; iconClassName?: string };

const labels = site.contactButtons;
const kakaoHref = toOpenChatHref(site.contact.kakaoOpenChat);

export function KakaoLink({ className, label = labels.kakao, iconClassName }: LinkProps) {
  if (!kakaoHref) return null;
  return (
    <a href={kakaoHref} {...externalLinkProps} className={cn("btn btn-kakao", className)}>
      <MessageCircle aria-hidden className={iconClassName} />
      <span>{label}</span>
      <span className="sr-only">{labels.newWindow}</span>
    </a>
  );
}

export function PhoneLink({ className, label = labels.phone, iconClassName }: LinkProps) {
  return (
    <a href={toTelHref(site.contact.phone)} className={cn("btn btn-navy", className)}>
      <Phone aria-hidden className={iconClassName} />
      <span>{label}</span>
    </a>
  );
}

export function ApplyLink({ className, label = labels.apply, iconClassName }: LinkProps) {
  return (
    <a href="#apply" className={cn("btn btn-accent", className)}>
      <ClipboardPen aria-hidden className={iconClassName} />
      <span>{label}</span>
    </a>
  );
}

export function MailLink({ className, label = site.contact.email }: LinkProps) {
  return (
    <a href={toMailHref(site.contact.email)} className={className}>
      <Mail aria-hidden className="inline size-5 align-[-3px]" /> {label}
    </a>
  );
}

/** [카톡 문의] [전화하기] 두 버튼 묶음 */
export function ContactButtons({
  className,
  buttonClassName,
  phoneVariant = "navy",
}: {
  className?: string;
  buttonClassName?: string;
  phoneVariant?: "navy" | "outline";
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <KakaoLink className={buttonClassName} />
      <PhoneLink
        className={cn(buttonClassName, phoneVariant === "outline" && "btn-outline bg-transparent text-navy")}
      />
    </div>
  );
}
