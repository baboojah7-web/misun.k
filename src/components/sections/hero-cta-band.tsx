import { ArrowRight } from "lucide-react";
import { site } from "@/config/site";
import { ContactButtons } from "@/components/common/contact-buttons";

/** FR-04. 첫 화면 신청 띠 */
export function HeroCtaBand() {
  return (
    <div className="bg-cream pb-8 lg:pb-16">
      <a
        href="#apply"
        className="flex h-16 w-full items-center justify-center gap-2 bg-accent text-[19px] font-bold text-white transition-colors hover:bg-accent-hover lg:hidden"
      >
        {site.hero.primaryCta}
        <ArrowRight aria-hidden className="size-5" />
      </a>
      <div className="container-page mt-4 lg:mt-0 lg:max-w-[560px]">
        <ContactButtons phoneVariant="outline" />
        <p className="mt-3 text-center text-[14px] text-ink-muted">{site.hero.ctaHint}</p>
      </div>
    </div>
  );
}
