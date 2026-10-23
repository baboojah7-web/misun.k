import Link from "next/link";
import { site } from "@/config/site";
import { ContactButtons } from "@/components/common/contact-buttons";

/** 오류·없는 페이지 공통 화면 (NFR-MT-08) */
export function StatusPage({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <main id="main" className="flex min-h-dvh items-center bg-cream py-16">
      <div className="mx-auto w-full max-w-[520px] px-5 text-center">
        <p className="text-[15px] text-ink-muted">
          {site.brand.company} · {site.brand.name} {site.brand.title}
        </p>
        <h1 className="h2 mt-3">{title}</h1>
        <p className="mt-3 text-[17px] text-ink-muted">{body}</p>
        <div className="mt-8 flex flex-col gap-3">
          {action}
          <Link href="/" className="btn btn-outline btn-lg">
            {site.errorPage.home}
          </Link>
          <ContactButtons buttonClassName="btn-lg" />
        </div>
      </div>
    </main>
  );
}
