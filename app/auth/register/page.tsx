"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { primaryBtn, card } from "@/lib/styles";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#fff", fontSize: 15,
    outline: "none", boxSizing: "border-box" as const,
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#090b18",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif", padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 800, fontSize: 24, color: "#fff" }}>
              Financial<span style={{ color: "#3b82f6" }}>Audit</span>
            </span>
          </Link>
          <p style={{ color: "#475569", marginTop: 8, fontSize: 15 }}>
            Create your account
          </p>
        </div>

        <div style={{ ...card, padding: "36px 32px" }}>

          {success ? (
            // Mensaje de confirmación
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <CheckCircle2 style={{ width: 48, height: 48, color: "#10b981", margin: "0 auto 16px" }} />
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>
                Check your email
              </h3>
              <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15 }}>
                We sent a confirmation link to <strong style={{ color: "#94a3b8" }}>{email}</strong>.
                Click it to activate your account.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  onKeyDown={e => e.key === "Enter" && handleRegister()}
                  style={inputStyle}
                />
              </div>

              {error && (
                <div style={{
                  marginBottom: 20, padding: "12px 16px",
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 10, display: "flex", alignItems: "center", gap: 10,
                }}>
                  <AlertCircle style={{ width: 16, height: 16, color: "#f87171", flexShrink: 0 }} />
                  <p style={{ color: "#fca5a5", fontSize: 13, margin: 0 }}>{error}</p>
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={loading || !email || !password}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 12,
                  fontSize: 16, display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8,
                  ...(loading || !email || !password
                    ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "#334155", cursor: "not-allowed" }
                    : { ...primaryBtn, border: "none" }
                  ),
                }}
              >
                {loading
                  ? <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Creating account...</>
                  : "Create Account"
                }
              </button>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 24, color: "#475569", fontSize: 14 }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}