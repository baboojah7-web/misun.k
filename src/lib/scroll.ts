import type { SectionId } from "@/config/types";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** FR-20: 구역으로 부드럽게 이동 (움직임 줄이기 설정 시 즉시 이동) */
export function scrollToSection(id: SectionId): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}
