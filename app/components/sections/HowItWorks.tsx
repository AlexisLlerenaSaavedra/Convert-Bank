// ============================================================
// HOW IT WORKS
// ============================================================
import { STEPS } from "@/lib/constants";
import { useState, useRef, DragEvent, ChangeEvent } from "react";

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{
      padding: "100px 5%", textAlign: "center",
      background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)",
    }}>
      <p style={{ fontSize: 13, color: "#10b981", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Simple Process</p>
      <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#fff", marginBottom: 64, letterSpacing: "-1px" }}>
        Three Steps to Your Spreadsheet
      </h2>
      <div style={{ display: "flex", gap: 0, maxWidth: 900, margin: "0 auto", justifyContent: "center", flexWrap: "wrap" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: "1 1 240px", padding: "0 24px", position: "relative", textAlign: "center" }}>
            {i < STEPS.length - 1 && (
              <div style={{ position: "absolute", top: 28, right: -10, width: 20, height: 2, background: "rgba(59,130,246,0.3)" }} />
            )}
            <div style={{
              width: 56, height: 56, borderRadius: "50%", margin: "0 auto 24px",
              background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.2))",
              border: "1px solid rgba(59,130,246,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "#3b82f6",
            }}>{s.num}</div>
            <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}