import type { MetadataRoute } from "next";

// NFR-CP-04: robots.txt는 항상 허용 (카카오 미리보기 수집을 막지 않기 위해).
// 검색 노출은 site.indexable → <meta name="robots">로 제어합니다.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }] };
}
