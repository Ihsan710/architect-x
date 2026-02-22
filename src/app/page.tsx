"use client";

import { useState } from "react";
import ArchitectureForm from "@/components/ArchitectureForm";
import ArchitectureResult from "@/components/ArchitectureResult";
import { ArchitectureInput, ArchitectureOutput } from "@/types";
import { ServerCog, Sparkles } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            ease: "easeOut",
            duration: 0.5
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
    const [result, setResult] = useState<ArchitectureOutput | null>(null);
    const [lastInput, setLastInput] = useState<ArchitectureInput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: ArchitectureInput) => {
        setLastInput(data);
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/architect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to generate architecture. Please try again.");
            }

            const responseData = await response.json();
            setResult(responseData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col pt-12 relative overflow-hidden"
        >
            <motion.header variants={itemVariants} className="mb-12 flex items-center gap-4 border-b border-white/10 pb-8 relative z-10 w-full">
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-blue-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none" />
                    <ServerCog className="w-10 h-10 text-blue-400 relative z-10 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                </motion.div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 tracking-tight flex items-center gap-3">
                        ARCHITECT-X
                        <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">Intelligent cloud topology generator.</p>
                </div>
            </motion.header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
                {/* Left Column: Form Section */}
                <motion.section variants={itemVariants} className="col-span-1 lg:col-span-4 premium-card rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 relative z-10">
                        Project Details
                    </h2>
                    <ArchitectureForm onSubmit={handleSubmit} isLoading={isLoading} />
                </motion.section>

                {/* Right Column: Output Section */}
                <motion.section variants={itemVariants} className="col-span-1 lg:col-span-8 premium-card rounded-2xl p-6 min-h-[600px] flex flex-col relative overflow-hidden transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <h2 className="text-xl font-semibold mb-6 flex flex-col md:flex-row md:items-center gap-4 relative z-20 w-full justify-between">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">System Architecture</span>

                            <AnimatePresence>
                                {result && lastInput && !error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex bg-slate-800/80 backdrop-blur-md rounded-lg p-1 border border-white/10 w-fit shadow-xl"
                                    >
                                        {(['small', 'medium', 'large'] as const).map(scale => (
                                            <button
                                                key={scale}
                                                disabled={isLoading}
                                                onClick={() => {
                                                    if (scale !== lastInput.scale) {
                                                        handleSubmit({ ...lastInput, scale });
                                                    }
                                                }}
                                                className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-all duration-300 ${lastInput.scale === scale
                                                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)] border border-white/10'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent disabled:opacity-50'
                                                    }`}
                                            >
                                                {scale}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {isLoading && (
                            <motion.span
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-sm font-medium text-blue-400 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                            >
                                <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                                Quantum Matrix Parsing...
                            </motion.span>
                        )}
                    </h2>

                    <div className="flex-1 flex flex-col relative z-20">
                        <AnimatePresence mode="wait">
                            {error ? (
                                <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex-1 flex items-center justify-center border border-dashed border-red-500/30 rounded-xl bg-red-500/10 text-red-400 p-8 text-center backdrop-blur-sm shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)]">
                                    <p className="font-medium text-lg">{error}</p>
                                </motion.div>
                            ) : result ? (
                                <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="flex-1 w-full h-full pb-4">
                                    <ArchitectureResult result={result} />
                                </motion.div>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/40 backdrop-blur-md relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <p className="text-slate-500 text-center max-w-sm relative z-10 leading-relaxed group-hover:text-slate-400 transition-colors">
                                        Enter your concept specifications on the left panel to synthesize a production-grade cloud topology.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>
            </div>
        </motion.main>
    );
}
