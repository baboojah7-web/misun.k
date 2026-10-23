"use client";

import { ChevronDown } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { site } from "@/config/site";
import { SectionTitle } from "@/components/common/section-title";
import { display } from "@/lib/content";

/** FR-12. 자주 묻는 질문 (한 번에 하나만 열림) */
export function Faq() {
  const { title, items } = site.faq;
  return (
    <section id="faq" aria-labelledby="faq-title" className="section bg-cream">
      <div className="container-page lg:max-w-[880px]">
        <SectionTitle id="faq-title">{title}</SectionTitle>
        <AccordionPrimitive.Root multiple={false} className="border-t border-navy/15">
          {items.map((item, i) => (
            <AccordionPrimitive.Item key={i} value={i} className="border-b border-navy/15">
              <AccordionPrimitive.Header className="m-0">
                <AccordionPrimitive.Trigger className="group flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-[17px] font-bold text-navy">
                  <span>{item.q}</span>
                  <ChevronDown
                    aria-hidden
                    className="size-6 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180"
                  />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                <p className="pb-5 text-[17px] text-navy/85">{display(item.a)}</p>
              </AccordionPrimitive.Panel>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
}
