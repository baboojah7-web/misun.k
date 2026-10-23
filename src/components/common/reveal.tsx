"use client";

import * as m from "motion/react-m";

/** 화면에 들어올 때 한 번만 부드럽게 나타납니다. (움직임 줄이기 설정 시 즉시 표시) */
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.08 }}
    >
      {children}
    </m.div>
  );
}
