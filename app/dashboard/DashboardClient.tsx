"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { primaryBtn } from "@/lib/styles";
import { LogOut, FileText, Zap, Crown, Building2 } from "lucide-react";

// ============================================================
// TYPES
// ============================================================

type Profile = {
  email: string;
  plan: string;
  conversions_used: number;
  conversions_limit: number;
  period_start: string;
};

type Plan = {
  name: string;
  price: string;
  limit: number;
  icon: React.ReactNode;
  features: string[];
  highlight: boolean;
};

// ============================================================
// CONSTANTS
// ============================================================

const PLAN_META: Record<string, { label: string; color: string; bg: string }> = {
  free:         { label: "Free",         color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
  starter:      { label: "Starter",      color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  professional: { label: "Professional", color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
  business:     { label: "Business",     color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
};

const UPGRADE_PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$10/mo",
    limit: 50,
    icon: <Zap style={{ width: 18, height: 18 }} />,
    features: ["50 conversions/month", "Bank & Credit Card PDFs", "Excel export"],
    highlight: false,
  },
  {
    name: "Professional",
    price: "$25/mo",
    limit: 200,
    icon: <Crown style={{ width: 18, height: 18 }} />,
    features: ["200 conversions/month", "Bank & Credit Card PDFs", "Priority support"],
    highlight: true,
  },
  {
    name: "Business",
    price: "$60/mo",
    limit: 9999,
    icon: <Building2 style={{ width: 18, height: 18 }} />,
    features: ["Unlimited conversions", "Dedicated support", "API access"],
    highlight: false,
  },
];

// ============================================================
// HELPERS
// ============================================================

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = limit >= 9999 ? 0 : Math.min((used / limit) * 100, 100);
  const color = pct >= 90 ? "#f87171" : pct >= 70 ? "#fbbf24" : "#10b981";

  return (
    <div>
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginBottom: 8, fontSize: 13,
      }}>
        <span style={{ color: "#94a3b8" }}>Conversions used this month</span>
        <span style={{ color, fontWeight: 700 }}>
          {limit >= 9999 ? `${used} / ∞` : `${used} / ${limit}`}
        </span>
      </div>
      <div style={{
        height: 8, borderRadius: 99,
        background: "rgba(255,255,255,0.07)", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 99,
          width: limit >= 9999 ? "10%" : `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function DashboardClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const meta = PLAN_META[profile.plan] ?? PLAN_META.free;
  const isFree = profile.plan === "free";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "28px 28px",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#090b18",
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: "#fff", padding: "40px 5%",
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 22 }}>
              Financial<span style={{ color: "#3b82f6" }}>Audit</span>
            </span>
            <p style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>
              Welcome back, {profile.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", borderRadius: 10,
              padding: "10px 18px", cursor: "pointer", fontSize: 14,
            }}
          >
            <LogOut style={{ width: 16, height: 16 }} /> Sign out
          </button>
        </div>

        {/* ── Top cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20, marginBottom: 24,
        }}>

          {/* Plan card */}
          <div style={cardStyle}>
            <p style={{ color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
              Current Plan
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: meta.bg, borderRadius: 8,
              padding: "6px 14px", marginBottom: 16,
            }}>
              <span style={{ color: meta.color, fontWeight: 700, fontSize: 15 }}>
                {meta.label}
              </span>
            </div>
            <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.6 }}>
              {isFree
                ? "You're on the free plan. Upgrade to unlock more conversions."
                : `Active subscription. Renews on ${new Date(profile.period_start).toLocaleDateString("en-US", { month: "long", day: "numeric" })}.`
              }
            </p>
          </div>

          {/* Usage card */}
          <div style={cardStyle}>
            <p style={{ color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
              Usage
            </p>
            <UsageBar used={profile.conversions_used} limit={profile.conversions_limit} />
            {profile.conversions_used >= profile.conversions_limit && profile.conversions_limit < 9999 && (
              <p style={{ color: "#f87171", fontSize: 13, marginTop: 12 }}>
                ⚠️ You've reached your limit. Upgrade to keep converting.
              </p>
            )}
          </div>

          {/* Quick action card */}
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20 }}>
            <div>
              <p style={{ color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                Converter
              </p>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
                Upload a PDF and get your Excel file instantly.
              </p>
            </div>
            <button
              onClick={() => router.push("/convert")}
              style={{
                ...primaryBtn,
                border: "none", padding: "12px 0", borderRadius: 12,
                fontSize: 15, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8, width: "100%",
              }}
            >
              <FileText style={{ width: 18, height: 18 }} />
              Go to Converter
            </button>
          </div>
        </div>

        {/* ── Upgrade section (solo si es free) ── */}
        {isFree && (
          <div style={{ ...cardStyle, marginTop: 8 }}>
            <p style={{ color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
              Upgrade Your Plan
            </p>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
              Choose a plan to unlock more conversions.
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}>
              {UPGRADE_PLANS.map((p, i) => (
                <div key={i} style={{
                  background: p.highlight
                    ? "linear-gradient(160deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08))"
                    : "rgba(255,255,255,0.02)",
                  border: p.highlight
                    ? "1px solid rgba(59,130,246,0.4)"
                    : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16, padding: "24px 20px", position: "relative",
                }}>
                  {p.highlight && (
                    <div style={{
                      position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(90deg,#3b82f6,#10b981)",
                      color: "#fff", fontSize: 11, fontWeight: 700,
                      padding: "3px 14px", borderRadius: 999, letterSpacing: 1,
                      whiteSpace: "nowrap",
                    }}>MOST POPULAR</div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, color: "#94a3b8" }}>
                    {p.icon}
                    <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 16 }}>{p.name}</span>
                  </div>
                  <p style={{ color: "#3b82f6", fontWeight: 800, fontSize: 22, marginBottom: 16 }}>{p.price}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {p.features.map((f, j) => (
                      <li key={j} style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => alert("Stripe coming soon!")}
                    style={{
                      width: "100%", padding: "11px 0",
                      fontSize: 14,
                      ...(p.highlight
                        ? { ...primaryBtn, border: "none", boxShadow: "none" }
                        : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }
                      ),
                    }}
                  >
                    Choose {p.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}