import { About } from "@/components/sections/about";
import { ChatPanel } from "@/components/sections/chat-panel";
import { Columns } from "@/components/sections/columns";
import { Faq } from "@/components/sections/faq";
import { FieldShowcase } from "@/components/sections/field-showcase";
import { FloatingCta } from "@/components/sections/floating-cta";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { HeroCtaBand } from "@/components/sections/hero-cta-band";
import { InquiryForm } from "@/components/sections/inquiry-form";
import { Pillars } from "@/components/sections/pillars";
import { Reviews } from "@/components/sections/reviews";
import { SloganMarquee } from "@/components/sections/slogan-marquee";
import { InquiryProvider } from "@/components/providers/inquiry-provider";

export default function Home() {
  return (
    <InquiryProvider>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <HeroCtaBand />
        <SloganMarquee />
        <Pillars />
        <Reviews />
        <ChatPanel />
        <About />
        <FieldShowcase />
        <Faq />
        <InquiryForm />
        <Columns />
      </main>
      <Footer />
      <FloatingCta />
    </InquiryProvider>
  );
}
