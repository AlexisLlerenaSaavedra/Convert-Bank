// "use client";

// import { useState, useRef, DragEvent } from "react";
// import axios from "axios";
// import { 
//   UploadCloud, 
//   FileText, 
//   XCircle, 
//   CreditCard, 
//   Landmark, 
//   Loader2, 
//   AlertCircle,
//   CheckCircle2
// } from "lucide-react";

// export default function Home() {
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // --- LÓGICA DE DROPZONE ---
//   const onDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const onDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const droppedFile = e.dataTransfer.files[0];
//     validateAndSetFile(droppedFile);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       validateAndSetFile(e.target.files[0]);
//     }
//   };

//   const validateAndSetFile = (selectedFile: File) => {
//     if (selectedFile.type !== "application/pdf") {
//       setError("⚠️ Solo admitimos archivos PDF por ahora.");
//       return;
//     }
//     setFile(selectedFile);
//     setError("");
//   };

//   const removeFile = () => {
//     setFile(null);
//     setError("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // --- LÓGICA DE CONVERSIÓN (Igual que antes) ---
//   const handleConvert = async (tipo: "credito" | "cuenta") => {
//     if (!file || loading) return;

//     setLoading(true);
//     setError("");
    
//     const formData = new FormData();
//     formData.append("file", file);

//     const endpoint = tipo === "credito" ? "/api/convert-credito" : "/api/convert-cuenta";

//     try {
//       const response = await axios.post(endpoint, formData, {
//         responseType: "blob",
//       });

//       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       const tipoTexto = tipo === "credito" ? "Credito" : "Cuenta";
//       link.setAttribute("download", `Resumen_${tipoTexto}_${file.name.replace('.pdf', '')}.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       window.URL.revokeObjectURL(url);
//       link.remove();
      
//     } catch (err: any) {
//       console.error("Error:", err);
//       const errorMsg = err.response?.data?.error || "Error al procesar el PDF con la IA.";
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- UI RENDER ---
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0F172A] to-blue-900 flex items-center justify-center p-4 sm:p-8 antialiased">
      
//       {/* Contenedor Principal Glassmorphism */}
//       <div className="w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 p-8 sm:p-10 text-white">
        
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
//             Auditoría Financiera
//           </h1>
//           <p className="text-slate-300 text-lg max-w-lg mx-auto leading-relaxed">
//             Transforma tus aburridos PDFs bancarios en reportes de Excel inteligentes en segundos.
//           </p>
//         </div>

//         {/* --- DROPZONE AREA --- */}
//         <div 
//           className={`relative border-3 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out group cursor-pointer
//             ${isDragging ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' : 'border-slate-600 hover:border-slate-400 hover:bg-white/5'}
//             ${file ? 'bg-emerald-500/5 border-emerald-500/50 border-solid' : ''}
//           `}
//           onDragOver={onDragOver}
//           onDragLeave={onDragLeave}
//           onDrop={onDrop}
//           onClick={() => !file && fileInputRef.current?.click()}
//         >
//           <input 
//             type="file" 
//             hidden 
//             ref={fileInputRef} 
//             accept=".pdf" 
//             onChange={handleFileChange} 
//           />
          
//           {!file ? (
//             // Estado Vacio
//             <div className="flex flex-col items-center justify-center gap-4 py-6">
//               <div className={`p-4 rounded-full bg-slate-800/50 transition-transform group-hover:scale-110 ${isDragging ? 'animate-bounce' : ''}`}>
//                 <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
//               </div>
//               <div className="text-center">
//                 <p className="text-lg font-medium text-slate-200">
//                   Arrastra tu PDF aquí
//                 </p>
//                 <p className="text-sm text-slate-400 mt-1">
//                   o haz clic para explorar archivos
//                 </p>
//               </div>
//             </div>
//           ) : (
//             // Estado Archivo Cargado
//             <div className="flex items-center justify-between p-2">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-emerald-500/20 rounded-xl">
//                   <FileText className="w-8 h-8 text-emerald-400" />
//                 </div>
//                 <div className="flex flex-col">
//                   <p className="text-lg font-semibold text-white truncate max-w-[250px] sm:max-w-md">
//                     {file.name}
//                   </p>
//                   <p className="text-sm text-emerald-400 flex items-center gap-1">
//                     <CheckCircle2 className="w-4 h-4" /> Listo para procesar
//                   </p>
//                 </div>
//               </div>
//               {!loading && (
//                 <button 
//                   onClick={(e) => { e.stopPropagation(); removeFile(); }}
//                   className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-red-400"
//                 >
//                   <XCircle className="w-6 h-6" />
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Mensajes de Estado (Error / Loading) */}
//         {error && (
//           <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-bottom-2">
//             <AlertCircle className="w-6 h-6 shrink-0" />
//             <p className="text-sm font-medium">{error}</p>
//           </div>
//         )}

//         {loading && (
//           <div className="mt-6 p-5 bg-blue-500/20 border border-blue-500/50 rounded-xl flex flex-col items-center justify-center gap-3 text-blue-200 animate-in fade-in">
//             <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
//             <p className="text-lg font-semibold">Analizando tu documento...</p>
//             <p className="text-xs opacity-80">Esto puede tomar unos segundos dependiendo de la complejidad.</p>
//           </div>
//         )}

//         {/* --- TARJETAS DE ACCIÓN (Grid) --- */}
//         <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 transition-all duration-500 ${(!file || loading) ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
          
//           {/* Tarjeta Crédito */}
//           <button
//             onClick={() => handleConvert("credito")}
//             className="group relative p-6 bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 border border-purple-500/30 hover:border-purple-400 rounded-2xl text-left transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.4)] focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-hidden"
//           >
//             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all"></div>
//             <CreditCard className="w-10 h-10 text-purple-300 mb-4 group-hover:scale-110 transition-transform" />
//             <h3 className="text-xl font-bold text-purple-100 mb-1">Tarjeta de Crédito</h3>
//             <p className="text-sm text-purple-300/80">Detecta cuotas, vencimientos y total a pagar.</p>
//           </button>

//           {/* Tarjeta Cuenta */}
//           <button
//             onClick={() => handleConvert("cuenta")}
//             className="group relative p-6 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 hover:border-emerald-400 rounded-2xl text-left transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.4)] focus:outline-none focus:ring-2 focus:ring-emerald-500 overflow-hidden"
//           >
//             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all"></div>
//             <Landmark className="w-10 h-10 text-emerald-300 mb-4 group-hover:scale-110 transition-transform" />
//             <h3 className="text-xl font-bold text-emerald-100 mb-1">Cuenta Bancaria</h3>
//             <p className="text-sm text-emerald-300/80">Auditoría de ingresos, egresos y saldos.</p>
//           </button>

//         </div>
//       </div>
      
//       {/* Footer sutil */}
//       <p className="absolute bottom-4 text-slate-500 text-xs text-center w-full">
//         © 2026 ConvertBank. All rights reserved.
//       </p>
//     </main>
//   );
// }

"use client";

import { useState, useRef, DragEvent } from "react";
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
  const [tipoDetectado, setTipoDetectado] = useState<string>("");
  const [bancoDetectado, setBancoDetectado] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LÓGICA DE DROPZONE ---
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("⚠️ Solo admitimos archivos PDF por ahora.");
      return;
    }
    setFile(selectedFile);
    setError("");
    setTipoDetectado("");
    setBancoDetectado("");
  };

  const removeFile = () => {
    setFile(null);
    setError("");
    setTipoDetectado("");
    setBancoDetectado("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- LÓGICA DE CONVERSIÓN AUTOMÁTICA ---
  const handleConvert = async () => {
    if (!file || loading) return;

    setLoading(true);
    setError("");
    setTipoDetectado("");
    setBancoDetectado("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("📤 Enviando archivo a /api/convert-auto...");
      
      const response = await axios.post("/api/convert-auto", formData, {
        responseType: "blob",
      });

      // Extraer metadata de los headers
      const tipoDocumento = response.headers["x-document-type"] || "Desconocido";
      const nombreBanco = response.headers["x-bank-name"] || "Desconocido";

      // Actualizar estados para mostrar feedback
      const tipoTexto = tipoDocumento === "CREDITO" ? "Tarjeta de Crédito" : "Extracto Bancario";
      setTipoDetectado(`${tipoTexto}`);
      setBancoDetectado(nombreBanco);

      console.log(`✅ Documento procesado: ${tipoTexto} - ${nombreBanco}`);

      // Descargar archivo
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const nombreArchivo = tipoDocumento === "CREDITO" 
        ? `Tarjeta_${nombreBanco}.xlsx`
        : `Extracto_${nombreBanco}.xlsx`;
      
      link.setAttribute("download", nombreArchivo);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      
    } catch (err: any) {
      console.error("❌ Error:", err);
      
      // Manejar errores del backend
      if (err.response?.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result as string);
            setError(errorData.error || "Error al procesar el PDF");
            
            if (errorData.detalle) {
              console.warn("Detalle:", errorData.detalle);
            }
          } catch {
            setError("Error al procesar el PDF con la IA.");
          }
        };
        reader.readAsText(err.response.data);
      } else {
        setError(err.message || "Error al procesar el PDF con la IA.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- UI RENDER ---
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0F172A] to-blue-900 flex items-center justify-center p-4 sm:p-8 antialiased">
      
      {/* Contenedor Principal Glassmorphism */}
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 p-8 sm:p-10 text-white">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            Auditoría Financiera
          </h1>
          <p className="text-slate-300 text-lg max-w-lg mx-auto leading-relaxed">
            Sube tu PDF bancario y nosotros detectamos automáticamente si es tarjeta de crédito o extracto de cuenta.
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
            // Estado Vacio
            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <div className={`p-4 rounded-full bg-slate-800/50 transition-transform group-hover:scale-110 ${isDragging ? 'animate-bounce' : ''}`}>
                <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-slate-200">
                  Arrastra tu PDF aquí
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  o haz clic para explorar archivos
                </p>
              </div>
            </div>
          ) : (
            // Estado Archivo Cargado
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
                    <CheckCircle2 className="w-4 h-4" /> Listo para procesar
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

        {/* Mensajes de Estado (Error / Loading) */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-6 p-5 bg-blue-500/20 border border-blue-500/50 rounded-xl flex flex-col items-center justify-center gap-3 text-blue-200 animate-in fade-in">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <p className="text-lg font-semibold">Analizando tu documento...</p>
            <p className="text-xs opacity-80">Detectando tipo y extrayendo datos...</p>
          </div>
        )}

        {/* --- BOTÓN ÚNICO DE CONVERSIÓN --- */}
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
                Analizando documento...
              </>
            ) : (
              <>
                <FileText className="w-6 h-6" />
                Convertir a Excel Automáticamente
              </>
            )}
          </button>

          {/* Feedback de tipo detectado */}
          {tipoDetectado && !loading && (
            <div className="mt-4 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 text-emerald-200">
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <p className="font-semibold">✅ {tipoDetectado}</p>
                  <p className="text-sm opacity-80">{bancoDetectado}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer sutil */}
      <p className="absolute bottom-4 text-slate-500 text-xs text-center w-full">
        © 2026 ConvertBank. All rights reserved.
      </p>
    </main>
  );
}