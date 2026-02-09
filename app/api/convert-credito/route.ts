import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ExcelJS from "exceljs";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("Falta la GEMINI_API_KEY en las variables de entorno");
}

// ✨ DICCIONARIO DE TRADUCCIONES SIMPLIFICADO
const traducciones: Record<string, any> = {
  es: {
    // Títulos de Secciones
    titulo_espejo: "📋 MOVIMIENTOS REGISTRADOS",
    titulo_auditoria: "🧠 ANÁLISIS DE CONSUMOS",
    titulo_futuro: "📅 COMPROMISOS FUTUROS (CUOTAS)",

    // Metadatos
    meta_vencimiento: "Vencimiento:",
    meta_total_ars: "Total a Pagar (ARS):",
    meta_total_usd: "Total a Pagar (USD):",

    // Encabezados Normalizados
    norm_fecha: "FECHA STD",
    norm_tarjeta: "TARJETA",
    norm_desc: "DESCRIPCIÓN",
    norm_cuota: "CUOTA",
    norm_moneda: "MON",
    norm_importe: "IMPORTE",
    
    // Futuro
    fut_mes: "MES / AÑO",
    fut_concepto: "CONCEPTO",
    fut_monto: "MONTO ESTIMADO"
  },
  en: {
    titulo_espejo: "📋 REGISTERED TRANSACTIONS",
    titulo_auditoria: "🧠 SPENDING ANALYSIS",
    titulo_futuro: "📅 FUTURE COMMITMENTS",
    meta_vencimiento: "Due Date:",
    meta_total_ars: "Total to Pay (ARS):",
    meta_total_usd: "Total to Pay (USD):",
    norm_fecha: "STD DATE",
    norm_tarjeta: "CARD",
    norm_desc: "DESCRIPTION",
    norm_cuota: "INSTALLMENT",
    norm_moneda: "CUR",
    norm_importe: "AMOUNT",
    fut_mes: "MONTH / YEAR",
    fut_concepto: "CONCEPT",
    fut_monto: "ESTIMATED AMOUNT"
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

    // 🔥 PROMPT ESPECIALIZADO EN CRÉDITO (ESPEJO + ANÁLISIS + FUTURO)
    const prompt = `
      Eres un experto en Tarjetas de Crédito. Analiza este resumen en TRES NIVELES.

      NIVEL 1: METADATOS CLAVE
      - Banco, Fecha de Vencimiento, Total a Pagar en Pesos y Dólares.

      NIVEL 2: TRANSCRIPCIÓN FIEL (ESPEJO)
      - Identifica las columnas EXACTAS que tiene la tabla de consumos del PDF.
      - Extrae las filas tal cual aparecen (mismo texto, mismo formato).

      NIVEL 3: NORMALIZACIÓN (ANÁLISIS)
      - Convierte cada consumo a un esquema estándar:
      - date: Formato YYYY-MM-DD.
      - card: Nombre de la tarjeta o adicional (ej: "Visa Gold", "Adicional Juan").
      - description: Texto limpio del comercio.
      - installment: Formato "01/12" (Cuota actual / Total). Si no es cuota, null.
      - currency: Código ISO (ARS, USD).
      - amount: Número float (Positivo para gastos, Negativo para pagos/devoluciones).

      NIVEL 4: FUTURO (Proyecciones)
      - Busca tablas de "Cuotas a vencer" o "Próximos vencimientos".
      - Extrae mes, concepto y monto.

      FORMATO DE SALIDA (JSON ESTRICTO):
      {
        "idioma_detectado": "codigo_iso",
        "metadata": {
          "banco": "String",
          "vencimiento": "String",
          "total_pesos": number,
          "total_dolares": number
        },
        "espejo": {
          "columnas": ["Col1", "Col2"...],
          "datos": [ ["Val1", "Val2"...] ]
        },
        "auditoria": [
          {
            "date": "YYYY-MM-DD",
            "card": "String",
            "description": "String",
            "installment": "String" o null,
            "currency": "String",
            "amount": number
          }
        ],
        "futuro": [
          { "mes": "String", "concepto": "String", "monto": number, "moneda": "String" }
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
    const ws = workbook.addWorksheet("Resumen Tarjeta");

    // 1. ENCABEZADO (METADATOS)
    ws.addRow([`RESUMEN: ${data.metadata.banco}`]).font = { bold: true, size: 16, color: { argb: "5B2C6F" } };
    ws.addRow([t.meta_vencimiento, data.metadata.vencimiento]);
    ws.addRow([t.meta_total_ars, data.metadata.total_pesos]).getCell(2).numFmt = '"$"#,##0.00';
    if(data.metadata.total_dolares) {
        ws.addRow([t.meta_total_usd, data.metadata.total_dolares]).getCell(2).numFmt = 'u$s#,##0.00';
    }
    ws.addRow([]);

    // ==========================================
    // 🟧 SECCIÓN 2: TABLA ESPEJO (ORIGINAL)
    // ==========================================
    const tituloEspejo = ws.addRow([t.titulo_espejo]);
    tituloEspejo.font = { bold: true, size: 12, color: { argb: "E67E22" } }; // Naranja
    
    // Cabecera Original
    if(data.espejo && data.espejo.columnas) {
        const headerEspejo = ws.addRow(data.espejo.columnas);
        headerEspejo.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDEBD0' } };
            cell.font = { bold: true, color: { argb: '9C640C' } };
            cell.border = { bottom: { style: 'thin' } };
        });

        // Datos Originales
        data.espejo.datos.forEach((fila: string[]) => {
            ws.addRow(fila);
        });
    }

    ws.addRow([]); 
    ws.addRow([]); 

    // ==========================================
    // 🟪 SECCIÓN 3: TABLA ANÁLISIS (NORMALIZADA)
    // ==========================================
    const tituloAuditoria = ws.addRow([t.titulo_auditoria]);
    tituloAuditoria.font = { bold: true, size: 12, color: { argb: "8E44AD" } }; // Violeta

    // Cabecera Normalizada (Sin Tipo)
    const headerAuditoria = ws.addRow([
        t.norm_fecha, 
        t.norm_tarjeta, 
        t.norm_desc, 
        t.norm_cuota, 
        t.norm_moneda, 
        t.norm_importe
    ]);

    headerAuditoria.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8DAEF' } }; // Violeta claro
        cell.font = { bold: true, color: { argb: '5B2C6F' } };
        cell.border = { bottom: { style: 'medium', color: { argb: '8E44AD' } } };
    });

    // Datos Normalizados
    data.auditoria.forEach((m: any) => {
        const row = ws.addRow([
            m.date,
            m.card,
            m.description,
            m.installment,
            m.currency,
            m.amount
        ]);

        // Estilos
        row.getCell(6).numFmt = '#,##0.00'; 
        // Si es gasto (positivo o negativo según criterio) generalmente gasto = consumo.
        // Aquí asumimos que consumo es un valor. Podés ajustar el color si querés.
    });

    ws.addRow([]);
    ws.addRow([]);

    // ==========================================
    // 📅 SECCIÓN 4: COMPROMISOS FUTUROS
    // ==========================================
    if (data.futuro && data.futuro.length > 0) {
        const tituloFuturo = ws.addRow([t.titulo_futuro]);
        tituloFuturo.font = { bold: true, size: 12, color: { argb: "2980B9" } }; // Azul

        const headerFuturo = ws.addRow([t.fut_mes, t.fut_concepto, t.fut_monto, t.norm_moneda]);
        headerFuturo.eachCell((cell) => {
            cell.font = { bold: true, italic: true, color: { argb: "1A5276" } };
            cell.border = { bottom: { style: 'thin' } };
        });
        
        data.futuro.forEach((f: any) => {
            const row = ws.addRow([f.mes, f.concepto, f.monto, f.moneda]);
            row.getCell(3).numFmt = '#,##0.00';
        });
    }

    // Ajuste de Anchos Visuales
    ws.getColumn(1).width = 15; // Fecha
    ws.getColumn(2).width = 20; // Tarjeta
    ws.getColumn(3).width = 50; // Descripción
    ws.getColumn(4).width = 12; // Cuota
    ws.getColumn(5).width = 10; // Moneda
    ws.getColumn(6).width = 15; // Importe

    const excelBuffer = await workbook.xlsx.writeBuffer();
    
    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Tarjeta_${data.metadata.banco}.xlsx"`,
      },
    });

  } catch (error: any) {
    console.error("❌ Error Fatal:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


