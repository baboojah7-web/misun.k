import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import { SectionTitle } from "@/components/common/section-title";
import { externalLinkProps } from "@/lib/contact";

const MAX_COLUMNS = 3;

/** FR-16. 칼럼·소식 (최대 3개, 없으면 "준비 중" 카드) */
export function Columns() {
  const { title, emptyText, items } = site.columns;
  const shown = items.slice(0, MAX_COLUMNS);

  return (
    <section id="columns" aria-labelledby="columns-title" className="section bg-cream">
      <div className="container-page">
        <SectionTitle id="columns-title">{title}</SectionTitle>
        {shown.length === 0 ? (
          <p className="rounded-[28px] border-2 border-dashed border-navy/20 p-6 text-center text-[17px] text-ink-muted">
            {emptyText}
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-3">
            {shown.map((col) => {
              const body = (
                <>
                  <span className="text-[14px] text-ink-muted">{col.date}</span>
                  <span className="mt-1 text-[18px] leading-snug font-bold">{col.title}</span>
                  <span className="mt-2 flex-1 text-[16px] text-navy/85">{col.summary}</span>
                  {col.href && <ArrowUpRight aria-hidden className="mt-3 size-5 self-end" />}
                </>
              );
              const cls = "flex h-full flex-col rounded-[28px] bg-white p-6 shadow-soft";
              return (
                <li key={col.title} className="flex">
                  {col.href ? (
                    <a href={col.href} {...externalLinkProps} className={`${cls} w-full hover:bg-white/80`}>
                      {body}
                      <span className="sr-only">{site.contactButtons.newWindow}</span>
                    </a>
                  ) : (
                    <div aria-disabled="true" className={`${cls} w-full opacity-80`}>
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
