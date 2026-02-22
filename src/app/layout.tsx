import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Starfield from "@/components/Starfield";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ARCHITECT-X | Intelligent Cloud Deployments",
    description: "Generate scalable cloud architectures in seconds.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark bg-[#030712]">
            <body className={`${inter.className} bg-[#030712] text-slate-300 min-h-screen relative selection:bg-blue-500/30 overflow-x-hidden`}>
                {/* Hyper-Space Starfield Effect Layers */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712]" />

                    <Starfield />

                    {/* Safe Deep Space Background Layers */}
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[150px] mix-blend-screen animate-pulse duration-[8000ms]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] mix-blend-screen animate-pulse duration-[12000ms]" />
                    <div className="absolute top-[40%] right-[20%] w-[30%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]" />

                    {/* Gradient Overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#010308] via-transparent to-transparent z-10" />
                </div>

                {/* Content Layer */}
                <div className="relative z-10 antialiased">
                    {children}
                </div>
            </body>
        </html>
    );
}
