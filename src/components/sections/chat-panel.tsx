"use client";

import { useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { site } from "@/config/site";
import { KakaoLink } from "@/components/common/contact-buttons";
import { cn } from "@/lib/utils";

/** FR-09. 카톡 대화 패널 ("상담, 그게 뭐예요?") */
export function ChatPanel() {
  const { title, messages, quickActions } = site.chat;
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useInView(listRef, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="chat-title" className="section bg-cream">
      <div className="container-page">
        <div className="rounded-[32px] bg-gradient-to-b from-sky via-sky/70 to-cream px-4 py-8 sm:px-8 lg:mx-auto lg:max-w-[760px] lg:px-12 lg:py-12">
          <h2 id="chat-title" className="h2 mb-6 px-1 text-center">
            {title}
          </h2>
          <ol ref={listRef} className="flex flex-col gap-3">
            {messages.map((msg, i) => {
              const fromAgent = msg.from === "agent";
              return (
                <m.li
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={reduced || inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.3 }}
                  className={cn("flex items-end gap-2", fromAgent ? "justify-start" : "justify-end")}
                >
                  <span className="sr-only">{fromAgent ? site.a11y.agentSays : site.a11y.customerSays}: </span>
                  {fromAgent && (
                    <span
                      aria-hidden
                      className="mb-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-navy text-[15px] font-bold text-white"
                    >
                      {site.hero.monogram}
                    </span>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-3 text-[17px] leading-relaxed shadow-[0_2px_8px_rgba(30,43,74,0.06)]",
                      fromAgent
                        ? "rounded-[20px] rounded-bl-[6px] bg-white text-navy"
                        : "rounded-[20px] rounded-br-[6px] bg-kakao text-kakao-ink",
                    )}
                  >
                    <p>{msg.text}</p>
                    {msg.steps && (
                      <ol className="mt-2 flex flex-col gap-1.5">
                        {msg.steps.map((step, n) => (
                          <li key={step} className="flex items-start gap-2">
                            <span
                              aria-hidden
                              className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-sky text-[14px] font-bold"
                            >
                              {n + 1}
                            </span>
                            <span>
                              <span className="sr-only">{n + 1}. </span>
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </m.li>
              );
            })}
          </ol>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a href="#apply" className="btn btn-accent btn-lg">
              {quickActions.apply}
            </a>
            <KakaoLink className="btn-lg" label={quickActions.kakao} />
          </div>
        </div>
      </div>
    </section>
  );
}
