"use client";

import { useEffect, useState, useRef } from "react";
import { ArchitectureOutput, EnhancementResponse } from "@/types";
import { ShieldAlert, Cpu, Database, Server, Component, Activity, HardDrive, Download, Terminal, Info, X, Sparkles, CheckCircle2 } from "lucide-react";
import MermaidDiagram from "./MermaidDiagram";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { toPng } from "html-to-image";
import { motion, AnimatePresence, Variants } from "framer-motion";

const EXPLAINERS: Record<string, string> = {
    "Web Server (Next.js)": "The primary user-facing server serving static assets, hydration logic, and routing.",
    "Core API Module": "The central monolith handling business logic, authentication, and database orchestration.",
    "PostgreSQL (Relational)": "A robust, ACID-compliant relational DB perfect for structured user data and transactions.",
    "WebSocket Gateway": "Stands up persistent bidirectional socket connections to push real-time events to clients instantly.",
    "Basic Alert Cronjob": "A scheduled background task that routinely checks thresholds (e.g., every 5 minutes) and fires notifications.",
    "Background Worker": "An asynchronous queue processor that handles heavy tasks outside the main API thread.",
    "PostgreSQL (Primary) + Read Replica": "Splits database traffic by offloading all SELECT queries to a replica, preventing lock contention.",
    "Redis (Cache)": "Blazingly fast in-memory store to rapidly serve repeated queries and reduce database load.",
    "Realtime Gateway (SSE/WS)": "Manages live client streams via Server-Sent Events or WebSockets for instant, scalable UI updates.",
    "Redis (Cache + Pub/Sub)": "Utilizes Redis as both a fast short-term cache and a message broker to broadcast events globally across nodes.",
    "Alert Engine (Rule Processor)": "A specialized service constantly evaluating incoming telemetry streams against user-defined alert thresholds.",
    "Notification Dispatcher": "Abstracts away external API complexity (Sendgrid, Twilio, APNS) to orchestrate mass mass delivery.",
    "API Gateway": "The single entry point routing all client requests to appropriate downstream microservices while handling rate-limiting and auth.",
    "Auth Service": "A decoupled microservice purely responsible for verifying JWT credentials, API keys, and managing identities.",
    "User Service": "A domain-driven microservice holding exclusive domain over user profiles, billing ties, and team structures.",
    "Data Pipeline (Kafka)": "A distributed, fault-tolerant event streaming platform capable of ingesting millions of messages per second.",
    "Analytics Engine": "Consumes data pipelines to generate materialized views, machine learning inferences, or heavy aggregations.",
    "Realtime Gateway (WS)": "A horizontally scaled fleet of WebSocket servers exclusively maintaining millions of active TCP connections.",
    "Redis Cluster (Pub/Sub + Edge Caching)": "A highly-available, sharded memory cluster enabling sub-millisecond data retrieval and global event propagation.",
    "Alert Engine Microservice": "An isolate engine parsing Kafka streams to trigger reactive rules in near-zero latency scenarios.",
    "Metrics & Logs (Prometheus/Grafana)": "The observability stack strictly recording server health, response times, and system trace points.",
    "PostgreSQL (Cluster) + Document DB": "A polyglot persistence layer bridging relational data guarantees with NoSQL schema flexibility at internet scale."
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const listVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
};

interface ArchitectureResultProps {
    result: ArchitectureOutput;
}

export default function ArchitectureResult({ result }: ArchitectureResultProps) {
    const isHighRisk = result.riskLevel === "High";
    const isMicroservices = result.architectureStyle === "Microservices";

    // Number counting animation hook
    const [animatedCost, setAnimatedCost] = useState(0);
    const [animatedScore, setAnimatedScore] = useState(0);

    // Advanced V2 Feature States
    const [isDevMode, setIsDevMode] = useState(false);
    const [editableDiagram, setEditableDiagram] = useState(result.mermaidDiagram);
    const [selectedExplainer, setSelectedExplainer] = useState<{ title: string; desc: string } | null>(null);

    // AI Enhancement State
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [enhancementResult, setEnhancementResult] = useState<EnhancementResponse | null>(null);
    const [showEnhanceOverlay, setShowEnhanceOverlay] = useState(false);

    const [activeResult, setActiveResult] = useState<ArchitectureOutput>(result);

    // Synchronize code if parent result changes
    useEffect(() => {
        setActiveResult(result);
        setEditableDiagram(result.mermaidDiagram);
        setEnhancementResult(null); // Reset enhancements on new generations
    }, [result]);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const duration = 1500; // 1.5 seconds
        const targetCost = activeResult.monthlyCostEstimate;
        const targetScore = activeResult.architectureScore;

        if (targetCost === 0 && targetScore === 0) {
            setAnimatedCost(0);
            setAnimatedScore(0);
            return;
        }

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setAnimatedCost(Math.floor(easeProgress * targetCost));
            setAnimatedScore(Math.floor(easeProgress * targetScore));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setAnimatedCost(targetCost);
                setAnimatedScore(targetScore);
            }
        };

        window.requestAnimationFrame(step);
    }, [activeResult.monthlyCostEstimate, activeResult.architectureScore]);

    const diagramRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleDownload = async () => {
        if (!diagramRef.current) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(diagramRef.current, {
                backgroundColor: '#070b14',
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            link.download = `${result.projectName}-architecture.png`.toLowerCase().replace(/\s+/g, '-');
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Export failed", err);
        } finally {
            setIsExporting(false);
        }
    };

    const handleEnhance = async () => {
        setIsEnhancing(true);
        try {
            const response = await fetch('/api/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(activeResult)
            });
            if (!response.ok) throw new Error("Enhancement failed");

            const enhancements: EnhancementResponse = await response.json();
            setEnhancementResult(enhancements);

            setActiveResult({
                ...activeResult,
                services: enhancements.updated_services,
                scalingStrategy: enhancements.updated_scaling_strategy,
                database: enhancements.updated_infrastructure[0],
                cache: enhancements.updated_infrastructure[1],
                mermaidDiagram: enhancements.updated_mermaid_diagram,
                architectureScore: Math.min(100, activeResult.architectureScore + 5)
            });
            setEditableDiagram(enhancements.updated_mermaid_diagram);
            setShowEnhanceOverlay(true);

        } catch (err) {
            console.error(err);
        } finally {
            setIsEnhancing(false);
        }
    };

    const costData = [
        { name: "Compute", value: activeResult.costBreakdown?.compute || 0, color: "#3b82f6" },
        { name: "Database", value: activeResult.costBreakdown?.database || 0, color: "#10b981" },
        { name: "Network", value: activeResult.costBreakdown?.network || 0, color: "#8b5cf6" },
    ];


    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 h-full flex flex-col relative z-20"
        >
            <div className="flex justify-end p-2 -mt-4 mb-2 absolute top-0 right-0 z-30">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEnhance}
                    disabled={isEnhancing || !!enhancementResult}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all overflow-hidden relative group ${enhancementResult
                        ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30 cursor-default opacity-90'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_20px_-3px_rgba(168,85,247,0.5)] border border-purple-400/30'
                        }`}
                >
                    {isEnhancing ? (
                        <>
                            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                            Analyzing Topology...
                        </>
                    ) : enhancementResult ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-purple-400" />
                            Architecture Optimized
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowEnhanceOverlay(true); }}
                                className="ml-2 text-xs bg-purple-500/20 px-2 py-0.5 rounded hover:bg-purple-500/40 border border-purple-500/30 transition-colors"
                            >
                                View Report
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                            <Sparkles className="w-4 h-4 animate-pulse relative z-10" />
                            <span className="relative z-10">AI Enhance</span>
                        </>
                    )}
                </motion.button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-slate-400 text-sm mb-1 text-center relative z-10 font-medium">Style</span>
                    <span className="text-white font-bold text-center leading-tight relative z-10 drop-shadow-md">
                        {activeResult.architectureStyle}
                    </span>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-slate-400 text-sm mb-1 text-center relative z-10 font-medium">Score</span>
                    <span className="text-emerald-400 font-extrabold text-3xl relative z-10 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                        {animatedScore}<span className="text-lg text-emerald-600">/100</span>
                    </span>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
                    <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-slate-400 text-sm mb-1 text-center relative z-10 font-medium">Est. Cost</span>
                    <span className="text-amber-400 font-extrabold text-3xl relative z-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                        ${animatedCost.toLocaleString()}<span className="text-sm font-normal text-amber-600/70">/mo</span>
                    </span>
                </motion.div>
                <motion.div variants={itemVariants} className={`border rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg backdrop-blur-md ${isHighRisk ? 'bg-red-900/20 border-red-500/30' : 'bg-slate-900/50 border-white/10'}`}>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isHighRisk ? 'bg-red-500/20' : 'bg-blue-500/10'}`} />
                    <span className="text-slate-400 text-sm mb-1 text-center relative z-10 font-medium">Risk Layer</span>
                    <span className={`font-bold flex items-center gap-1.5 text-lg relative z-10 ${activeResult.riskLevel === 'Low' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                        activeResult.riskLevel === 'Medium' ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                        }`}>
                        {activeResult.riskLevel}
                        {isHighRisk && <ShieldAlert className="w-5 h-5 ml-1 animate-pulse" />}
                    </span>
                </motion.div>
            </div>

            <motion.div variants={itemVariants} className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6 overflow-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        System Topology Matrix
                    </h3>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setIsDevMode(!isDevMode)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors border ${isDevMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]' : 'bg-slate-800/80 text-slate-300 hover:text-white border-white/10 hover:bg-slate-700/80'}`}
                        >
                            <Terminal className="w-4 h-4" />
                            {isDevMode ? 'Exit Dev Mode' : 'Dev Mode'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={handleDownload}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-sm transition-colors shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]"
                        >
                            <Download className="w-4 h-4" />
                            {isExporting ? 'Exporting...' : 'Export PNG'}
                        </motion.button>
                    </div>
                </div>
                <div ref={diagramRef} className="bg-[#040812] rounded-xl p-2 md:p-4 min-h-[300px] flex items-center justify-center border border-white/5 relative shadow-inner overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#040812] to-[#040812] pointer-events-none" />

                    {isExporting && <div className="absolute bottom-2 right-4 text-xs text-slate-600 font-bold opacity-50 pointer-events-none z-10">Generated by ARCHITECT-X</div>}

                    {isDevMode ? (
                        <motion.textarea
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            value={editableDiagram}
                            onChange={(e) => setEditableDiagram(e.target.value)}
                            className="w-full h-[350px] bg-slate-950/80 text-emerald-400 font-mono text-sm p-4 rounded-lg border border-slate-800 focus:outline-none focus:border-purple-500/50 resize-none transition-colors relative z-10 shadow-inner"
                            spellCheck={false}
                        />
                    ) : (
                        <div className="relative z-10 w-full flex justify-center">
                            <MermaidDiagram chart={editableDiagram} />
                        </div>
                    )}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-5 hover:bg-white/5 transition-colors shadow-lg">
                    <h4 className="flex items-center gap-2 text-slate-200 font-semibold mb-4">
                        {isMicroservices ? <Server className="w-4 h-4 text-purple-400" /> : <Component className="w-4 h-4 text-blue-400" />}
                        Core Modules
                    </h4>
                    <motion.ul variants={containerVariants} initial="hidden" animate="show" className="space-y-3 relative">
                        {activeResult.services.map((service, idx) => {
                            const explainer = EXPLAINERS[service];
                            return (
                                <motion.li variants={listVariants} key={idx} className="flex items-center gap-3 text-sm text-slate-300 group">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                    <span className="font-medium">{service}</span>
                                    {explainer && (
                                        <button
                                            onClick={() => setSelectedExplainer({ title: service, desc: explainer })}
                                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-full"
                                            title="What is this?"
                                        >
                                            <Info className="w-4 h-4 text-slate-400 hover:text-blue-300" />
                                        </button>
                                    )}
                                </motion.li>
                            );
                        })}
                    </motion.ul>
                </motion.div>

                <div className="space-y-4">
                    <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/5 transition-colors shadow-lg">
                        <h4 className="flex items-center gap-2 text-slate-200 font-semibold mb-3">
                            <Database className="w-4 h-4 text-emerald-400" />
                            Data Synapse
                        </h4>
                        <div className="text-sm text-slate-300 flex flex-col gap-2">
                            <div className="bg-emerald-500/10 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-medium shadow-[0_0_10px_-2px_rgba(16,185,129,0.2)]">
                                {activeResult.database}
                            </div>
                            <div className="bg-amber-500/10 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/20 font-medium shadow-[0_0_10px_-2px_rgba(245,158,11,0.2)]">
                                {activeResult.cache}
                            </div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/5 transition-colors shadow-lg">
                        <h4 className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                            <HardDrive className="w-4 h-4 text-indigo-400" />
                            Deployment Plan
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            {activeResult.scalingStrategy}
                        </p>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-5 hover:bg-white/5 transition-colors flex flex-col shadow-lg">
                    <h4 className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                        Resource Allocation
                    </h4>
                    <div className="flex-1 min-h-[150px] relative w-full flex items-center justify-center -ml-4">
                        {costData.every(d => d.value === 0) ? (
                            <span className="text-slate-500 text-sm font-medium">Awaiting Data...</span>
                        ) : (
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={costData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={75}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="transparent"
                                        animationDuration={1500}
                                        animationEasing="ease-out"
                                    >
                                        {costData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 4px ${entry.color}80)` }} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val: any) => `$${val}/mo`}
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                                        itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    <div className="flex justify-center flex-wrap gap-4 text-xs mt-2 font-medium">
                        {costData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 opacity-90">
                                <span className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}` }} />
                                <span className="text-slate-300">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Modals using AnimatePresence */}
            <AnimatePresence>
                {selectedExplainer && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-blue-500/40 rounded-2xl p-6 max-w-md w-full shadow-[0_0_40px_-5px_rgba(59,130,246,0.3)] relative"
                        >
                            <button
                                onClick={() => setSelectedExplainer(null)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="text-xl font-bold text-white mb-3 pr-8 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                                {selectedExplainer.title}
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-sm font-medium">{selectedExplainer.desc}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showEnhanceOverlay && enhancementResult && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: "spring", stiffness: 250, damping: 25 }}
                            className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-[0_0_50px_-10px_rgba(168,85,247,0.4)] relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setShowEnhanceOverlay(false)}
                                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-500/40 shadow-[0_0_15px_-3px_rgba(168,85,247,0.5)]">
                                    <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Architecture Enhanced</h3>
                                    <p className="text-slate-400 text-sm mt-1 font-medium">AI analysis complete. Automatically applied the following core upgrades:</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {enhancementResult.changes_made.map((change, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (idx * 0.1) }}
                                        key={idx} className="bg-slate-950/50 border border-white/10 rounded-xl p-5 hover:border-purple-500/30 transition-colors shadow-inner"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="bg-emerald-500/20 rounded-full p-1 mt-0.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-1.5 text-base">{change}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed">{enhancementResult.reasoning[idx]}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-10 flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px -5px rgba(168,85,247,0.6)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowEnhanceOverlay(false)}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/40"
                                >
                                    Accept Blueprint Commits
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
