"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface Song {
  num: string;
  name: string;
  artist: string;
  file: string;
  note: string;
}

const songs: Song[] = [
  { num: "01", name: "Your Love", artist: "Chandler Moore & Moses Bliss", file: "Your_love.mp3", note: "Nimetoa hii kwa gram yako" },
  { num: "02", name: "Sifa Zitande", artist: "Jacque Gachiri", file: "Sifa_Zitande.mp3", note: "Mwecheche" },
  { num: "03", name: "Nizamishe", artist: "Joana Neema", file: "Nizamishe.mp3", note: "Ya Kuzama in His Presence" },
  { num: "04", name: "Sitasahau", artist: "Kestin Mbogo", file: "Sitasahau.mp3", note: "Your Fav Artist " },
  { num: "05", name: "Hakuna Kama Wewe", artist: "KINGDOM WORSHIPPERS FACTORY FT NICKSON KANYELELE ", file: "Hakuna_Kama_wewe.mp3", note: "Your fav song (ka nakumbuka fiti)" },
];

function formatTime(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function SongSection() {
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number[]>([0, 0, 0, 0, 0]);
  const [duration, setDuration] = useState<number[]>([0, 0, 0, 0, 0]);

  const handleTimeUpdate = useCallback((i: number) => {
    const audio = audioRefs.current[i];
    if (audio) {
      setCurrentTime((prev) => { const n = [...prev]; n[i] = audio.currentTime; return n; });
    }
  }, []);

  const handleLoadedMetadata = useCallback((i: number) => {
    const audio = audioRefs.current[i];
    if (audio) {
      setDuration((prev) => { const n = [...prev]; n[i] = audio.duration; return n; });
    }
  }, []);

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    songs.forEach((_, i) => {
      const audio = audioRefs.current[i];
      if (!audio) return;
      const onTime = () => handleTimeUpdate(i);
      const onMeta = () => handleLoadedMetadata(i);
      audio.addEventListener("timeupdate", onTime);
      audio.addEventListener("loadedmetadata", onMeta);
      cleanups.push(() => {
        audio.removeEventListener("timeupdate", onTime);
        audio.removeEventListener("loadedmetadata", onMeta);
      });
    });
    return () => { cleanups.forEach((fn) => fn()); };
  }, [handleTimeUpdate, handleLoadedMetadata]);

  function playSong(i: number) {
    if (activeIndex !== null && activeIndex !== i) {
      const prev = audioRefs.current[activeIndex];
      if (prev) { prev.pause(); prev.currentTime = 0; }
    }
    const audio = audioRefs.current[i];
    if (!audio) return;
    if (activeIndex === i && playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setActiveIndex(i);
      setPlaying(true);
    }
  }

  function handleSeek(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRefs.current[i];
    if (audio) {
      audio.currentTime = Number(e.target.value);
    }
  }

  return (
    <div className="section reveal">
      <span className="section-tag">Songs that carry your spirit</span>
      <h2 className="section-title">
        A playlist<br /><em>just for you</em>
      </h2>
      <p className="section-body">
        Music is one of the ways God speaks to your heart. These are songs that feel like you —
        full of worship, depth, and the kind of faith that doesn&rsquo;t flinch.
      </p>
      <div className="song-list">
        {songs.map((s, i) => (
          <div key={s.num} className="song-card">
            <div className="song-card-top">
              <button
                className={`song-play-btn ${activeIndex === i && playing ? "playing" : ""}`}
                onClick={() => playSong(i)}
                aria-label={activeIndex === i && playing ? "Pause" : "Play"}
              >
                {activeIndex === i && playing ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              <div className="song-info">
                <span className="song-name">{s.name}</span>
                <span className="song-artist">{s.artist}</span>
                <span className="song-note">{s.note}</span>
              </div>
              <a
                href={`/assets/songs/${s.file}`}
                download
                className="song-download"
                aria-label="Download"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4714F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>
            {activeIndex === i && (
              <div className="song-seek">
                <input
                  type="range"
                  min={0}
                  max={duration[i] || 0}
                  step={0.1}
                  value={currentTime[i]}
                  onChange={(e) => handleSeek(i, e)}
                  style={{
                    background: `linear-gradient(to right, #C4714F 0%, #C4714F ${(currentTime[i] / (duration[i] || 1)) * 100}%, rgba(196,113,79,0.2) ${(currentTime[i] / (duration[i] || 1)) * 100}%, rgba(196,113,79,0.2) 100%)`,
                  }}
                />
                <div className="song-time">
                  {formatTime(currentTime[i])} / {formatTime(duration[i])}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {songs.map((s, i) => (
        <audio
          key={s.file}
          ref={(el) => { audioRefs.current[i] = el; }}
          src={`/assets/songs/${s.file}`}
          preload="metadata"
        />
      ))}
    </div>
  );
}
