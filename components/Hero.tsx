"use client";

export default function Hero() {
  return (
    <section className="hero">
      <span className="hero-leaf">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C4714F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4 C16 4 8 12 8 20 C8 26 12 30 16 30 C20 30 24 26 24 20 C24 12 16 4 16 4Z" />
          <path d="M16 4 L16 30" />
        </svg>
      </span>
      <p className="hero-label">Today is your day</p>
      <h1 className="hero-name">
        Happy Birthday,<br /><span>Lucy Wanjiru</span>
      </h1>
      <p className="hero-twenty">Turning 20 — a new and beautiful decade</p>
      <p className="hero-verse">
        &ldquo;For I know the plans I have for you,&rdquo; declares the Lord,<br />
        &ldquo;plans to prosper you and not to harm you,<br />
        plans to give you <strong>hope and a future.</strong>&rdquo;<br />
        — Jeremiah 29:11
      </p>
      <div
        className="scroll-hint"
        onClick={() =>
          document.getElementById("main")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <span>Scroll</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  );
}
