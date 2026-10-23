// 메뉴 시트·다이얼로그가 열려 있는지 하단 고정 바(FR-05)에 알려 줍니다.
const EVENT = "site:overlaychange";
let openCount = 0;

export function setOverlayOpen(open: boolean): void {
  openCount = Math.max(0, openCount + (open ? 1 : -1));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: openCount > 0 }));
}

export function onOverlayChange(listener: (open: boolean) => void): () => void {
  const handler = (e: Event) => listener((e as CustomEvent<boolean>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
