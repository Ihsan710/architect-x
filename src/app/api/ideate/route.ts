import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 60; // Extended timeout for Vercel Hobby limits

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        // 1. Create the system prompt to guide Gemini
        const systemPrompt = `You are a visionary Cloud Software Architect with 20 years of experience designing massive global platforms like Netflix and Uber.
        
Your task is to take a vague user idea and convert it into a concrete, 1-paragraph technical "Project Concept Brief".
It must sound professional, dense, and highly actionable. It should mention potential scale, users, and core requirements (like realtime, caching, ML pipelines, etc.).
Do NOT write more than 3-4 sentences. Do NOT output markdown formatting like bold or bullet points. Output raw paragraph text only.

Example User Input: "a chat app like whatsapp"
Example Output: "A global real-time messaging platform supporting 50 million concurrent TCP streams with end-to-end encryption. The system requires ultra-low latency message delivery under 50ms, a distributed append-only log for message persistence, and edge-deployed WebSocket gateways. It must handle presence indicators, media blob storage, and localized push notifications with 99.999% availability."`;

        // 2. Fallback "prompt" if the user didn't write anything in the hint box
        const userPrompt = prompt
            ? `Draft a high-end 3-sentence architectural project brief for a system related to: "${prompt}"`
            : `Generate a completely random, incredibly complex cloud infrastructure project idea (e.g. planetary sensor network, global crypto exchange). Keep it to 3 sentences max. No formatting.`;

        // 3. Connect to Gemini 1.5 Flash using the Vercel AI SDK
        const result = await streamText({
            model: google("models/gemini-1.5-flash-latest"),
            system: systemPrompt,
            prompt: userPrompt,
            temperature: 0.8, // Slightly high temperature for creative ideas
            onError: (error) => {
                console.error("Gemini Stream Error Backend Caught:", error);
            }
        });

        // 4. Return the streaming text response instantly to the frontend UI hooks
        return result.toTextStreamResponse({
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });

    } catch (error: any) {
        console.error("AI Ideation Error:", error);
        return new Response(JSON.stringify({ error: "Failed to generate concept", details: error.message || error.toString() }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
