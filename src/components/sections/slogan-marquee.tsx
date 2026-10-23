import { site } from "@/config/site";

/** FR-06. 슬로건 흐르는 띠 (CSS 애니메이션만) */
export function SloganMarquee() {
  const { enabled, text, repeat } = site.marquee;
  if (!enabled) return null;

  const group = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex min-w-[100vw] shrink-0 items-center justify-around">
      {Array.from({ length: Math.max(repeat, 2) }, (_, i) => (
        <span key={i} className="flex items-center whitespace-nowrap" aria-hidden={i > 0 || undefined}>
          <span className="px-6">{text}</span>
          <span aria-hidden className="text-cream/50">
            ·
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee overflow-hidden bg-navy text-[20px] font-bold text-cream">
      <div className="marquee-track flex h-14 w-max items-center">
        {group(false)}
        {group(true)}
      </div>
      <p className="marquee-static h-14 items-center justify-center px-5 text-center">{text}</p>
    </div>
  );
}
