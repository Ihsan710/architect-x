const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res = await model.generateContent("test");
        console.log("SUCCESS:", res.response.text());
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}
run();
