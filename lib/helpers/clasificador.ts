import { GoogleGenerativeAI } from "@google/generative-ai";
import { promptClasificacion } from "./prompts";

export type TipoDocumento = "CREDITO" | "BANCO" | "INVALIDO";

export interface ResultadoClasificacion {
  tipo: TipoDocumento;
  razon: string;
}

export async function clasificarDocumento(
  apiKey: string,
  base64Data: string
): Promise<ResultadoClasificacion> {
  
  try {
    // 1. Crear instancia de Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 2. Llamar a la API con el prompt de clasificación
    const result = await model.generateContent([
      promptClasificacion,
      { inlineData: { data: base64Data, mimeType: "application/pdf" } },
    ]);

    // 3. Extraer texto de la respuesta
    const textResponse = result.response.text();
    console.log("🔍 Respuesta de clasificación:", textResponse);

    // 4. Extraer JSON (buscar entre llaves)
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("No se encontró JSON en la respuesta de clasificación");
    }

    const jsonRaw = textResponse.substring(jsonStart, jsonEnd);
    const clasificacion = JSON.parse(jsonRaw) as ResultadoClasificacion;

    // 5. Validar estructura del JSON
    if (!clasificacion.tipo || !["CREDITO", "BANCO", "INVALIDO"].includes(clasificacion.tipo)) {
      throw new Error("Tipo de documento no válido en la respuesta");
    }

    console.log("✅ Clasificación exitosa:", clasificacion);
    return clasificacion;

  } catch (error: any) {
    console.error("❌ Error en clasificación:", error);
    
    // Fallback: si algo falla, retornar INVALIDO
    return {
      tipo: "INVALIDO",
      razon: `Error al clasificar: ${error.message || "Error desconocido"}`
    };
  }
}