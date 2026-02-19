// ============================================================
// FAQ
// ============================================================
import { FAQS } from "@/lib/constants";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { card, primaryBtn, gradientText } from "@/lib/styles";



export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: "100px 5%", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <p style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>FAQ</p>
        <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>Common Questions</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FAQS.map((f, i) => (
          <div key={i} style={{
            ...card,
            overflow: "hidden",
            borderColor: open === i ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.08)",
            transition: "border-color 0.3s",
          }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%", padding: "20px 24px", textAlign: "left",
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 16 }}>{f.q}</span>
              <span style={{
                color: "#3b82f6", fontSize: 22, fontWeight: 300, flexShrink: 0, marginLeft: 16,
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s",
                display: "inline-block",
              }}>+</span>
            </button>
            {open === i && (
              <p style={{ padding: "0 24px 20px", color: "#64748b", lineHeight: 1.8, fontSize: 15, margin: 0 }}>
                {f.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}