"use client";

import { useEffect, useState, memo } from "react";

function Starfield() {
    const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; duration: number; opacity: number; depth: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate stars only on the client
        const generateStars = () => {
            const newStars = [];
            const starCount = 200; // Optimal density

            for (let i = 0; i < starCount; i++) {
                const depthInt = Math.random();
                let depth = 1;
                let size = 1;
                let durationMultiplier = 1;

                if (depthInt > 0.9) {
                    depth = 4; // Large, fast close stars
                    size = Math.random() * 2 + 2;
                    durationMultiplier = 0.5;
                } else if (depthInt > 0.6) {
                    depth = 3; // Medium
                    size = Math.random() * 1.5 + 1;
                    durationMultiplier = 1.5;
                } else if (depthInt > 0.2) {
                    depth = 2; // Tiny dense
                    size = Math.random() * 1 + 0.5;
                    durationMultiplier = 3;
                } else {
                    depth = 1; // Distant background
                    size = Math.random() * 1 + 0.5;
                    durationMultiplier = 10;
                }

                newStars.push({
                    id: i,
                    left: `${Math.random() * 100}%`,
                    top: depth > 1 ? `${Math.random() * 100}%` : `${Math.random() * 100}%`,
                    size,
                    duration: (Math.random() * 50 + 50) * durationMultiplier,
                    opacity: Math.random() * 0.7 + 0.3,
                    depth,
                    delay: Math.random() * 50 // Positive delay, staggered starts natively handled by looping
                });
            }
            setStars(newStars);

            // Inject keyframes safely
            if (!document.getElementById('starfield-keyframes')) {
                const style = document.createElement('style');
                style.id = 'starfield-keyframes';
                style.innerHTML = `
                    @keyframes moveTargetY {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-100vh); }
                    }
                    @keyframes pulseOpacity {
                        0%, 100% { opacity: 0.2; }
                        50% { opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
        };

        generateStars();
    }, []);

    if (stars.length === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {stars.map((star) => {
                const isMoving = star.depth > 1;
                const animationString = isMoving
                    ? `moveTargetY ${star.duration}s linear ${-star.delay}s infinite` // CSS handles negative delays fine!
                    : `pulseOpacity ${star.duration / 10}s ease-in-out ${-star.delay}s infinite`;

                return (
                    <div
                        key={star.id}
                        className="absolute bg-white rounded-full"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: isMoving ? star.opacity : undefined, // pulseOpacity overrides opacity
                            animation: animationString
                        }}
                    />
                );
            })}
        </div>
    );
}

export default memo(Starfield);
