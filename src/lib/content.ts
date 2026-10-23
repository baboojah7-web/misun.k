import { site } from "@/config/site";
import type { SectionId } from "@/config/types";

const TODO_PREFIX = "TODO:";

/** 아직 확정되지 않은 값인지 확인합니다. */
export function isTodo(value: string): boolean {
  return value.trim().startsWith(TODO_PREFIX);
}

/** 확정되지 않은 값이면 "(준비 중)"을 보여줍니다. */
export function display(value: string): string {
  return isTodo(value) ? site.pendingText : value;
}

/** 값이 비었거나 확정되지 않았으면 숨깁니다. */
export function hasValue(value: string | undefined | null): value is string {
  return Boolean(value && value.trim() && !isTodo(value));
}

export const credentialsConfirmed =
  site.about.credentials.length > 0 && site.about.credentials.every((c) => hasValue(c));

export const hasReviews = site.reviews.items.length > 0;
export const hasColumns = site.columns.items.length > 0;

/** 내용이 없어 숨겨진 구역 */
const hiddenSections = new Set<SectionId>([
  ...(hasReviews ? [] : (["reviews"] as const)),
  ...(hasColumns ? [] : (["columns"] as const)),
]);

export const navItems = site.nav.items.filter((item) => !hiddenSections.has(item.id));

export function sectionHref(id: SectionId): `#${SectionId}` {
  return `#${id}`;
}
