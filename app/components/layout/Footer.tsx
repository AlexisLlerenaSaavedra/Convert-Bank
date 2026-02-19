// ============================================================
// FOOTER
// ============================================================

export function Footer() {
  return (
    <footer style={{
      padding: "48px 5%", borderTop: "1px solid rgba(255,255,255,0.07)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: "linear-gradient(135deg,#3b82f6,#10b981)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
        }}>📊</div>
        <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>
          Financial<span style={{ color: "#3b82f6" }}>Audit</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 32 }}>
        {["Privacy Policy", "Terms", "Contact"].map(l => (
          <a key={l} href="#" style={{ color: "#475569", fontSize: 14, textDecoration: "none" }}>{l}</a>
        ))}
      </div>
      <p style={{ color: "#334155", fontSize: 13, margin: 0 }}>© 2026 FinancialAudit. All rights reserved.</p>
    </footer>
  );
}