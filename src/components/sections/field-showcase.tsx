"use client";

import { site } from "@/config/site";
import { SectionTitle } from "@/components/common/section-title";
import { useInquiry } from "@/components/providers/inquiry-provider";
import { cn } from "@/lib/utils";

const backgrounds = ["bg-field-1", "bg-field-2", "bg-field-3", "bg-field-4", "bg-field-5"];

/** FR-11. 전문 분야 5개 상자와 신청서 주제 연동 */
export function FieldShowcase() {
  const { title, cta, badgePrefix, items } = site.fields;
  const { selectTopic } = useInquiry();

  return (
    <section id="fields" aria-labelledby="fields-title" className="section bg-sky">
      <div className="container-page">
        <SectionTitle id="fields-title">{title}</SectionTitle>
        <ul className="grid gap-4 lg:grid-cols-6">
          {items.map((field, i) => (
            <li key={field.id} className={cn("flex lg:col-span-2", i === 3 && items.length === 5 && "lg:col-start-2")}>
              <article
                aria-labelledby={`field-${field.id}`}
                className={cn(
                  "relative flex min-h-[220px] w-full flex-col overflow-hidden rounded-[28px] p-7",
                  backgrounds[i % backgrounds.length],
                )}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-2 right-4 text-[88px] leading-none font-extrabold text-navy/[0.07] select-none"
                >
                  {field.no}
                </span>
                <span className="inline-flex w-fit rounded-full bg-white/70 px-3 py-1 text-[14px] font-bold">
                  {badgePrefix} {field.no}
                </span>
                <h3 id={`field-${field.id}`} className="mt-3 text-[24px] font-bold">
                  {field.title}
                </h3>
                <p className="mt-2 flex-1 text-[17px] text-navy/85">{field.body}</p>
                <button
                  type="button"
                  onClick={() => selectTopic(field.id)}
                  className="btn btn-outline mt-5 w-full sm:w-auto"
                >
                  {cta}
                </button>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
