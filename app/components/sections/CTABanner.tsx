// ============================================================
// CTA BANNER
// ============================================================
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { card, primaryBtn, gradientText } from "@/lib/styles";

export function CTABanner({ onConvertClick }: { onConvertClick: () => void }) {
  return (
    <section style={{
      padding: "80px 5%", margin: "0 5% 80px", textAlign: "center",
      background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08))",
      border: "1px solid rgba(59,130,246,0.2)", borderRadius: 32,
    }}>
      <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-1px" }}>
        Ready to Stop Typing Numbers Manually?
      </h2>
      <p style={{ color: "#64748b", marginBottom: 40, fontSize: 18 }}>
        Join hundreds of accountants and finance pros saving hours every week.
      </p>
      <button onClick={onConvertClick} style={{ ...primaryBtn, padding: "18px 44px", fontSize: 18 }}>
        Get 3 Free Conversions →
      </button>
    </section>
  );
}