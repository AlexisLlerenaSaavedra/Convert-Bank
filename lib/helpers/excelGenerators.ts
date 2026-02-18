import ExcelJS from "exceljs";
import { 
  CURRENCY_CONFIG, 
  creditTranslations, 
  bankTranslations,
  getTranslation,
  getCurrencyFormat 
} from "@/lib/constants";

// ========================================
// TYPES
// ========================================

interface CreditData {
  detected_language: string;
  main_currency: string;
  metadata: {
    bank: string;
    due_date: string;
    totals: Array<{ currency: string; amount: number }>;
  };
  mirror: {
    columns: string[];
    rows: string[][]; // Note: changed from 'datos' to 'rows'
  };
  analysis: Array<{ // Note: changed from 'auditoria' to 'analysis'
    date: string;
    card: string;
    description: string;
    installment: string | null;
    currency: string;
    amount: number;
    type?: string;
  }>;
  future?: Array<{ // Note: changed from 'futuro' to 'future'
    month: string;
    concept: string;
    amount: number;
    currency: string;
  }>;
}

interface BankData {
  detected_language: string;
  main_currency: string;
  metadata: {
    bank: string;
    account_number: string; // Changed from 'cuenta'
    period: string;
    opening_balance: number | null; // Changed from 'saldo_inicial'
    closing_balance: number | null; // Changed from 'saldo_final'
  };
  mirror: {
    columns: string[];
    rows: string[][];
  };
  analysis: Array<{
    date: string;
    description: string;
    amount_out: number;
    amount_in: number;
    currency: string;
    balance: number;
  }>;
}

// ========================================
// SHARED HELPER FUNCTIONS
// ========================================

function calculateColumnWidth(data: string[], min: number = 10, max: number = 60): number {
  if (!data || data.length === 0) return min;
  const maxLength = Math.max(...data.map(d => String(d || '').length));
  return Math.min(Math.max(maxLength + 2, min), max);
}

function validateMirror(mirror: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!mirror || !mirror.columns || !mirror.rows) {
    errors.push("Incomplete mirror structure");
    return { valid: false, errors };
  }
  
  const numColumns = mirror.columns.length;
  
  if (numColumns < 3) {
    errors.push(`Too few columns detected (${numColumns}). Expected minimum: 3`);
  }
  if (numColumns > 15) {
    errors.push(`Too many columns detected (${numColumns}). Expected maximum: 15`);
  }
  
  const misalignedRows = mirror.rows.filter((row: any[]) => row.length !== numColumns);
  if (misalignedRows.length > 0) {
    errors.push(`${misalignedRows.length} rows have incorrect column count`);
  }
  
  return { valid: errors.length === 0, errors };
}

// ========================================
// CREDIT CARD GENERATOR
// ========================================

export async function generateCreditExcel(data: CreditData): Promise<Buffer> {
  const t = getTranslation(data.detected_language, true); // true = is credit
  
  // Validate mirror
  const validation = validateMirror(data.mirror);
  if (!validation.valid) {
    console.warn("⚠️ Mirror warnings:", validation.errors);
  }

  const workbook = new ExcelJS.Workbook();
  
  // TAB 1: ORIGINAL DATA
  const wsOriginal = workbook.addWorksheet(t.sheetOriginal);
  
  // TAB 2: ANALYSIS
  const wsAnalysis = workbook.addWorksheet(t.sheetAnalysis);

  // ==========================================
  // TAB 1: METADATA + MIRROR
  // ==========================================
  
  // 1. HEADER (METADATA)
  wsOriginal.addRow([`${t.mainTitle}: ${data.metadata.bank}`]).font = { 
    bold: true, size: 16, color: { argb: "5B2C6F" } 
  };
  wsOriginal.addRow([t.metaDueDate, data.metadata.due_date]);
  
  // Dynamic totals by currency
  if (data.metadata.totals && Array.isArray(data.metadata.totals)) {
    data.metadata.totals.forEach((total: any) => {
      const labelTotal = t.metaTotal.replace("{moneda}", total.currency);
      wsOriginal.addRow([labelTotal, total.amount]);
    });
  }
  
  wsOriginal.addRow([]);

  // 2. MIRROR TABLE (ORIGINAL)
  const titleMirror = wsOriginal.addRow([t.titleRegistered]);
  titleMirror.font = { bold: true, size: 12, color: { argb: "E67E22" } };
  
  if(data.mirror && data.mirror.columns) {
    const headerMirror = wsOriginal.addRow(data.mirror.columns);
    headerMirror.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDEBD0' } };
      cell.font = { bold: true, color: { argb: '9C640C' } };
      cell.border = { bottom: { style: 'thin' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Add data as pure TEXT
    data.mirror.rows.forEach((rowRaw: string[]) => {
      const row = wsOriginal.addRow(rowRaw);
      row.eachCell((cell) => {
        cell.numFmt = '@'; // Text format
        cell.alignment = { vertical: 'top', wrapText: false };
      });
    });

    // DYNAMIC WIDTHS
    data.mirror.columns.forEach((column: string, index: number) => {
      const columnIndex = index + 1;
      const columnValues = [
        column, 
        ...data.mirror.rows.map((r: any[]) => r[index])
      ];
      const optimalWidth = calculateColumnWidth(columnValues, 12, 50);
      wsOriginal.getColumn(columnIndex).width = optimalWidth;
    });
  }

  // ==========================================
  // TAB 2: ANALYSIS + FUTURE
  // ==========================================
  
  // 1. ANALYSIS TABLE (NORMALIZED)
  const titleAudit = wsAnalysis.addRow([t.titleAudit]);
  titleAudit.font = { bold: true, size: 14, color: { argb: "8E44AD" } };
  wsAnalysis.addRow([]);

  const headerAnalysis = wsAnalysis.addRow([
    t.stdDate, 
    t.stdCard, 
    t.stdDesc, 
    t.stdInstallment, 
    t.stdCurrency, 
    t.stdAmount,
    t.stdType
  ]);

  headerAnalysis.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8DAEF' } };
    cell.font = { bold: true, color: { argb: '5B2C6F' } };
    cell.border = { bottom: { style: 'medium', color: { argb: '8E44AD' } } };
    cell.alignment = { horizontal: 'center' };
  });

  // Normalized data
  data.analysis.forEach((m: any) => {
    const row = wsAnalysis.addRow([
      m.date,
      m.card,
      m.description,
      m.installment || '-',
      m.currency,
      m.amount,
      m.type || 'purchase'
    ]);
    
    // Number format for amount
    row.getCell(6).numFmt = getCurrencyFormat(m.currency);
    
    // Color by type
    const typeCell = row.getCell(7);
    if (m.type === 'payment') {
      typeCell.font = { color: { argb: '27AE60' }, bold: true };
    } else if (m.type === 'fee' || m.type === 'tax') {
      typeCell.font = { color: { argb: 'E67E22' } };
    } else if (m.type === 'refund') {
      typeCell.font = { color: { argb: '3498DB' } };
    }
  });

  wsAnalysis.addRow([]);
  wsAnalysis.addRow([]);

  // 2. FUTURE COMMITMENTS
  if (data.future && data.future.length > 0) {
    const titleFuture = wsAnalysis.addRow([t.titleFuture]);
    titleFuture.font = { bold: true, size: 14, color: { argb: "2980B9" } };
    wsAnalysis.addRow([]);

    const headerFuture = wsAnalysis.addRow([t.estMonth, t.estConcept, t.estAmount, t.stdCurrency]);
    headerFuture.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D6EAF8' } };
      cell.font = { bold: true, color: { argb: "1A5276" } };
      cell.border = { bottom: { style: 'thin' } };
      cell.alignment = { horizontal: 'center' };
    });
    
    data.future.forEach((f: any) => {
      const row = wsAnalysis.addRow([f.month, f.concept, f.amount, f.currency]);
      row.getCell(3).numFmt = getCurrencyFormat(f.currency);
    });
  }

  // Width adjustments for analysis tab
  wsAnalysis.getColumn(1).width = 15;
  wsAnalysis.getColumn(2).width = 18;
  wsAnalysis.getColumn(3).width = 45;
  wsAnalysis.getColumn(4).width = 12;
  wsAnalysis.getColumn(5).width = 8;
  wsAnalysis.getColumn(6).width = 15;
  wsAnalysis.getColumn(7).width = 12;

  const excelBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(excelBuffer);
}

// ========================================
// BANK STATEMENT GENERATOR
// ========================================

export async function generateBankExcel(data: BankData): Promise<Buffer> {
  const t = getTranslation(data.detected_language, false); // false = NOT credit
  const mainCurrency = data.main_currency || "USD";
  
  // Validate mirror
  const validation = validateMirror(data.mirror);
  if (!validation.valid) {
    console.warn("⚠️ Mirror warnings:", validation.errors);
  }

  // Calculate totals
  let totalCredits = 0;
  let totalDebits = 0;
  
  if (data.analysis && Array.isArray(data.analysis)) {
    data.analysis.forEach((mov: any) => {
      if (mov.amount_in) totalCredits += mov.amount_in;
      if (mov.amount_out) totalDebits += mov.amount_out;
    });
  }
  
  const workbook = new ExcelJS.Workbook();
  
  // TAB 1: ORIGINAL DATA
  const wsOriginal = workbook.addWorksheet(t.sheetOriginal);
  
  // TAB 2: ANALYSIS
  const wsAnalysis = workbook.addWorksheet(t.sheetAnalysis);

  // ==========================================
  // TAB 1: METADATA + MIRROR
  // ==========================================
  
  // 1. HEADER (METADATA)
  wsOriginal.addRow([`${t.mainTitle}: ${data.metadata.bank}`]).font = { 
    bold: true, size: 16, color: { argb: "2E86C1" } 
  };
  wsOriginal.addRow([t.metaAccount, data.metadata.account_number]);
  wsOriginal.addRow([t.metaPeriod, data.metadata.period]);
  wsOriginal.addRow([t.metaCurrency, mainCurrency]);
  
  // Balances (if exist)
  if (data.metadata.opening_balance !== null && data.metadata.opening_balance !== undefined) {
    const rowOpening = wsOriginal.addRow([t.metaOpeningBalance, data.metadata.opening_balance]);
    rowOpening.getCell(2).numFmt = getCurrencyFormat(mainCurrency);
  }
  
  if (data.metadata.closing_balance !== null && data.metadata.closing_balance !== undefined) {
    const rowClosing = wsOriginal.addRow([t.metaClosingBalance, data.metadata.closing_balance]);
    rowClosing.getCell(2).numFmt = getCurrencyFormat(mainCurrency);
  }
  
  // Calculated totals
  const rowTotalCredits = wsOriginal.addRow([t.metaTotalCredits, totalCredits]);
  rowTotalCredits.getCell(2).numFmt = getCurrencyFormat(mainCurrency);
  rowTotalCredits.getCell(2).font = { color: { argb: "27AE60" }, bold: true };
  
  const rowTotalDebits = wsOriginal.addRow([t.metaTotalDebits, totalDebits]);
  rowTotalDebits.getCell(2).numFmt = getCurrencyFormat(mainCurrency);
  rowTotalDebits.getCell(2).font = { color: { argb: "C0392B" }, bold: true };
  
  wsOriginal.addRow([]);

  // 2. MIRROR TABLE (ORIGINAL)
  const titleMirror = wsOriginal.addRow([t.titleRegistered]);
  titleMirror.font = { bold: true, size: 12, color: { argb: "E67E22" } };
  
  if(data.mirror && data.mirror.columns) {
    const headerMirror = wsOriginal.addRow(data.mirror.columns);
    headerMirror.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDEBD0' } };
      cell.font = { bold: true, color: { argb: '9C640C' } };
      cell.border = { bottom: { style: 'thin' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Add data as pure TEXT
    data.mirror.rows.forEach((rowRaw: string[]) => {
      const row = wsOriginal.addRow(rowRaw);
      row.eachCell((cell) => {
        cell.numFmt = '@';
        cell.alignment = { vertical: 'top', wrapText: false };
      });
    });

    // DYNAMIC WIDTHS
    data.mirror.columns.forEach((column: string, index: number) => {
      const columnIndex = index + 1;
      const columnValues = [
        column, 
        ...data.mirror.rows.map((r: any[]) => r[index])
      ];
      const optimalWidth = calculateColumnWidth(columnValues, 12, 50);
      wsOriginal.getColumn(columnIndex).width = optimalWidth;
    });
  }

  // ==========================================
  // TAB 2: ANALYSIS
  // ==========================================
  
  // 1. ANALYSIS TABLE (NORMALIZED)
  const titleAudit = wsAnalysis.addRow([t.titleAudit]);
  titleAudit.font = { bold: true, size: 14, color: { argb: "27AE60" } };
  wsAnalysis.addRow([]);

  const headerAnalysis = wsAnalysis.addRow([
    t.stdDate, 
    t.stdDesc, 
    t.stdDebit, 
    t.stdCredit,
    t.stdCurrency,
    t.stdBalance
  ]);

  headerAnalysis.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D5F5E3' } };
    cell.font = { bold: true, color: { argb: '145A32' } };
    cell.border = { bottom: { style: 'medium', color: { argb: '27AE60' } } };
    cell.alignment = { horizontal: 'center' };
  });

  // Normalized data
  data.analysis.forEach((m: any) => {
    const row = wsAnalysis.addRow([
      m.date,
      m.description,
      m.amount_out !== 0 ? m.amount_out : null,
      m.amount_in !== 0 ? m.amount_in : null,
      m.currency,
      m.balance
    ]);
    
    // Number format with currency
    row.getCell(3).numFmt = getCurrencyFormat(m.currency);
    row.getCell(3).font = { color: { argb: "C0392B" } };
    
    row.getCell(4).numFmt = getCurrencyFormat(m.currency);
    row.getCell(4).font = { color: { argb: "27AE60" } };
    
    row.getCell(6).numFmt = getCurrencyFormat(m.currency);
  });

  // Width adjustments for analysis tab
  wsAnalysis.getColumn(1).width = 15;
  const descriptions = data.analysis.map((m: any) => m.description);
  const widthDesc = calculateColumnWidth(descriptions, 30, 100);
  wsAnalysis.getColumn(2).width = widthDesc;
  wsAnalysis.getColumn(3).width = 15;
  wsAnalysis.getColumn(4).width = 15;
  wsAnalysis.getColumn(5).width = 8;
  wsAnalysis.getColumn(6).width = 15;

  const excelBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(excelBuffer);
}