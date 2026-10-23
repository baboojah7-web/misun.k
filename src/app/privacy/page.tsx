import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site } from "@/config/site";
import { Footer } from "@/components/sections/footer";
import { display } from "@/lib/content";

export const metadata: Metadata = {
  title: `${site.privacy.title} | ${site.brand.name} ${site.brand.title}`,
  alternates: { canonical: "/privacy" },
};

/** FR-18. 개인정보 처리방침 (하단 고정 바 없음) */
export default function PrivacyPage() {
  const { privacy } = site;
  return (
    <>
      <main id="main" className="bg-cream pt-6 pb-16">
        <div className="mx-auto max-w-[720px] px-5 md:px-8">
          <Link href="/" className="-ml-2 inline-flex min-h-12 items-center gap-1.5 rounded-full px-2 font-semibold">
            <ArrowLeft aria-hidden className="size-5" />
            {privacy.backHome}
          </Link>
          <h1 className="h2 mt-4">{privacy.title}</h1>
          <p className="mt-1 text-[15px] text-ink-muted">{display(privacy.updatedAt)}</p>
          <p className="mt-6">{privacy.intro}</p>
          {privacy.sections.map((section) => (
            <section key={section.heading} className="mt-8">
              <h2 className="text-[20px] font-bold">{section.heading}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="mt-2">
                  {display(paragraph)}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer withFloatingBar={false} />
    </>
  );
}
