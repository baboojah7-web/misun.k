"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import type { SectionId } from "@/config/types";
import { ContactButtons } from "@/components/common/contact-buttons";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toTelHref } from "@/lib/contact";
import { navItems } from "@/lib/content";
import { setOverlayOpen } from "@/lib/overlay";
import { scrollToSection } from "@/lib/scroll";

/** FR-02. 상단 바와 메뉴 */
export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setOverlayOpen(true);
    return () => setOverlayOpen(false);
  }, [open]);

  const go = (id: SectionId) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    // 시트가 닫히며 스크롤 잠금이 풀린 뒤 이동
    window.setTimeout(() => scrollToSection(id), 220);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <a href="#top" className="truncate text-[16px] font-bold tracking-[-0.02em] text-navy">
          {site.brand.company}
        </a>

        {/* PC: 가로 메뉴 + 전화번호 */}
        <nav aria-label={site.nav.label} className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="inline-flex min-h-12 items-center rounded-full px-4 text-[16px] font-semibold text-navy hover:bg-navy/5"
            >
              {item.label}
            </a>
          ))}
          <a
            href={toTelHref(site.contact.phone)}
            className="ml-3 inline-flex min-h-12 items-center rounded-full px-4 text-[17px] font-bold text-accent tabular-nums"
          >
            {site.contact.phone}
          </a>
        </nav>

        {/* 모바일·태블릿: 메뉴 시트 */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label={site.a11y.openMenu}
            className="-mr-3 inline-flex size-12 items-center justify-center rounded-full text-navy lg:hidden"
          >
            <Menu aria-hidden className="size-6" />
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-[80%] max-w-sm gap-0 bg-cream p-0 data-[side=right]:w-[80%] data-[side=right]:sm:max-w-sm"
          >
            <div className="flex h-14 items-center justify-between border-b border-line pl-6 pr-2">
              <SheetTitle className="text-[16px] font-bold text-navy">{site.brand.company}</SheetTitle>
              <SheetCloseButton label={site.a11y.closeMenu} onClose={() => setOpen(false)} />
            </div>
            <nav aria-label={site.nav.label} className="flex-1 overflow-y-auto px-3 py-4">
              <ul>
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={go(item.id)}
                      className="flex min-h-14 items-center rounded-2xl px-3 text-[20px] font-bold text-navy hover:bg-navy/5"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-line p-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
              <ContactButtons buttonClassName="btn-lg" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function SheetCloseButton({ label, onClose }: { label: string; onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      className="inline-flex size-12 items-center justify-center rounded-full text-navy hover:bg-navy/5"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
      </svg>
    </button>
  );
}
