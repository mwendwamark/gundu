"use client";

import { useState, useEffect, useRef } from "react";
import { launchConfetti } from "./ConfettiButton";

interface CandleState {
  status: "lit" | "extinguishing" | "extinguished";
}

export default function CandleGate() {
  const [candles, setCandles] = useState<CandleState[]>([
    { status: "lit" },
    { status: "lit" },
    { status: "lit" },
  ]);
  const [phase, setPhase] = useState<"idle" | "teasing" | "wishing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [fading, setFading] = useState(false);
  const [showTease, setShowTease] = useState(false);

  const animFrameRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const puffTimerRef = useRef(0);
  const candleIndexRef = useRef(0);
  const blowDetectionRef = useRef(false);

  const candlesRef = useRef(candles);
  candlesRef.current = candles;

  // Scroll lock on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Setup mic AFTER 300ms delay so cake is fully painted before permission prompt
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicSupported(false);
      return;
    }

    let cancelled = false;
    let blowTimer: ReturnType<typeof setTimeout> | undefined;

    const mountTimer = setTimeout(() => {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          const ctx = new AudioContext();
          audioCtxRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          setMicActive(true);

          // Enable blow detection after 2000ms — mic is active but ignores audio during this window
          blowTimer = setTimeout(() => {
            blowDetectionRef.current = true;
          }, 2000);

          function checkMic() {
            if (cancelled) return;
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

            if (blowDetectionRef.current && avg > 55) {
              if (puffTimerRef.current === 0) {
                puffTimerRef.current = Date.now();
              } else if (Date.now() - puffTimerRef.current >= 80) {
                puffTimerRef.current = 0;
                if (ctx.state === "suspended") ctx.resume();
                extinguishCandle();
              }
            } else {
              puffTimerRef.current = 0;
            }

            animFrameRef.current = requestAnimationFrame(checkMic);
          }
          checkMic();
        } catch {
          setMicSupported(false);
        }
      })();
    }, 300);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(blowTimer);
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function extinguishCandle() {
    const current = candlesRef.current;
    const litIdx = current.findIndex((c) => c.status === "lit");
    if (litIdx === -1) return;
    doExtinguish(litIdx);
  }

  function tapCandle(i: number) {
    if (candlesRef.current[i].status !== "lit") return;
    doExtinguish(i);
  }

  function doExtinguish(i: number) {
    const current = candlesRef.current;
    const litBefore = current.filter((c) => c.status === "lit").length;
    const wasFirstBlow = litBefore === 3;

    setCandles((prev) => {
      const next = prev.map((c, idx) =>
        idx === i ? { ...c, status: "extinguishing" as const } : c
      );
      return next;
    });

    if (wasFirstBlow) {
      setTimeout(() => {
        setPhase("teasing");
        setShowTease(true);
      }, 1000);
    }

    setTimeout(() => {
      setCandles((prev) => {
        const next = prev.map((c, idx) =>
          idx === i && c.status === "extinguishing"
            ? { ...c, status: "extinguished" as const }
            : c
        );
        const litAfter = next.filter((c) => c.status === "lit").length;

        if (litAfter === 0) {
          setPhase("wishing");
          setShowTease(false);
          setProgress(0);
          startCountdown();
        }
        return next;
      });
    }, 400);
  }

  function startCountdown() {
    let startTime = Date.now();
    const duration = 12000;

    function tick() {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        // Done
        launchConfetti();
        setTimeout(() => {
          setFading(true);
          setTimeout(() => {
            setPhase("done");
            document.body.style.overflow = "auto";
          }, 600);
        }, 200);
      }
    }
    requestAnimationFrame(tick);
  }

  function getFlamePath(cx: number): string {
    return `M${cx},82 Q${cx},70 ${cx + 2},64 Q${cx + 4},70 ${cx + 4},82 Q${cx + 4},87 ${cx + 2},89 Q${cx},87 ${cx},82 Z`;
  }

  if (phase === "done") return null;

  return (
    <div className={`candle-gate ${fading ? "fading" : ""}`}>
      <div className="candle-gate-inner">
        {/* Cake SVG */}
        <svg className="candle-cake" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bottom tier */}
          <rect x="40" y="160" width="220" height="50" rx="6" fill="#FDF6F0" stroke="rgba(196,113,79,0.3)" strokeWidth="1.5" />
          <path d="M40,162 Q65,155 90,162 Q115,169 140,162 Q165,155 190,162 Q215,169 240,162 Q255,155 260,160" stroke="#C4714F" strokeOpacity="0.4" strokeWidth="2" fill="none" />

          {/* Top tier */}
          <rect x="80" y="110" width="140" height="50" rx="6" fill="#FDF6F0" stroke="rgba(196,113,79,0.3)" strokeWidth="1.5" />
          <path d="M80,112 Q100,105 120,112 Q140,119 160,112 Q180,105 200,112 Q215,119 220,110" stroke="#C4714F" strokeOpacity="0.4" strokeWidth="2" fill="none" />

          {/* Candles */}
          {[115, 150, 185].map((cx, i) => {
            const state = candles[i]?.status || "lit";
            const isExt = state === "extinguished";
            return (
              <g key={i} onClick={() => tapCandle(i)} style={{ cursor: "pointer" }}>
                {/* Wick */}
                <line x1={cx} y1="82" x2={cx} y2="76" stroke={isExt ? "#5A5450" : "#C4714F"} strokeWidth="1.5" />
                {/* Wax */}
                <rect x={cx - 4} y="82" width="8" height="28" rx="3" fill="#C4714F" opacity={isExt ? 0.5 : 0.9} />
                {/* Wick dot */}
                <circle cx={cx} cy="82" r="1.5" fill={isExt ? "#5A5450" : "#C4714F"} />

                {/* Flame */}
                <g className={`candle-flame ${state}`}>
                  <path d={getFlamePath(cx)} fill="#E8A87C" opacity={state === "extinguished" ? 0 : 0.9} />
                  <path d={getFlamePath(cx)} fill="#FCE6C9" opacity={state === "extinguished" ? 0 : 0.5} transform="scale(0.6) translate(0, 0)" />
                </g>

                {/* Smoke (only when extinguished, appears after flame fades) */}
                {isExt && (
                  <path
                    className="candle-smoke"
                    d={`M${cx},60 Q${cx - 5},50 ${cx + 3},40 Q${cx + 8},30 ${cx - 2},20`}
                    stroke="#9A8E88"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Gate text */}
        {(phase === "idle" || phase === "teasing") && (
          <p className="gate-text">Blow the candles and make a wish</p>
        )}

        {(phase === "idle" || phase === "teasing") && (
          <p className="gate-hint">
            Tap the mic button and blow into your mic — or just tap a candle
          </p>
        )}

        {showTease && phase === "teasing" && (
          <p className="gate-tease">Niko serious blow the candle 😂</p>
        )}

        {phase === "wishing" && (
          <>
            <p className="gate-wish">
              Happy Birthday, Lucy&nbsp;
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="#C4714F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle" }}>
                <path d="M16 4 C16 4 8 12 8 20 C8 26 12 30 16 30 C20 30 24 26 24 20 C24 12 16 4 16 4Z" />
                <path d="M16 4 L16 30" />
              </svg>
            </p>
            <p className="gate-text">Make your wish...</p>
          </>
        )}

        {/* Progress bar */}
        {phase === "wishing" && (
          <div className="gate-progress">
            <div className="gate-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        )}

        {/* Mic button */}
        {micSupported && (phase === "idle" || phase === "teasing") && (
          <button
            className={`mic-btn ${micActive ? "active" : ""}`}
            onClick={() => {
              if (audioCtxRef.current?.state === "suspended") {
                audioCtxRef.current.resume();
              }
            }}
            aria-label="Microphone"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4714F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="11" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
