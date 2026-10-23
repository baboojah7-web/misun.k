"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { TopicId } from "@/config/types";
import { scrollToSection } from "@/lib/scroll";

type Selection = { topic: TopicId; nonce: number } | null;

type InquiryContextValue = {
  selection: Selection;
  /** FR-11: 분야 버튼 → 신청서 주제 미리 선택 → #apply로 이동 */
  selectTopic: (topic: TopicId) => void;
};

const InquiryContext = createContext<InquiryContextValue | null>(null);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<Selection>(null);

  const selectTopic = useCallback((topic: TopicId) => {
    setSelection((prev) => ({ topic, nonce: (prev?.nonce ?? 0) + 1 }));
    scrollToSection("apply");
  }, []);

  const value = useMemo(() => ({ selection, selectTopic }), [selection, selectTopic]);
  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>;
}

export function useInquiry(): InquiryContextValue {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used within InquiryProvider");
  return ctx;
}
