import Link from "next/link";
import { site } from "@/config/site";
import { externalLinkProps, toMailHref, toOpenChatHref, toTelHref } from "@/lib/contact";
import { hasValue } from "@/lib/content";

/** FR-17. 푸터 (값이 없는 줄은 자동으로 숨김) */
export function Footer({ withFloatingBar = true }: { withFloatingBar?: boolean }) {
  const { brand, contact, footer } = site;
  const kakaoHref = toOpenChatHref(contact.kakaoOpenChat);
  const link = "underline underline-offset-4 decoration-cream/40 hover:decoration-cream";

  const rows = [
    hasValue(footer.registrationNo) && { label: footer.registrationLabel, value: footer.registrationNo },
    hasValue(footer.reviewNo) && { label: footer.reviewLabel, value: footer.reviewNo },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  return (
    <footer
      className={`on-dark bg-navy text-[15px] leading-relaxed text-cream ${
        withFloatingBar ? "pb-[calc(112px+env(safe-area-inset-bottom))] lg:pb-16" : "pb-16"
      } pt-12`}
    >
      <div className="container-page flex flex-col gap-6">
        <p className="text-[18px] font-bold">
          {brand.company} · {brand.name} {brand.title}
        </p>

        <div>
          <h2 className="sr-only">{footer.contactHeading}</h2>
          <dl className="grid gap-y-1 sm:grid-cols-[auto_1fr] sm:gap-x-4">
            <dt className="text-cream/75">{footer.phoneLabel}</dt>
            <dd className="mb-2 sm:mb-0">
              <a href={toTelHref(contact.phone)} className={`${link} inline-flex min-h-12 items-center sm:min-h-0`}>
                {contact.phone}
              </a>
            </dd>
            <dt className="text-cream/75">{footer.emailLabel}</dt>
            <dd className="mb-2 sm:mb-0">
              <a href={toMailHref(contact.email)} className={`${link} inline-flex min-h-12 items-center sm:min-h-0`}>
                {contact.email}
              </a>
            </dd>
            {kakaoHref && (
              <>
                <dt className="text-cream/75">{footer.kakaoLabel}</dt>
                <dd>
                  <a
                    href={kakaoHref}
                    {...externalLinkProps}
                    className={`${link} inline-flex min-h-12 items-center break-all sm:min-h-0`}
                  >
                    {kakaoHref}
                    <span className="sr-only">{site.contactButtons.newWindow}</span>
                  </a>
                </dd>
              </>
            )}
          </dl>
        </div>

        {rows.length > 0 && (
          <dl className="grid gap-y-1 sm:grid-cols-[auto_1fr] sm:gap-x-4">
            {rows.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-cream/75">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {hasValue(footer.legalNotice) && <p className="text-cream/90">{footer.legalNotice}</p>}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-cream/20 pt-6">
          <Link href="/privacy" className={`${link} inline-flex min-h-12 items-center font-bold`}>
            {footer.privacyLink}
          </Link>
          <p className="text-cream/75">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
