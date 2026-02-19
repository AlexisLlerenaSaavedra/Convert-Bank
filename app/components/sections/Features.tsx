// ============================================================
// FEATURES
// ============================================================
import { FEATURES } from "@/lib/constants";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { card, primaryBtn, gradientText } from "@/lib/styles";

export function Features() {
  return (
    <section id="features" style={{ padding: "100px 5%", textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Why Choose Us</p>
      <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-1px" }}>
        Built for Financial Professionals
      </h2>
      <p style={{ color: "#64748b", maxWidth: 500, margin: "0 auto 64px", lineHeight: 1.7 }}>
        Everything you need to process financial documents efficiently, accurately, and securely.
      </p>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
        gap: 24, maxWidth: 1100, margin: "0 auto",
      }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{ ...card, padding: "36px 28px", textAlign: "left", transition: "border-color 0.3s, transform 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14, fontSize: 24,
              background: "rgba(59,130,246,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
            }}>{f.icon}</div>
            <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
            <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}