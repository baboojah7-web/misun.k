"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { ApplyLink, KakaoLink, PhoneLink } from "@/components/common/contact-buttons";
import { externalLinkProps, toOpenChatHref } from "@/lib/contact";
import { onOverlayChange } from "@/lib/overlay";
import { cn } from "@/lib/utils";

const TEXT_INPUT_TYPES = new Set(["text", "tel", "email", "search", "number", "url", "password"]);

function isTextEntry(el: EventTarget | null): boolean {
  if (el instanceof HTMLTextAreaElement) return true;
  if (el instanceof HTMLInputElement) return TEXT_INPUT_TYPES.has(el.type);
  return el instanceof HTMLElement && el.isContentEditable;
}

/** FR-05. 하단 고정 연락 바 (PC에서는 오른쪽 아래 둥근 카톡 버튼) */
export function FloatingCta() {
  const [applyVisible, setApplyVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const [overlay, setOverlay] = useState(false);

  // 신청서 구역이 보이는 동안 [상담 신청]만 숨김
  useEffect(() => {
    const target = document.getElementById("apply");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setApplyVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -20% 0px",
    });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  // 입력칸에 포커스가 있는 동안(키보드가 올라온 동안) 바 전체 숨김. 짧은 지연으로 깜빡임 방지
  useEffect(() => {
    let timer: number | undefined;
    const onIn = (e: FocusEvent) => {
      window.clearTimeout(timer);
      if (isTextEntry(e.target)) setTyping(true);
    };
    const onOut = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setTyping(isTextEntry(document.activeElement)), 150);
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  useEffect(() => onOverlayChange(setOverlay), []);

  const hidden = typing || overlay;
  const kakaoHref = toOpenChatHref(site.contact.kakaoOpenChat);
  const btn =
    "btn min-h-[52px] gap-1.5 px-2 text-[16px] max-[359px]:flex-col max-[359px]:gap-0.5 max-[359px]:text-[14px]";

  return (
    <>
      <div
        aria-hidden={hidden}
        inert={hidden}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-3 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(30,43,74,0.08)] transition-transform duration-200 ease-out lg:hidden",
          hidden && "translate-y-full",
        )}
      >
        <div className="mx-auto flex max-w-[640px] gap-2">
          <KakaoLink className={cn(btn, "flex-1")} />
          <PhoneLink className={cn(btn, "flex-1")} label={site.contactButtons.phoneShort} />
          {!applyVisible && <ApplyLink className={cn(btn, "flex-1")} />}
        </div>
      </div>

      {kakaoHref && (
        <a
          href={kakaoHref}
          {...externalLinkProps}
          aria-label={`${site.contactButtons.kakao} ${site.contactButtons.newWindow}`}
          className="fixed right-6 bottom-6 z-50 hidden size-16 items-center justify-center rounded-full bg-kakao text-kakao-ink shadow-soft hover:bg-[#f5d800] lg:inline-flex"
        >
          <MessageCircle aria-hidden className="size-7" />
        </a>
      )}
    </>
  );
}
