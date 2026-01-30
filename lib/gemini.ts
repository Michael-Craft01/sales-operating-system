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

export type DocType = 'onboarding' | 'proposal' | 'audit' | 'contract' | 'meeting_plan';

export async function generateSalesDoc(leadContext: any, docType: DocType) {
    if (!genAI) {
        throw new Error("Gemini_api_key is not set in .env");
    }

    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    // Helper to sanitize "undefined" strings and nulls
    const sanitize = (val: any, fallback: string) => {
        if (!val || val === "undefined" || val === "null" || (typeof val === 'string' && val.trim() === "")) return fallback;
        return val;
    };

    const contactName = sanitize(leadContext.contact_name, "Sir/Madam");
    // Handle both snake_case (DB) and camelCase (frontend props) to be safe
    const businessName = sanitize(leadContext.business_name || leadContext.businessName, "Valued Client");
    const location = sanitize(leadContext.address || leadContext.city, "Client Headquarters");
    const phone = sanitize(leadContext.phone, "Not Provided");
    const painPoint = sanitize(leadContext.pain_point || leadContext.painPoint, "Operational Efficiency");

    let promptContext = "";
    if (docType === 'onboarding') {
        promptContext = `
        Draft a professional "Welcome & Strategic Vision Letter" from LogicHQ in PLAIN TEXT.
        
        INSTRUCTIONS:
        - Do NOT use Markdown (NO bolding with asterisks, NO headers with hashes).
        - Format it exactly like a standard business letter (Times New Roman style).
        - Use simple spacing between paragraphs.
        
        HEADER DETAILS:
        To: ${businessName}
        Location: ${location}
        Phone: ${phone}
        
        SALUTATION:
        Dear ${contactName},

        BODY INSTRUCTIONS:
        Write a very nice, amazing, calm, and welcoming letter.
        1. Express honour to work with them and explicitly mention their business name: "${businessName}".
        2. Emphasize our belief in excellence and that we will provide it.
        3. Briefly outline the technical approach for their pain point: "${painPoint}".
        4. Describe the results/transformation they will achieve (efficiency, growth, peace of mind).

        SIGN-OFF:
        Sincerely,

        Michael Ragu
        LogicHQ
        Belvedere, Harare, HIT Institute
        Phone: +263 719 200 295
        Website: www.logichq.tech
        `;
    } else if (docType === 'contract') {
        promptContext = `
        Draft a formal "Service Agreement & Scope of Work" as a CLEAN, PLAIN TEXT document.
        
        CRITICAL FORMATTING RULES:
        1. DO NOT use Markdown characters (no *, #, -, etc. for formatting).
        2. DO NOT use bolding or italics.
        3. Write it exactly like a typed page in Microsoft Word.
        4. Use CAPITAL LETTERS for section headers instead of bold.
        
        REQUIRED SECTIONS:
        
        CONTRACT AGREEMENT
        
        1. PROJECT SCOPE
           Solution Name: "Strategic Growth System"
           Deliverables: Custom Software/Web App.
           Number of Developers: 2 Senior Engineers.
           
        2. COMMERCIALS & INVESTMENT
           Total Investment: $2,500
           Payment Strategy: 50% Upfront, 50% Upon Delivery.
           Payment Methods: Ecocash, Cash, or Bank Transfer.
           
        3. EXPECTED RESULTS
           Efficiency improvements.
           Automated lead handling.
           Clear ROI within 3 months.
           
        4. DELIVERY & TIMELINE
           Agile Delivery Methodology.
           4-6 Weeks estimated timeline.
        `;
    } else if (docType === 'meeting_plan') {
        promptContext = `
         Draft a "Communication & Meeting Schedule" as a CLEAN, PLAIN TEXT document.
         
         CRITICAL FORMATTING RULES:
         1. DO NOT use Markdown characters.
         2. Use CAPITAL LETTERS for headers.
         
         REQUIRED SECTIONS:
         
         COMMUNICATION PLAN
         
         1. KICKOFF MEETING
         Finalize scope and requirements (Google Meet).
         
         2. WEEKLY SPRINTS
         Progress Review and Feedback (Zoom/Meet).
         
         3. DAILY UPDATES
         Asynchronous updates via WhatsApp group.
         
         4. HANDOVER & TRAINING
         Final delivery session (In-person or Zoom).
         `;
    }

    const prompt = `
    You are Michael Ragu from LogicHQ. ${promptContext}
    
    Client Info:
    - Name: ${businessName}
    - Industry: ${leadContext.industry || "General"}
    - Core Challenge: ${painPoint}
    - Contact: ${contactName}
    
    Output Format: Pure Plain Text (No Markdown).
    Length: ~400-600 words.
  `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI Doc Generation Failed:", error);
        throw error;
    }
}

export async function analyzeLeadPotential(leadContext: any) {
    if (!genAI) throw new Error("Missing API Key");

    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    const prompt = `
    Role: You are an elite Technical Strategist (Software Engineer, Market Strategist, AI Engineer).
    Task: Analyze the client's pain point and provide a strategic technical breakdown.

    Client: ${leadContext.businessName} (${leadContext.industry})
    Pain Point: "${leadContext.painPoint}"

    Requirements:
    1. **Estimated Budget**: Calculate a SINGLE specific dollar amount (e.g. "$1,250 USD") strictly between $500 USD and $3,000 USD based on the complexity. Do NOT provide a range.
    2. **Tech Stack**: Recommend 3-4 specific tools/technologies to solve this.
    3. **Dev Translation**: Translate the business problem into a technical engineering problem statement. **CRITICAL: Write this as a clean, human-readable paragraph. Do NOT use Markdown formatting (no bolding, no bullet points). Just plain text.**

    Output Format (JSON):
    {
      "budget_estimate": "$2,500 USD",
      "tech_stack": ["Next.js", "Supabase", "LangChain", "Twilio"],
      "dev_translation": "The core architecture requires an automated webhook receiver to ingest data from the client's existing system. This will feed into a normalized relational schema..."
    }
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            // generationConfig: { responseMimeType: "application/json" } // Not supported on this model version yet
        });

        let text = result.response.text();
        // Clean markdown formatting if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        // Escape newlines and control characters inside string values to prevent JSON parse errors
        // This regex looks for newlines that are NOT already escaped
        // However, a simpler approach is often safely parsing or using a specialized cleaning function
        // For now, let's try a basic cleanup for common issues:

        return text;
    } catch (error) {
        console.error("Analysis Failed:", error);
        throw error;
    }
}

export async function generateQualificationQuestions(leadContext: any) {
    if (!genAI) throw new Error("Missing API Key");

    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    const prompt = `
    Role: Senior Sales Director.
    Task: Generate exactly 15 rigorous qualification questions to ask a potential client.
    
    Client: ${leadContext.businessName} (${leadContext.industry})
    Pain Point: "${leadContext.painPoint}"
    
    Goal: Uncover BANT (Budget, Authority, Need, Timing) and technical readiness.
    
    Output Format (JSON Array of strings only):
    [
      "What is your current monthly spend on [Problem Area]?",
      "Who else needs to sign off on this decision?",
      ...
    ]
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        let text = result.response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Question Generation Failed:", error);
        // Fallback questions if AI fails
        return [
            "What is the primary business objective driving this project?",
            "What is your estimated budget or spending cap?",
            "Who is the final decision maker?",
            "When do you ideally want to see a solution in place?",
            "What happens if you do nothing?",
            "Are you currently evaluating other vendors?",
            "What technical constraints should we be aware of?",
            "Do you have an internal development team?",
            "What does a 'successful' outcome look like to you?",
            "What is your preferred communication style?",
            "Are there any legal or compliance requirements?",
            "How does this project align with your quarterly goals?",
            "What is your current tech stack?",
            "Have you tried to solve this problem before? If so, why did it fail?",
            "What is the best time to follow up?"
        ];
    }
}
