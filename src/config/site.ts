// ★ 홈페이지에 보이는 모든 문구와 연락처는 이 파일 하나에서만 고칩니다.
// - "TODO:"로 시작하는 값은 아직 확정되지 않은 값입니다. 공개 빌드에서는 오류가 납니다.
// - 후기(reviews.items)·칼럼(columns.items)이 비어 있으면 해당 구역과 메뉴가 자동으로 숨겨집니다.
// - 수정 방법은 README.md의 "비개발자용 수정 안내"를 참고하세요.

import type { SiteConfig } from "./types";

const contact = {
  phone: "010-9930-1828",
  email: "baboojah7@naver.com", // 업무용 메일 (팀장님 확인 완료, D-02)
  kakaoOpenChat: "https://open.kakao.com/o/sxlfkJTi", // 1:1 채팅방 (팀장님 확인 완료, D-04)
};

/** 사이트 주소: NEXT_PUBLIC_SITE_URL → (Vercel) 배포 주소 → 로컬 */
function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const vercelHost =
    process.env.VERCEL_ENV === "production" ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;
  return vercelHost ? `https://${vercelHost}` : "http://localhost:3000";
}

const config = {
  url: siteUrl(),
  indexable: false, // 회사 확인 전까지 false (D-07)
  pendingText: "(준비 중)",

  brand: { company: "한화생명금융서비스", name: "강미선", title: "팀장" },
  contact, // 연락처는 파일 맨 위 contact에서 고칩니다.

  seo: {
    title: "강미선 팀장 | 알고 준비할수록 달라집니다",
    description: "내 보험, 지금 괜찮은지 부담 없이 함께 살펴드립니다.",
    ogImage: "/og.png",
    ogImageAlt: "한화생명금융서비스 강미선 팀장 - 알고 준비할수록 달라집니다",
    themeColor: "#FBF7EF",
  },

  nav: {
    label: "주요 메뉴",
    // 순서 고정 (FR-02). 후기·칼럼은 내용이 없으면 자동으로 빠집니다.
    items: [
      { id: "reviews", label: "후기" },
      { id: "about", label: "소개" },
      { id: "fields", label: "분야" },
      { id: "faq", label: "질문" },
      { id: "apply", label: "상담 신청" },
      { id: "columns", label: "칼럼" },
    ],
  },

  contactButtons: {
    kakao: "카톡 문의",
    phone: "전화하기",
    phoneShort: "전화",
    apply: "상담 신청",
    email: "이메일",
    newWindow: "(새 창)",
  },

  hero: {
    eyebrow: "한화생명금융서비스",
    headline: "알고 준비할수록, 달라집니다",
    subcopy: "내 보험, 지금 괜찮은지 부담 없이 함께 살펴드립니다.",
    promises: ["무리한 권유 없이", "편한 방법으로 연락", "궁금한 점만 간단히"],
    primaryCta: "상담 신청하기",
    ctaHint: "길게 쓰지 않으셔도 됩니다. 궁금한 점만 남겨 주세요.",
    photo: "/profile.jpg", // 예: "/profile.jpg" (D-09). 없으면 모노그램이 보입니다.
    photoAlt: "강미선 팀장 프로필 사진",
    monogram: "강", 
  },

  marquee: { enabled: true, text: "알고 준비할수록 달라집니다", repeat: 6 },

  pillars: {
    title: "알고, 준비하면 달라집니다",
    items: [
      { title: "알고", body: "내 보험이 지금 어떻게 되어 있는지 먼저 확인합니다." },
      { title: "준비하고", body: "보장과 노후, 꼭 필요한 만큼 차근차근 준비합니다." },
      { title: "달라지고", body: "알고 준비하면 막연한 걱정이 한결 줄어듭니다." },
    ],
  },

  reviews: {
    title: "먼저 상담받으신 분들의 이야기",
    // 고객의 서면 동의를 받은 실제 후기만 넣습니다 (D-08). 비면 구역과 메뉴가 숨겨집니다.
    // 예) { summary: "한 줄 요약", quote: "후기 본문", label: "K님", meta: "40대, 맞벌이 가정" },
   items: [
      {
        summary: "초기 갑상선암",
        quote: "3년전 건강검진을 하다가 추가 소견으로 검사 해 초기 갑상선암 진단을 받았습니다. 진단받기 2년전 초기암인 유사암 진단비를 크게 준비 할 수있다는 설계사님의 권유로 크게 관심없던 암 보험을 가입해둔 덕에 고액이 드는 로봇수술도 걱정없이 받을 수 있었습니다. 그때 준비 하지 않았다면 소액의 금액을 진단비로 받고 로봇수술도 고민했을 텐데 덕분에 흉터없고 회복빠른 치료를 받을 수 있었습니다. 감사합니다",
        label: "K님",
        meta: "40대, 전업주부",
      },
    ],
  chat: {
    title: "강미선 팀장님, 상담 그게 뭐예요?",
    // ⚠️ 약속 내용은 실제로 지킬 수 있는지 확인 (NFR-AD-06)
    messages: [
      { from: "customer", text: "상담하면 꼭 가입해야 하나요?" },
      {
        from: "agent",
        // banned-ok: "지금 가입하신 보험"은 이미 가입한 보험을 가리키는 말로, 가입 권유가 아님 (사람 확인 필요)
        text: "아니요. 지금 가입하신 보험을 함께 살펴보는 시간이에요. 결정은 충분히 생각하신 뒤에 편하게 하시면 됩니다.",
      },
      { from: "customer", text: "연락처를 남기면 전화가 계속 오나요?" },
      { from: "agent", text: "남겨 주신 문의에 대해서만, 고르신 방법과 시간에 맞춰 연락드려요." },
      { from: "customer", text: "상담은 어떻게 진행돼요?" },
      {
        from: "agent",
        text: "이렇게 진행돼요.",
        steps: ["신청", "연락", "보험 점검", "결정은 고객님이 천천히"],
      },
    ],
    quickActions: { apply: "상담 신청하기", kakao: "카톡으로 먼저 물어보기" },
  },

  about: {
    title: "안녕하세요, 강미선입니다",
    intro:
      "보험은 많이 가입하는 것보다 내게 맞게 알고 준비하는 것이 중요하다고 생각합니다. 어려운 말은 쉽게 풀어 설명드리고, 선택은 고객님이 편안하게 하실 수 있도록 돕겠습니다.",
    credentialsLabel: "자격",
    // 팀장님 확인 완료. 미확정 자격은 앞에 "TODO:"를 붙이면 자격 표시가 숨겨집니다.
    credentials: ["생명/손해보험자격", "탑컨설턴트", "변액", "치매케어컨설턴트"],
    tagsLabel: "살펴보는 분야",
    tags: ["보장", "노후대비", "법인", "사업자", "절세", "상속"],
    statsLabel: "한눈에 보는 강미선 팀장",
    stats: [
      {
        kind: "credentials",
        value: "4",
        label: "갖춘 자격",
        detail: "생명/손해보험자격 · 탑컨설턴트 · 변액 · 치매케어컨설턴트",
      },
      { kind: "fields", value: "6", label: "살펴보는 분야", detail: "보장 · 노후 · 법인 · 사업자 · 절세 · 상속" },
      { kind: "region", value: "전국", label: "활동 지역", detail: "원하시면 대면 상담도 가능합니다" },
    ],
    kakaoCta: "카톡으로 물어보기",
  },

  fields: {
    title: "이런 분야를 함께 살펴봅니다",
    cta: "이 주제로 상담 신청",
    badgePrefix: "분야",
    // id는 아래 form.topics의 id와 같아야 합니다.
    items: [
      {
        id: "protect",
        no: "01",
        title: "보장 점검",
        // banned-ok: "지금 가입한 보험"은 이미 가입한 보험을 가리키는 말로, 가입 권유가 아님 (사람 확인 필요)
        body: "지금 가입한 보험에서 빠진 부분과 겹치는 부분을 함께 살펴봅니다.",
      },
      { id: "retirement", no: "02", title: "노후 대비", body: "연금과 은퇴 후 생활을 현실적으로 따져봅니다." },
      { id: "care", no: "03", title: "치매·간병", body: "치매케어컨설턴트로서 간병 대비를 함께 이야기합니다." },
      { id: "business", no: "04", title: "사업자·법인", body: "대표님의 상황에 맞춰 함께 살펴봅니다." },
      {
        id: "tax",
        no: "05",
        title: "절세·상속",
        body: "관련 제도를 쉽게 설명드립니다. 세무·법률 판단이 필요한 부분은 해당 전문가와 함께 확인합니다.",
      },
    ],
  },

  faq: {
    title: "자주 묻는 질문",
    items: [
      { q: "상담 비용이 있나요?", a: "상담은 비용 없이 진행됩니다." },
      { q: "가입한 보험 내용을 잘 몰라도 되나요?", a: "괜찮습니다. 확인하는 방법부터 안내해 드립니다." },
      {
        q: "꼭 만나야 하나요?",
        a: "전화, 카카오톡, 문자로 상담하실 수 있고, 원하시면 전국 어디든 대면 상담도 가능합니다.",
      },
      {
        q: "사업자·법인 대표도 상담받을 수 있나요?",
        a: "네, 가능합니다. 세무·법률 판단이 필요한 부분은 해당 전문가와 함께 확인해야 할 수 있습니다.",
      },
    ],
  },

  form: {
    title: "궁금한 점만 남겨 주세요",
    titleSub: "길게 쓰지 않으셔도 됩니다.",
    // ⚠️ 사실과 일치할 때만 사용
    description: "남겨 주신 내용은 상담 연락 외 다른 용도로 쓰지 않습니다.",
    requiredMark: "필수",
    optionalMark: "선택",
    labels: {
      name: "이름",
      phone: "연락처",
      topic: "궁금한 점",
      message: "더 알려주실 내용",
      method: "원하는 상담 방식",
      time: "편한 연락 시간대",
    },
    placeholders: { name: "홍길동", phone: "010-1234-5678", message: "예) 지금 보험료가 적당한지 궁금해요" },
    messageCounter: "자",
    topics: [
      { id: "protect", label: "보험료·보장 점검" },
      { id: "retirement", label: "노후 준비" },
      { id: "care", label: "치매·간병 대비" },
      { id: "business", label: "사업자·법인" },
      { id: "tax", label: "절세·상속" },
      { id: "other", label: "기타" },
    ],
    methods: [
      { id: "phone", label: "전화" },
      { id: "kakao", label: "카카오톡" },
      { id: "sms", label: "문자" },
    ],
    times: [
      { id: "any", label: "상관없음" },
      { id: "morning", label: "오전" },
      { id: "afternoon", label: "오후" },
      { id: "evening", label: "저녁" },
    ],
    sensitiveNotice: "주민등록번호, 병력 등 민감한 정보는 적지 말아 주세요.",
    consentLabel: "개인정보 수집·이용에 동의합니다. (필수)",
    consentDetail: "내용 보기",
    consentDialog: {
      title: "개인정보 수집·이용 안내",
      items: [
        { term: "수집 항목", desc: "이름, 연락처, 궁금한 점(주제·메모), 원하는 상담 방식, 편한 연락 시간대" },
        { term: "이용 목적", desc: "상담 연락 및 상담 내용 안내" },
        { term: "보관 기간", desc: "상담 종료 후 1년간 보관하며, 기간이 지나면 이메일을 영구 삭제합니다." },
        {
          term: "동의 거부",
          desc: "동의를 거부하실 수 있습니다. 다만 동의하지 않으시면 홈페이지 신청은 어렵고, 전화나 카카오톡으로 문의하실 수 있습니다.",
        },
      ],
      privacyLink: "개인정보 처리방침 전체 보기",
      close: "닫기",
    },
    submit: "상담 신청하기",
    submitting: "전송 중...",
    slowNotice: "조금 오래 걸리고 있어요. 잠시만 기다려 주세요.",
    successTitle: "신청이 접수되었습니다",
    successBody: "선택하신 방법으로 순차적으로 연락드리겠습니다.", // 연락 가능 시간 확정 시 교체 (D-15)
    successKakaoHint: "카카오톡을 고르셨다면, 아래 버튼으로 먼저 말을 걸어 주셔도 좋아요.",
    successKakaoCta: "카톡으로 바로 문의하기",
    errorTitle: "신청이 접수되지 않았습니다",
    errorBody: "잠시 후 다시 시도하시거나, 아래 방법으로 바로 연락해 주세요.",
    offlineBody: "인터넷 연결을 확인해 주세요.",
    retry: "다시 시도",
    toHome: "처음으로",
    validation: {
      name: "이름을 입력해 주세요.",
      nameFormat: "이름은 한글이나 영문으로 2~20자 적어 주세요.",
      phone: "연락처를 정확히 입력해 주세요. 예) 010-1234-5678",
      topic: "궁금한 점을 골라 주세요.",
      method: "상담 방식을 골라 주세요.",
      consent: "개인정보 수집·이용에 동의해 주셔야 신청할 수 있어요.",
      messageTooLong: "200자 이내로 적어 주세요.",
      sensitive: "주민등록번호, 병력 등은 적지 말아 주세요.",
    },
  },

  columns: {
    title: "알아두면 좋은 보험 이야기",
    emptyText: "곧 유익한 글로 찾아뵙겠습니다.",
    // 최대 3개까지 보입니다. ⚠️ 글마다 광고 규정·회사 확인 필요
    // 예) { title: "글 제목", summary: "한 줄 요약", date: "2026.10.01", href: "https://blog.naver.com/..." },
   items: [
      {
        title: "암 치료비, 제대로 알고 준비하기",
        summary: "급여·선별급여·비급여, 본인부담이 어떻게 다른지 한눈에 보기",
        date: "2026.10.27",
        href: "https://misun-k.vercel.app/%EC%95%94%EC%B9%98%EB%A3%8C%EB%B9%84.png",
      },
    ],
  },

  footer: {
    contactHeading: "연락처",
    phoneLabel: "휴대폰",
    emailLabel: "이메일",
    kakaoLabel: "카카오톡 오픈채팅",
    registrationLabel: "설계사 등록번호",
    registrationNo: "", // 설계사 등록번호가 나오면 큰따옴표 안에 입력하세요. 비워 두면 푸터에서 줄이 숨겨집니다.
    reviewLabel: "광고 심의 번호",
    reviewNo: "", // 회사 안내에 따라 입력 (D-12). 비우면 줄이 숨겨집니다.
    legalNotice: "보험 계약 체결 전 상품설명서와 약관을 반드시 확인하세요.",
    privacyLink: "개인정보 처리방침",
    copyright: "© 강미선",
  },

  // ⚠️ 임시 초안입니다. 회사 양식이 있으면 그것으로 교체합니다 (D-13).
  privacy: {
    title: "개인정보 처리방침",
    updatedAt: "시행일: 2026년 11월 1일",
    intro:
      '한화생명금융서비스 강미선 팀장(이하 "상담자")은 홈페이지 상담 신청을 통해 받은 개인정보를 아래와 같이 처리합니다.',
    sections: [
      {
        heading: "1. 수집하는 항목",
        body: ["이름, 연락처, 궁금한 점(주제·메모), 원하는 상담 방식, 편한 연락 시간대"],
      },
      {
        heading: "2. 수집·이용 목적",
        body: ["상담 연락 및 상담 내용 안내에만 이용합니다."],
      },
      {
        heading: "3. 보관·이용 기간과 파기 방법",
        body: ["상담 종료 후 1년간 보관하며, 기간이 지나면 이메일을 영구 삭제합니다."],
      },
      {
        heading: "4. 처리 방법과 위탁",
        body: [
          "신청 내용은 홈페이지 서버에 저장하지 않고, 이메일 발송 서비스를 거쳐 상담자의 이메일로만 전달됩니다.",
          "신청 내용은 네이버 메일을 통해 상담자의 업무용 이메일로 전달되며, 전달 외 목적으로 보관되지 않습니다.",
        ],
      },
      {
        heading: "5. 동의를 거부할 권리",
        body: [
          "개인정보 수집·이용에 동의하지 않으실 수 있습니다.",
          "동의하지 않으시면 홈페이지를 통한 상담 신청은 어렵지만, 전화나 카카오톡으로 문의하실 수 있습니다.",
        ],
      },
      {
        heading: "6. 정보주체의 권리",
        body: ["언제든지 남기신 정보의 열람, 정정, 삭제를 요청하실 수 있습니다. 아래 문의처로 연락해 주세요."],
      },
      {
        heading: "7. 문의처",
        body: [`강미선 팀장 · ${contact.phone} · ${contact.email}`],
      },
    ],
    backHome: "홈으로",
  },

  mail: {
    fromName: "홈페이지 상담 신청",
    subjectPrefix: "[홈페이지 상담 신청]",
    receivedAt: "접수 시각",
    name: "이름",
    phone: "연락처",
    topic: "궁금한 점",
    message: "메모",
    method: "원하는 상담 방식",
    time: "편한 연락 시간대",
    consent: "개인정보 수집·이용 동의",
    consentYes: "동의함",
    consentAt: "동의 시각",
    empty: "(없음)",
  },

  errorPage: {
    notFoundTitle: "페이지를 찾을 수 없습니다",
    notFoundBody: "주소가 바뀌었거나 없는 페이지입니다. 아래 버튼으로 다시 찾아와 주세요.",
    errorTitle: "잠시 문제가 생겼습니다",
    errorBody: "불편을 드려 죄송합니다. 다시 시도하시거나 전화·카카오톡으로 연락해 주세요.",
    retry: "다시 시도",
    home: "처음으로",
  },

  a11y: {
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
    skipToContent: "본문으로 건너뛰기",
    customerSays: "고객 질문",
    agentSays: "팀장 답변",
    closeDialog: "닫기",
    reviewOf: "번째 후기",
  },
} satisfies SiteConfig;

export const site: SiteConfig = config;
