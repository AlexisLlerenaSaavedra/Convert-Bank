// ============================================================
// PRICING
// ============================================================
import { PLANS } from "@/lib/constants";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { card, primaryBtn, gradientText } from "@/lib/styles";

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" style={{ padding: "100px 5%", textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Pricing</p>
      <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-1px" }}>
        Simple, Transparent Pricing
      </h2>
      <p style={{ color: "#64748b", marginBottom: 40, lineHeight: 1.7 }}>Scale as your needs grow. No hidden fees.</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 56 }}>
        <span style={{ color: yearly ? "#475569" : "#f1f5f9", fontWeight: 600, fontSize: 15 }}>Monthly</span>
        <div
          onClick={() => setYearly(y => !y)}
          style={{
            width: 52, height: 28, borderRadius: 99,
            background: yearly ? "#3b82f6" : "rgba(255,255,255,0.1)",
            position: "relative", cursor: "pointer", transition: "background 0.3s",
          }}
        >
          <div style={{
            position: "absolute", top: 4, left: yearly ? 28 : 4,
            width: 20, height: 20, borderRadius: "50%",
            background: "#fff", transition: "left 0.3s",
          }} />
        </div>
        <span style={{ color: yearly ? "#f1f5f9" : "#475569", fontWeight: 600, fontSize: 15 }}>
          Yearly <span style={{ color: "#10b981", fontSize: 12, fontWeight: 700 }}>Save 25%</span>
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
        {PLANS.map((p, i) => {
          const price = yearly ? Math.round(p.monthlyPrice * 12 * 0.75) : p.monthlyPrice;
          const period = yearly ? "/year" : "/month";
          return (
            <div key={i} style={{
              background: p.highlight
                ? "linear-gradient(160deg, rgba(59,130,246,0.15), rgba(16,185,129,0.1))"
                : "rgba(255,255,255,0.03)",
              border: p.highlight ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24, padding: "40px 32px", textAlign: "left", position: "relative",
            }}>
              {p.highlight && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(90deg,#3b82f6,#10b981)",
                  color: "#fff", fontSize: 12, fontWeight: 700,
                  padding: "4px 18px", borderRadius: 999, letterSpacing: 1,
                }}>MOST POPULAR</div>
              )}
              <p style={{ color: "#94a3b8", fontWeight: 600, fontSize: 14, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{p.name}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: "#fff" }}>${price}</span>
                <span style={{ color: "#475569", fontSize: 15 }}>{period}</span>
              </div>
              <p style={{ color: "#475569", fontSize: 14, marginBottom: 28 }}>{p.desc}</p>
              <button style={{
                width: "100%", padding: "14px 0", fontSize: 15, marginBottom: 28,
                ...(p.highlight
                  ? { ...primaryBtn, border: "none", boxShadow: "none" }
                  : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }),
              }}>Get Started</button>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "center", gap: 10, color: "#94a3b8", fontSize: 14 }}>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}