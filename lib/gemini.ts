import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.Gemini_api_key;

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateOutreach(leadContext: any) {
    if (!genAI) {
        throw new Error("Gemini_api_key is not set in .env");
    }

    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    const prompt = `
    You are an expert sales SDR. Write a short, punchy, and personalized outreach message for this lead.
    
    Lead Info:
    - Business: ${leadContext.businessName}
    - Industry: ${leadContext.industry}
    - Pain Point: ${leadContext.painPoint || "Unknown"}
    - Description: ${leadContext.description || "N/A"}

    Tone: Professional but conversational.
    Format: Plain text, no subject line, ready to paste into LinkedIn or Email.
    Length: Under 50 words.
  `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI Generation Failed:", error);
        throw error;
    }
}

export type DocType = 'onboarding' | 'proposal' | 'audit';

export async function generateSalesDoc(leadContext: any, docType: DocType) {
    if (!genAI) {
        throw new Error("Gemini_api_key is not set in .env");
    }

    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    let promptContext = "";
    if (docType === 'onboarding') {
        promptContext = "Generate a structured Onboarding Plan including Audit, Implementation, and Training phases.";
    } else if (docType === 'proposal') {
        promptContext = "Generate a persuasive Sales Proposal focusing on ROI, specific pain points, and our unique value proposition.";
    } else if (docType === 'audit') {
        promptContext = "Generate a preliminary Audit Report outlining potential gaps in their current workflow based on their industry.";
    }

    const prompt = `
    You are a Senior Solutions Architect. ${promptContext}
    
    Client Info:
    - Name: ${leadContext.businessName}
    - Industry: ${leadContext.industry}
    - Core Challenge: ${leadContext.painPoint || "Operational Efficiency"}
    - Description: ${leadContext.description || "N/A"}

    Output Format: Markdown.
    Tone: Professional, authoritative, and clear.
    Structure: Use headers (##), bullet points, and bold text for readability.
    Length: ~300-400 words.
  `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI Doc Generation Failed:", error);
        throw error;
    }
}
