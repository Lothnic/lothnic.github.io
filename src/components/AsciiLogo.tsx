"use client";

import { useEffect, useState } from "react";

// ASCII art with dotted scatter pattern
const asciiArtLines = [
    "                    :;  :;  :;      :;  :;  :;      :;  :;  :;      :;  :;  :;",
    "            :;  :;      :;      :;  :;      :;  :;      :;      :;      :;  :;",
    "        :;      :;  :;  :;  :;      :;  :;      :;  :;  :;  :;      :;  :;",
    "    :;  :;  :;      :;      :;  :;      :;  :;      :;      :;  :;      :;  :;",
    "",
    "    ██╗          ██████╗     ████████╗    ██╗  ██╗    ███╗   ██╗    ██╗     ██████╗",
    "    ██║         ██╔═══██╗    ╚══██╔══╝    ██║  ██║    ████╗  ██║    ██║    ██╔════╝",
    "    ██║         ██║   ██║       ██║       ███████║    ██╔██╗ ██║    ██║    ██║     ",
    "    ██║         ██║   ██║       ██║       ██╔══██║    ██║╚██╗██║    ██║    ██║     ",
    "    ███████╗    ╚██████╔╝       ██║       ██║  ██║    ██║ ╚████║    ██║    ╚██████╗",
    "    ╚══════╝     ╚═════╝        ╚═╝       ╚═╝  ╚═╝    ╚═╝  ╚═══╝    ╚═╝     ╚═════╝",
    "",
    "        :;  :;      :;      :;  :;      :;  :;      :;      :;  :;      :;  :;",
    "            :;  :;  :;  :;      :;  :;      :;  :;  :;  :;      :;  :;",
    "                :;      :;  :;      :;  :;      :;      :;  :;      :;  :;",
    "                    :;  :;  :;      :;  :;  :;      :;  :;  :;      :;  :;  :;",
];

interface AsciiLogoProps {
    variant?: "solid" | "dotted";
    className?: string;
    lineDelay?: number; // Delay between each line in ms
}

export default function AsciiLogo({
    variant = "dotted",
    className = "",
    lineDelay = 80
}: AsciiLogoProps) {
    const [visibleLines, setVisibleLines] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Reset on mount
        setVisibleLines(0);
        setIsComplete(false);

        // Animate lines appearing one by one
        const totalLines = asciiArtLines.length;
        let currentLine = 0;

        const interval = setInterval(() => {
            currentLine++;
            setVisibleLines(currentLine);

            if (currentLine >= totalLines) {
                clearInterval(interval);
                setIsComplete(true);
            }
        }, lineDelay);

        return () => clearInterval(interval);
    }, [lineDelay]);

    return (
        <pre
            className={`ascii-logo ascii-logo-visible ${className}`}
            aria-label="LOTHNIC ASCII Art Logo"
        >
            {asciiArtLines.slice(0, visibleLines).map((line, index) => (
                <div
                    key={index}
                    className="ascii-line"
                    style={{
                        opacity: 1,
                        animation: `fadeInLine 0.15s ease-out`,
                    }}
                >
                    {line || " "}
                </div>
            ))}
            {!isComplete && (
                <span className="ascii-cursor">█</span>
            )}
        </pre>
    );
}
