# 강미선 팀장 홈페이지

한화생명금융서비스 강미선 팀장의 모바일 우선 원페이지 홈페이지입니다.
카카오톡으로 링크를 받은 고객이 부담 없이 상담을 신청할 수 있게 만드는 것이 목적입니다.

- 구현 기준: 「강미선 팀장 홈페이지 요구사항 정의서 v1.0」(2026-10-23)
- 기술 스택: TypeScript, Next.js 16(App Router), Tailwind CSS 4, shadcn/ui(Base UI), Lucide Icons, Motion, next/font + Pretendard
- 구성: 메인 원페이지(`/`) + 신청서 이메일 전송 API(`POST /api/inquiry`) + 개인정보 처리방침(`/privacy`)

> ⚠️ **아직 공개(운영 배포)하면 안 됩니다.** 아래 [공개 전 확인 사항](#공개-전-확인-사항)이 모두 끝나야 합니다.

---

## 비개발자용 수정 안내

화면에 보이는 **모든 글과 연락처는 `src/config/site.ts` 파일 하나**에 있습니다. 다른 파일은 고치지 않아도 됩니다.
GitHub 웹사이트에서 이 파일을 열고 연필(✏️) 아이콘을 눌러 고친 뒤 **Commit changes**를 누르면, Vercel이 자동으로 다시 배포합니다.

고칠 때 지켜 주세요.

- 큰따옴표(`"`) 안의 글자만 바꿉니다. 따옴표·쉼표(`,`)·괄호는 지우지 않습니다.
- `TODO:`로 시작하는 값은 아직 정해지지 않은 값입니다. 정해지면 `TODO:` 부분을 지우고 실제 문구로 바꿉니다.

### 연락처 바꾸기

파일 맨 위의 `contact` 부분만 고치면 버튼·푸터·처리방침 등 **모든 곳이 함께 바뀝니다.**

```ts
const contact = {
  phone: "010-9930-1828", // 휴대폰 (010-0000-0000 형식)
  email: "baboojah7@naver.com", // 이메일
  kakaoOpenChat: "https://open.kakao.com/o/sxlfkJTi", // 오픈채팅 주소 (https://open.kakao.com/ 으로 시작)
};
```

### 후기 추가하기

1. **고객의 서면 동의를 먼저 받습니다.** (동의서 보관 위치를 아래 "공개 전 확인 기록"에 적어 둡니다.)
2. `reviews` 의 `items: []` 대괄호 안에 아래처럼 한 줄씩 넣습니다. 실명·직장·지역은 쓰지 않습니다.

```ts
items: [
  { summary: "한 줄 요약", quote: "후기 본문", label: "K님", meta: "40대, 맞벌이 가정" },
],
```

후기가 하나도 없으면 후기 구역과 메뉴의 "후기"가 자동으로 숨겨집니다.

### 칼럼(글) 추가하기

`columns` 의 `items: []` 안에 넣습니다. 최대 3개까지 보이고, 누르면 `href` 주소(블로그 등)가 새 창으로 열립니다.

```ts
items: [{ title: "글 제목", summary: "한 줄 요약", date: "2026.10.01", href: "https://blog.naver.com/..." }],
```

글이 없으면 "곧 유익한 글로 찾아뵙겠습니다." 카드가 보이고 메뉴의 "칼럼"은 숨겨집니다.

### 슬로건 흐르는 띠 끄기

`marquee: { enabled: true, ... }` 의 `true` 를 `false` 로 바꿉니다.

### 프로필 사진 넣기

1. 사진(세로 4:5 비율, 200KB 이하 권장)을 `public/profile.jpg` 로 올립니다.
2. `site.ts` 의 `hero.photo: null` 을 `photo: "/profile.jpg"` 로 바꿉니다.
3. 사진이 없으면 이름 첫 글자("강") 모노그램이 보입니다.

### 링크 미리보기 이미지(카톡 카드) 바꾸기

- 직접 만든 이미지(1200×630, 1MB 이하)가 있으면 `public/og.png` 를 덮어씁니다.
- 없으면 개발자가 `pnpm make:images` 로 `site.ts` 문구를 이용한 기본 이미지를 다시 만들 수 있습니다. (사진을 넣었다면 사진도 함께 들어갑니다.)

---

## 개발자용 안내

### 실행

```bash
pnpm install
cp .env.example .env.local   # 값 입력 (로컬 확인만 할 때는 MAIL_DRIVER=dryrun)
pnpm dev                     # http://localhost:3000
```

| 명령어                       | 내용                                                               |
| ---------------------------- | ------------------------------------------------------------------ |
| `pnpm dev`                   | 개발 서버                                                          |
| `pnpm build`                 | `check:content` 실행 후 Next.js 빌드                               |
| `pnpm lint`                  | ESLint(`next/core-web-vitals`) + Prettier 검사                     |
| `pnpm typecheck`             | TypeScript 검사 (`site.ts` 필수 항목 누락 시 실패)                 |
| `pnpm check:content`         | 내용 검사 (개발 모드: `TODO:` 는 경고)                             |
| `pnpm check:content:release` | 내용 검사 (공개 모드: `TODO:` 는 오류)                             |
| `pnpm make:images`           | `public/og.png`, `src/app/icon.png`, `src/app/apple-icon.png` 생성 |
| `pnpm format`                | Prettier 정렬                                                      |

### 환경 변수

| 이름                   | 설명                                                                            |
| ---------------------- | ------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | 사이트 주소(https). 링크 미리보기 절대 주소, 신청 API 출처 확인에 사용          |
| `RESEND_API_KEY`       | Resend API 키 (D-01 기본값)                                                     |
| `INQUIRY_TO`           | 신청 메일을 받을 주소 (D-02)                                                    |
| `INQUIRY_FROM`         | 보내는 주소. Resend에서 인증한 도메인이어야 함                                  |
| `ALLOWED_ORIGINS`      | (선택) 추가 허용 출처, 쉼표 구분. Vercel 배포 주소(`VERCEL_URL` 등)는 자동 허용 |
| `MAIL_DRIVER`          | (로컬 전용) `dryrun` 이면 메일을 보내지 않고 성공 처리                          |

메일 설정이 빠지거나 틀리면 API가 `500 SEND_FAILED` 를 돌려주고, 화면에는 전화·카톡 대체 연락 안내가 나옵니다.

### 폴더 구조

```
scripts/check-content.ts     내용 검사 (NFR-MT-03)
scripts/banned-terms.ts      광고 금칙어 목록 (부록 B)
scripts/make-images.ts       OG 이미지·아이콘 생성 (D-20)
src/config/site.ts           ★ 모든 문구·연락처
src/config/types.ts          SiteConfig 타입
src/app/api/inquiry/route.ts 신청서 전송 API (FR-14)
src/app/privacy/page.tsx     개인정보 처리방침 (FR-18)
src/components/sections/     구역별 컴포넌트 (1구역 1파일)
src/components/common/       ContactButtons, ProfilePhoto 등 공통 부품
src/lib/schema.ts            zod 스키마 (화면·서버 공용)
src/lib/mail.ts              메일 전송 추상화
src/lib/contact.ts           전화·메일·오픈채팅 링크 (FR-19)
```

### 신청 API 동작 (FR-14)

처리 순서: 콘텐츠 타입(415) → 본문 크기 8KB(413) → `Origin` 확인(403) → zod 검증(400) → 스팸 판정(숨은 칸 `website` 값 있음 또는 입력 시간 3초 미만이면 **200으로 응답하고 메일 안 보냄**) → 요청 제한(같은 IP 분당 5회 초과 시 429) → 중복 방지(같은 연락처·주제·메모가 1분 안에 다시 오면 메일을 다시 보내지 않고 200) → 메일 발송.

- 응답 헤더 `Cache-Control: no-store`
- 서버 로그에는 오류 종류(`MAIL_NOT_CONFIGURED` / `MAIL_SEND_FAILED`)만 남고 이름·연락처·메모는 남지 않습니다.
- **요청 제한·중복 방지의 한계:** 서버 메모리에 저장하는 베스트에포트 방식이라, Vercel 서버리스에서는 인스턴스끼리 공유되지 않고 인스턴스가 재시작되면 초기화됩니다. 스팸이 실제로 문제가 되면 D-14(Turnstile, Vercel Firewall 요청 제한 규칙 등)를 검토합니다.

### 배포 (사람이 진행)

에이전트는 공개 배포를 하지 않습니다. 아래는 팀장님(또는 담당자)이 진행합니다.

1. [Vercel](https://vercel.com)에서 이 GitHub 저장소를 Import 합니다. (프레임워크: Next.js, 설정 변경 없음. 정적 내보내기 `output: 'export'` 는 쓰지 않습니다 — 신청 API가 동작하지 않게 됩니다.)
2. Settings → Environment Variables 에 위 환경 변수를 입력합니다. (`MAIL_DRIVER` 는 넣지 않습니다.)
3. 서버 함수 지역을 서울(`icn1`)로 지정할 수 있는지 Settings → Functions 에서 확인합니다.
4. `main` 에 푸시하면 자동 배포됩니다. Production 빌드(`VERCEL_ENV=production`)에서는 `check:content` 가 공개 모드로 실행되어 `TODO:` 가 남아 있으면 **빌드가 실패**합니다(의도된 안전장치). 확인 전 단계에서는 Preview 배포로 확인합니다.
5. 도메인 연결, `site.ts` 의 `indexable: true` 변경(검색 노출, D-07)은 회사 확인 후에 합니다.

### 카카오톡 미리보기 캐시 갱신

이미지나 제목을 바꿨는데 카톡에 예전 미리보기가 보이면:

1. [카카오 개발자 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에 로그인합니다.
2. **Production 주소**를 입력하고 "캐시 초기화"를 누릅니다.
3. 카톡 "나와의 채팅"에 링크를 다시 보내 확인합니다.

Preview 주소는 Vercel 인증 보호 때문에 카카오가 읽지 못할 수 있어, 미리보기는 반드시 Production 주소로 확인합니다.

### 칼럼 글 추가 (개발자 요약)

`site.ts` → `columns.items` 에 `{ title, summary, date, href }` 추가. 최대 3개 표시. ⚠️ 글마다 광고 규정·회사 확인.

---

## 결정 사항 기본값 적용 기록

요구사항 정의서 4.3의 기본값(추천안)을 따른 항목입니다.

| ID   | 적용한 기본값                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------ |
| D-01 | Resend로 메일 전송 (`src/lib/mail.ts`). 처리방침에 발송 서비스 경유 사실 기재, 위탁·국외 이전 문구는 `TODO:` |
| D-02 | 수신 주소는 환경 변수 `INQUIRY_TO` 로 분리 (업무용 여부 확인 필요)                                           |
| D-04 | 오픈채팅 주소는 설정값 그대로 사용 (1:1 방 여부 확인 필요)                                                   |
| D-05 | 방문 분석 도구 없음                                                                                          |
| D-06 | 칼럼 상세 페이지 없음, 외부 링크 또는 "준비 중"                                                              |
| D-07 | `indexable: false` → `noindex,nofollow`. `robots.txt` 는 항상 허용                                           |
| D-08 | 후기 0개 → 후기 구역·메뉴 숨김                                                                               |
| D-09 | 사진 없음 → 모노그램("강")                                                                                   |
| D-10 | 소속 로고 이미지 없이 텍스트만                                                                               |
| D-12 | 등록번호·심의 번호 비어 있음 → 해당 줄 숨김                                                                  |
| D-13 | 보관 기간·파기 방법은 `TODO:` (공개 빌드 차단)                                                               |
| D-14 | 숨은 칸 + 입력 시간 + 출처 확인 + 요청 제한(베스트에포트)                                                    |
| D-15 | 완료 문구 "선택하신 방법으로 순차적으로 연락드리겠습니다."                                                   |
| D-16 | 완료 화면에 오픈채팅 버튼 표시 (+ 카카오톡 선택 시 안내 문구)                                                |
| D-17 | FAQ 상담 비용 답변 `TODO:` → 개발 중 "(준비 중)" 표시, 공개 빌드 차단                                        |
| D-18 | 자격 명칭은 정의서 초기값으로 표시. 값 앞에 `TODO:` 를 붙이면 자격 카드·문구가 숨겨짐                        |
| D-20 | `pnpm make:images` 로 텍스트형 OG 이미지 생성 (`public/og.png`)                                              |

### 사람 확인이 필요한 금칙어 예외 (승인된 예외)

`check:content` 의 차단어 "지금 가입"이 아래 두 문구에 걸려 `// banned-ok:` 주석으로 예외 처리했습니다. 둘 다 "이미 가입해 둔 보험"을 가리키는 말이고 가입 권유가 아니라고 판단했지만, **회사 확인 시 함께 검토**해 주세요. 바꾸려면 "현재 가입하신 보험" 등으로 고치면 됩니다.

- 대화 패널: "아니요. 지금 가입하신 보험을 함께 살펴보는 시간이에요. …"
- 분야 01: "지금 가입한 보험에서 빠진 부분과 겹치는 부분을 함께 살펴봅니다."

경고어("전문가", "확정")는 `pnpm check:content` 출력 목록으로 확인합니다.

---

## 측정 기록

### 디자인 토큰 대비 (NFR-AC-02, WCAG 대비율)

| 조합                            | 대비            | 비고                                                          |
| ------------------------------- | --------------- | ------------------------------------------------------------- |
| 남색 `#1E2B4A` / 크림 `#FBF7EF` | 13.10           | 본문                                                          |
| 보조 글자 `#4B5563` / 크림      | 7.07            |                                                               |
| 흰 글자 / 포인트 `#C2410C`      | 5.18            | 상담 신청 버튼                                                |
| `#191919` / 카톡 노랑 `#FEE500` | 13.75           |                                                               |
| 남색 / 연파랑 `#DCEBF7`         | 11.52           |                                                               |
| 오류 `#B91C1C` / 흰색           | 6.47            |                                                               |
| 크림 / 남색 (푸터)              | 13.10           |                                                               |
| 남색 85% / 분야 파스텔 5종      | 7.34 ~ 7.81     | `#FBE3D3`, `#E2EEDB`, `#E7E3F6`, `#F8EDC8`, `#D9EEF0`         |
| "필수" 표시 (포인트 10% 바탕)   | 4.48 → **조정** | 글자색을 `--color-accent-hover #9A3412` 로 바꿔 4.5 이상 확보 |

정의서 시안 색은 그대로 사용했고, 분야 파스텔 5종은 위 값으로 정했습니다.

### 폰트 (NFR-PF-06)

- Pretendard Variable(OFL)을 KS X 1001 한글 2,350자 + 영문·숫자·기호 + `site.ts` 사용 글자로 서브셋: 원본 woff2 2.0MB → **422KB** (`src/app/fonts/PretendardVariable.subset.woff2`, 1개 파일, preload, `display: swap`).
- 서브셋에 없는 글자(희귀 한글 등)는 시스템 폰트로 표시됩니다. `site.ts` 에 새 글자가 많이 늘면 서브셋을 다시 만듭니다.

### 자바스크립트 용량 (NFR-PF-05)

- 로컬 `next build` + `next start` 측정, 메인 페이지 첫 로드 JS: **약 261KB (gzip)**, 12개 파일. **목표 200KB를 넘습니다.**
- 이 중 React 19 + Next.js 16 기본 런타임만 약 157KB이고, 나머지는 정의서가 지정한 react-hook-form·zod(공용 스키마)·Base UI(메뉴 시트·다이얼로그·아코디언)·Motion입니다. zod는 `zod/mini` 로 바꿔 약 14KB를 줄였습니다.
- 추가로 줄이려면 신청서 검증 라이브러리를 늦게 불러오는 방식 등을 검토해야 하며, 배포 주소의 Lighthouse 결과(NFR-PF-01)를 보고 결정하는 것을 권합니다.

### 외부 요청·저장소 (NFR-PF-08, NFR-PV-04·07)

- 페이지가 요청하는 도메인: 자체 도메인 1개뿐 (외부 CDN·폰트·분석 0개)
- 쿠키 0개, `localStorage`·`sessionStorage` 0건

---

## 공개 전 확인 사항

- [ ] `pnpm check:content:release` 가 오류 0건 (`TODO:` 0건, 차단어 0건) — 현재 남은 `TODO:` 6건 + `NEXT_PUBLIC_SITE_URL`
- [ ] 회사 광고·준법 확인 완료와 결과 기록 (아래 표)
- [ ] 개인정보 처리방침·동의 문구·보관 기간 확정 (D-13)
- [ ] 후기 사용 시 고객 서면 동의 확인 (D-08)
- [ ] 실기기(iOS·Android) + 카카오톡 인앱 브라우저 QA (요구사항 정의서 부록 E)
- [ ] 테스트 신청서가 팀장님 이메일에 1분 안에 도착
- [ ] 오픈채팅이 1:1 방인지 확인 (D-04)
- [ ] 검색 노출 여부 결정 (D-07)
- [ ] 배포 주소에서 Lighthouse 모바일 성능 90 / 접근성 95 이상 기록

### 공개 전 확인 기록 (NFR-AD-10)

| 확인 항목                     | 담당 부서 | 확인일 | 결과 | 수정 지시 |
| ----------------------------- | --------- | ------ | ---- | --------- |
| 홈페이지 전체 문구(광고 심의) |           |        |      |           |
| 개인정보 처리방침·동의 문구   |           |        |      |           |
| 등록번호·심의 번호 표기       |           |        |      |           |
| 후기 동의서 보관 위치         |           |        |      |           |

---

## 월 1회 점검 (NFR-MT-10)

- [ ] 전화·카톡·이메일 링크가 모두 열리는지 (카톡 인앱 브라우저에서)
- [ ] 테스트 신청서를 보내 메일이 도착하는지
- [ ] 오픈채팅 방이 정상인지 (1:1 방 유지)
- [ ] 의존성 보안 업데이트 확인 (`pnpm outdated`, GitHub Dependabot 알림)

---

## 라이선스 참고

- Pretendard: SIL Open Font License 1.1 (`src/app/fonts/Pretendard-LICENSE.txt`)
