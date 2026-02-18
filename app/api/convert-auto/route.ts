import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { classifyDocument } from "@/lib/helpers/clasificador"; 
import { generateCreditExcel, generateBankExcel } from "@/lib/helpers/excelGenerators";
import { creditPrompt, bankPrompt } from "@/lib/helpers/prompts";

// ========================================
// CONFIGURATION
// ========================================

const API_KEY = process.env.GEMINI_API_KEY as string;

if (!API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

// ========================================
// MAIN ENDPOINT
// ========================================

export async function POST(req: NextRequest) {
  try {
    console.log("📥 Starting automatic conversion...");

    // ==========================================
    // STEP 1: RECEIVE AND VALIDATE FILE
    // ==========================================
    
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ 
        error: "No file received" 
      }, { status: 400 });
    }

    console.log(`📄 File received: ${file.name} (${file.size} bytes)`);

    // ==========================================
    // STEP 2: CONVERT TO BASE64
    // ==========================================
    
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // ==========================================
    // STEP 3: CLASSIFY DOCUMENT (1st Gemini call)
    // ==========================================
    
    console.log("🔍 Starting document classification...");
    
    // Now calls classifyDocument and expects { type: "CREDIT" | "BANK" | "INVALID", ... }
    const classification = await classifyDocument(API_KEY, base64Data);
    
    console.log(`✅ Classification completed:`, classification);

    // ==========================================
    // STEP 4: VALIDATE DOCUMENT TYPE
    // ==========================================
    
    if (classification.type === "INVALID") {
      console.warn("⚠️ Document rejected:", classification.reason);
      
      return NextResponse.json({ 
        error: `Invalid document: ${classification.reason}`,
        details: "This file does not appear to be a credit card summary or bank statement."
      }, { status: 400 });
    }

    // ==========================================
    // STEP 5: SELECT PROMPT BASED ON TYPE
    // ==========================================
    
    // Logic updated to use English Enum values
    const prompt = classification.type === "CREDIT" ? creditPrompt : bankPrompt;
    const documentTypeLabel = classification.type === "CREDIT" ? "Credit Card" : "Bank Statement";
    
    console.log(`📋 Detected type: ${documentTypeLabel}`);
    console.log(`🚀 Starting full analysis with ${documentTypeLabel} prompt...`);

    // ==========================================
    // STEP 6: FULL ANALYSIS (2nd Gemini call)
    // ==========================================
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "application/pdf" } },
    ]);

    // ==========================================
    // STEP 7: PARSE JSON RESPONSE
    // ==========================================
    
    const textResponse = result.response.text();
    
    console.log("📦 Response received, parsing JSON...");
    
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}') + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("No valid JSON found in AI response");
    }

    const rawJson = textResponse.substring(jsonStart, jsonEnd);
    
    let data;
    try {
      data = JSON.parse(rawJson);
    } catch (parseError) {
      console.error("❌ Error parsing JSON:", rawJson.substring(0, 200));
      throw new Error("The AI did not return a valid JSON.");
    }

    console.log("✅ JSON parsed successfully");

    // ==========================================
    // STEP 8: GENERATE EXCEL BASED ON TYPE
    // ==========================================
    
    console.log(`📊 Generating ${documentTypeLabel} Excel...`);

    let excelBuffer: Buffer;
    let fileName: string;

    // Use English keys to access metadata (data.metadata.bank)
    const bankName = data.metadata.bank || "Unknown";

    if (classification.type === "CREDIT") {
      excelBuffer = await generateCreditExcel(data);
      fileName = `${bankName}.xlsx`;
    } else {
      excelBuffer = await generateBankExcel(data);
      fileName = `${bankName}.xlsx`;
    }

    console.log(`✅ Excel generated: ${fileName}`);

    // ==========================================
    // STEP 9: RETURN FILE
    // ==========================================
    
    return new NextResponse(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        // Headers for frontend (Updated values)
        "X-Document-Type": classification.type,
        "X-Bank-Name": bankName
      },
    });

  } catch (error: any) {
    console.error("❌ Fatal conversion error:", error);
    
    return NextResponse.json({ 
      error: error.message || "Unknown error processing PDF",
      details: "Please verify that the file is a valid bank statement or credit card PDF."
    }, { status: 500 });
  }
}