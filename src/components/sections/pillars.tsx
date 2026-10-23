import { ListChecks, Search, Sparkles } from "lucide-react";
import { site } from "@/config/site";
import { Reveal } from "@/components/common/reveal";
import { SectionTitle } from "@/components/common/section-title";

const icons = [Search, ListChecks, Sparkles];
const backgrounds = ["bg-field-1", "bg-field-2", "bg-field-3"];

/** FR-07. 알고·준비하고·달라지고 3카드 */
export function Pillars() {
  const { title, items } = site.pillars;
  return (
    <section aria-labelledby="pillars-title" className="section bg-white">
      <div className="container-page">
        <SectionTitle id="pillars-title">{title}</SectionTitle>
        <ol className="grid gap-4 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={item.title} className="flex">
                <Reveal index={i} className="flex w-full">
                  <div
                    className={`flex w-full flex-col gap-2 rounded-[28px] p-6 ${backgrounds[i % backgrounds.length]}`}
                  >
                    <Icon aria-hidden className="size-7 text-navy/70" />
                    <h3 className="text-[24px] font-bold">{item.title}</h3>
                    <p className="text-[17px] text-navy/85">{item.body}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
