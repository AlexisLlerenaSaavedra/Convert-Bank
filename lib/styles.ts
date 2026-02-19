// lib/styles.ts
export const card = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 20,
} as const;

export const gradientText = {
  background: "linear-gradient(90deg, #3b82f6, #10b981)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

export const primaryBtn = {
  background: "linear-gradient(135deg, #3b82f6, #10b981)",
  border: "none",
  color: "#fff",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: 700,
  boxShadow: "0 0 40px rgba(59,130,246,0.3)",
} as const;