"use client";

import { useState, useEffect } from "react";

export default function VaultLoading() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => (c <= 1 ? 1 : c - 1));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-center">
        <div className="font-[family-name:var(--font-display)] text-gold text-7xl font-bold glow-gold-text flicker mb-6">
          {count}
        </div>
        <div className="font-[family-name:var(--font-typewriter)] text-cream/40 text-sm tracking-widest">
          OPENING THE VAULT...
        </div>
      </div>
    </div>
  );
}
