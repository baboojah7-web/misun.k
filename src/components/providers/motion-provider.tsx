"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/** 2.1.4: LazyMotion + domAnimation으로 번들 최소화, 기기의 "움직임 줄이기" 설정 존중 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
