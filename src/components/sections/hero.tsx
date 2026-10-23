import { CircleCheck } from "lucide-react";
import { site } from "@/config/site";
import { ProfilePhoto } from "@/components/common/profile-photo";

const order = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** FR-03. 첫 화면 */
export function Hero() {
  const { hero, brand } = site;
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-x-clip bg-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-28 size-[340px] rounded-full bg-sky/80 lg:-top-40 lg:-right-20 lg:size-[560px]"
      />
      <div className="container-page relative grid gap-5 pt-6 pb-7 lg:grid-cols-[1fr_minmax(0,440px)] lg:items-center lg:gap-16 lg:py-24">
        <div className="relative lg:order-2 lg:w-full lg:max-w-[440px] lg:justify-self-end">
          <div aria-hidden className="absolute -bottom-3 -left-3 size-24 rounded-full bg-field-4 lg:size-40" />
          <ProfilePhoto
            priority
            sizes="(min-width: 1024px) 440px, 200px"
            className="relative h-[clamp(160px,26dvh,240px)] w-auto shadow-soft lg:h-auto lg:w-full"
          />
        </div>

        <div className="lg:order-1">
          <p className="rise-in text-[15px] font-medium text-ink-muted" style={order(0)}>
            {brand.company}
          </p>
          <p className="rise-in text-[22px] leading-snug font-bold" style={order(1)}>
            {brand.name} {brand.title}
          </p>
          <h1 id="hero-title" className="rise-in h1 mt-3" style={order(2)}>
            {hero.headline}
          </h1>
          <p className="rise-in mt-3 text-[17px] text-ink-muted lg:text-[19px]" style={order(3)}>
            {hero.subcopy}
          </p>
          <ul className="rise-in mt-4 flex flex-wrap gap-2" style={order(4)}>
            {hero.promises.map((promise) => (
              <li
                key={promise}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[15px] font-semibold shadow-soft"
              >
                <CircleCheck aria-hidden className="size-[18px] shrink-0 text-accent" />
                {promise}
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden max-w-[480px] lg:block">
            <a href="#apply" className="btn btn-accent btn-lg w-full text-[18px]">
              {hero.primaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
