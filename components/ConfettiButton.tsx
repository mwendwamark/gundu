"use client";

export function launchConfetti() {
  const colors = ["#C4714F","#E8A87C","#B85C6E","#FDFAF7","#F2C5A0","#D4907A","#fff"];
  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      const c = document.createElement("div");
      c.className = "confetti-piece";
      c.style.cssText = `
        left: ${Math.random() * 100}vw;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        animation-duration: ${1.8 + Math.random() * 2.2}s;
        animation-delay: ${Math.random() * 0.8}s;
      `;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4200);
    }, i * 12);
  }
}

export default function ConfettiButton() {
  return (
    <button className="confetti-btn" onClick={launchConfetti}>
      Celebrate!
    </button>
  );
}
