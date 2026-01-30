'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.Gemini_api_key || '');

export async function generateDeck(leadId: string) {
    try {
        // 1. Fetch Lead Context
        const { data: lead } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .single();

        if (!lead) throw new Error("Lead not found");

        // 2. Prompt Gemini
        // Using gemma-3-27b-it as requested
        const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

        const prompt = `
      You are a world-class sales strategist. Create a 3-slide value proposition deck for a client with these details:
      
      Business Name: ${lead.business_name}
      Industry: ${lead.industry || 'General Business'}
      Core Pain Point: ${lead.pain_point || 'Revenue instability and inefficient processes'}
      
      Your goal: Convince them that "Chocolate OS" is the solution.
      Chocolate OS is a Sales Operating System that automates outreach, organizes leads, and closes deals faster.
      
      Return ONLY valid JSON with this structure (no markdown formatting):
      {
        "hook": "A short, punchy 5-word hook for the title slide",
        "slides": [
            {
                "title": "Slide 1 Title (The Problem)",
                "subtitle": "2 sentences describing their specific pain point empathetically."
            },
            {
                "title": "Slide 2 Title (The Solution)",
                "subtitle": "2 sentences explaining how Chocolate OS automates that specific problem."
            },
            {
                "title": "Slide 3 Title (The Vision)",
                "subtitle": "2 sentences painting a future where this problem is gone."
            }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const presentationData = JSON.parse(jsonStr);

        // 3. Save to DB
        await supabase
            .from('leads')
            .update({ presentation_data: presentationData })
            .eq('id', leadId);

        return { success: true, data: presentationData };

    } catch (error) {
        console.error("AI Generation Error:", error);
        return { success: false, error: 'Failed to generate deck' };
    }
}
