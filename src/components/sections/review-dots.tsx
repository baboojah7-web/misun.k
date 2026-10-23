"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** 후기 가로 스크롤 위치를 보여주는 작은 점 (장식, 스크린리더 제외) */
export function ReviewDots({ count, hideOnPc }: { count: number; hideOnPc: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = document.getElementById("reviews-track");
    if (!track) return;
    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth;
      const ratio = max > 0 ? track.scrollLeft / max : 0;
      setActive(Math.round(ratio * (count - 1)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [count]);

  return (
    <div aria-hidden className={cn("mt-4 flex justify-center gap-2", hideOnPc && "lg:hidden")}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn("h-2 rounded-full transition-all", i === active ? "w-6 bg-navy" : "w-2 bg-navy/25")}
        />
      ))}
    </div>
  );
}
