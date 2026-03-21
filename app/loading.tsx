"use client";

import { useState, useEffect } from "react";

export default function Loading() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 1;
        }
        return c - 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-center">
        {/* Countdown circle */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-full h-full countdown-circle" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2"
              opacity="0.3"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2"
              strokeDasharray="283"
              strokeDashoffset={283 * (1 - count / 3)}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            {/* Crosshair */}
            <line x1="50" y1="10" x2="50" y2="25" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
            <line x1="50" y1="75" x2="50" y2="90" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
            <line x1="10" y1="50" x2="25" y2="50" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
            <line x1="75" y1="50" x2="90" y2="50" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-[family-name:var(--font-display)] text-gold text-5xl font-bold glow-gold-text">
              {count}
            </span>
          </div>
        </div>

        <div className="font-[family-name:var(--font-typewriter)] text-cream/40 text-sm tracking-widest">
          THREADING THE REEL...
        </div>
      </div>
    </div>
  );
}
