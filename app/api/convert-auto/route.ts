import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { clasificarDocumento, TipoDocumento } from "@/lib/helpers/clasificador";
import { generarExcelCredito, generarExcelBanco } from "@/lib/helpers/excelGenerators";
import { promptCredito, promptBanco } from "@/lib/helpers/prompts";

// ========================================
// CONFIGURACIÓN
// ========================================

const API_KEY = process.env.GEMINI_API_KEY as string;

if (!API_KEY) {
  throw new Error("Falta la GEMINI_API_KEY en las variables de entorno");
}

// ========================================
// ENDPOINT PRINCIPAL
// ========================================

export async function POST(req: NextRequest) {
  try {
    console.log("📥 Iniciando conversión automática...");

    // ==========================================
    // PASO 1: RECIBIR Y VALIDAR ARCHIVO
    // ==========================================
    
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ 
        error: "No se recibió ningún archivo" 
      }, { status: 400 });
    }

    console.log(`📄 Archivo recibido: ${file.name} (${file.size} bytes)`);

    // ==========================================
    // PASO 2: CONVERTIR A BASE64
    // ==========================================
    
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // ==========================================
    // PASO 3: CLASIFICAR DOCUMENTO (1ra llamada a Gemini)
    // ==========================================
    
    console.log("🔍 Iniciando clasificación del documento...");
    
    const clasificacion = await clasificarDocumento(API_KEY, base64Data);
    
    console.log(`✅ Clasificación completada:`, clasificacion);

    // ==========================================
    // PASO 4: VALIDAR QUE SEA DOCUMENTO VÁLIDO
    // ==========================================
    
    if (clasificacion.tipo === "INVALIDO") {
      console.warn("⚠️ Documento rechazado:", clasificacion.razon);
      
      return NextResponse.json({ 
        error: `Documento no válido: ${clasificacion.razon}`,
        detalle: "Este archivo no parece ser un resumen de tarjeta de crédito ni un extracto bancario."
      }, { status: 400 });
    }

    // ==========================================
    // PASO 5: ELEGIR PROMPT SEGÚN TIPO DETECTADO
    // ==========================================
    
    const prompt = clasificacion.tipo === "CREDITO" ? promptCredito : promptBanco;
    const tipoTexto = clasificacion.tipo === "CREDITO" ? "Tarjeta de Crédito" : "Extracto Bancario";
    
    console.log(`📋 Tipo detectado: ${tipoTexto} (confianza: ${clasificacion.confianza})`);
    console.log(`🚀 Iniciando análisis completo con prompt de ${tipoTexto}...`);

    // ==========================================
    // PASO 6: ANÁLISIS COMPLETO (2da llamada a Gemini)
    // ==========================================
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "application/pdf" } },
    ]);

    // ==========================================
    // PASO 7: PARSEAR RESPUESTA JSON
    // ==========================================
    
    const textResponse = result.response.text();
    
    console.log("📦 Respuesta recibida, parseando JSON...");
    
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}') + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("No se encontró JSON válido en la respuesta de la IA");
    }

    const jsonRaw = textResponse.substring(jsonStart, jsonEnd);
    
    let data;
    try {
      data = JSON.parse(jsonRaw);
    } catch (parseError) {
      console.error("❌ Error parseando JSON:", jsonRaw.substring(0, 200));
      throw new Error("La IA no devolvió un JSON válido.");
    }

    console.log("✅ JSON parseado correctamente");

    // ==========================================
    // PASO 8: GENERAR EXCEL SEGÚN TIPO
    // ==========================================
    
    console.log(`📊 Generando Excel de ${tipoTexto}...`);

    let excelBuffer: Buffer;
    let nombreArchivo: string;

    if (clasificacion.tipo === "CREDITO") {
      excelBuffer = await generarExcelCredito(data);
      nombreArchivo = `${data.metadata.banco || "Desconocido"}.xlsx`;
    } else {
      excelBuffer = await generarExcelBanco(data);
      nombreArchivo = `${data.metadata.banco || "Desconocido"}.xlsx`;
    }

    console.log(`✅ Excel generado: ${nombreArchivo}`);

    // ==========================================
    // PASO 9: RETORNAR ARCHIVO
    // ==========================================
    
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
        // Headers adicionales para el frontend
        "X-Document-Type": clasificacion.tipo,
        "X-Bank-Name": data.metadata.banco || "Desconocido"
      },
    });

  } catch (error: any) {
    console.error("❌ Error fatal en conversión:", error);
    
    // Respuesta de error detallada
    return NextResponse.json({ 
      error: error.message || "Error desconocido al procesar el PDF",
      detalle: "Por favor verifica que el archivo sea un PDF válido de resumen bancario o de tarjeta de crédito."
    }, { status: 500 });
  }
}