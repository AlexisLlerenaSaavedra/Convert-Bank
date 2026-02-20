"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { primaryBtn } from "@/lib/styles";
import { supabase } from "@/lib/supabase";

export function Navbar({ onConvertClick }: { onConvertClick: () => void }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Chequea sesión al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Escucha cambios de sesión en tiempo real (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(9,11,24,0.85)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 5%", height: 64,
    }}>
      {/* Logo */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => router.push("/")}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, #3b82f6, #10b981)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>📊</div>
        <span style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.5px" }}>
          Financial<span style={{ color: "#3b82f6" }}>Audit</span>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 28 }}>
        {NAV_LINKS.map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{
            color: "#94a3b8", fontSize: 14, fontWeight: 500, textDecoration: "none",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
          >{l}</a>
        ))}
      </div>

      {/* CTA buttons — cambian según sesión */}
      <div style={{ display: "flex", gap: 12 }}>
        {isLoggedIn ? (
          // Usuario logueado
          <>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#cbd5e1", borderRadius: 8,
                padding: "8px 18px", fontSize: 14,
                cursor: "pointer", fontWeight: 500,
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/convert")}
              style={{ ...primaryBtn, padding: "8px 18px", fontSize: 14, boxShadow: "none" }}
            >
              Go to Converter
            </button>
          </>
        ) : (
          // Usuario no logueado
          <>
            <button
              onClick={() => router.push("/auth/login")}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#cbd5e1", borderRadius: 8,
                padding: "8px 18px", fontSize: 14,
                cursor: "pointer", fontWeight: 500,
              }}
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/auth/register")}
              style={{ ...primaryBtn, padding: "8px 18px", fontSize: 14, boxShadow: "none" }}
            >
              Get Started Free
            </button>
          </>
        )}
      </div>
    </nav>
  );
}