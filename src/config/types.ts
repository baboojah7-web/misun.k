// 홈페이지 설정 파일(site.ts)의 형태를 정의합니다.
// 필수 항목이 빠지면 `pnpm typecheck`가 실패합니다.

export type FieldId = "protect" | "retirement" | "care" | "business" | "tax";
export type TopicId = FieldId | "other";
export type MethodId = "phone" | "kakao" | "sms";
export type TimeId = "any" | "morning" | "afternoon" | "evening";

export type SectionId = "top" | "reviews" | "about" | "fields" | "faq" | "apply" | "columns";

export type Option<T extends string> = { id: T; label: string };

export type Review = {
  /** 한 줄 요약 (굵게 표시) */
  summary: string;
  /** 후기 본문 */
  quote: string;
  /** 가명 또는 이니셜. 예) "K님" */
  label: string;
  /** 연령대와 상황. 예) "40대, 맞벌이 가정" */
  meta: string;
};

export type Column = {
  title: string;
  summary: string;
  /** 표시용 날짜. 예) "2026.10.01" */
  date: string;
  /** 외부 글 주소(https). 비우면 비활성 카드 */
  href?: string;
};

export type ChatMessage = {
  from: "customer" | "agent";
  text: string;
  /** 번호 목록으로 보여줄 단계 (FR-09의 6번 말풍선) */
  steps?: string[];
};

export type Stat = {
  /** "credentials"이면 자격 미확정(TODO:) 시 숨김 + 자격 수와 일치 검사 */
  kind: "credentials" | "fields" | "region";
  value: string;
  label: string;
  detail: string;
};

export type PrivacySection = {
  heading: string;
  body: string[];
};

export type SiteConfig = {
  url: string;
  indexable: boolean;
  /** 값이 "TODO:"로 시작해 아직 확정되지 않은 항목에 대신 보여줄 문구 (개발 중에만 보임) */
  pendingText: string;

  brand: { company: string; name: string; title: string };
  contact: { phone: string; email: string; kakaoOpenChat: string };

  seo: {
    title: string;
    description: string;
    ogImage: string;
    ogImageAlt: string;
    themeColor: string;
  };

  nav: {
    label: string;
    items: { id: SectionId; label: string }[];
  };

  contactButtons: {
    kakao: string;
    phone: string;
    phoneShort: string;
    apply: string;
    email: string;
    newWindow: string;
  };

  hero: {
    eyebrow: string;
    headline: string;
    subcopy: string;
    promises: string[];
    primaryCta: string;
    ctaHint: string;
    photo: string | null;
    photoAlt: string;
    monogram: string;
  };

  marquee: { enabled: boolean; text: string; repeat: number };

  pillars: {
    title: string;
    items: { title: string; body: string }[];
  };

  reviews: {
    title: string;
    items: Review[];
    dotsLabel: string;
  };

  chat: {
    title: string;
    messages: ChatMessage[];
    quickActions: { apply: string; kakao: string };
  };

  about: {
    title: string;
    intro: string;
    credentialsLabel: string;
    credentials: string[];
    tagsLabel: string;
    tags: string[];
    statsLabel: string;
    stats: Stat[];
    kakaoCta: string;
  };

  fields: {
    title: string;
    cta: string;
    badgePrefix: string;
    items: { id: FieldId; no: string; title: string; body: string }[];
  };

  faq: {
    title: string;
    items: { q: string; a: string }[];
  };

  form: {
    title: string;
    titleSub: string;
    description: string;
    requiredMark: string;
    optionalMark: string;
    labels: {
      name: string;
      phone: string;
      topic: string;
      message: string;
      method: string;
      time: string;
    };
    placeholders: { name: string; phone: string; message: string };
    messageCounter: string;
    topics: Option<TopicId>[];
    methods: Option<MethodId>[];
    times: Option<TimeId>[];
    sensitiveNotice: string;
    consentLabel: string;
    consentDetail: string;
    consentDialog: {
      title: string;
      items: { term: string; desc: string }[];
      privacyLink: string;
      close: string;
    };
    submit: string;
    submitting: string;
    slowNotice: string;
    successTitle: string;
    successBody: string;
    successKakaoHint: string;
    successKakaoCta: string;
    errorTitle: string;
    errorBody: string;
    offlineBody: string;
    retry: string;
    toHome: string;
    validation: {
      name: string;
      nameFormat: string;
      phone: string;
      topic: string;
      method: string;
      consent: string;
      messageTooLong: string;
      sensitive: string;
    };
  };

  columns: {
    title: string;
    emptyText: string;
    items: Column[];
  };

  footer: {
    contactHeading: string;
    phoneLabel: string;
    emailLabel: string;
    kakaoLabel: string;
    registrationLabel: string;
    registrationNo: string;
    reviewLabel: string;
    reviewNo: string;
    legalNotice: string;
    privacyLink: string;
    copyright: string;
  };

  privacy: {
    title: string;
    updatedAt: string;
    intro: string;
    sections: PrivacySection[];
    backHome: string;
  };

  /** 신청 메일 본문의 항목 이름 (FR-14) */
  mail: {
    fromName: string;
    subjectPrefix: string;
    receivedAt: string;
    name: string;
    phone: string;
    topic: string;
    message: string;
    method: string;
    time: string;
    consent: string;
    consentYes: string;
    consentAt: string;
    empty: string;
  };

  errorPage: {
    notFoundTitle: string;
    notFoundBody: string;
    errorTitle: string;
    errorBody: string;
    retry: string;
    home: string;
  };

  a11y: {
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
    customerSays: string;
    agentSays: string;
    closeDialog: string;
    reviewOf: string;
  };
};
