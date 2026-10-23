import { Quote } from "lucide-react";
import { site } from "@/config/site";
import { SectionTitle } from "@/components/common/section-title";
import { ReviewDots } from "@/components/sections/review-dots";
import { hasReviews } from "@/lib/content";
import { cn } from "@/lib/utils";

/** FR-08. 고객 후기 (후기가 없으면 구역 전체를 숨김) */
export function Reviews() {
  if (!hasReviews) return null;
  const { title, items } = site.reviews;
  const single = items.length === 1;
  const scrollOnPc = items.length >= 4;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section bg-sky">
      <div className="container-page">
        <SectionTitle id="reviews-title">{title}</SectionTitle>
      </div>
      <div className={cn("container-page", !single && "max-lg:px-0", scrollOnPc && "lg:px-0")}>
        <ul
          id="reviews-track"
          className={cn(
            single ? "grid" : "no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:px-8",
            !single && !scrollOnPc && "lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0",
          )}
        >
          {items.map((review, i) => (
            <li
              key={`${review.label}-${i}`}
              aria-label={`${i + 1}${site.a11y.reviewOf}`}
              className={cn(
                "flex",
                !single && "w-[85%] shrink-0 snap-center md:w-[60%] lg:w-auto",
                scrollOnPc && "lg:w-[32%]",
              )}
            >
              <figure className="flex w-full flex-col rounded-[28px] bg-white p-6 shadow-soft">
                <Quote aria-hidden className="size-8 text-accent/70" />
                <p className="mt-3 text-[18px] leading-snug font-bold">{review.summary}</p>
                <blockquote className="mt-2 flex-1 text-[17px] text-navy/85">{review.quote}</blockquote>
                <figcaption className="mt-4 text-[15px] text-ink-muted">
                  {review.label} · {review.meta}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        {!single && <ReviewDots count={items.length} hideOnPc={!scrollOnPc} />}
      </div>
    </section>
  );
}
