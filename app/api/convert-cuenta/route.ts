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
//     titulo_principal: "RESUMEN BANCARIO",
//     hoja_original: "Datos Originales",
//     hoja_analisis: "Análisis",
//     titulo_espejo: "📋 MOVIMIENTOS REGISTRADOS",
//     titulo_auditoria: "🧠 ANÁLISIS DE MOVIMIENTOS",
//     meta_cuenta: "Cuenta:",
//     meta_periodo: "Período:",
//     meta_moneda: "Moneda:",
//     meta_saldo_inicial: "Saldo Inicial:",
//     meta_saldo_final: "Saldo Final:",
//     meta_total_ingresos: "Total Ingresos:",
//     meta_total_egresos: "Total Egresos:",
//     norm_fecha: "FECHA STD",
//     norm_desc: "DESCRIPCIÓN",
//     norm_egreso: "EGRESO (-)",
//     norm_ingreso: "INGRESO (+)",
//     norm_moneda: "MON",
//     norm_saldo: "SALDO"
//   },
//   en: {
//     titulo_principal: "BANK STATEMENT",
//     hoja_original: "Original Data",
//     hoja_analisis: "Analysis",
//     titulo_espejo: "📋 REGISTERED TRANSACTIONS",
//     titulo_auditoria: "🧠 TRANSACTION ANALYSIS",
//     meta_cuenta: "Account:",
//     meta_periodo: "Period:",
//     meta_moneda: "Currency:",
//     meta_saldo_inicial: "Opening Balance:",
//     meta_saldo_final: "Closing Balance:",
//     meta_total_ingresos: "Total Credits:",
//     meta_total_egresos: "Total Debits:",
//     norm_fecha: "STD DATE",
//     norm_desc: "DESCRIPTION",
//     norm_egreso: "DEBIT (-)",
//     norm_ingreso: "CREDIT (+)",
//     norm_moneda: "CUR",
//     norm_saldo: "BALANCE"
//   },
//   zh: {
//     titulo_principal: "银行对账单",
//     hoja_original: "原始数据",
//     hoja_analisis: "分析",
//     titulo_espejo: "📋 已登记交易",
//     titulo_auditoria: "🧠 交易分析",
//     meta_cuenta: "账户:",
//     meta_periodo: "期间:",
//     meta_moneda: "货币:",
//     meta_saldo_inicial: "期初余额:",
//     meta_saldo_final: "期末余额:",
//     meta_total_ingresos: "总收入:",
//     meta_total_egresos: "总支出:",
//     norm_fecha: "标准日期",
//     norm_desc: "描述",
//     norm_egreso: "支出 (-)",
//     norm_ingreso: "收入 (+)",
//     norm_moneda: "货币",
//     norm_saldo: "余额"
//   },
//   ja: {
//     titulo_principal: "銀行明細書",
//     hoja_original: "元データ",
//     hoja_analisis: "分析",
//     titulo_espejo: "📋 登録された取引",
//     titulo_auditoria: "🧠 取引分析",
//     meta_cuenta: "口座:",
//     meta_periodo: "期間:",
//     meta_moneda: "通貨:",
//     meta_saldo_inicial: "期首残高:",
//     meta_saldo_final: "期末残高:",
//     meta_total_ingresos: "総入金:",
//     meta_total_egresos: "総出金:",
//     norm_fecha: "標準日付",
//     norm_desc: "説明",
//     norm_egreso: "出金 (-)",
//     norm_ingreso: "入金 (+)",
//     norm_moneda: "通貨",
//     norm_saldo: "残高"
//   },
//   pt: {
//     titulo_principal: "EXTRATO BANCÁRIO",
//     hoja_original: "Dados Originais",
//     hoja_analisis: "Análise",
//     titulo_espejo: "📋 TRANSAÇÕES REGISTRADAS",
//     titulo_auditoria: "🧠 ANÁLISE DE TRANSAÇÕES",
//     meta_cuenta: "Conta:",
//     meta_periodo: "Período:",
//     meta_moneda: "Moeda:",
//     meta_saldo_inicial: "Saldo Inicial:",
//     meta_saldo_final: "Saldo Final:",
//     meta_total_ingresos: "Total Créditos:",
//     meta_total_egresos: "Total Débitos:",
//     norm_fecha: "DATA STD",
//     norm_desc: "DESCRIÇÃO",
//     norm_egreso: "DÉBITO (-)",
//     norm_ingreso: "CRÉDITO (+)",
//     norm_moneda: "MOEDA",
//     norm_saldo: "SALDO"
//   },
//   fr: {
//     titulo_principal: "RELEVÉ BANCAIRE",
//     hoja_original: "Données Originales",
//     hoja_analisis: "Analyse",
//     titulo_espejo: "📋 TRANSACTIONS ENREGISTRÉES",
//     titulo_auditoria: "🧠 ANALYSE DES TRANSACTIONS",
//     meta_cuenta: "Compte:",
//     meta_periodo: "Période:",
//     meta_moneda: "Devise:",
//     meta_saldo_inicial: "Solde Initial:",
//     meta_saldo_final: "Solde Final:",
//     meta_total_ingresos: "Total Crédits:",
//     meta_total_egresos: "Total Débits:",
//     norm_fecha: "DATE STD",
//     norm_desc: "DESCRIPTION",
//     norm_egreso: "DÉBIT (-)",
//     norm_ingreso: "CRÉDIT (+)",
//     norm_moneda: "DEV",
//     norm_saldo: "SOLDE"
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

//     // 🔥 PROMPT MEJORADO PARA EXTRACTO BANCARIO
//     const prompt = `
//       Eres un experto en extracción de datos de extractos bancarios. Analiza este documento en CUATRO NIVELES.

//       NIVEL 0: DETECCIÓN DE CONTEXTO
//       - Detecta el idioma del documento (código ISO 639-1: es, en, zh, ja, pt, fr, de, etc.)
//       - Detecta la MONEDA PRINCIPAL del extracto (código ISO 4217: USD, EUR, ARS, CNY, JPY, BRL, etc.)
//       - Si hay movimientos en múltiples monedas, identifica la principal

//       NIVEL 1: METADATOS CLAVE
//       - Banco o entidad financiera (nombre completo)
//       - Número de cuenta (completo o parcial)
//       - Período del extracto (fecha inicio - fecha fin)
//       - Saldo Inicial (si está disponible, sino null)
//       - Saldo Final (si está disponible, sino null)

//       NIVEL 2: TRANSCRIPCIÓN FIEL (ESPEJO)
//       Esta sección debe ser una copia EXACTA de la tabla de movimientos tal como aparece en el PDF.
      
//       REGLAS ESTRICTAS:
//       1. Usa los nombres de columnas EXACTOS del PDF (respeta mayúsculas, acentos, espacios)
//       2. Mantén los formatos de fecha y números SIN MODIFICAR (si dice "15/01/25", ponlo así)
//       3. Mantén los valores de texto exactamente como aparecen
//       4. Si una celda está vacía o tiene "-", déjala así
//       5. NO interpretes ni transformes nada, solo copia
//       6. Incluye TODAS las filas de la tabla de movimientos
//       7. Alinea correctamente: cada valor debe ir en su columna correspondiente
//       8. Si hay saltos de línea dentro de una celda, unifica el texto en una sola línea
//       9. Valida que todas las filas tengan la misma cantidad de columnas
      
//       FORMATO ESPERADO:
//       {
//         "columnas": ["FECHA", "DESCRIPCIÓN", "DÉBITO", "CRÉDITO", "SALDO"],
//         "datos": [
//           ["15/01/25", "TRANSFERENCIA RECIBIDA", "", "5000.00", "25000.00"],
//           ["16/01/25", "COMPRA EN COMERCIO", "1500.00", "", "23500.00"],
//           ...
//         ]
//       }

//       NIVEL 3: NORMALIZACIÓN (ANÁLISIS)
//       Ahora SÍ transforma cada movimiento a un esquema estándar:
      
//       - date: Formato YYYY-MM-DD (convierte la fecha original)
//       - description: Texto limpio del movimiento
//       - amount_out: Número positivo para egresos/débitos (si no es egreso: 0)
//       - amount_in: Número positivo para ingresos/créditos (si no es ingreso: 0)
//       - currency: Código ISO de la moneda de ESTE movimiento específico (puede variar por fila)
//       - balance: Saldo después de este movimiento (número)
      
//       IMPORTANTE PARA DETECTAR INGRESOS VS EGRESOS:
//       - Analiza las columnas del PDF:
//         * Si hay columnas separadas "DÉBITO" y "CRÉDITO" → usa esa info
//         * Si hay una sola columna con signos → negativo = egreso, positivo = ingreso
//         * Si no hay signo → analiza la descripción (PAGO, COMPRA, RETIRO = egreso)
//       - amount_out y amount_in SIEMPRE son positivos (el signo está implícito en la columna)
//       - Si es egreso: amount_out = valor, amount_in = 0
//       - Si es ingreso: amount_in = valor, amount_out = 0

//       FORMATO DE SALIDA (JSON ESTRICTO):
//       {
//         "idioma_detectado": "codigo_iso_idioma",
//         "moneda_principal": "codigo_iso_moneda",
//         "metadata": {
//           "banco": "String",
//           "cuenta": "String",
//           "periodo": "String",
//           "saldo_inicial": number o null,
//           "saldo_final": number o null
//         },
//         "espejo": {
//           "columnas": ["Col1", "Col2"...],
//           "datos": [ ["Val1", "Val2"...] ]
//         },
//         "auditoria": [
//           {
//             "date": "YYYY-MM-DD",
//             "description": "String",
//             "amount_out": number,
//             "amount_in": number,
//             "currency": "String",
//             "balance": number
//           }
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
//     }

//     const t = obtenerTraduccion(data.idioma_detectado);
//     const monedaPrincipal = data.moneda_principal || "USD";
    
//     // 🆕 CALCULAR TOTALES (si no vienen en metadata)
//     let totalIngresos = 0;
//     let totalEgresos = 0;
    
//     if (data.auditoria && Array.isArray(data.auditoria)) {
//       data.auditoria.forEach((mov: any) => {
//         if (mov.amount_in) totalIngresos += mov.amount_in;
//         if (mov.amount_out) totalEgresos += mov.amount_out;
//       });
//     }
    
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
//       bold: true, size: 16, color: { argb: "2E86C1" } 
//     };
//     wsOriginal.addRow([t.meta_cuenta, data.metadata.cuenta]);
//     wsOriginal.addRow([t.meta_periodo, data.metadata.periodo]);
//     wsOriginal.addRow([t.meta_moneda, monedaPrincipal]);
    
//     // Saldos (si existen)
//     if (data.metadata.saldo_inicial !== null && data.metadata.saldo_inicial !== undefined) {
//       const rowSaldoInicial = wsOriginal.addRow([t.meta_saldo_inicial, data.metadata.saldo_inicial]);
//       rowSaldoInicial.getCell(2).numFmt = obtenerFormatoMoneda(monedaPrincipal);
//     }
    
//     if (data.metadata.saldo_final !== null && data.metadata.saldo_final !== undefined) {
//       const rowSaldoFinal = wsOriginal.addRow([t.meta_saldo_final, data.metadata.saldo_final]);
//       rowSaldoFinal.getCell(2).numFmt = obtenerFormatoMoneda(monedaPrincipal);
//     }
    
//     // Totales calculados
//     const rowTotalIngresos = wsOriginal.addRow([t.meta_total_ingresos, totalIngresos]);
//     rowTotalIngresos.getCell(2).numFmt = obtenerFormatoMoneda(monedaPrincipal);
//     rowTotalIngresos.getCell(2).font = { color: { argb: "27AE60" }, bold: true };
    
//     const rowTotalEgresos = wsOriginal.addRow([t.meta_total_egresos, totalEgresos]);
//     rowTotalEgresos.getCell(2).numFmt = obtenerFormatoMoneda(monedaPrincipal);
//     rowTotalEgresos.getCell(2).font = { color: { argb: "C0392B" }, bold: true };
    
//     wsOriginal.addRow([]);

//     // 2. TABLA ESPEJO (ORIGINAL)
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

//         // Agregar datos como TEXTO puro
//         data.espejo.datos.forEach((fila: string[]) => {
//             const row = wsOriginal.addRow(fila);
//             row.eachCell((cell) => {
//               cell.numFmt = '@'; // Formato texto
//               cell.alignment = { vertical: 'top', wrapText: false };
//             });
//         });

//         // ANCHOS DINÁMICOS
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
//     // 🧠 PESTAÑA 2: ANÁLISIS
//     // ==========================================
    
//     // 1. TABLA ANÁLISIS (NORMALIZADA)
//     const tituloAuditoria = wsAnalisis.addRow([t.titulo_auditoria]);
//     tituloAuditoria.font = { bold: true, size: 14, color: { argb: "27AE60" } };
//     wsAnalisis.addRow([]); // Espacio

//     const headerAuditoria = wsAnalisis.addRow([
//         t.norm_fecha, 
//         t.norm_desc, 
//         t.norm_egreso, 
//         t.norm_ingreso,
//         t.norm_moneda,
//         t.norm_saldo
//     ]);

//     headerAuditoria.eachCell((cell) => {
//         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D5F5E3' } };
//         cell.font = { bold: true, color: { argb: '145A32' } };
//         cell.border = { bottom: { style: 'medium', color: { argb: '27AE60' } } };
//         cell.alignment = { horizontal: 'center' };
//     });

//     // Datos normalizados
//     data.auditoria.forEach((m: any) => {
//         const row = wsAnalisis.addRow([
//             m.date,
//             m.description,
//             m.amount_out !== 0 ? m.amount_out : null,
//             m.amount_in !== 0 ? m.amount_in : null,
//             m.currency,
//             m.balance
//         ]);
        
//         // Formato numérico con moneda
//         row.getCell(3).numFmt = obtenerFormatoMoneda(m.currency); // Egreso
//         row.getCell(3).font = { color: { argb: "C0392B" } }; // Rojo
        
//         row.getCell(4).numFmt = obtenerFormatoMoneda(m.currency); // Ingreso
//         row.getCell(4).font = { color: { argb: "27AE60" } }; // Verde
        
//         row.getCell(6).numFmt = obtenerFormatoMoneda(m.currency); // Saldo
//     });

//     // Ajuste de anchos para pestaña análisis
//     wsAnalisis.getColumn(1).width = 15;
//     const descripciones = data.auditoria.map((m: any) => m.description);
//     const anchoDescripcion = calcularAnchoColumna(descripciones, 30, 100);
//     wsAnalisis.getColumn(2).width = anchoDescripcion;
//     wsAnalisis.getColumn(3).width = 15;
//     wsAnalisis.getColumn(4).width = 15;
//     wsAnalisis.getColumn(5).width = 8;
//     wsAnalisis.getColumn(6).width = 15;

//     const excelBuffer = await workbook.xlsx.writeBuffer();
    
//     return new NextResponse(excelBuffer, {
//       headers: {
//         "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition": `attachment; filename="Extracto_${data.metadata.banco}.xlsx"`,
//       },
//     });

//   } catch (error: any) {
//     console.error("❌ Error Fatal:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }