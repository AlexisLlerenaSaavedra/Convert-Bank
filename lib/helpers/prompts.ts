    export const classificationPrompt = `
Classify this PDF into ONE category:

1. CREDIT: Credit card summary/statement
   Keywords: "cuota", "1/", "2/12", "vencimiento" (due date), "consumo", "tarjeta", "visa", "mastercard", "limit"

2. BANK: Bank account statement
   Keywords: "débito" (debit), "crédito" (credit), "saldo" (balance), "CBU", "IBAN", "transferencia", "movimientos", "cuenta"

3. INVALID: Any other document (invoice, receipt, contract, investment report, etc.)

Analyze ONLY the first page if possible for faster classification.

Reply ONLY with this JSON, no markdown, no additional explanations:
{"type": "CREDIT"|"BANK"|"INVALID", "reason": "max 8 words"}

Valid examples:
{"type": "CREDIT", "reason": "contains installments and due date"}
{"type": "BANK", "reason": "transactions with debits and credits"}
{"type": "INVALID", "reason": "utility bill"}
`;

export const creditPrompt = `
      You are an expert in extracting data from credit card statements. Analyze this document in FOUR LEVELS.

      LEVEL 0: CONTEXT DETECTION
      - Detect the document language (ISO 639-1 code: es, en, zh, ja, pt, fr, de, etc.)
      - Detect the MAIN CURRENCY of the statement (ISO 4217 code: USD, EUR, ARS, CNY, JPY, BRL, etc.)
      - If multiple currencies exist, identify the main one and secondary ones.

      LEVEL 1: KEY METADATA
      - Bank or card issuer (full name)
      - Payment Due Date
      - Total to Pay (in all present currencies)

      LEVEL 2: FAITHFUL TRANSCRIPTION (MIRROR) - VERY IMPORTANT
      This section must be an EXACT COPY of the transaction table as it appears in the PDF.
      
      STRICT RULES:
      1. Use the EXACT column names from the PDF (respect uppercase, accents, spaces)
      2. Keep date and number formats UNMODIFIED (if it says "27/11/25", keep it that way)
      3. Keep text values exactly as they appear
      4. If a cell is empty or has "-", leave it as is
      5. DO NOT interpret or transform anything, just copy
      6. Include ALL rows from the table, including taxes, fees, payments
      7. Align correctly: each value must go in its corresponding column
      8. If there are line breaks within a cell, unify the text into a single line
      9. Validate that all rows have the same number of columns
      
      EXPECTED FORMAT:
      {
        "columns": ["FECHA", "TARJETA", "DETALLE", ...],  // ORIGINAL names
        "rows": [
          ["27/11/25", "Naranja X", "COMISION...", ...],   // ORIGINAL values
          ["15/08/25", "NX Visa", "CASTELLANAS", ...],
          ...
        ]
      }

      LEVEL 3: NORMALIZATION (ANALYSIS)
      Now DO transform each transaction into a standard schema:
      
      - date: Format YYYY-MM-DD (convert the original date)
      - card: Name of the card or cardholder
      - description: Clean merchant text/description
      - installment: Format "01/12" (Current installment / Total). If not an installment: null
      - currency: ISO Code (ARS, USD, CNY, etc.)
      - amount: Float number
      - type: Classify the transaction into one of these types:
        * "purchase" - Normal purchases/consumption
        * "payment" - Payments made (identify by words: PAGO, PAYMENT, ABONO, 支付)
        * "fee" - Bank fees/commissions
        * "tax" - VAT, stamp duty, etc.
        * "refund" - Returns or reimbursements
      
      IMPORTANT FOR DETECTING PAYMENTS:
      - If detail contains: "PAGO", "PAYMENT", "ABONO", "PAY", "付款", "支付" -> type: "payment", amount: negative
      - If detail contains: "DEVOLUCION", "REFUND", "REINTEGRO" -> type: "refund", amount: negative
      - Otherwise -> type: "purchase", amount: positive (or whatever sign the PDF indicates)

      LEVEL 4: FUTURE (Projections)
      - Look for sections like "Installments to come", "Future installments", "Next due dates"
      - For each future month, extract:
        * month: "March/26" (PDF format)
        * concept: Description of the installment (e.g., "MERPAGO PASAJESCDP - Installment 2/3")
        * amount: Numeric value
        * currency: ISO Code

      OUTPUT FORMAT (STRICT JSON):
      {
        "detected_language": "iso_code",
        "main_currency": "iso_code",
        "metadata": {
          "bank": "String",
          "due_date": "String",
          "totals": [
            { "currency": "ARS", "amount": number }
          ]
        },
        "mirror": {
          "columns": ["Col1", "Col2"...],
          "rows": [ ["Val1", "Val2"...] ]
        },
        "analysis": [
          {
            "date": "YYYY-MM-DD",
            "card": "String",
            "description": "String",
            "installment": "String" or null,
            "currency": "String",
            "amount": number,
            "type": "purchase|payment|fee|tax|refund"
          }
        ],
        "future": [
          { "month": "String", "concept": "String", "amount": number, "currency": "String" }
        ]
      }
    `;

export const bankPrompt = `
      You are an expert in extracting data from bank account statements. Analyze this document in FOUR LEVELS.

      LEVEL 0: CONTEXT DETECTION
      - Detect the document language (ISO 639-1 code: es, en, zh, ja, pt, fr, de, etc.)
      - Detect the MAIN CURRENCY of the statement (ISO 4217 code: USD, EUR, ARS, CNY, JPY, BRL, etc.)
      - If there are transactions in multiple currencies, identify the main one.

      LEVEL 1: KEY METADATA
      - Bank or financial institution (full name)
      - Account number (full or partial)
      - Statement Period (start date - end date)
      - Opening Balance (if available, else null)
      - Closing Balance (if available, else null)

      LEVEL 2: FAITHFUL TRANSCRIPTION (MIRROR)
      This section must be an EXACT COPY of the transaction table as it appears in the PDF.
      
      STRICT RULES:
      1. Use the EXACT column names from the PDF (respect uppercase, accents, spaces)
      2. Keep date and number formats UNMODIFIED (if it says "15/01/25", keep it that way)
      3. Keep text values exactly as they appear
      4. If a cell is empty or has "-", leave it as is
      5. DO NOT interpret or transform anything, just copy
      6. Include ALL rows from the transaction table
      7. Align correctly: each value must go in its corresponding column
      8. If there are line breaks within a cell, unify the text into a single line
      9. Validate that all rows have the same number of columns
      
      EXPECTED FORMAT:
      {
        "columns": ["FECHA", "DESCRIPCIÓN", "DÉBITO", "CRÉDITO", "SALDO"],
        "rows": [
          ["15/01/25", "TRANSFERENCIA RECIBIDA", "", "5000.00", "25000.00"],
          ["16/01/25", "COMPRA EN COMERCIO", "1500.00", "", "23500.00"],
          ...
        ]
      }

      LEVEL 3: NORMALIZATION (ANALYSIS)
      Now DO transform each transaction into a standard schema:
      
      - date: Format YYYY-MM-DD (convert the original date)
      - description: Clean transaction text
      - amount_out: Positive number for debits/outflows (if not a debit: 0)
      - amount_in: Positive number for credits/inflows (if not a credit: 0)
      - currency: ISO Code for THIS specific transaction (can vary per row)
      - balance: Balance after this transaction (number)
      
      IMPORTANT FOR DETECTING INFLOWS VS OUTFLOWS:
      - Analyze the PDF columns:
        * If there are separate "DEBIT" and "CREDIT" columns -> use that info
        * If there is a single column with signs -> negative = debit (out), positive = credit (in)
        * If no signs -> analyze description (PAYMENT, PURCHASE, WITHDRAWAL = debit)
      - amount_out and amount_in are ALWAYS positive (the sign is implied by the column)
      - If debit: amount_out = value, amount_in = 0
      - If credit: amount_in = value, amount_out = 0

      OUTPUT FORMAT (STRICT JSON):
      {
        "detected_language": "iso_code",
        "main_currency": "iso_code",
        "metadata": {
          "bank": "String",
          "account_number": "String",
          "period": "String",
          "opening_balance": number or null,
          "closing_balance": number or null
        },
        "mirror": {
          "columns": ["Col1", "Col2"...],
          "rows": [ ["Val1", "Val2"...] ]
        },
        "analysis": [
          {
            "date": "YYYY-MM-DD",
            "description": "String",
            "amount_out": number,
            "amount_in": number,
            "currency": "String",
            "balance": number
          }
        ]
      }
    `;