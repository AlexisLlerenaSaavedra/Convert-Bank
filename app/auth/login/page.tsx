"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { primaryBtn, card } from "@/lib/styles";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
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
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{ ...card, padding: "36px 32px" }}>

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%", padding: "12px 16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, color: "#fff", fontSize: 15,
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%", padding: "12px 16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, color: "#fff", fontSize: 15,
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Error */}
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

          {/* Button */}
          <button
            onClick={handleLogin}
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
              ? <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Signing in...</>
              : "Sign In"
            }
          </button>
        </div>

        {/* Footer link */}
        <p style={{ textAlign: "center", marginTop: 24, color: "#475569", fontSize: 14 }}>
          Don't have an account?{" "}
          <Link href="/auth/register" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}