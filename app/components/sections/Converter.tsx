// ============================================================
// CONVERTER (your original component, integrated)
// ============================================================
import axios from "axios";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { card, primaryBtn, gradientText } from "@/lib/styles";
import {
  UploadCloud,
  FileText,
  XCircle,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function Converter({ sectionRef }: { sectionRef: React.RefObject<HTMLElement|null> }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [detectedType, setDetectedType] = useState("");
  const [detectedBank, setDetectedBank] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };

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

      const docType = response.headers["x-document-type"] || "Unknown";
      const bankName = response.headers["x-bank-name"] || "Unknown";

      setDetectedType(docType === "CREDIT" ? "Credit Card" : "Bank Statement");
      setDetectedBank(bankName);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", docType === "CREDIT" ? `CreditCard_${bankName}.xlsx` : `BankStatement_${bankName}.xlsx`);
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
    <section
      ref={sectionRef}
      id="converter"
      style={{
        padding: "100px 5%",
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}
    >
      {/* Section header */}
      <p style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
        Converter
      </p>
      <h2 style={{
        fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#fff",
        marginBottom: 16, letterSpacing: "-1px", textAlign: "center",
      }}>
        Try It Now
      </h2>
      <p style={{ color: "#64748b", marginBottom: 56, textAlign: "center", maxWidth: 480, lineHeight: 1.7 }}>
        Upload your PDF and get your Excel file in seconds. No sign-up required for your first 3 conversions.
      </p>

      {/* Converter card */}
      <div style={{
        width: "100%", maxWidth: 620,
        background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 28, padding: "40px 40px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
      }}>
        {/* Dropzone */}
        <div
          style={{
            border: dropzoneBorder,
            borderRadius: 16, padding: "32px 24px",
            background: dropzoneBg,
            transition: "all 0.25s",
            cursor: file ? "default" : "pointer",
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input type="file" hidden ref={fileInputRef} accept=".pdf" onChange={handleFileChange} />

          {!file ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "16px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(59,130,246,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <UploadCloud style={{ width: 28, height: 28, color: isDragging ? "#3b82f6" : "#64748b" }} />
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
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "rgba(16,185,129,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FileText style={{ width: 24, height: 24, color: "#10b981" }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: "#fff", fontSize: 15, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
            marginTop: 20, padding: "14px 18px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12, display: "flex", alignItems: "center", gap: 12,
          }}>
            <AlertCircle style={{ width: 20, height: 20, color: "#f87171", flexShrink: 0 }} />
            <p style={{ fontSize: 14, color: "#fca5a5", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            marginTop: 20, padding: "20px",
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: 12, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 10,
          }}>
            <Loader2 style={{ width: 28, height: 28, color: "#3b82f6", animation: "spin 1s linear infinite" }} />
            <p style={{ fontWeight: 600, color: "#93c5fd", margin: 0 }}>Analyzing your document...</p>
            <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>Detecting type and extracting data...</p>
          </div>
        )}

        {/* Convert button */}
        <button
          onClick={handleConvert}
          disabled={!file || loading}
          style={{
            marginTop: 24, width: "100%", padding: "18px 0",
            borderRadius: 14, fontSize: 17, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "all 0.25s", cursor: !file || loading ? "not-allowed" : "pointer",
            ...((!file || loading)
              ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "#334155" }
              : { ...primaryBtn, border: "none", padding: "18px 0" }),
          }}
        >
          {loading ? (
            <><Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} /> Processing...</>
          ) : (
            <><FileText style={{ width: 20, height: 20 }} /> Auto-Convert to Excel</>
          )}
        </button>

        {/* Success feedback */}
        {detectedType && !loading && (
          <div style={{
            marginTop: 16, padding: "16px 20px",
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
    </section>
  );
}