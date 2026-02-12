// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import ExcelJS from "exceljs";

// const API_KEY = process.env.GEMINI_API_KEY as string;
// if (!API_KEY) {
//   throw new Error("Falta la GEMINI_API_KEY en las variables de entorno");
// }

// // ✨ CONFIGURACIÓN DE MONEDAS
// const MONEDAS_CONFIG: Record<string, { simbolo: string; decimales: number; formato: string }> = {
//   ARS: { simbolo: "$", decimales: 2, formato: '"$"#,##0.00' },
//   USD: { simbolo: "$", decimales: 2, formato: '"$"#,##0.00' },
//   EUR: { simbolo: "€", decimales: 2, formato: '"€"#,##0.00' },
//   GBP: { simbolo: "£", decimales: 2, formato: '"£"#,##0.00' },
//   CNY: { simbolo: "¥", decimales: 2, formato: '"¥"#,##0.00' },
//   JPY: { simbolo: "¥", decimales: 0, formato: '"¥"#,##0' },
//   BRL: { simbolo: "R$", decimales: 2, formato: '"R$"#,##0.00' },
//   MXN: { simbolo: "$", decimales: 2, formato: '"$"#,##0.00' },
//   CLP: { simbolo: "$", decimales: 0, formato: '"$"#,##0' },
//   COP: { simbolo: "$", decimales: 2, formato: '"$"#,##0.00' },
// };

// // ✨ DICCIONARIO DE TRADUCCIONES AMPLIADO
// const traducciones: Record<string, any> = {
//   es: {
//     titulo_principal: "RESUMEN",
//     hoja_original: "Datos Originales",
//     hoja_analisis: "Análisis",
//     titulo_espejo: "📋 MOVIMIENTOS REGISTRADOS",
//     titulo_auditoria: "🧠 ANÁLISIS DE CONSUMOS",
//     titulo_futuro: "📅 COMPROMISOS FUTUROS (CUOTAS)",
//     meta_vencimiento: "Vencimiento:",
//     meta_total: "Total a Pagar ({moneda}):",
//     norm_fecha: "FECHA STD",
//     norm_tarjeta: "TARJETA",
//     norm_desc: "DESCRIPCIÓN",
//     norm_cuota: "CUOTA",
//     norm_moneda: "MON",
//     norm_importe: "IMPORTE",
//     norm_tipo: "TIPO",
//     fut_mes: "MES / AÑO",
//     fut_concepto: "CONCEPTO",
//     fut_monto: "MONTO ESTIMADO"
//   },
//   en: {
//     titulo_principal: "SUMMARY",
//     hoja_original: "Original Data",
//     hoja_analisis: "Analysis",
//     titulo_espejo: "📋 REGISTERED TRANSACTIONS",
//     titulo_auditoria: "🧠 SPENDING ANALYSIS",
//     titulo_futuro: "📅 FUTURE COMMITMENTS",
//     meta_vencimiento: "Due Date:",
//     meta_total: "Total to Pay ({moneda}):",
//     norm_fecha: "STD DATE",
//     norm_tarjeta: "CARD",
//     norm_desc: "DESCRIPTION",
//     norm_cuota: "INSTALLMENT",
//     norm_moneda: "CUR",
//     norm_importe: "AMOUNT",
//     norm_tipo: "TYPE",
//     fut_mes: "MONTH / YEAR",
//     fut_concepto: "CONCEPT",
//     fut_monto: "ESTIMATED AMOUNT"
//   },
//   zh: {
//     titulo_principal: "摘要",
//     hoja_original: "原始数据",
//     hoja_analisis: "分析",
//     titulo_espejo: "📋 已登记交易",
//     titulo_auditoria: "🧠 消费分析",
//     titulo_futuro: "📅 未来承诺（分期付款）",
//     meta_vencimiento: "到期日期:",
//     meta_total: "应付总额 ({moneda}):",
//     norm_fecha: "标准日期",
//     norm_tarjeta: "卡片",
//     norm_desc: "描述",
//     norm_cuota: "分期",
//     norm_moneda: "货币",
//     norm_importe: "金额",
//     norm_tipo: "类型",
//     fut_mes: "月份 / 年份",
//     fut_concepto: "概念",
//     fut_monto: "估计金额"
//   },
//   ja: {
//     titulo_principal: "要約",
//     hoja_original: "元データ",
//     hoja_analisis: "分析",
//     titulo_espejo: "📋 登録された取引",
//     titulo_auditoria: "🧠 消費分析",
//     titulo_futuro: "📅 将来のコミットメント（分割払い）",
//     meta_vencimiento: "支払期限:",
//     meta_total: "支払総額 ({moneda}):",
//     norm_fecha: "標準日付",
//     norm_tarjeta: "カード",
//     norm_desc: "説明",
//     norm_cuota: "分割払い",
//     norm_moneda: "通貨",
//     norm_importe: "金額",
//     norm_tipo: "タイプ",
//     fut_mes: "月 / 年",
//     fut_concepto: "コンセプト",
//     fut_monto: "推定金額"
//   },
//   pt: {
//     titulo_principal: "RESUMO",
//     hoja_original: "Dados Originais",
//     hoja_analisis: "Análise",
//     titulo_espejo: "📋 TRANSAÇÕES REGISTRADAS",
//     titulo_auditoria: "🧠 ANÁLISE DE CONSUMOS",
//     titulo_futuro: "📅 COMPROMISSOS FUTUROS (PARCELAS)",
//     meta_vencimiento: "Vencimento:",
//     meta_total: "Total a Pagar ({moneda}):",
//     norm_fecha: "DATA STD",
//     norm_tarjeta: "CARTÃO",
//     norm_desc: "DESCRIÇÃO",
//     norm_cuota: "PARCELA",
//     norm_moneda: "MOEDA",
//     norm_importe: "VALOR",
//     norm_tipo: "TIPO",
//     fut_mes: "MÊS / ANO",
//     fut_concepto: "CONCEITO",
//     fut_monto: "VALOR ESTIMADO"
//   },
//   fr: {
//     titulo_principal: "RÉSUMÉ",
//     hoja_original: "Données Originales",
//     hoja_analisis: "Analyse",
//     titulo_espejo: "📋 TRANSACTIONS ENREGISTRÉES",
//     titulo_auditoria: "🧠 ANALYSE DES DÉPENSES",
//     titulo_futuro: "📅 ENGAGEMENTS FUTURS (VERSEMENTS)",
//     meta_vencimiento: "Date d'échéance:",
//     meta_total: "Total à Payer ({moneda}):",
//     norm_fecha: "DATE STD",
//     norm_tarjeta: "CARTE",
//     norm_desc: "DESCRIPTION",
//     norm_cuota: "VERSEMENT",
//     norm_moneda: "DEV",
//     norm_importe: "MONTANT",
//     norm_tipo: "TYPE",
//     fut_mes: "MOIS / ANNÉE",
//     fut_concepto: "CONCEPT",
//     fut_monto: "MONTANT ESTIMÉ"
//   }
// };

// function obtenerTraduccion(idioma: string): any {
//   return traducciones[idioma] || traducciones["en"];
// }

// function obtenerFormatoMoneda(moneda: string): string {
//   return MONEDAS_CONFIG[moneda]?.formato || '#,##0.00';
// }

// // 🆕 FUNCIÓN PARA CALCULAR ANCHO ÓPTIMO DE COLUMNA
// function calcularAnchoColumna(datos: string[], minimo: number = 10, maximo: number = 60): number {
//   if (!datos || datos.length === 0) return minimo;
//   const maxLength = Math.max(...datos.map(d => String(d || '').length));
//   return Math.min(Math.max(maxLength + 2, minimo), maximo);
// }

// // 🆕 VALIDACIÓN DE DATOS ESPEJO
// function validarEspejo(espejo: any): { valido: boolean; errores: string[] } {
//   const errores: string[] = [];
  
//   if (!espejo || !espejo.columnas || !espejo.datos) {
//     errores.push("Estructura de espejo incompleta");
//     return { valido: false, errores };
//   }
  
//   const numColumnas = espejo.columnas.length;
  
//   // Validar cantidad de columnas
//   if (numColumnas < 3) {
//     errores.push(`Muy pocas columnas detectadas (${numColumnas}). Mínimo esperado: 3`);
//   }
//   if (numColumnas > 15) {
//     errores.push(`Demasiadas columnas detectadas (${numColumnas}). Máximo esperado: 15`);
//   }
  
//   // Validar alineación de datos
//   const filasDesalineadas = espejo.datos.filter((fila: any[]) => fila.length !== numColumnas);
//   if (filasDesalineadas.length > 0) {
//     errores.push(`${filasDesalineadas.length} filas tienen cantidad incorrecta de columnas`);
//   }
  
//   return { valido: errores.length === 0, errores };
// }

// export async function POST(req: NextRequest) {
//   try {
//     const genAI = new GoogleGenerativeAI(API_KEY);
//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) return NextResponse.json({ error: "No hay archivo" }, { status: 400 });

//     const arrayBuffer = await file.arrayBuffer();
//     const base64Data = Buffer.from(arrayBuffer).toString("base64");
//     const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

//     // 🔥 PROMPT MEJORADO CON ESPEJO SEMI-INTELIGENTE
//     const prompt = `
//       Eres un experto en extracción de datos de resúmenes de tarjetas de crédito. Analiza este documento en CUATRO NIVELES.

//       NIVEL 0: DETECCIÓN DE CONTEXTO
//       - Detecta el idioma del documento (código ISO 639-1: es, en, zh, ja, pt, fr, de, etc.)
//       - Detecta la MONEDA PRINCIPAL del resumen (código ISO 4217: USD, EUR, ARS, CNY, JPY, BRL, etc.)
//       - Si hay múltiples monedas, identifica la principal y las secundarias.

//       NIVEL 1: METADATOS CLAVE
//       - Banco o emisor de la tarjeta (nombre completo)
//       - Fecha de Vencimiento del pago
//       - Total a Pagar (en todas las monedas presentes)

//       NIVEL 2: TRANSCRIPCIÓN FIEL (ESPEJO) - MUY IMPORTANTE
//       Esta sección debe ser una copia EXACTA de la tabla de consumos tal como aparece en el PDF.
      
//       REGLAS ESTRICTAS:
//       1. Usa los nombres de columnas EXACTOS del PDF (respeta mayúsculas, acentos, espacios)
//       2. Mantén los formatos de fecha y números SIN MODIFICAR (si dice "27/11/25", ponlo así)
//       3. Mantén los valores de texto exactamente como aparecen
//       4. Si una celda está vacía o tiene "-", déjala así
//       5. NO interpretes ni transformes nada, solo copia
//       6. Incluye TODAS las filas de la tabla, incluso impuestos, comisiones, pagos
//       7. Alinea correctamente: cada valor debe ir en su columna correspondiente
//       8. Si hay saltos de línea dentro de una celda, unifica el texto en una sola línea
//       9. Valida que todas las filas tengan la misma cantidad de columnas
      
//       FORMATO ESPERADO:
//       {
//         "columnas": ["FECHA", "TARJETA", "DETALLE", ...],  // Nombres ORIGINALES
//         "datos": [
//           ["27/11/25", "Naranja X", "COMISION...", ...],   // Valores ORIGINALES
//           ["15/08/25", "NX Visa", "CASTELLANAS", ...],
//           ...
//         ]
//       }

//       NIVEL 3: NORMALIZACIÓN (ANÁLISIS)
//       Ahora SÍ transforma cada movimiento a un esquema estándar:
      
//       - date: Formato YYYY-MM-DD (convierte la fecha original)
//       - card: Nombre de la tarjeta o adicional
//       - description: Texto limpio del comercio
//       - installment: Formato "01/12" (Cuota actual / Total). Si no es cuota: null
//       - currency: Código ISO (ARS, USD, CNY, etc.)
//       - amount: Número float
//       - type: Clasifica el movimiento en uno de estos tipos:
//         * "consumo" - Compras normales
//         * "pago" - Pagos realizados (identifica por palabras: PAGO, PAYMENT, ABONO, 支付)
//         * "comision" - Comisiones bancarias
//         * "impuesto" - IVA, impuesto de sellos, etc.
//         * "devolucion" - Devoluciones o reintegros
      
//       IMPORTANTE PARA DETECTAR PAGOS:
//       - Si el detalle contiene: "PAGO", "PAYMENT", "ABONO", "PAY", "付款", "支付" → type: "pago", amount: negativo
//       - Si el detalle contiene: "DEVOLUCION", "REFUND", "REINTEGRO" → type: "devolucion", amount: negativo
//       - Caso contrario → type: "consumo", amount: positivo (o el signo que indique el PDF)

//       NIVEL 4: FUTURO (Proyecciones)
//       - Busca secciones de "Cuotas a vencer", "Cuotas futuras", "Próximos vencimientos"
//       - Para cada mes futuro, extrae:
//         * mes: "Marzo/26" (formato del PDF)
//         * concepto: Descripción de qué cuota es (ej: "MERPAGO PASAJESCDP - Cuota 2/3")
//         * monto: Valor numérico
//         * moneda: Código ISO

//       FORMATO DE SALIDA (JSON ESTRICTO):
//       {
//         "idioma_detectado": "codigo_iso_idioma",
//         "moneda_principal": "codigo_iso_moneda",
//         "metadata": {
//           "banco": "String",
//           "vencimiento": "String",
//           "totales": [
//             { "moneda": "ARS", "monto": number }
//           ]
//         },
//         "espejo": {
//           "columnas": ["Col1", "Col2"...],
//           "datos": [ ["Val1", "Val2"...] ]
//         },
//         "auditoria": [
//           {
//             "date": "YYYY-MM-DD",
//             "card": "String",
//             "description": "String",
//             "installment": "String" o null,
//             "currency": "String",
//             "amount": number,
//             "type": "consumo|pago|comision|impuesto|devolucion"
//           }
//         ],
//         "futuro": [
//           { "mes": "String", "concepto": "String", "monto": number, "moneda": "String" }
//         ]
//       }
//     `;

//     const result = await model.generateContent([
//       prompt,
//       { inlineData: { data: base64Data, mimeType: "application/pdf" } },
//     ]);

//     const textResponse = result.response.text();
//     const jsonStart = textResponse.indexOf('{');
//     const jsonEnd = textResponse.lastIndexOf('}') + 1;
//     const jsonRaw = textResponse.substring(jsonStart, jsonEnd);
    
//     let data;
//     try {
//         data = JSON.parse(jsonRaw);
//     } catch (e) {
//         console.error("Error parseando:", textResponse);
//         throw new Error("La IA no devolvió un JSON válido.");
//     }

//     // 🆕 VALIDAR ESPEJO
//     const validacion = validarEspejo(data.espejo);
//     if (!validacion.valido) {
//       console.warn("⚠️ Advertencias en espejo:", validacion.errores);
//       // No lanzamos error, solo logueamos. Podríamos agregar las advertencias al Excel
//     }

//     const t = obtenerTraduccion(data.idioma_detectado);
//     const monedaPrincipal = data.moneda_principal || "USD";
    
//     // ==========================================
//     // 🆕 CREACIÓN DE 2 WORKSHEETS (PESTAÑAS)
//     // ==========================================
//     const workbook = new ExcelJS.Workbook();
    
//     // 📄 PESTAÑA 1: DATOS ORIGINALES
//     const wsOriginal = workbook.addWorksheet(t.hoja_original);
    
//     // 📄 PESTAÑA 2: ANÁLISIS
//     const wsAnalisis = workbook.addWorksheet(t.hoja_analisis);

//     // ==========================================
//     // 📋 PESTAÑA 1: METADATOS + ESPEJO
//     // ==========================================
    
//     // 1. ENCABEZADO (METADATOS)
//     wsOriginal.addRow([`${t.titulo_principal}: ${data.metadata.banco}`]).font = { 
//       bold: true, size: 16, color: { argb: "5B2C6F" } 
//     };
//     wsOriginal.addRow([t.meta_vencimiento, data.metadata.vencimiento]);
    
//     // Totales dinámicos por moneda
//     if (data.metadata.totales && Array.isArray(data.metadata.totales)) {
//       data.metadata.totales.forEach((total: any) => {
//         const labelTotal = t.meta_total.replace("{moneda}", total.moneda);
//         wsOriginal.addRow([labelTotal, total.monto]);
//         // NO aplicamos formato numérico en metadatos, dejamos como texto para fidelidad
//       });
//     }
    
//     wsOriginal.addRow([]);

//     // 2. TABLA ESPEJO (ORIGINAL) - MEJORADA
//     const tituloEspejo = wsOriginal.addRow([t.titulo_espejo]);
//     tituloEspejo.font = { bold: true, size: 12, color: { argb: "E67E22" } };
    
//     if(data.espejo && data.espejo.columnas) {
//         const headerEspejo = wsOriginal.addRow(data.espejo.columnas);
//         headerEspejo.eachCell((cell) => {
//             cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDEBD0' } };
//             cell.font = { bold: true, color: { argb: '9C640C' } };
//             cell.border = { bottom: { style: 'thin' } };
//             cell.alignment = { horizontal: 'center', vertical: 'middle' };
//         });

//         // 🆕 Agregar datos como TEXTO puro (sin conversión automática)
//         data.espejo.datos.forEach((fila: string[]) => {
//             const row = wsOriginal.addRow(fila);
//             // Forzar TODO como texto
//             row.eachCell((cell) => {
//               cell.numFmt = '@'; // Formato texto
//               cell.alignment = { vertical: 'top', wrapText: false };
//             });
//         });

//         // 🆕 ANCHOS DINÁMICOS basados en contenido
//         data.espejo.columnas.forEach((columna: string, index: number) => {
//           const columnIndex = index + 1;
//           const valoresColumna = [
//             columna, 
//             ...data.espejo.datos.map((fila: any[]) => fila[index])
//           ];
//           const anchoOptimo = calcularAnchoColumna(valoresColumna, 12, 50);
//           wsOriginal.getColumn(columnIndex).width = anchoOptimo;
//         });
//     }

//     // ==========================================
//     // 🧠 PESTAÑA 2: ANÁLISIS + FUTURO
//     // ==========================================
    
//     // 1. TABLA ANÁLISIS (NORMALIZADA) - MEJORADA CON TIPO
//     const tituloAuditoria = wsAnalisis.addRow([t.titulo_auditoria]);
//     tituloAuditoria.font = { bold: true, size: 14, color: { argb: "8E44AD" } };
//     wsAnalisis.addRow([]); // Espacio

//     const headerAuditoria = wsAnalisis.addRow([
//         t.norm_fecha, 
//         t.norm_tarjeta, 
//         t.norm_desc, 
//         t.norm_cuota, 
//         t.norm_moneda, 
//         t.norm_importe,
//         t.norm_tipo  // 🆕 Nueva columna
//     ]);

//     headerAuditoria.eachCell((cell) => {
//         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8DAEF' } };
//         cell.font = { bold: true, color: { argb: '5B2C6F' } };
//         cell.border = { bottom: { style: 'medium', color: { argb: '8E44AD' } } };
//         cell.alignment = { horizontal: 'center' };
//     });

//     // Datos normalizados
//     data.auditoria.forEach((m: any) => {
//         const row = wsAnalisis.addRow([
//             m.date,
//             m.card,
//             m.description,
//             m.installment || '-',
//             m.currency,
//             m.amount,
//             m.type || 'consumo'  // 🆕
//         ]);
        
//         // Formato numérico en importe
//         row.getCell(6).numFmt = obtenerFormatoMoneda(m.currency);
        
//         // 🆕 Colorear según tipo
//         const tipoCell = row.getCell(7);
//         if (m.type === 'pago') {
//           tipoCell.font = { color: { argb: '27AE60' }, bold: true }; // Verde
//         } else if (m.type === 'comision' || m.type === 'impuesto') {
//           tipoCell.font = { color: { argb: 'E67E22' } }; // Naranja
//         } else if (m.type === 'devolucion') {
//           tipoCell.font = { color: { argb: '3498DB' } }; // Azul
//         }
//     });

//     wsAnalisis.addRow([]);
//     wsAnalisis.addRow([]);

//     // 2. COMPROMISOS FUTUROS
//     if (data.futuro && data.futuro.length > 0) {
//         const tituloFuturo = wsAnalisis.addRow([t.titulo_futuro]);
//         tituloFuturo.font = { bold: true, size: 14, color: { argb: "2980B9" } };
//         wsAnalisis.addRow([]); // Espacio

//         const headerFuturo = wsAnalisis.addRow([t.fut_mes, t.fut_concepto, t.fut_monto, t.norm_moneda]);
//         headerFuturo.eachCell((cell) => {
//             cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D6EAF8' } };
//             cell.font = { bold: true, color: { argb: "1A5276" } };
//             cell.border = { bottom: { style: 'thin' } };
//             cell.alignment = { horizontal: 'center' };
//         });
        
//         data.futuro.forEach((f: any) => {
//             const row = wsAnalisis.addRow([f.mes, f.concepto, f.monto, f.moneda]);
//             row.getCell(3).numFmt = obtenerFormatoMoneda(f.moneda);
//         });
//     }

//     // Ajuste de anchos para pestaña análisis
//     wsAnalisis.getColumn(1).width = 15;  // Fecha
//     wsAnalisis.getColumn(2).width = 18;  // Tarjeta
//     wsAnalisis.getColumn(3).width = 45;  // Descripción
//     wsAnalisis.getColumn(4).width = 12;  // Cuota
//     wsAnalisis.getColumn(5).width = 8;   // Moneda
//     wsAnalisis.getColumn(6).width = 15;  // Importe
//     wsAnalisis.getColumn(7).width = 12;  // Tipo

//     const excelBuffer = await workbook.xlsx.writeBuffer();
    
//     return new NextResponse(excelBuffer, {
//       headers: {
//         "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition": `attachment; filename="Tarjeta_${data.metadata.banco}.xlsx"`,
//       },
//     });

//   } catch (error: any) {
//     console.error("❌ Error Fatal:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }