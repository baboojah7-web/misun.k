import { site } from "@/config/site";
import { KakaoLink } from "@/components/common/contact-buttons";
import { ProfilePhoto } from "@/components/common/profile-photo";
import { SectionTitle } from "@/components/common/section-title";
import { credentialsConfirmed } from "@/lib/content";
import { cn } from "@/lib/utils";

/** FR-10. 팀장님 소개와 숫자 카드 */
export function About() {
  const { about } = site;
  // 자격이 확정되지 않았으면(TODO:) 자격 카드와 자격 문구를 숨김
  const stats = about.stats.filter((s) => s.kind !== "credentials" || credentialsConfirmed);

  return (
    <section id="about" aria-labelledby="about-title" className="section bg-white">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-14">
          <ProfilePhoto sizes="(min-width: 1024px) 280px, 160px" className="w-40 lg:w-full" />
          <div>
            <SectionTitle id="about-title" className="mb-4">
              {about.title}
            </SectionTitle>
            <p className="text-[17px] leading-[1.7]">{about.intro}</p>

            {credentialsConfirmed && (
              <p className="mt-4 text-[16px]">
                <span className="font-bold">{about.credentialsLabel}</span>
                <span className="text-ink-muted"> · {about.credentials.join(" · ")}</span>
              </p>
            )}

            <div className="mt-4">
              <p className="sr-only">{about.tagsLabel}</p>
              <ul className="flex flex-wrap gap-2">
                {about.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-cream px-3.5 py-1.5 text-[15px] font-semibold">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <h3 className="sr-only">{about.statsLabel}</h3>
        <ul className={cn("mt-10 grid gap-3", stats.length >= 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2")}>
          {stats.map((stat, i) => (
            <li
              key={stat.kind}
              className={cn(
                "flex flex-col rounded-[28px] bg-cream p-5 lg:p-7",
                stats.length >= 3 && i === stats.length - 1 && "col-span-2 md:col-span-1",
              )}
            >
              <span className="stat-number">{stat.value}</span>
              <span className="mt-1 text-[17px] font-bold">{stat.label}</span>
              <span className="mt-1 text-[14px] leading-snug text-ink-muted">{stat.detail}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <KakaoLink className="btn-lg w-full sm:w-auto sm:px-10" label={about.kakaoCta} />
        </div>
      </div>
    </section>
  );
}
