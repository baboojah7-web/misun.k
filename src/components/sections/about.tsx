import { site } from "@/config/site";
import { KakaoLink } from "@/components/common/contact-buttons";
import { ProfilePhoto } from "@/components/common/profile-photo";
import { SectionTitle } from "@/components/common/section-title";
import { credentialsConfirmed } from "@/lib/content";

/** FR-10. 팀장님 소개와 활동 지역 한 줄 안내 */
export function About() {
  const { about } = site;
  // 자격이 확정되지 않았으면(TODO:) 자격 문구를 숨김
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

            {stats.length > 0 && (
              <>
                <h3 className="sr-only">{about.statsLabel}</h3>
                <ul className="mt-5 space-y-1 text-[16px]">
                  {stats.map((stat) => (
                    <li key={stat.kind}>
                      <span className="font-bold">{stat.label}</span>
                      <span> · </span>
                      <span className="font-semibold">{stat.value}</span>
                      <span className="text-ink-muted"> · {stat.detail}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <KakaoLink className="btn-lg w-full sm:w-auto sm:px-10" label={about.kakaoCta} />
        </div>
      </div>
    </section>
  );
}
