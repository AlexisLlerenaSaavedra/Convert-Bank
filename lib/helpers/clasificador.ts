import { GoogleGenerativeAI } from "@google/generative-ai";
import { classificationPrompt } from "./prompts";

export type DocumentType = "CREDIT" | "BANK" | "INVALID";

export interface ClassificationResult {
  type: DocumentType;
  reason: string;
}

export async function classifyDocument(
  apiKey: string,
  base64Data: string
): Promise<ClassificationResult> {
  
  try {
    // 1. Create Gemini instance
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 2. Call API with classification prompt
    const result = await model.generateContent([
      classificationPrompt,
      { inlineData: { data: base64Data, mimeType: "application/pdf" } },
    ]);

    // 3. Extract text from response
    const textResponse = result.response.text();
    console.log("🔍 Classification response:", textResponse);

    // 4. Extract JSON (find between braces)
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("No JSON found in classification response");
    }

    const rawJson = textResponse.substring(jsonStart, jsonEnd);
    
    // Parse mapping keys (if the AI returns keys in Spanish by mistake, we could map them here, 
    // but the prompt explicitly asks for "type" and "reason")
    const classification = JSON.parse(rawJson) as ClassificationResult;

    // 5. Validate JSON structure
    if (!classification.type || !["CREDIT", "BANK", "INVALID"].includes(classification.type)) {
      throw new Error(`Invalid document type received: ${classification.type}`);
    }

    console.log("✅ Classification successful:", classification);
    return classification;

  } catch (error: any) {
    console.error("❌ Classification error:", error);
    
    // Fallback: if something fails, return INVALID
    return {
      type: "INVALID",
      reason: `Error classifying: ${error.message || "Unknown error"}`
    };
  }
}