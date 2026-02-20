"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import { primaryBtn } from "@/lib/styles";
import {
  UploadCloud, FileText, XCircle,
  Loader2, AlertCircle, CheckCircle2,
  LayoutDashboard, LogOut,
} from "lucide-react";

export default function ConvertPage() {
  const router = useRouter();

  // ── Converter state ──
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [detectedType, setDetectedType] = useState("");
  const [detectedBank, setDetectedBank] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handlers ──
  const validateAndSetFile = (f: File) => {
    if (f.type !== "application/pdf") {
      setError("⚠️ Only PDF files are supported for now.");
      return;
    }
    setFile(f);
    setError("");
    setDetectedType("");
    setDetectedBank("");
  };

  const removeFile = () => {
    setFile(null);
    setError("");
    setDetectedType("");
    setDetectedBank("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragOver  = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const onDrop      = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };

  // ── Convert ──
  const handleConvert = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError("");
    setDetectedType("");
    setDetectedBank("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/convert-auto", formData, { responseType: "blob" });

      const docType  = response.headers["x-document-type"] || "Unknown";
      const bankName = response.headers["x-bank-name"]     || "Unknown";

      setDetectedType(docType === "CREDIT" ? "Credit Card" : "Bank Statement");
      setDetectedBank(bankName);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", docType === "CREDIT"
        ? `CreditCard_${bankName}.xlsx`
        : `BankStatement_${bankName}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (err: any) {
      if (err.response?.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const e = JSON.parse(reader.result as string);
            setError(e.error || "Error processing PDF");
          } catch {
            setError("Error processing PDF with AI.");
          }
        };
        reader.readAsText(err.response.data);
      } else {
        setError(err.message || "Error processing PDF with AI.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  // ── Styles ──
  const dropzoneBorder = isDragging
    ? "2px dashed #3b82f6"
    : file
    ? "2px solid rgba(16,185,129,0.5)"
    : "2px dashed rgba(100,116,139,0.5)";

  const dropzoneBg = isDragging
    ? "rgba(59,130,246,0.08)"
    : file
    ? "rgba(16,185,129,0.04)"
    : "rgba(255,255,255,0.02)";

  return (
    <div style={{
      minHeight: "100vh", background: "#090b18",
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: "#fff", display: "flex", flexDirection: "column",
    }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: 64, flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(9,11,24,0.85)", backdropFilter: "blur(16px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <span
          style={{ fontWeight: 800, fontSize: 20, cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          Financial<span style={{ color: "#3b82f6" }}>Audit</span>
        </span>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", borderRadius: 10,
              padding: "9px 16px", cursor: "pointer", fontSize: 14,
            }}
          >
            <LayoutDashboard style={{ width: 15, height: 15 }} /> Dashboard
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#475569", borderRadius: 10,
              padding: "9px 16px", cursor: "pointer", fontSize: 14,
            }}
          >
            <LogOut style={{ width: 15, height: 15 }} /> Sign out
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 5%",
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900,
            color: "#fff", letterSpacing: "-1px", marginBottom: 10,
          }}>
            Convert your PDF
          </h1>
          <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.6 }}>
            Drop your bank statement or credit card summary below.
          </p>
        </div>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: 580,
          background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 28, padding: "36px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}>

          {/* Dropzone */}
          <div
            style={{
              border: dropzoneBorder, borderRadius: 16, padding: "32px 24px",
              background: dropzoneBg, transition: "all 0.25s",
              cursor: file ? "default" : "pointer",
            }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input type="file" hidden ref={fileInputRef} accept=".pdf" onChange={handleFileChange} />

            {!file ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "12px 0" }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: "rgba(59,130,246,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <UploadCloud style={{ width: 26, height: 26, color: isDragging ? "#3b82f6" : "#64748b" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>
                    Drag & Drop your PDF here
                  </p>
                  <p style={{ fontSize: 14, color: "#475569" }}>or click to browse files</p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: "rgba(16,185,129,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <FileText style={{ width: 22, height: 22, color: "#10b981" }} />
                  </div>
                  <div>
                    <p style={{
                      fontWeight: 600, color: "#fff", fontSize: 15,
                      maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: 13, color: "#10b981", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <CheckCircle2 style={{ width: 13, height: 13 }} /> Ready to process
                    </p>
                  </div>
                </div>
                {!loading && (
                  <button
                    onClick={e => { e.stopPropagation(); removeFile(); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8 }}
                  >
                    <XCircle style={{ width: 22, height: 22, color: "#475569" }} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 18, padding: "13px 16px",
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 12, display: "flex", alignItems: "center", gap: 12,
            }}>
              <AlertCircle style={{ width: 18, height: 18, color: "#f87171", flexShrink: 0 }} />
              <p style={{ fontSize: 14, color: "#fca5a5", margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{
              marginTop: 18, padding: "18px",
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: 12, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 8,
            }}>
              <Loader2 style={{ width: 26, height: 26, color: "#3b82f6", animation: "spin 1s linear infinite" }} />
              <p style={{ fontWeight: 600, color: "#93c5fd", margin: 0 }}>Analyzing your document...</p>
              <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>Detecting type and extracting data...</p>
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleConvert}
            disabled={!file || loading}
            style={{
              marginTop: 22, width: "100%", padding: "17px 0",
              borderRadius: 14, fontSize: 17, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.25s", cursor: !file || loading ? "not-allowed" : "pointer",
              ...((!file || loading)
                ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "#334155" }
                : { ...primaryBtn, border: "none" }
              ),
            }}
          >
            {loading
              ? <><Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} /> Processing...</>
              : <><FileText style={{ width: 20, height: 20 }} /> Auto-Convert to Excel</>
            }
          </button>

          {/* Success */}
          {detectedType && !loading && (
            <div style={{
              marginTop: 14, padding: "14px 18px",
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 12, display: "flex", alignItems: "center", gap: 12,
            }}>
              <CheckCircle2 style={{ width: 20, height: 20, color: "#10b981", flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600, color: "#6ee7b7", margin: 0 }}>{detectedType} detected</p>
                <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>{detectedBank}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}