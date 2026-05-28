"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const images = [
  { src: "/assets/images/Lucy1.webp", alt: "Lucy 1" },
  { src: "/assets/images/Lucy2.webp", alt: "Lucy 2" },
  { src: "/assets/images/Lucy3.webp", alt: "Lucy 3" },
  { src: "/assets/images/Lucy4.webp", alt: "Lucy 4" },
  { src: "/assets/images/Lucy5.webp", alt: "Lucy 5" },
  { src: "/assets/images/Lucy6.webp", alt: "Lucy 6" },
  { src: "/assets/images/Lucy7.webp", alt: "Lucy 7" },
  { src: "/assets/images/Lucy8.webp", alt: "Lucy 8" },
  { src: "/assets/images/Lucy9.webp", alt: "Lucy 9" },
];

export default function PhotoGallery() {
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observerRef.current?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".gallery-item.reveal").forEach((el) => {
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const handleTap = useCallback((i: number) => {
    setTappedIndex(i);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setTappedIndex(null), 500);
  }, []);

  return (
    <div className="section reveal">
      <span className="section-tag">Moments</span>
      <h2 className="section-title">
        A few of our favourite <em>favourite</em> frames
      </h2>
      <p className="section-body">
        Each photo is a chapter. Each smile, a verse.
      </p>
      <div className="gallery-grid">
        {images.map((img, i) => {
          const isFull = i % 3 === 0;
          const isSpan2 = i % 5 === 0;
          return (
            <div
              key={img.src}
              className={`gallery-item reveal ${isFull ? "full" : "half"} ${isSpan2 ? "span-2" : ""} ${tappedIndex === i ? "tapped" : ""}`}
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => handleTap(i)}
              onTouchStart={() => handleTap(i)}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
              <div className="gallery-caption" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
