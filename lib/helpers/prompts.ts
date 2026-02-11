export const promptClasificacion = `
    Analiza este documento PDF financiero y clasifícalo con precisión.

    TIPOS VÁLIDOS:

    1. CREDITO (Resumen de Tarjeta de Crédito):
    ✓ Contiene: consumos en comercios, cuotas (ej: "1/6"), fecha de vencimiento
    ✓ Contiene: total a pagar, límite de crédito, intereses
    ✓ Estructura: lista de compras con montos

    2. BANCO (Extracto de Cuenta Bancaria):
    ✓ Contiene: débitos y créditos separados o combinados
    ✓ Contiene: saldo (inicial/final), número de cuenta/CBU
    ✓ Estructura: movimientos con columna de saldo corriente

    3. INVALIDO:
    ✗ Facturas, recibos, contratos, estados de cuenta de inversión
    ✗ Cualquier documento que NO sea resumen de crédito ni extracto bancario

    IMPORTANTE:
    - Si tiene "cuotas" (1/3, 2/12, etc.) → casi siempre es CREDITO
    - Si tiene "saldo" que cambia con cada movimiento → casi siempre es BANCO
    - Si no tiene ninguno de los indicadores anteriores → INVALIDO

    Responde ÚNICAMENTE en este formato JSON:
    {
    "tipo": "CREDITO" | "BANCO" | "INVALIDO",
    "confianza": "alta" | "media" | "baja",
    "razon": "Explicación breve (máx 20 palabras)"
    }

    NO incluyas markdown, ni comentarios, ni texto adicional. SOLO el JSON.
    `;

export const promptCredito = `
      Eres un experto en extracción de datos de resúmenes de tarjetas de crédito. Analiza este documento en CUATRO NIVELES.

      NIVEL 0: DETECCIÓN DE CONTEXTO
      - Detecta el idioma del documento (código ISO 639-1: es, en, zh, ja, pt, fr, de, etc.)
      - Detecta la MONEDA PRINCIPAL del resumen (código ISO 4217: USD, EUR, ARS, CNY, JPY, BRL, etc.)
      - Si hay múltiples monedas, identifica la principal y las secundarias.

      NIVEL 1: METADATOS CLAVE
      - Banco o emisor de la tarjeta (nombre completo)
      - Fecha de Vencimiento del pago
      - Total a Pagar (en todas las monedas presentes)

      NIVEL 2: TRANSCRIPCIÓN FIEL (ESPEJO) - MUY IMPORTANTE
      Esta sección debe ser una copia EXACTA de la tabla de consumos tal como aparece en el PDF.
      
      REGLAS ESTRICTAS:
      1. Usa los nombres de columnas EXACTOS del PDF (respeta mayúsculas, acentos, espacios)
      2. Mantén los formatos de fecha y números SIN MODIFICAR (si dice "27/11/25", ponlo así)
      3. Mantén los valores de texto exactamente como aparecen
      4. Si una celda está vacía o tiene "-", déjala así
      5. NO interpretes ni transformes nada, solo copia
      6. Incluye TODAS las filas de la tabla, incluso impuestos, comisiones, pagos
      7. Alinea correctamente: cada valor debe ir en su columna correspondiente
      8. Si hay saltos de línea dentro de una celda, unifica el texto en una sola línea
      9. Valida que todas las filas tengan la misma cantidad de columnas
      
      FORMATO ESPERADO:
      {
        "columnas": ["FECHA", "TARJETA", "DETALLE", ...],  // Nombres ORIGINALES
        "datos": [
          ["27/11/25", "Naranja X", "COMISION...", ...],   // Valores ORIGINALES
          ["15/08/25", "NX Visa", "CASTELLANAS", ...],
          ...
        ]
      }

      NIVEL 3: NORMALIZACIÓN (ANÁLISIS)
      Ahora SÍ transforma cada movimiento a un esquema estándar:
      
      - date: Formato YYYY-MM-DD (convierte la fecha original)
      - card: Nombre de la tarjeta o adicional
      - description: Texto limpio del comercio
      - installment: Formato "01/12" (Cuota actual / Total). Si no es cuota: null
      - currency: Código ISO (ARS, USD, CNY, etc.)
      - amount: Número float
      - type: Clasifica el movimiento en uno de estos tipos:
        * "consumo" - Compras normales
        * "pago" - Pagos realizados (identifica por palabras: PAGO, PAYMENT, ABONO, 支付)
        * "comision" - Comisiones bancarias
        * "impuesto" - IVA, impuesto de sellos, etc.
        * "devolucion" - Devoluciones o reintegros
      
      IMPORTANTE PARA DETECTAR PAGOS:
      - Si el detalle contiene: "PAGO", "PAYMENT", "ABONO", "PAY", "付款", "支付" → type: "pago", amount: negativo
      - Si el detalle contiene: "DEVOLUCION", "REFUND", "REINTEGRO" → type: "devolucion", amount: negativo
      - Caso contrario → type: "consumo", amount: positivo (o el signo que indique el PDF)

      NIVEL 4: FUTURO (Proyecciones)
      - Busca secciones de "Cuotas a vencer", "Cuotas futuras", "Próximos vencimientos"
      - Para cada mes futuro, extrae:
        * mes: "Marzo/26" (formato del PDF)
        * concepto: Descripción de qué cuota es (ej: "MERPAGO PASAJESCDP - Cuota 2/3")
        * monto: Valor numérico
        * moneda: Código ISO

      FORMATO DE SALIDA (JSON ESTRICTO):
      {
        "idioma_detectado": "codigo_iso_idioma",
        "moneda_principal": "codigo_iso_moneda",
        "metadata": {
          "banco": "String",
          "vencimiento": "String",
          "totales": [
            { "moneda": "ARS", "monto": number }
          ]
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
            "amount": number,
            "type": "consumo|pago|comision|impuesto|devolucion"
          }
        ],
        "futuro": [
          { "mes": "String", "concepto": "String", "monto": number, "moneda": "String" }
        ]
      }
    `;

export const promptBanco = `
      Eres un experto en extracción de datos de extractos bancarios. Analiza este documento en CUATRO NIVELES.

      NIVEL 0: DETECCIÓN DE CONTEXTO
      - Detecta el idioma del documento (código ISO 639-1: es, en, zh, ja, pt, fr, de, etc.)
      - Detecta la MONEDA PRINCIPAL del extracto (código ISO 4217: USD, EUR, ARS, CNY, JPY, BRL, etc.)
      - Si hay movimientos en múltiples monedas, identifica la principal

      NIVEL 1: METADATOS CLAVE
      - Banco o entidad financiera (nombre completo)
      - Número de cuenta (completo o parcial)
      - Período del extracto (fecha inicio - fecha fin)
      - Saldo Inicial (si está disponible, sino null)
      - Saldo Final (si está disponible, sino null)

      NIVEL 2: TRANSCRIPCIÓN FIEL (ESPEJO)
      Esta sección debe ser una copia EXACTA de la tabla de movimientos tal como aparece en el PDF.
      
      REGLAS ESTRICTAS:
      1. Usa los nombres de columnas EXACTOS del PDF (respeta mayúsculas, acentos, espacios)
      2. Mantén los formatos de fecha y números SIN MODIFICAR (si dice "15/01/25", ponlo así)
      3. Mantén los valores de texto exactamente como aparecen
      4. Si una celda está vacía o tiene "-", déjala así
      5. NO interpretes ni transformes nada, solo copia
      6. Incluye TODAS las filas de la tabla de movimientos
      7. Alinea correctamente: cada valor debe ir en su columna correspondiente
      8. Si hay saltos de línea dentro de una celda, unifica el texto en una sola línea
      9. Valida que todas las filas tengan la misma cantidad de columnas
      
      FORMATO ESPERADO:
      {
        "columnas": ["FECHA", "DESCRIPCIÓN", "DÉBITO", "CRÉDITO", "SALDO"],
        "datos": [
          ["15/01/25", "TRANSFERENCIA RECIBIDA", "", "5000.00", "25000.00"],
          ["16/01/25", "COMPRA EN COMERCIO", "1500.00", "", "23500.00"],
          ...
        ]
      }

      NIVEL 3: NORMALIZACIÓN (ANÁLISIS)
      Ahora SÍ transforma cada movimiento a un esquema estándar:
      
      - date: Formato YYYY-MM-DD (convierte la fecha original)
      - description: Texto limpio del movimiento
      - amount_out: Número positivo para egresos/débitos (si no es egreso: 0)
      - amount_in: Número positivo para ingresos/créditos (si no es ingreso: 0)
      - currency: Código ISO de la moneda de ESTE movimiento específico (puede variar por fila)
      - balance: Saldo después de este movimiento (número)
      
      IMPORTANTE PARA DETECTAR INGRESOS VS EGRESOS:
      - Analiza las columnas del PDF:
        * Si hay columnas separadas "DÉBITO" y "CRÉDITO" → usa esa info
        * Si hay una sola columna con signos → negativo = egreso, positivo = ingreso
        * Si no hay signo → analiza la descripción (PAGO, COMPRA, RETIRO = egreso)
      - amount_out y amount_in SIEMPRE son positivos (el signo está implícito en la columna)
      - Si es egreso: amount_out = valor, amount_in = 0
      - Si es ingreso: amount_in = valor, amount_out = 0

      FORMATO DE SALIDA (JSON ESTRICTO):
      {
        "idioma_detectado": "codigo_iso_idioma",
        "moneda_principal": "codigo_iso_moneda",
        "metadata": {
          "banco": "String",
          "cuenta": "String",
          "periodo": "String",
          "saldo_inicial": number o null,
          "saldo_final": number o null
        },
        "espejo": {
          "columnas": ["Col1", "Col2"...],
          "datos": [ ["Val1", "Val2"...] ]
        },
        "auditoria": [
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