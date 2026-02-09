// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import ExcelJS from "exceljs";

// // ⚠️ IMPORTANTE: Mové esto a .env.local después
// const API_KEY = "AIzaSyDQtQ-s8l_AGaufsR4v0Ff8bZTDbb8bMGs"; 


// export async function POST(req: NextRequest) {
//   try {
//     // 1. Inicializar Google AI
//     const genAI = new GoogleGenerativeAI(API_KEY);



    

//     // 2. Recibir archivo
//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No se subió archivo" }, { status: 400 });
//     }

//     // 3. Convertir a Base64
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const base64Data = buffer.toString("base64");

//     // 4. ✅ MODELO CORRECTO
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     // 5. El Prompt mejorado
//     const prompt = `
// Eres un experto contador. Analiza este extracto bancario en PDF.

// INSTRUCCIONES:
// 1. Extrae TODAS las transacciones (débitos y créditos)
// 2. Une descripciones que estén en múltiples líneas
// 3. Los importes negativos son gastos/débitos
// 4. Ignora: saldos iniciales, textos legales, encabezados del banco

// FORMATO DE SALIDA:
// Devuelve ÚNICAMENTE un array JSON válido (sin markdown, sin texto adicional):

// [
//   {
//     "fecha": "DD/MM/AAAA",
//     "comprobante": "número o tipo de comprobante",
//     "descripcion": "descripción completa de la transacción",
//     "importe": número positivo o negativo,
//     "saldo": número del saldo resultante
//   }
// ]

// Si algún campo no existe en el PDF, usá null.
// IMPORTANTE: Solo devolvé el JSON, nada más.
//     `.trim();

//     // 6. ENVIAR A GEMINI
//     const result = await model.generateContent([
//       prompt,
//       {
//         inlineData: {
//           data: base64Data,
//           mimeType: "application/pdf",
//         },
//       },
//     ]);

//     const response = await result.response;
//     let textoJson = response.text();

//     // Limpieza de respuesta
//     textoJson = textoJson
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();
    
//     let movimientos = [];
//     try {
//       movimientos = JSON.parse(textoJson);
//     } catch (e) {
//       console.error("❌ Error parseando JSON:", textoJson);
//       return NextResponse.json({ 
//         error: "La IA no devolvió un formato válido. Intentá con otro PDF.",
//         detalle: textoJson.substring(0, 200) 
//       }, { status: 500 });
//     }

//     if (!Array.isArray(movimientos) || movimientos.length === 0) {
//       return NextResponse.json({ 
//         error: "No se encontraron movimientos en el PDF" 
//       }, { status: 400 });
//     }

//     // 7. Generar Excel
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Movimientos");

//     worksheet.columns = [
//       { header: "Fecha", key: "fecha", width: 12 },
//       { header: "Comprobante", key: "comprobante", width: 15 },
//       { header: "Descripción", key: "descripcion", width: 50 },
//       { header: "Importe", key: "importe", width: 15 },
//       { header: "Saldo", key: "saldo", width: 15 },
//     ];

//     // Estilo del encabezado
//     const headerRow = worksheet.getRow(1);
//     headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
//     headerRow.fill = { 
//       type: "pattern", 
//       pattern: "solid", 
//       fgColor: { argb: "4285F4" } 
//     };
    
//     // Agregar datos
//     movimientos.forEach((mov: any) => {
//       const row = worksheet.addRow(mov);
      
//       // Formato moneda
//       row.getCell(4).numFmt = '"$"#,##0.00';
//       row.getCell(5).numFmt = '"$"#,##0.00';
      
//       // Rojo para gastos
//       if (mov.importe < 0) {
//         row.getCell(4).font = { color: { argb: "FF0000" } };
//       }
//     });

//     const excelBuffer = await workbook.xlsx.writeBuffer();

//     return new NextResponse(excelBuffer, {
//       headers: {
//         "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition": 'attachment; filename="Resumen_Bancario.xlsx"',
//       },
//     });

//   } catch (error: any) {
//     console.error("❌ Error Backend:", error);
//     return NextResponse.json({ 
//       error: error.message || "Error desconocido" 
//     }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import ExcelJS from "exceljs";

// const API_KEY = "API_KEY"; 

// export async function POST(req: NextRequest) {
//   try {
//     const genAI = new GoogleGenerativeAI(API_KEY);
//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) return NextResponse.json({ error: "No hay archivo" }, { status: 400 });

//     const arrayBuffer = await file.arrayBuffer();
//     const base64Data = Buffer.from(arrayBuffer).toString("base64");

//     // Usamos el modelo estándar de 2026
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     const prompt = `
//       Eres un sistema de auditoría financiera universal. Analiza este PDF de tarjeta de crédito.
      
//       INSTRUCCIONES DE EXTRACCIÓN:
//       1. METADATOS: Extrae el nombre del banco, fecha de vencimiento y el total a pagar del mes.
//       2. MOVIMIENTOS: Extrae solo los consumos, impuestos y comisiones del período actual. 
//          - Mantén el idioma original en la descripción.
//          - Si hay cuotas (ej: 02/06), extráelas a un campo separado.
//          - Clasifica cada fila como: 'Gasto', 'Impuesto', 'Comisión/Interés' o 'Pago'.
//          - Detecta la moneda ISO (ARS, USD, etc.).
//       3. COMPROMISOS FUTUROS: Busca información de cuotas a vencer en meses próximos (usualmente al final o en notas al pie).
      
//       FORMATO DE SALIDA (JSON ESTRICTO):
//       {
//         "metadata": { "banco": "string", "vencimiento": "string", "total_pesos": number, "total_dolares": number },
//         "movimientos": [
//           { "fecha": "string", "tarjeta": "string", "descripcion": "string", "cuota": "string", "moneda": "string", "importe": number, "tipo": "string" }
//         ],
//         "futuro": [
//           { "mes_proximo": "string", "monto": number, "moneda": "string" }
//         ]
//       }
//     `;

//     const result = await model.generateContent([
//       prompt,
//       { inlineData: { data: base64Data, mimeType: "application/pdf" } },
//     ]);

//     const data = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

//     // --- GENERACIÓN DEL EXCEL PROFESIONAL ---
//     const workbook = new ExcelJS.Workbook();
//     const ws = workbook.addWorksheet("Resumen Financiero");

//     // 1. SECCIÓN: ENCABEZADO (METADATOS)
//     ws.addRow([`RESUMEN: ${data.metadata.banco}`]).font = { bold: true, size: 14 };
//     ws.addRow(["Vencimiento:", data.metadata.vencimiento]);
//     ws.addRow(["Total a Pagar (ARS):", data.metadata.total_pesos]).getCell(2).numFmt = '"$"#,##0.00';
//     if(data.metadata.total_dolares) {
//         ws.addRow(["Total a Pagar (USD):", data.metadata.total_dolares]).getCell(2).numFmt = 'u$s#,##0.00';
//     }
//     ws.addRow([]); // Espacio

//     // 2. SECCIÓN: TABLA DE MOVIMIENTOS
//     const startRowTable = ws.rowCount + 1;
//     ws.addRow(["FECHA", "TARJETA", "DESCRIPCIÓN", "CUOTA", "MONEDA", "IMPORTE", "TIPO"]).font = { bold: true };
    
//     // Aplicar color azul a la cabecera de la tabla
//     const headerRow = ws.getRow(ws.rowCount);
//     headerRow.eachCell(cell => {
//         cell.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'4285F4' } };
//         cell.font = { color: { argb: 'FFFFFF' }, bold: true };
//     });

//     data.movimientos.forEach((m: any) => {
//       const row = ws.addRow([m.fecha, m.tarjeta, m.descripcion, m.cuota, m.moneda, m.importe, m.tipo]);
//       row.getCell(6).numFmt = '#,##0.00';
//       if (m.importe < 0) row.getCell(6).font = { color: { argb: "FF0000" } };
//     });

//     ws.addRow([]); // Espacio

//     // 3. SECCIÓN: COMPROMISOS FUTUROS
//     if (data.futuro && data.futuro.length > 0) {
//         ws.addRow(["⚠️ COMPROMISOS PARA PRÓXIMOS MESES"]).font = { bold: true, color: { argb: "E67E22" } };
//         ws.addRow(["MES / CONCEPTO", "MONTO ESTIMADO", "MONEDA"]).font = { italic: true };
        
//         data.futuro.forEach((f: any) => {
//             const row = ws.addRow([f.mes_proximo, f.monto, f.moneda]);
//             row.getCell(2).numFmt = '#,##0.00';
//         });
//     }

//     // Auto-ajustar columnas
//     ws.columns.forEach(column => { column.width = 20; });
//     ws.getColumn(3).width = 45; // Descripción más ancha

//     const excelBuffer = await workbook.xlsx.writeBuffer();
//     return new NextResponse(excelBuffer, {
//       headers: {
//         "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition": 'attachment; filename="Resumen_Inteligente_2026.xlsx"',
//       },
//     });

//   } catch (error: any) {
//     console.error("Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ExcelJS from "exceljs";

const API_KEY = "TU_API_KEY"; 

// ✨ DICCIONARIO DE TRADUCCIONES
const traducciones: Record<string, any> = {
  es: {
    // Encabezados de columnas
    fecha: "FECHA",
    tarjeta: "TARJETA",
    descripcion: "DESCRIPCIÓN",
    cuota: "CUOTA",
    moneda: "MONEDA",
    importe: "IMPORTE",
    tipo: "TIPO",
    
    // Secciones del Excel
    resumen: "RESUMEN",
    vencimiento: "Vencimiento:",
    total_pagar_pesos: "Total a Pagar (ARS):",
    total_pagar_dolares: "Total a Pagar (USD):",
    compromisos_futuros: "⚠️ COMPROMISOS PARA PRÓXIMOS MESES",
    mes_concepto: "MES / CONCEPTO",
    monto_estimado: "MONTO ESTIMADO"
  },
  
  en: {
    fecha: "DATE",
    tarjeta: "CARD",
    descripcion: "DESCRIPTION",
    cuota: "INSTALLMENT",
    moneda: "CURRENCY",
    importe: "AMOUNT",
    tipo: "TYPE",
    
    resumen: "SUMMARY",
    vencimiento: "Due Date:",
    total_pagar_pesos: "Total to Pay (ARS):",
    total_pagar_dolares: "Total to Pay (USD):",
    compromisos_futuros: "⚠️ FUTURE COMMITMENTS",
    mes_concepto: "MONTH / CONCEPT",
    monto_estimado: "ESTIMATED AMOUNT"
  },
  
  de: {
    fecha: "DATUM",
    tarjeta: "KARTE",
    descripcion: "BESCHREIBUNG",
    cuota: "RATE",
    moneda: "WÄHRUNG",
    importe: "BETRAG",
    tipo: "TYP",
    
    resumen: "ZUSAMMENFASSUNG",
    vencimiento: "Fälligkeitsdatum:",
    total_pagar_pesos: "Gesamtbetrag (ARS):",
    total_pagar_dolares: "Gesamtbetrag (USD):",
    compromisos_futuros: "⚠️ ZUKÜNFTIGE VERPFLICHTUNGEN",
    mes_concepto: "MONAT / KONZEPT",
    monto_estimado: "GESCHÄTZTER BETRAG"
  },
  
  fr: {
    fecha: "DATE",
    tarjeta: "CARTE",
    descripcion: "DESCRIPTION",
    cuota: "VERSEMENT",
    moneda: "DEVISE",
    importe: "MONTANT",
    tipo: "TYPE",
    
    resumen: "RÉSUMÉ",
    vencimiento: "Date d'échéance:",
    total_pagar_pesos: "Total à payer (ARS):",
    total_pagar_dolares: "Total à payer (USD):",
    compromisos_futuros: "⚠️ ENGAGEMENTS FUTURS",
    mes_concepto: "MOIS / CONCEPT",
    monto_estimado: "MONTANT ESTIMÉ"
  },
  
  it: {
    fecha: "DATA",
    tarjeta: "CARTA",
    descripcion: "DESCRIZIONE",
    cuota: "RATA",
    moneda: "VALUTA",
    importe: "IMPORTO",
    tipo: "TIPO",
    
    resumen: "RIEPILOGO",
    vencimiento: "Scadenza:",
    total_pagar_pesos: "Totale da pagare (ARS):",
    total_pagar_dolares: "Totale da pagare (USD):",
    compromisos_futuros: "⚠️ IMPEGNI FUTURI",
    mes_concepto: "MESE / CONCETTO",
    monto_estimado: "IMPORTO STIMATO"
  },
  
  pt: {
    fecha: "DATA",
    tarjeta: "CARTÃO",
    descripcion: "DESCRIÇÃO",
    cuota: "PARCELA",
    moneda: "MOEDA",
    importe: "VALOR",
    tipo: "TIPO",
    
    resumen: "RESUMO",
    vencimiento: "Vencimento:",
    total_pagar_pesos: "Total a Pagar (ARS):",
    total_pagar_dolares: "Total a Pagar (USD):",
    compromisos_futuros: "⚠️ COMPROMISSOS FUTUROS",
    mes_concepto: "MÊS / CONCEITO",
    monto_estimado: "VALOR ESTIMADO"
  }
};

// ✨ FUNCIÓN PARA OBTENER TRADUCCIONES (con fallback a español)
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // ✨ PROMPT MODIFICADO
    const prompt = `
      Eres un sistema de auditoría financiera universal. Analiza este PDF de tarjeta de crédito.
      
      PASO 1 - DETECTAR IDIOMA:
      Identifica el idioma principal del documento y devuélvelo como código ISO 639-1:
      - "es" para español
      - "en" para inglés
      - "de" para alemán
      - "fr" para francés
      - "it" para italiano
      - "pt" para portugués
      - "zh" para chino
      - "ja" para japonés
      
      PASO 2 - INSTRUCCIONES DE EXTRACCIÓN:
      1. METADATOS: Extrae el nombre del banco, fecha de vencimiento y el total a pagar del mes.
      2. MOVIMIENTOS: Extrae solo los consumos, impuestos y comisiones del período actual. 
         - Mantén el idioma original en la descripción.
         - Si hay cuotas (ej: 02/06), extráelas a un campo separado.
         - Clasifica cada fila como: 'Gasto', 'Impuesto', 'Comisión/Interés' o 'Pago'.
         - Detecta la moneda ISO (ARS, USD, EUR, etc.).
      3. COMPROMISOS FUTUROS: Busca información de cuotas a vencer en meses próximos.
      
      FORMATO DE SALIDA (JSON ESTRICTO):
      {
        "idioma": "string (código ISO del idioma detectado)",
        "metadata": { 
          "banco": "string", 
          "vencimiento": "string", 
          "total_pesos": number, 
          "total_dolares": number 
        },
        "movimientos": [
          { 
            "fecha": "string", 
            "tarjeta": "string", 
            "descripcion": "string", 
            "cuota": "string", 
            "moneda": "string", 
            "importe": number, 
            "tipo": "string" 
          }
        ],
        "futuro": [
          { 
            "mes_proximo": "string", 
            "monto": number, 
            "moneda": "string" 
          }
        ]
      }
      
      IMPORTANTE: El campo "idioma" es obligatorio y debe estar ANTES de "metadata".
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "application/pdf" } },
    ]);

    const data = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

    // ✨ VALIDACIÓN DEL IDIOMA
    if (!data.idioma) {
      console.warn("⚠️ La IA no detectó el idioma, usando español por defecto");
      data.idioma = "es";
    }
    console.log(`✅ Idioma detectado: ${data.idioma}`);

    // ✨ OBTENER TRADUCCIONES SEGÚN EL IDIOMA
    const t = obtenerTraduccion(data.idioma);

    // --- GENERACIÓN DEL EXCEL CON TRADUCCIONES ---
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Resumen Financiero");

    ws.addRow([`${t.resumen}: ${data.metadata.banco}`]).font = { bold: true, size: 14 };
    ws.addRow([t.vencimiento, data.metadata.vencimiento]);
    ws.addRow([t.total_pagar_pesos, data.metadata.total_pesos]).getCell(2).numFmt = '"$"#,##0.00';
    if(data.metadata.total_dolares) {
        ws.addRow([t.total_pagar_dolares, data.metadata.total_dolares]).getCell(2).numFmt = 'u$s#,##0.00';
    }
    ws.addRow([]);

    // ✨ Encabezados de tabla con traducciones
    const startRowTable = ws.rowCount + 1;
    ws.addRow([
        t.fecha,
        t.tarjeta,
        t.descripcion,
        t.cuota,
        t.moneda,
        t.importe,
        t.tipo
    ]).font = { bold: true };
    
    const headerRow = ws.getRow(ws.rowCount);
    headerRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'4285F4' } };
        cell.font = { color: { argb: 'FFFFFF' }, bold: true };
    });

    data.movimientos.forEach((m: any) => {
      const row = ws.addRow([m.fecha, m.tarjeta, m.descripcion, m.cuota, m.moneda, m.importe, m.tipo]);
      row.getCell(6).numFmt = '#,##0.00';
      if (m.importe < 0) row.getCell(6).font = { color: { argb: "FF0000" } };
    });

    ws.addRow([]);

    if (data.futuro && data.futuro.length > 0) {
        ws.addRow([t.compromisos_futuros]).font = { bold: true, color: { argb: "E67E22" } };
        ws.addRow([t.mes_concepto, t.monto_estimado, t.moneda]).font = { italic: true };
        
        data.futuro.forEach((f: any) => {
            const row = ws.addRow([f.mes_proximo, f.monto, f.moneda]);
            row.getCell(2).numFmt = '#,##0.00';
        });
    }

    ws.columns.forEach(column => { column.width = 20; });
    ws.getColumn(3).width = 45;

    const excelBuffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="Resumen_Inteligente_2026.xlsx"',
      },
    });

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}