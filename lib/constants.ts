// ========================================
// CONFIGURACIÓN DE MONEDAS
// ========================================

export const MONEDAS_CONFIG: Record<string, { simbolo: string; decimales: number; formato: string }> = {
  ARS: { simbolo: "$", decimales: 2, formato: '"$"#,##0.00' },
  USD: { simbolo: "$", decimales: 2, formato: '"$"#,##0.00' },
  EUR: { simbolo: "€", decimales: 2, formato: '"€"#,##0.00' },
  GBP: { simbolo: "£", decimales: 2, formato: '"£"#,##0.00' },
  CNY: { simbolo: "¥", decimales: 2, formato: '"¥"#,##0.00' },
  JPY: { simbolo: "¥", decimales: 0, formato: '"¥"#,##0' },
  BRL: { simbolo: "R$", decimales: 2, formato: '"R$"#,##0.00' },
  MXN: { simbolo: "$", decimales: 2, formato: '"$"#,##0.00' },
  CLP: { simbolo: "$", decimales: 0, formato: '"$"#,##0' },
  COP: { simbolo: "$", decimales: 2, formato: '"$"#,##0.00' },
};

// ========================================
// TRADUCCIONES PARA TARJETA DE CRÉDITO
// ========================================

export const traduccionesCredito: Record<string, any> = {
  es: {
    titulo_principal: "RESUMEN",
    hoja_original: "Datos Originales",
    hoja_analisis: "Análisis",
    titulo_espejo: "📋 MOVIMIENTOS REGISTRADOS",
    titulo_auditoria: "🧠 ANÁLISIS DE CONSUMOS",
    titulo_futuro: "📅 COMPROMISOS FUTUROS (CUOTAS)",
    meta_vencimiento: "Vencimiento:",
    meta_total: "Total a Pagar ({moneda}):",
    norm_fecha: "FECHA STD",
    norm_tarjeta: "TARJETA",
    norm_desc: "DESCRIPCIÓN",
    norm_cuota: "CUOTA",
    norm_moneda: "MON",
    norm_importe: "IMPORTE",
    norm_tipo: "TIPO",
    fut_mes: "MES / AÑO",
    fut_concepto: "CONCEPTO",
    fut_monto: "MONTO ESTIMADO"
  },
  en: {
    titulo_principal: "SUMMARY",
    hoja_original: "Original Data",
    hoja_analisis: "Analysis",
    titulo_espejo: "📋 REGISTERED TRANSACTIONS",
    titulo_auditoria: "🧠 SPENDING ANALYSIS",
    titulo_futuro: "📅 FUTURE COMMITMENTS",
    meta_vencimiento: "Due Date:",
    meta_total: "Total to Pay ({moneda}):",
    norm_fecha: "STD DATE",
    norm_tarjeta: "CARD",
    norm_desc: "DESCRIPTION",
    norm_cuota: "INSTALLMENT",
    norm_moneda: "CUR",
    norm_importe: "AMOUNT",
    norm_tipo: "TYPE",
    fut_mes: "MONTH / YEAR",
    fut_concepto: "CONCEPT",
    fut_monto: "ESTIMATED AMOUNT"
  },
  zh: {
    titulo_principal: "摘要",
    hoja_original: "原始数据",
    hoja_analisis: "分析",
    titulo_espejo: "📋 已登记交易",
    titulo_auditoria: "🧠 消费分析",
    titulo_futuro: "📅 未来承诺（分期付款）",
    meta_vencimiento: "到期日期:",
    meta_total: "应付总额 ({moneda}):",
    norm_fecha: "标准日期",
    norm_tarjeta: "卡片",
    norm_desc: "描述",
    norm_cuota: "分期",
    norm_moneda: "货币",
    norm_importe: "金额",
    norm_tipo: "类型",
    fut_mes: "月份 / 年份",
    fut_concepto: "概念",
    fut_monto: "估计金额"
  },
  ja: {
    titulo_principal: "要約",
    hoja_original: "元データ",
    hoja_analisis: "分析",
    titulo_espejo: "📋 登録された取引",
    titulo_auditoria: "🧠 消費分析",
    titulo_futuro: "📅 将来のコミットメント（分割払い）",
    meta_vencimiento: "支払期限:",
    meta_total: "支払総額 ({moneda}):",
    norm_fecha: "標準日付",
    norm_tarjeta: "カード",
    norm_desc: "説明",
    norm_cuota: "分割払い",
    norm_moneda: "通貨",
    norm_importe: "金額",
    norm_tipo: "タイプ",
    fut_mes: "月 / 年",
    fut_concepto: "コンセプト",
    fut_monto: "推定金額"
  },
  pt: {
    titulo_principal: "RESUMO",
    hoja_original: "Dados Originais",
    hoja_analisis: "Análise",
    titulo_espejo: "📋 TRANSAÇÕES REGISTRADAS",
    titulo_auditoria: "🧠 ANÁLISE DE CONSUMOS",
    titulo_futuro: "📅 COMPROMISSOS FUTUROS (PARCELAS)",
    meta_vencimiento: "Vencimento:",
    meta_total: "Total a Pagar ({moneda}):",
    norm_fecha: "DATA STD",
    norm_tarjeta: "CARTÃO",
    norm_desc: "DESCRIÇÃO",
    norm_cuota: "PARCELA",
    norm_moneda: "MOEDA",
    norm_importe: "VALOR",
    norm_tipo: "TIPO",
    fut_mes: "MÊS / ANO",
    fut_concepto: "CONCEITO",
    fut_monto: "VALOR ESTIMADO"
  },
  fr: {
    titulo_principal: "RÉSUMÉ",
    hoja_original: "Données Originales",
    hoja_analisis: "Analyse",
    titulo_espejo: "📋 TRANSACTIONS ENREGISTRÉES",
    titulo_auditoria: "🧠 ANALYSE DES DÉPENSES",
    titulo_futuro: "📅 ENGAGEMENTS FUTURS (VERSEMENTS)",
    meta_vencimiento: "Date d'échéance:",
    meta_total: "Total à Payer ({moneda}):",
    norm_fecha: "DATE STD",
    norm_tarjeta: "CARTE",
    norm_desc: "DESCRIPTION",
    norm_cuota: "VERSEMENT",
    norm_moneda: "DEV",
    norm_importe: "MONTANT",
    norm_tipo: "TYPE",
    fut_mes: "MOIS / ANNÉE",
    fut_concepto: "CONCEPT",
    fut_monto: "MONTANT ESTIMÉ"
  }
};

// ========================================
// TRADUCCIONES PARA EXTRACTO BANCARIO
// ========================================

export const traduccionesBanco: Record<string, any> = {
  es: {
    titulo_principal: "RESUMEN BANCARIO",
    hoja_original: "Datos Originales",
    hoja_analisis: "Análisis",
    titulo_espejo: "📋 MOVIMIENTOS REGISTRADOS",
    titulo_auditoria: "🧠 ANÁLISIS DE MOVIMIENTOS",
    meta_cuenta: "Cuenta:",
    meta_periodo: "Período:",
    meta_moneda: "Moneda:",
    meta_saldo_inicial: "Saldo Inicial:",
    meta_saldo_final: "Saldo Final:",
    meta_total_ingresos: "Total Ingresos:",
    meta_total_egresos: "Total Egresos:",
    norm_fecha: "FECHA STD",
    norm_desc: "DESCRIPCIÓN",
    norm_egreso: "EGRESO (-)",
    norm_ingreso: "INGRESO (+)",
    norm_moneda: "MON",
    norm_saldo: "SALDO"
  },
  en: {
    titulo_principal: "BANK STATEMENT",
    hoja_original: "Original Data",
    hoja_analisis: "Analysis",
    titulo_espejo: "📋 REGISTERED TRANSACTIONS",
    titulo_auditoria: "🧠 TRANSACTION ANALYSIS",
    meta_cuenta: "Account:",
    meta_periodo: "Period:",
    meta_moneda: "Currency:",
    meta_saldo_inicial: "Opening Balance:",
    meta_saldo_final: "Closing Balance:",
    meta_total_ingresos: "Total Credits:",
    meta_total_egresos: "Total Debits:",
    norm_fecha: "STD DATE",
    norm_desc: "DESCRIPTION",
    norm_egreso: "DEBIT (-)",
    norm_ingreso: "CREDIT (+)",
    norm_moneda: "CUR",
    norm_saldo: "BALANCE"
  },
  zh: {
    titulo_principal: "银行对账单",
    hoja_original: "原始数据",
    hoja_analisis: "分析",
    titulo_espejo: "📋 已登记交易",
    titulo_auditoria: "🧠 交易分析",
    meta_cuenta: "账户:",
    meta_periodo: "期间:",
    meta_moneda: "货币:",
    meta_saldo_inicial: "期初余额:",
    meta_saldo_final: "期末余额:",
    meta_total_ingresos: "总收入:",
    meta_total_egresos: "总支出:",
    norm_fecha: "标准日期",
    norm_desc: "描述",
    norm_egreso: "支出 (-)",
    norm_ingreso: "收入 (+)",
    norm_moneda: "货币",
    norm_saldo: "余额"
  },
  ja: {
    titulo_principal: "銀行明細書",
    hoja_original: "元データ",
    hoja_analisis: "分析",
    titulo_espejo: "📋 登録された取引",
    titulo_auditoria: "🧠 取引分析",
    meta_cuenta: "口座:",
    meta_periodo: "期間:",
    meta_moneda: "通貨:",
    meta_saldo_inicial: "期首残高:",
    meta_saldo_final: "期末残高:",
    meta_total_ingresos: "総入金:",
    meta_total_egresos: "総出金:",
    norm_fecha: "標準日付",
    norm_desc: "説明",
    norm_egreso: "出金 (-)",
    norm_ingreso: "入金 (+)",
    norm_moneda: "通貨",
    norm_saldo: "残高"
  },
  pt: {
    titulo_principal: "EXTRATO BANCÁRIO",
    hoja_original: "Dados Originais",
    hoja_analisis: "Análise",
    titulo_espejo: "📋 TRANSAÇÕES REGISTRADAS",
    titulo_auditoria: "🧠 ANÁLISE DE TRANSAÇÕES",
    meta_cuenta: "Conta:",
    meta_periodo: "Período:",
    meta_moneda: "Moeda:",
    meta_saldo_inicial: "Saldo Inicial:",
    meta_saldo_final: "Saldo Final:",
    meta_total_ingresos: "Total Créditos:",
    meta_total_egresos: "Total Débitos:",
    norm_fecha: "DATA STD",
    norm_desc: "DESCRIÇÃO",
    norm_egreso: "DÉBITO (-)",
    norm_ingreso: "CRÉDITO (+)",
    norm_moneda: "MOEDA",
    norm_saldo: "SALDO"
  },
  fr: {
    titulo_principal: "RELEVÉ BANCAIRE",
    hoja_original: "Données Originales",
    hoja_analisis: "Analyse",
    titulo_espejo: "📋 TRANSACTIONS ENREGISTRÉES",
    titulo_auditoria: "🧠 ANALYSE DES TRANSACTIONS",
    meta_cuenta: "Compte:",
    meta_periodo: "Période:",
    meta_moneda: "Devise:",
    meta_saldo_inicial: "Solde Initial:",
    meta_saldo_final: "Solde Final:",
    meta_total_ingresos: "Total Crédits:",
    meta_total_egresos: "Total Débits:",
    norm_fecha: "DATE STD",
    norm_desc: "DESCRIPTION",
    norm_egreso: "DÉBIT (-)",
    norm_ingreso: "CRÉDIT (+)",
    norm_moneda: "DEV",
    norm_saldo: "SOLDE"
  }
};

// ========================================
// FUNCIONES AUXILIARES
// ==

export function obtenerTraduccion(idioma: string, esCredito: boolean): any {
  const diccionario = esCredito ? traduccionesCredito : traduccionesBanco;
  return diccionario[idioma] || diccionario["en"];
}

export function obtenerFormatoMoneda(moneda: string): string {
  return MONEDAS_CONFIG[moneda]?.formato || '#,##0.00';
}