"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import axios from "axios";
import { 
  UploadCloud, 
  FileText, 
  XCircle, 
  Loader2, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  // State for response feedback
  const [detectedType, setDetectedType] = useState<string>("");
  const [detectedBank, setDetectedBank] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- DROPZONE LOGIC ---
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("⚠️ Only PDF files are supported for now.");
      return;
    }
    setFile(selectedFile);
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

  // --- AUTO CONVERSION LOGIC ---
  const handleConvert = async () => {
    if (!file || loading) return;

    setLoading(true);
    setError("");
    setDetectedType("");
    setDetectedBank("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("📤 Sending file to /api/convert-auto...");
      
      const response = await axios.post("/api/convert-auto", formData, {
        responseType: "blob", // Important for handling the Excel file
      });

      // Extract metadata from headers (Now matching the English backend)
      const documentType = response.headers["x-document-type"] || "Unknown";
      const bankName = response.headers["x-bank-name"] || "Unknown";

      // Map backend types (CREDIT/BANK) to UI text
      const typeLabel = documentType === "CREDIT" ? "Credit Card" : "Bank Statement";
      
      setDetectedType(typeLabel);
      setDetectedBank(bankName);

      console.log(`✅ Document processed: ${documentType} - ${bankName}`);

      // Download file
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Update naming logic to check for "CREDIT"
      const fileName = documentType === "CREDIT" 
        ? `CreditCard_${bankName}.xlsx`
        : `BankStatement_${bankName}.xlsx`;
      
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      
    } catch (err: any) {
      console.error("❌ Error:", err);
      
      // Handle backend errors
      if (err.response?.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result as string);
            // Updated to read 'details' instead of 'detalle'
            setError(errorData.error || "Error processing PDF");
            
            if (errorData.details) {
              console.warn("Details:", errorData.details);
            }
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

  // --- UI RENDER ---
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0F172A] to-blue-900 flex items-center justify-center p-4 sm:p-8 antialiased">
      
      {/* Main Container Glassmorphism */}
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 p-8 sm:p-10 text-white">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            Financial Audit
          </h1>
          <p className="text-slate-300 text-lg max-w-lg mx-auto leading-relaxed">
            Upload your bank PDF. We'll automatically detect if it's a Credit Card summary or a Bank Statement.
          </p>
        </div>

        {/* --- DROPZONE AREA --- */}
        <div 
          className={`relative border-3 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out group cursor-pointer
            ${isDragging ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' : 'border-slate-600 hover:border-slate-400 hover:bg-white/5'}
            ${file ? 'bg-emerald-500/5 border-emerald-500/50 border-solid' : ''}
          `}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            hidden 
            ref={fileInputRef} 
            accept=".pdf" 
            onChange={handleFileChange} 
          />
          
          {!file ? (
            // Empty State
            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <div className={`p-4 rounded-full bg-slate-800/50 transition-transform group-hover:scale-110 ${isDragging ? 'animate-bounce' : ''}`}>
                <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-slate-200">
                  Drag & Drop your PDF here
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  or click to browse files
                </p>
              </div>
            </div>
          ) : (
            // File Loaded State
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <FileText className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-white truncate max-w-[250px] sm:max-w-md">
                    {file.name}
                  </p>
                  <p className="text-sm text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Ready to process
                  </p>
                </div>
              </div>
              {!loading && (
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-red-400"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Status Messages (Error / Loading) */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-6 p-5 bg-blue-500/20 border border-blue-500/50 rounded-xl flex flex-col items-center justify-center gap-3 text-blue-200 animate-in fade-in">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <p className="text-lg font-semibold">Analyzing your document...</p>
            <p className="text-xs opacity-80">Detecting type and extracting data...</p>
          </div>
        )}

        {/* --- CONVERSION BUTTON --- */}
        <div className="mt-8">
          <button
            onClick={handleConvert}
            disabled={!file || loading}
            className={`
              w-full p-6 rounded-2xl font-bold text-lg transition-all duration-300
              ${(!file || loading) 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
              }
              flex items-center justify-center gap-3
              focus:outline-none focus:ring-4 focus:ring-blue-500/50
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="w-6 h-6" />
                Auto-Convert to Excel
              </>
            )}
          </button>

          {/* Feedback of detected type */}
          {detectedType && !loading && (
            <div className="mt-4 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 text-emerald-200">
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <p className="font-semibold">✅ {detectedType}</p>
                  <p className="text-sm opacity-80">{detectedBank}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <p className="absolute bottom-4 text-slate-500 text-xs text-center w-full">
        © 2026 ConvertBank. All rights reserved.
      </p>
    </main>
  );
}