// ========================================
// CURRENCY CONFIGURATION
// ========================================

export const CURRENCY_CONFIG: Record<string, { symbol: string; decimals: number; format: string }> = {
  ARS: { symbol: "$", decimals: 2, format: '"$"#,##0.00' },
  USD: { symbol: "$", decimals: 2, format: '"$"#,##0.00' },
  EUR: { symbol: "€", decimals: 2, format: '"€"#,##0.00' },
  GBP: { symbol: "£", decimals: 2, format: '"£"#,##0.00' },
  CNY: { symbol: "¥", decimals: 2, format: '"¥"#,##0.00' },
  JPY: { symbol: "¥", decimals: 0, format: '"¥"#,##0' },
  BRL: { symbol: "R$", decimals: 2, format: '"R$"#,##0.00' },
  MXN: { symbol: "$", decimals: 2, format: '"$"#,##0.00' },
  CLP: { symbol: "$", decimals: 0, format: '"$"#,##0' },
  COP: { symbol: "$", decimals: 2, format: '"$"#,##0.00' },
};

// ========================================
// CREDIT CARD TRANSLATIONS
// ========================================

export const creditTranslations: Record<string, any> = {
  es: {
    mainTitle: "RESUMEN",
    sheetOriginal: "Datos Originales",
    sheetAnalysis: "Análisis",
    titleRegistered: "📋 MOVIMIENTOS REGISTRADOS",
    titleAudit: "🧠 ANÁLISIS DE CONSUMOS",
    titleFuture: "📅 COMPROMISOS FUTUROS (CUOTAS)",
    metaDueDate: "Vencimiento:",
    metaTotal: "Total a Pagar ({moneda}):",
    stdDate: "FECHA STD",
    stdCard: "TARJETA",
    stdDesc: "DESCRIPCIÓN",
    stdInstallment: "CUOTA",
    stdCurrency: "MON",
    stdAmount: "IMPORTE",
    stdType: "TIPO",
    estMonth: "MES / AÑO",
    estConcept: "CONCEPTO",
    estAmount: "MONTO ESTIMADO"
  },
  en: {
    mainTitle: "SUMMARY",
    sheetOriginal: "Original Data",
    sheetAnalysis: "Analysis",
    titleRegistered: "📋 REGISTERED TRANSACTIONS",
    titleAudit: "🧠 SPENDING ANALYSIS",
    titleFuture: "📅 FUTURE COMMITMENTS",
    metaDueDate: "Due Date:",
    metaTotal: "Total to Pay ({moneda}):",
    stdDate: "STD DATE",
    stdCard: "CARD",
    stdDesc: "DESCRIPTION",
    stdInstallment: "INSTALLMENT",
    stdCurrency: "CUR",
    stdAmount: "AMOUNT",
    stdType: "TYPE",
    estMonth: "MONTH / YEAR",
    estConcept: "CONCEPT",
    estAmount: "ESTIMATED AMOUNT"
  },
  zh: {
    mainTitle: "摘要",
    sheetOriginal: "原始数据",
    sheetAnalysis: "分析",
    titleRegistered: "📋 已登记交易",
    titleAudit: "🧠 消费分析",
    titleFuture: "📅 未来承诺（分期付款）",
    metaDueDate: "到期日期:",
    metaTotal: "应付总额 ({moneda}):",
    stdDate: "标准日期",
    stdCard: "卡片",
    stdDesc: "描述",
    stdInstallment: "分期",
    stdCurrency: "货币",
    stdAmount: "金额",
    stdType: "类型",
    estMonth: "月份 / 年份",
    estConcept: "概念",
    estAmount: "估计金额"
  },
  ja: {
    mainTitle: "要約",
    sheetOriginal: "元データ",
    sheetAnalysis: "分析",
    titleRegistered: "📋 登録された取引",
    titleAudit: "🧠 消費分析",
    titleFuture: "📅 将来のコミットメント（分割払い）",
    metaDueDate: "支払期限:",
    metaTotal: "支払総額 ({moneda}):",
    stdDate: "標準日付",
    stdCard: "カード",
    stdDesc: "説明",
    stdInstallment: "分割払い",
    stdCurrency: "通貨",
    stdAmount: "金額",
    stdType: "タイプ",
    estMonth: "月 / 年",
    estConcept: "コンセプト",
    estAmount: "推定金額"
  },
  pt: {
    mainTitle: "RESUMO",
    sheetOriginal: "Dados Originais",
    sheetAnalysis: "Análise",
    titleRegistered: "📋 TRANSAÇÕES REGISTRADAS",
    titleAudit: "🧠 ANÁLISE DE CONSUMOS",
    titleFuture: "📅 COMPROMISSOS FUTUROS (PARCELAS)",
    metaDueDate: "Vencimento:",
    metaTotal: "Total a Pagar ({moneda}):",
    stdDate: "DATA STD",
    stdCard: "CARTÃO",
    stdDesc: "DESCRIÇÃO",
    stdInstallment: "PARCELA",
    stdCurrency: "MOEDA",
    stdAmount: "VALOR",
    stdType: "TIPO",
    estMonth: "MÊS / ANO",
    estConcept: "CONCEITO",
    estAmount: "VALOR ESTIMADO"
  },
  fr: {
    mainTitle: "RÉSUMÉ",
    sheetOriginal: "Données Originales",
    sheetAnalysis: "Analyse",
    titleRegistered: "📋 TRANSACTIONS ENREGISTRÉES",
    titleAudit: "🧠 ANALYSE DES DÉPENSES",
    titleFuture: "📅 ENGAGEMENTS FUTURS (VERSEMENTS)",
    metaDueDate: "Date d'échéance:",
    metaTotal: "Total à Payer ({moneda}):",
    stdDate: "DATE STD",
    stdCard: "CARTE",
    stdDesc: "DESCRIPTION",
    stdInstallment: "VERSEMENT",
    stdCurrency: "DEV",
    stdAmount: "MONTANT",
    stdType: "TYPE",
    estMonth: "MOIS / ANNÉE",
    estConcept: "CONCEPT",
    estAmount: "MONTANT ESTIMÉ"
  }
};

// ========================================
// BANK STATEMENT TRANSLATIONS
// ========================================

export const bankTranslations: Record<string, any> = {
  es: {
    mainTitle: "RESUMEN BANCARIO",
    sheetOriginal: "Datos Originales",
    sheetAnalysis: "Análisis",
    titleRegistered: "📋 MOVIMIENTOS REGISTRADOS",
    titleAudit: "🧠 ANÁLISIS DE MOVIMIENTOS",
    metaAccount: "Cuenta:",
    metaPeriod: "Período:",
    metaCurrency: "Moneda:",
    metaOpeningBalance: "Saldo Inicial:",
    metaClosingBalance: "Saldo Final:",
    metaTotalCredits: "Total Ingresos:",
    metaTotalDebits: "Total Egresos:",
    stdDate: "FECHA STD",
    stdDesc: "DESCRIPCIÓN",
    stdDebit: "EGRESO (-)",
    stdCredit: "INGRESO (+)",
    stdCurrency: "MON",
    stdBalance: "SALDO"
  },
  en: {
    mainTitle: "BANK STATEMENT",
    sheetOriginal: "Original Data",
    sheetAnalysis: "Analysis",
    titleRegistered: "📋 REGISTERED TRANSACTIONS",
    titleAudit: "🧠 TRANSACTION ANALYSIS",
    metaAccount: "Account:",
    metaPeriod: "Period:",
    metaCurrency: "Currency:",
    metaOpeningBalance: "Opening Balance:",
    metaClosingBalance: "Closing Balance:",
    metaTotalCredits: "Total Credits:",
    metaTotalDebits: "Total Debits:",
    stdDate: "STD DATE",
    stdDesc: "DESCRIPTION",
    stdDebit: "DEBIT (-)",
    stdCredit: "CREDIT (+)",
    stdCurrency: "CUR",
    stdBalance: "BALANCE"
  },
  zh: {
    mainTitle: "银行对账单",
    sheetOriginal: "原始数据",
    sheetAnalysis: "分析",
    titleRegistered: "📋 已登记交易",
    titleAudit: "🧠 交易分析",
    metaAccount: "账户:",
    metaPeriod: "期间:",
    metaCurrency: "货币:",
    metaOpeningBalance: "期初余额:",
    metaClosingBalance: "期末余额:",
    metaTotalCredits: "总收入:",
    metaTotalDebits: "总支出:",
    stdDate: "标准日期",
    stdDesc: "描述",
    stdDebit: "支出 (-)",
    stdCredit: "收入 (+)",
    stdCurrency: "货币",
    stdBalance: "余额"
  },
  ja: {
    mainTitle: "銀行明細書",
    sheetOriginal: "元データ",
    sheetAnalysis: "分析",
    titleRegistered: "📋 登録された取引",
    titleAudit: "🧠 取引分析",
    metaAccount: "口座:",
    metaPeriod: "期間:",
    metaCurrency: "通貨:",
    metaOpeningBalance: "期首残高:",
    metaClosingBalance: "期末残高:",
    metaTotalCredits: "総入金:",
    metaTotalDebits: "総出金:",
    stdDate: "標準日付",
    stdDesc: "説明",
    stdDebit: "出金 (-)",
    stdCredit: "入金 (+)",
    stdCurrency: "通貨",
    stdBalance: "残高"
  },
  pt: {
    mainTitle: "EXTRATO BANCÁRIO",
    sheetOriginal: "Dados Originais",
    sheetAnalysis: "Análise",
    titleRegistered: "📋 TRANSAÇÕES REGISTRADAS",
    titleAudit: "🧠 ANÁLISE DE TRANSAÇÕES",
    metaAccount: "Conta:",
    metaPeriod: "Período:",
    metaCurrency: "Moeda:",
    metaOpeningBalance: "Saldo Inicial:",
    metaClosingBalance: "Saldo Final:",
    metaTotalCredits: "Total Créditos:",
    metaTotalDebits: "Total Débitos:",
    stdDate: "DATA STD",
    stdDesc: "DESCRIÇÃO",
    stdDebit: "DÉBITO (-)",
    stdCredit: "CRÉDITO (+)",
    stdCurrency: "MOEDA",
    stdBalance: "SALDO"
  },
  fr: {
    mainTitle: "RELEVÉ BANCAIRE",
    sheetOriginal: "Données Originales",
    sheetAnalysis: "Analyse",
    titleRegistered: "📋 TRANSACTIONS ENREGISTRÉES",
    titleAudit: "🧠 ANALYSE DES TRANSACTIONS",
    metaAccount: "Compte:",
    metaPeriod: "Période:",
    metaCurrency: "Devise:",
    metaOpeningBalance: "Solde Initial:",
    metaClosingBalance: "Solde Final:",
    metaTotalCredits: "Total Crédits:",
    metaTotalDebits: "Total Débits:",
    stdDate: "DATE STD",
    stdDesc: "DESCRIPTION",
    stdDebit: "DÉBIT (-)",
    stdCredit: "CRÉDIT (+)",
    stdCurrency: "DEV",
    stdBalance: "SOLDE"
  }
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export function getTranslation(language: string, isCredit: boolean): any {
  const dictionary = isCredit ? creditTranslations : bankTranslations;
  return dictionary[language] || dictionary["en"];
}

export function getCurrencyFormat(currency: string): string {
  return CURRENCY_CONFIG[currency]?.format || '#,##0.00';
}