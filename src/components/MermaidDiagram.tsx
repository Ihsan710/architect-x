"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
    chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgError, setSvgError] = useState<string | null>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            fontFamily: "inherit",
            themeVariables: {
                primaryColor: "#0f172a",
                primaryTextColor: "#cbd5e1",
                primaryBorderColor: "#334155",
                lineColor: "#64748b",
                secondaryColor: "#1e293b",
                tertiaryColor: "#0f172a",
                clusterBkg: "#1e293b50",
                clusterBorder: "#334155",
            },
        });
    }, []);

    useEffect(() => {
        const renderDiagram = async () => {
            if (containerRef.current && chart) {
                try {
                    setSvgError(null);
                    // Clear previous content
                    containerRef.current.innerHTML = '';

                    // Generate a unique ID for this render to prevent conflicts
                    const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;

                    try {
                        // First parse the syntax to catch obvious errors before render
                        await mermaid.parse(chart);

                        const { svg, bindFunctions } = await mermaid.render(id, chart);
                        containerRef.current.innerHTML = svg;
                        if (bindFunctions) {
                            bindFunctions(containerRef.current);
                        }
                    } catch (parseError: any) {
                        console.error('Mermaid parsing failed:', parseError);
                        setSvgError(parseError.message || "Invalid Mermaid syntax");

                        // Fallback logic for when the textarea DevMode has malformed syntax
                        if (containerRef.current) {
                            containerRef.current.innerHTML = `
                                <div class="text-red-400 bg-red-500/10 p-4 border border-red-500/20 rounded-lg font-mono text-sm overflow-auto w-full h-full flex flex-col justify-center">
                                    <div class="font-bold mb-2 text-xs uppercase tracking-wider">Syntax Error</div>
                                    ${parseError.message || "Unable to render diagram. Check syntax."}
                                </div>
                            `;
                        }
                    }

                } catch (error) {
                    console.error("Mermaid unexpected render error:", error);
                }
            }
        };

        renderDiagram();
    }, [chart]);

    return (
        <div
            ref={containerRef}
            className={`w-full h-full flex justify-center items-center overflow-x-auto ${svgError ? 'p-0' : 'p-4'}`}
        />
    );
}
