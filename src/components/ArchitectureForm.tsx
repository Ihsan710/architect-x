"use client";

import { useState } from "react";
import { ArchitectureInput, ProjectScale } from "@/types";
import { Rocket, Box, Boxes, Layers, Sparkles } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface ArchitectureFormProps {
    onSubmit: (data: ArchitectureInput) => void;
    isLoading: boolean;
}

const formVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const inputVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Custom hook removed due to Next.js 14 API strict stream bypass
export default function ArchitectureForm({ onSubmit, isLoading }: ArchitectureFormProps) {
    const [projectName, setProjectName] = useState("");
    const [scale, setScale] = useState<ProjectScale>("small");

    const [input, setInput] = useState("");
    const [completion, setCompletion] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleAiIdeation = async () => {
        if (isAiLoading) return;
        setIsAiLoading(true);
        setCompletion("");

        try {
            const res = await fetch('/api/ideate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            });

            if (!res.ok) throw new Error("AI Stream Failed");
            if (!res.body) throw new Error("No Readable Stream");

            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode the byte chunk specifically, preserving spaces
                const chunk = decoder.decode(value, { stream: true });
                setCompletion(prev => prev + chunk);
            }
        } catch (error) {
            console.error(error);
            setCompletion("Error generating AI concept. Please check API Key.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalDescription = completion || input;
        onSubmit({ projectName, scale, description: finalDescription });
    };

    return (
        <motion.form
            variants={formVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit}
            className="space-y-6 relative z-10"
        >
            <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Name
                </label>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500 pointer-events-none" />
                    <input
                        type="text"
                        required
                        maxLength={50}
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="e.g. Globex Payment Gateway"
                        className="glass-input relative z-10 bg-slate-900/80 backdrop-blur-sm"
                        disabled={isLoading}
                    />
                </div>
            </motion.div>

            <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Expected Target Scale
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setScale("small")}
                        disabled={isLoading}
                        className={`p-3 rounded-xl border text-left transition-all duration-300 relative overflow-hidden ${scale === "small"
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]"
                            : "bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800/80 hover:border-blue-500/30"
                            }`}
                    >
                        {scale === "small" && <div className="absolute inset-0 bg-blue-400/10 mix-blend-overlay animate-pulse" />}
                        <Box className={`w-5 h-5 mb-2 relative z-10 ${scale === "small" ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "text-slate-500"}`} />
                        <div className="font-medium text-sm relative z-10">Small</div>
                        <div className="text-xs opacity-70 mt-1 relative z-10">&lt; 10k users/mo</div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setScale("medium")}
                        disabled={isLoading}
                        className={`p-3 rounded-xl border text-left transition-all duration-300 relative overflow-hidden ${scale === "medium"
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                            : "bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800/80 hover:border-emerald-500/30"
                            }`}
                    >
                        {scale === "medium" && <div className="absolute inset-0 bg-emerald-400/10 mix-blend-overlay animate-pulse" />}
                        <Boxes className={`w-5 h-5 mb-2 relative z-10 ${scale === "medium" ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "text-slate-500"}`} />
                        <div className="font-medium text-sm relative z-10">Medium</div>
                        <div className="text-xs opacity-70 mt-1 relative z-10">~ 100k users/mo</div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setScale("large")}
                        disabled={isLoading}
                        className={`p-3 rounded-xl border text-left transition-all duration-300 relative overflow-hidden ${scale === "large"
                            ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]"
                            : "bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800/80 hover:border-purple-500/30"
                            }`}
                    >
                        {scale === "large" && <div className="absolute inset-0 bg-purple-400/10 mix-blend-overlay animate-pulse" />}
                        <Layers className={`w-5 h-5 mb-2 relative z-10 ${scale === "large" ? "text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" : "text-slate-500"}`} />
                        <div className="font-medium text-sm relative z-10">Enterprise</div>
                        <div className="text-xs opacity-70 mt-1 relative z-10">1M+ users/mo</div>
                    </motion.button>
                </div>
            </motion.div>

            <motion.div variants={inputVariants}>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        Project Requirements
                        <Sparkles className="w-3 h-3 text-purple-400" />
                    </label>
                    <button
                        type="button"
                        onClick={handleAiIdeation}
                        disabled={isAiLoading || isLoading}
                        className="text-xs flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors disabled:opacity-50 shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]"
                    >
                        {isAiLoading ? (
                            <>
                                <span className="w-3 h-3 rounded-full border border-purple-300 border-t-transparent animate-spin" />
                                Synthesizing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3 h-3" />
                                AI Idea Generator
                            </>
                        )}
                    </button>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition duration-500 pointer-events-none" />
                    <textarea
                        required
                        minLength={20}
                        rows={5}
                        value={completion || input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type 'a global chat app' and hit AI Generator, or describe your system explicitly mentioning realtime, analytics, alerts..."
                        className="glass-input resize-none relative z-10 bg-slate-900/80 backdrop-blur-sm focus:ring-purple-500/20 selection:bg-purple-500/40"
                        disabled={isLoading || isAiLoading}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-mono opacity-80 flex justify-between">
                    <span>\/* Engine scans for keywords like "realtime", "analytics", "alerts" *\/</span>
                    {isAiLoading && <span className="text-purple-400 animate-pulse">Streaming from Gemini 1.5...</span>}
                </p>
            </motion.div>

            <motion.div variants={inputVariants} className="pt-2">
                <motion.button
                    whileHover={{ scale: 1.01, boxShadow: "0 0 25px -5px rgba(59,130,246,0.6)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || !projectName || (completion || input || "").length < 20}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl px-4 py-3 transition-colors shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30 relative overflow-hidden"
                >
                    {isLoading ? (
                        <>
                            <div className="absolute inset-0 bg-white/10 animate-pulse" />
                            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin relative z-10" />
                            <span className="relative z-10">Deploying Quantum Generators...</span>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none" />
                            <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform relative z-10" />
                            <span className="relative z-10 tracking-wide">Synthesize Architecture</span>
                        </>
                    )}
                </motion.button>
            </motion.div>
        </motion.form>
    );
}
