import ExcelJS from "exceljs";
import { 
  MONEDAS_CONFIG, 
  traduccionesCredito, 
  traduccionesBanco,
  obtenerTraduccion,
  obtenerFormatoMoneda 
} from "@/lib/constants";

// ========================================
// TIPOS
// ========================================

interface DatosCredito {
  idioma_detectado: string;
  moneda_principal: string;
  metadata: {
    banco: string;
    vencimiento: string;
    totales: Array<{ moneda: string; monto: number }>;
  };
  espejo: {
    columnas: string[];
    datos: string[][];
  };
  auditoria: Array<{
    date: string;
    card: string;
    description: string;
    installment: string | null;
    currency: string;
    amount: number;
    type?: string;
  }>;
  futuro?: Array<{
    mes: string;
    concepto: string;
    monto: number;
    moneda: string;
  }>;
}

interface DatosBanco {
  idioma_detectado: string;
  moneda_principal: string;
  metadata: {
    banco: string;
    cuenta: string;
    periodo: string;
    saldo_inicial: number | null;
    saldo_final: number | null;
  };
  espejo: {
    columnas: string[];
    datos: string[][];
  };
  auditoria: Array<{
    date: string;
    description: string;
    amount_out: number;
    amount_in: number;
    currency: string;
    balance: number;
  }>;
}

// ========================================
// FUNCIONES AUXILIARES COMPARTIDAS
// ========================================

function calcularAnchoColumna(datos: string[], minimo: number = 10, maximo: number = 60): number {
  if (!datos || datos.length === 0) return minimo;
  const maxLength = Math.max(...datos.map(d => String(d || '').length));
  return Math.min(Math.max(maxLength + 2, minimo), maximo);
}

function validarEspejo(espejo: any): { valido: boolean; errores: string[] } {
  const errores: string[] = [];
  
  if (!espejo || !espejo.columnas || !espejo.datos) {
    errores.push("Estructura de espejo incompleta");
    return { valido: false, errores };
  }
  
  const numColumnas = espejo.columnas.length;
  
  if (numColumnas < 3) {
    errores.push(`Muy pocas columnas detectadas (${numColumnas}). Mínimo esperado: 3`);
  }
  if (numColumnas > 15) {
    errores.push(`Demasiadas columnas detectadas (${numColumnas}). Máximo esperado: 15`);
  }
  
  const filasDesalineadas = espejo.datos.filter((fila: any[]) => fila.length !== numColumnas);
  if (filasDesalineadas.length > 0) {
    errores.push(`${filasDesalineadas.length} filas tienen cantidad incorrecta de columnas`);
  }
  
  return { valido: errores.length === 0, errores };
}

// ========================================
// GENERADOR PARA TARJETA DE CRÉDITO
// ========================================

export async function generarExcelCredito(data: DatosCredito): Promise<Buffer> {
  const t = obtenerTraduccion(data.idioma_detectado, true); // true = es crédito
  const monedaPrincipal = data.moneda_principal || "USD";
  
  // Validar espejo
  const validacion = validarEspejo(data.espejo);
  if (!validacion.valido) {
    console.warn("⚠️ Advertencias en espejo:", validacion.errores);
  }

  const workbook = new ExcelJS.Workbook();
  
  // PESTAÑA 1: DATOS ORIGINALES
  const wsOriginal = workbook.addWorksheet(t.hoja_original);
  
  // PESTAÑA 2: ANÁLISIS
  const wsAnalisis = workbook.addWorksheet(t.hoja_analisis);

  // ==========================================
  // PESTAÑA 1: METADATOS + ESPEJO
  // ==========================================
  
  // 1. ENCABEZADO (METADATOS)
  wsOriginal.addRow([`${t.titulo_principal}: ${data.metadata.banco}`]).font = { 
    bold: true, size: 16, color: { argb: "5B2C6F" } 
  };
  wsOriginal.addRow([t.meta_vencimiento, data.metadata.vencimiento]);
  
  // Totales dinámicos por moneda
  if (data.metadata.totales && Array.isArray(data.metadata.totales)) {
    data.metadata.totales.forEach((total: any) => {
      const labelTotal = t.meta_total.replace("{moneda}", total.moneda);
      wsOriginal.addRow([labelTotal, total.monto]);
    });
  }
  
  wsOriginal.addRow([]);

  // 2. TABLA ESPEJO (ORIGINAL)
  const tituloEspejo = wsOriginal.addRow([t.titulo_espejo]);
  tituloEspejo.font = { bold: true, size: 12, color: { argb: "E67E22" } };
  
  if(data.espejo && data.espejo.columnas) {
    const headerEspejo = wsOriginal.addRow(data.espejo.columnas);
    headerEspejo.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDEBD0' } };
      cell.font = { bold: true, color: { argb: '9C640C' } };
      cell.border = { bottom: { style: 'thin' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Agregar datos como TEXTO puro
    data.espejo.datos.forEach((fila: string[]) => {
      const row = wsOriginal.addRow(fila);
      row.eachCell((cell) => {
        cell.numFmt = '@'; // Formato texto
        cell.alignment = { vertical: 'top', wrapText: false };
      });
    });

    // ANCHOS DINÁMICOS
    data.espejo.columnas.forEach((columna: string, index: number) => {
      const columnIndex = index + 1;
      const valoresColumna = [
        columna, 
        ...data.espejo.datos.map((fila: any[]) => fila[index])
      ];
      const anchoOptimo = calcularAnchoColumna(valoresColumna, 12, 50);
      wsOriginal.getColumn(columnIndex).width = anchoOptimo;
    });
  }

  // ==========================================
  // PESTAÑA 2: ANÁLISIS + FUTURO
  // ==========================================
  
  // 1. TABLA ANÁLISIS (NORMALIZADA)
  const tituloAuditoria = wsAnalisis.addRow([t.titulo_auditoria]);
  tituloAuditoria.font = { bold: true, size: 14, color: { argb: "8E44AD" } };
  wsAnalisis.addRow([]);

  const headerAuditoria = wsAnalisis.addRow([
    t.norm_fecha, 
    t.norm_tarjeta, 
    t.norm_desc, 
    t.norm_cuota, 
    t.norm_moneda, 
    t.norm_importe,
    t.norm_tipo
  ]);

  headerAuditoria.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8DAEF' } };
    cell.font = { bold: true, color: { argb: '5B2C6F' } };
    cell.border = { bottom: { style: 'medium', color: { argb: '8E44AD' } } };
    cell.alignment = { horizontal: 'center' };
  });

  // Datos normalizados
  data.auditoria.forEach((m: any) => {
    const row = wsAnalisis.addRow([
      m.date,
      m.card,
      m.description,
      m.installment || '-',
      m.currency,
      m.amount,
      m.type || 'consumo'
    ]);
    
    // Formato numérico en importe
    row.getCell(6).numFmt = obtenerFormatoMoneda(m.currency);
    
    // Colorear según tipo
    const tipoCell = row.getCell(7);
    if (m.type === 'pago') {
      tipoCell.font = { color: { argb: '27AE60' }, bold: true };
    } else if (m.type === 'comision' || m.type === 'impuesto') {
      tipoCell.font = { color: { argb: 'E67E22' } };
    } else if (m.type === 'devolucion') {
      tipoCell.font = { color: { argb: '3498DB' } };
    }
  });

  wsAnalisis.addRow([]);
  wsAnalisis.addRow([]);

  // 2. COMPROMISOS FUTUROS
  if (data.futuro && data.futuro.length > 0) {
    const tituloFuturo = wsAnalisis.addRow([t.titulo_futuro]);
    tituloFuturo.font = { bold: true, size: 14, color: { argb: "2980B9" } };
    wsAnalisis.addRow([]);

    const headerFuturo = wsAnalisis.addRow([t.fut_mes, t.fut_concepto, t.fut_monto, t.norm_moneda]);
    headerFuturo.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D6EAF8' } };
      cell.font = { bold: true, color: { argb: "1A5276" } };
      cell.border = { bottom: { style: 'thin' } };
      cell.alignment = { horizontal: 'center' };
    });
    
    data.futuro.forEach((f: any) => {
      const row = wsAnalisis.addRow([f.mes, f.concepto, f.monto, f.moneda]);
      row.getCell(3).numFmt = obtenerFormatoMoneda(f.moneda);
    });
  }

  // Ajuste de anchos para pestaña análisis
  wsAnalisis.getColumn(1).width = 15;
  wsAnalisis.getColumn(2).width = 18;
  wsAnalisis.getColumn(3).width = 45;
  wsAnalisis.getColumn(4).width = 12;
  wsAnalisis.getColumn(5).width = 8;
  wsAnalisis.getColumn(6).width = 15;
  wsAnalisis.getColumn(7).width = 12;

  const excelBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(excelBuffer);
}

// ========================================
// GENERADOR PARA EXTRACTO BANCARIO
// ========================================

export async function generarExcelBanco(data: DatosBanco): Promise<Buffer> {
  const t = obtenerTraduccion(data.idioma_detectado, false); // false = NO es crédito
  const monedaPrincipal = data.moneda_principal || "USD";
  
  // Validar espejo
  const validacion = validarEspejo(data.espejo);
  if (!validacion.valido) {
    console.warn("⚠️ Advertencias en espejo:", validacion.errores);
  }

  // Calcular totales
  let totalIngresos = 0;
  let totalEgresos = 0;
  
  if (data.auditoria && Array.isArray(data.auditoria)) {
    data.auditoria.forEach((mov: any) => {
      if (mov.amount_in) totalIngresos += mov.amount_in;
      if (mov.amount_out) totalEgresos += mov.amount_out;
    });
  }
  
  const workbook = new ExcelJS.Workbook();
  
  // PESTAÑA 1: DATOS ORIGINALES
  const wsOriginal = workbook.addWorksheet(t.hoja_original);
  
  // PESTAÑA 2: ANÁLISIS
  const wsAnalisis = workbook.addWorksheet(t.hoja_analisis);

  // ==========================================
  // PESTAÑA 1: METADATOS + ESPEJO
  // ==========================================
  
  // 1. ENCABEZADO (METADATOS)
  wsOriginal.addRow([`${t.titulo_principal}: ${data.metadata.banco}`]).font = { 
    bold: true, size: 16, color: { argb: "2E86C1" } 
  };
  wsOriginal.addRow([t.meta_cuenta, data.metadata.cuenta]);
  wsOriginal.addRow([t.meta_periodo, data.metadata.periodo]);
  wsOriginal.addRow([t.meta_moneda, monedaPrincipal]);
  
  // Saldos (si existen)
  if (data.metadata.saldo_inicial !== null && data.metadata.saldo_inicial !== undefined) {
    const rowSaldoInicial = wsOriginal.addRow([t.meta_saldo_inicial, data.metadata.saldo_inicial]);
    rowSaldoInicial.getCell(2).numFmt = obtenerFormatoMoneda(monedaPrincipal);
  }
  
  if (data.metadata.saldo_final !== null && data.metadata.saldo_final !== undefined) {
    const rowSaldoFinal = wsOriginal.addRow([t.meta_saldo_final, data.metadata.saldo_final]);
    rowSaldoFinal.getCell(2).numFmt = obtenerFormatoMoneda(monedaPrincipal);
  }
  
  // Totales calculados
  const rowTotalIngresos = wsOriginal.addRow([t.meta_total_ingresos, totalIngresos]);
  rowTotalIngresos.getCell(2).numFmt = obtenerFormatoMoneda(monedaPrincipal);
  rowTotalIngresos.getCell(2).font = { color: { argb: "27AE60" }, bold: true };
  
  const rowTotalEgresos = wsOriginal.addRow([t.meta_total_egresos, totalEgresos]);
  rowTotalEgresos.getCell(2).numFmt = obtenerFormatoMoneda(monedaPrincipal);
  rowTotalEgresos.getCell(2).font = { color: { argb: "C0392B" }, bold: true };
  
  wsOriginal.addRow([]);

  // 2. TABLA ESPEJO (ORIGINAL)
  const tituloEspejo = wsOriginal.addRow([t.titulo_espejo]);
  tituloEspejo.font = { bold: true, size: 12, color: { argb: "E67E22" } };
  
  if(data.espejo && data.espejo.columnas) {
    const headerEspejo = wsOriginal.addRow(data.espejo.columnas);
    headerEspejo.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDEBD0' } };
      cell.font = { bold: true, color: { argb: '9C640C' } };
      cell.border = { bottom: { style: 'thin' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Agregar datos como TEXTO puro
    data.espejo.datos.forEach((fila: string[]) => {
      const row = wsOriginal.addRow(fila);
      row.eachCell((cell) => {
        cell.numFmt = '@';
        cell.alignment = { vertical: 'top', wrapText: false };
      });
    });

    // ANCHOS DINÁMICOS
    data.espejo.columnas.forEach((columna: string, index: number) => {
      const columnIndex = index + 1;
      const valoresColumna = [
        columna, 
        ...data.espejo.datos.map((fila: any[]) => fila[index])
      ];
      const anchoOptimo = calcularAnchoColumna(valoresColumna, 12, 50);
      wsOriginal.getColumn(columnIndex).width = anchoOptimo;
    });
  }

  // ==========================================
  // PESTAÑA 2: ANÁLISIS
  // ==========================================
  
  // 1. TABLA ANÁLISIS (NORMALIZADA)
  const tituloAuditoria = wsAnalisis.addRow([t.titulo_auditoria]);
  tituloAuditoria.font = { bold: true, size: 14, color: { argb: "27AE60" } };
  wsAnalisis.addRow([]);

  const headerAuditoria = wsAnalisis.addRow([
    t.norm_fecha, 
    t.norm_desc, 
    t.norm_egreso, 
    t.norm_ingreso,
    t.norm_moneda,
    t.norm_saldo
  ]);

  headerAuditoria.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D5F5E3' } };
    cell.font = { bold: true, color: { argb: '145A32' } };
    cell.border = { bottom: { style: 'medium', color: { argb: '27AE60' } } };
    cell.alignment = { horizontal: 'center' };
  });

  // Datos normalizados
  data.auditoria.forEach((m: any) => {
    const row = wsAnalisis.addRow([
      m.date,
      m.description,
      m.amount_out !== 0 ? m.amount_out : null,
      m.amount_in !== 0 ? m.amount_in : null,
      m.currency,
      m.balance
    ]);
    
    // Formato numérico con moneda
    row.getCell(3).numFmt = obtenerFormatoMoneda(m.currency);
    row.getCell(3).font = { color: { argb: "C0392B" } };
    
    row.getCell(4).numFmt = obtenerFormatoMoneda(m.currency);
    row.getCell(4).font = { color: { argb: "27AE60" } };
    
    row.getCell(6).numFmt = obtenerFormatoMoneda(m.currency);
  });

  // Ajuste de anchos para pestaña análisis
  wsAnalisis.getColumn(1).width = 15;
  const descripciones = data.auditoria.map((m: any) => m.description);
  const anchoDescripcion = calcularAnchoColumna(descripciones, 30, 100);
  wsAnalisis.getColumn(2).width = anchoDescripcion;
  wsAnalisis.getColumn(3).width = 15;
  wsAnalisis.getColumn(4).width = 15;
  wsAnalisis.getColumn(5).width = 8;
  wsAnalisis.getColumn(6).width = 15;

  const excelBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(excelBuffer);
}