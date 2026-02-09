import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ExcelJS from "exceljs";

// ⚠️ RECUERDA USAR TU API KEY REAL AQUÍ
const API_KEY = process.env.GEMINI_API_KEY as string;
if (!API_KEY) {
  throw new Error("Falta la GEMINI_API_KEY en las variables de entorno");
}

// ✨ DICCIONARIO DE TRADUCCIONES (Solo para la Tabla de Auditoría)
const traducciones: Record<string, any> = {
  es: {
    // Nuevos Títulos simplificados
    titulo_espejo: "📋 MOVIMIENTOS REGISTRADOS (ORIGINAL)", // Más sobrio
    titulo_auditoria: "🧠 ANÁLISIS", // Simple, como pediste
    
    // Encabezados Normalizados (Sin Categoría)
    norm_fecha: "FECHA STD",
    norm_desc: "DESCRIPCIÓN",
    norm_egreso: "EGRESO (-)",
    norm_ingreso: "INGRESO (+)",
    norm_saldo: "SALDO CALC."
  },
  en: {
    titulo_espejo: "📋 REGISTERED TRANSACTIONS (ORIGINAL)",
    titulo_auditoria: "🧠 ANALYSIS",
    norm_fecha: "STD DATE",
    norm_desc: "DESCRIPTION",
    norm_egreso: "OUTFLOW (-)",
    norm_ingreso: "INFLOW (+)",
    norm_saldo: "CALC. BALANCE"
  }
};

function obtenerTraduccion(idioma: string): any {
  return traducciones[idioma] || traducciones["es"];
}

export async function POST(req: NextRequest) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No hay archivo" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 🔥 PROMPT DUAL: ESPEJO + ANÁLISIS
    const prompt = `
      Eres un Auditor Financiero. Procesa este extracto bancario en DOS NIVELES.

      NIVEL 1: TRANSCRIPCIÓN FIEL (ESPEJO)
      - Identifica las columnas EXACTAS del PDF.
      - Extrae las filas tal cual aparecen, sin cambiar idioma ni formato.

      NIVEL 2: NORMALIZACIÓN (ANÁLISIS)
      - Convierte cada movimiento a un esquema estándar:
      - date: Formato YYYY-MM-DD.
      - description: Texto limpio.
      - amount_out: Número negativo para salidas (si es salida).
      - amount_in: Número positivo para entradas (si es entrada).
      - balance: Saldo numérico.

      FORMATO DE SALIDA (JSON ESTRICTO):
      {
        "idioma_detectado": "codigo_iso",
        "metadata": {
          "banco": "Nombre Banco",
          "cuenta": "Nro Cuenta",
          "periodo": "Periodo"
        },
        "espejo": {
          "columnas": ["Col1", "Col2"...],
          "datos": [ ["Val1", "Val2"...] ]
        },
        "auditoria": [
          {
            "date": "YYYY-MM-DD",
            "description": "String",
            "amount_out": number (o 0),
            "amount_in": number (o 0),
            "balance": number
          }
        ]
      }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "application/pdf" } },
    ]);

    // --- PARSEO ROBUSTO DEL JSON ---
    const textResponse = result.response.text();
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}') + 1;
    const jsonRaw = textResponse.substring(jsonStart, jsonEnd);
    
    let data;
    try {
        data = JSON.parse(jsonRaw);
    } catch (e) {
        console.error("Error parseando:", textResponse);
        throw new Error("La IA no devolvió un JSON válido.");
    }

    const t = obtenerTraduccion(data.idioma_detectado);
    
    // --- GENERACIÓN DEL EXCEL ---
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Análisis Bancario");

    // 1. ENCABEZADO DEL REPORTE
    ws.addRow([data.metadata.banco]).font = { bold: true, size: 18, color: { argb: "2E86C1" } };
    ws.addRow([`Cuenta: ${data.metadata.cuenta} | Período: ${data.metadata.periodo}`]);
    ws.addRow([]);

    // ==========================================
    // 🟦 SECCIÓN 1: TABLA ESPEJO (ORIGINAL)
    // ==========================================
    const tituloEspejo = ws.addRow([t.titulo_espejo]);
    tituloEspejo.font = { bold: true, size: 12, color: { argb: "E67E22" } }; // Naranja
    
    // Cabecera Original (Dinámica según lo que vio la IA)
    const headerEspejo = ws.addRow(data.espejo.columnas);
    headerEspejo.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDEBD0' } }; // Fondo naranja claro
        cell.font = { bold: true, color: { argb: '9C640C' } };
        cell.border = { bottom: { style: 'thin' } };
    });

    // Datos Originales
    data.espejo.datos.forEach((fila: string[]) => {
        ws.addRow(fila);
    });

    ws.addRow([]); 
    ws.addRow([]); 

// ==========================================
    // 🟩 SECCIÓN 2: TABLA AUDITORÍA (ANÁLISIS)
    // ==========================================
    const tituloAuditoria = ws.addRow([t.titulo_auditoria]);
    tituloAuditoria.font = { bold: true, size: 12, color: { argb: "27AE60" } }; 

    // Cabecera Normalizada (Sin Categoría)
    const headerAuditoria = ws.addRow([
        t.norm_fecha, 
        t.norm_desc, 
        t.norm_egreso, 
        t.norm_ingreso, 
        t.norm_saldo
    ]);

    headerAuditoria.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D5F5E3' } };
        cell.font = { bold: true, color: { argb: '145A32' } };
        cell.border = { bottom: { style: 'medium', color: { argb: '27AE60' } } };
    });

    // Datos Normalizados
    data.auditoria.forEach((m: any) => {
        const row = ws.addRow([
            m.date,
            m.description,
            m.amount_out !== 0 ? m.amount_out : null,
            m.amount_in !== 0 ? m.amount_in : null,
            m.balance
        ]);

        // Formatos y Colores
        row.getCell(3).numFmt = '#,##0.00'; 
        row.getCell(3).font = { color: { argb: "C0392B" } }; // Rojo egresos
        
        row.getCell(4).numFmt = '#,##0.00';
        row.getCell(4).font = { color: { argb: "27AE60" } }; // Verde ingresos
        
        row.getCell(5).numFmt = '#,##0.00';
    });

    // Ajuste de Anchos Visuales
    ws.getColumn(1).width = 15; // Fecha
    ws.getColumn(2).width = 60; // Descripción (Más ancha ahora que hay espacio)
    ws.getColumn(3).width = 15; // Egreso
    ws.getColumn(4).width = 15; // Ingreso
    ws.getColumn(5).width = 15; // Saldo

    // ⚠️ AQUÍ TERMINA EL EXCEL (Borramos la Sección 3 Dashboard)

    const excelBuffer = await workbook.xlsx.writeBuffer();
    
    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Analisis_Cuenta_${data.metadata.banco}.xlsx"`,
      },
    });

  } catch (error: any) {
    console.error("❌ Error Fatal:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}