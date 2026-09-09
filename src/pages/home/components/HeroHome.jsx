import { useEffect, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function VolumeIcon({ muted }) {
  if (muted) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 5L6.5 9H3v6h3.5L11 19V5z" />
        <path d="M16 9l5 6" />
        <path d="M21 9l-5 6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5L6.5 9H3v6h3.5L11 19V5z" />
      <path d="M15.5 8.5a5 5 0 010 7" />
      <path d="M18 6a8.5 8.5 0 010 12" />
    </svg>
  );
}

export default function HeroHome({
  loading,
  error,
  videoUrl,
  squareVideoUrl,
  title,
}) {
  /* =========================================================
     RESPONSIVE
  ========================================================= */

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  function toggleSound() {
    const video = videoRef.current;

    if (!video) return;

    const nextMuted = !isMuted;

    video.muted = nextMuted;
    setIsMuted(nextMuted);
  }

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeVideoUrl = isMobile
    ? squareVideoUrl || videoUrl
    : videoUrl || squareVideoUrl;

  return (
    <section className="hero-home" aria-label="Homepage hero">
      <SkeletonTheme baseColor="#ece7e1" highlightColor="#f7f3ef">
        <div className="hero-home__frame">
          <div className="hero-home__stage">
            <div className="hero-media">
              {loading && (
                <div className="hero-media__placeholder hero-media__placeholder--skeleton">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "1100px",
                      margin: "0 auto",
                    }}
                  >
                    <Skeleton
                      height="100%"
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        borderRadius: 0,
                        lineHeight: 1,
                        display: "block",
                      }}
                    />
                  </div>
                </div>
              )}

              {!loading && error && (
                <div className="hero-media__placeholder">
                  <span>Failed to load video</span>
                </div>
              )}

              {!loading && !error && activeVideoUrl && (
                <video
                  ref={videoRef}
                  key={activeVideoUrl}
                  className="hero-media__video"
                  src={activeVideoUrl}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  preload="auto"
                  aria-label={title}
                />
              )}
              <button
                type="button"
                className="hero-media__sound-button"
                onClick={toggleSound}
                aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
              >
                <span className="hero-media__sound-icon">
                  <VolumeIcon muted={isMuted} />
                </span>

                <span className="hero-media__sound-label">
                  {isMuted ? "Sound On" : "Sound Off"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </section>
  );
}
