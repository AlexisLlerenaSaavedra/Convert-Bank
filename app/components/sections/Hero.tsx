// ============================================================
// HERO
// ============================================================
import { DEMO_ROWS } from "@/lib/constants";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { card, primaryBtn, gradientText } from "@/lib/styles";
import router from "next/router";

export function Hero({ onConvertClick }: { onConvertClick: () => void }) {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "120px 5% 80px", textAlign: "center",
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
        borderRadius: 999, padding: "6px 16px", marginBottom: 32,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
        <span style={{ fontSize: 13, color: "#93c5fd", fontWeight: 500 }}>AI-Powered · Instant · Accurate</span>
      </div>

      <h1 style={{
        fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.1,
        color: "#fff", maxWidth: 800, margin: "0 auto 24px", letterSpacing: "-2px",
      }}>
        Convert Any Financial{" "}
        <span style={gradientText}>PDF to Excel</span>
        {" "}in Seconds
      </h1>

      <p style={{ fontSize: 20, color: "#94a3b8", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
        Upload your bank statement or credit card summary. Our AI auto-detects the document type and delivers a clean, structured Excel file instantly.
      </p>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 72 }}>
        <button
          onClick={() => router.push("/auth/register")}
          style={{ ...primaryBtn, padding: "16px 36px", fontSize: 17 }}
        >
          Start Converting — It's Free ↗
        </button>
        <a href="#how-it-works" style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#cbd5e1", borderRadius: 12,
          padding: "16px 36px", fontSize: 17, fontWeight: 600,
          textDecoration: "none", display: "inline-block",
        }}>
          See How It Works
        </a>
      </div>

      {/* Demo table */}
      <div style={{
        width: "100%", maxWidth: 700, ...card,
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>
        <div style={{
          padding: "14px 20px", display: "flex", alignItems: "center", gap: 8,
          background: "rgba(16,185,129,0.08)", borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <span style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>✅ Converted successfully</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748b" }}>BankStatement_Chase.xlsx</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["Date", "Description", "Amount", "Balance"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    color: "#475569", fontWeight: 600, fontSize: 12,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_ROWS.map((row, i) => (
                <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "12px 16px", color: "#94a3b8" }}>{row.date}</td>
                  <td style={{ padding: "12px 16px", color: "#cbd5e1" }}>{row.desc}</td>
                  <td style={{
                    padding: "12px 16px", fontWeight: 600,
                    color: row.amount.startsWith("+") ? "#10b981" : "#f87171",
                  }}>{row.amount}</td>
                  <td style={{ padding: "12px 16px", color: "#94a3b8" }}>{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}