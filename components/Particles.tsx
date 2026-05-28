"use client";

import { useEffect } from "react";

export default function Particles() {
  useEffect(() => {
    const container = document.getElementById("particles");
    if (!container) return;
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = 2 + Math.random() * 4;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${8 + Math.random() * 12}s;
        animation-delay: ${Math.random() * 10}s;
      `;
      container.appendChild(p);
    }
  }, []);

  return <div className="particles" id="particles" />;
}
