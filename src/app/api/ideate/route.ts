import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60; // Extended timeout for Vercel Hobby limits

// Initialize the native Google SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        // 1. Create the system prompt
        const systemInstruction = `You are a visionary Cloud Software Architect with 20 years of experience designing massive global platforms like Netflix and Uber.
        
Your task is to take a vague user idea and convert it into a concrete, 1-paragraph technical "Project Concept Brief".
It must sound professional, dense, and highly actionable. It should mention potential scale, users, and core requirements (like realtime, caching, ML pipelines, etc.).
Do NOT write more than 3-4 sentences. Do NOT output markdown formatting like bold or bullet points. Output raw paragraph text only.

Example User Input: "a chat app like whatsapp"
Example Output: "A global real-time messaging platform supporting 50 million concurrent TCP streams with end-to-end encryption. The system requires ultra-low latency message delivery under 50ms, a distributed append-only log for message persistence, and edge-deployed WebSocket gateways. It must handle presence indicators, media blob storage, and localized push notifications with 99.999% availability."`;

        // 2. Prepare the prompt
        const finalPrompt = prompt
            ? `Draft a high-end 3-sentence architectural project brief for a system related to: "${prompt}"`
            : `Generate a completely random, incredibly complex cloud infrastructure project idea (e.g. planetary sensor network, global crypto exchange). Keep it to 3 sentences max. No formatting.`;

        // 3. Request strictly from Google
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction,
        });

        const result = await model.generateContent(finalPrompt);
        const text = result.response.text();

        // 4. Return as standard JSON
        return Response.json({ text });

    } catch (error: any) {
        console.error("Gemini Native Native API Error:", error);
        return Response.json({ error: "Failed to generate concept", details: error.message }, { status: 500 });
    }
}
