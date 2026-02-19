"use client";

import { useRef } from "react";
import { Features } from "./components/sections/Features";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/sections/Hero";
import { Converter } from "./components/sections/Converter";
import { HowItWorks } from "./components/sections/HowItWorks";
import { Pricing } from "./components/sections/Pricing";
import { FAQ } from "./components/sections/FAQ";
import { CTABanner } from "./components/sections/CTABanner";
import { Footer } from "./components/layout/Footer";

export default function Home() {
  const converterRef = useRef<HTMLElement|null>(null);
  const scrollToConverter = () =>
    converterRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#090b18",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#fff",
    }}>
      <Navbar onConvertClick={scrollToConverter} />
      <Hero onConvertClick={scrollToConverter} />
      <Converter sectionRef={converterRef} />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTABanner onConvertClick={scrollToConverter} />
      <Footer />
    </div>
  );
}