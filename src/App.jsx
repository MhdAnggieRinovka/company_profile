import { useEffect, useState } from "react";
import "./app.css";

const API_URL = "https://cms.kyubstudio.com/wp-json/wp/v2/home_video";

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("Home Video");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchHomeVideo() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch API: ${response.status}`);
        }

        const json = await response.json();
        const firstItem = Array.isArray(json) ? json[0] : json;

        const videoData = firstItem?.acf?.wide_video;
        let finalVideoUrl = "";

        if (typeof videoData === "string") {
          finalVideoUrl = videoData;
        } else if (videoData && typeof videoData === "object") {
          finalVideoUrl = videoData.url;
        }

        if (!finalVideoUrl) {
          throw new Error("Video URL tidak ditemukan dalam data API.");
        }

        if (ignore) return;

        setVideoUrl(finalVideoUrl);
        setTitle(firstItem?.title?.rendered || "Home Video");
      } catch (err) {
        if (ignore) return;
        setError(err.message || "Failed to load homepage video.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchHomeVideo();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="home-page">
      <header className="site-header">
        <div className="site-header__inner">
          <a href="/" className="brand" aria-label="KYUB home">
            <img src="/logo-kyub.jpeg" alt="KYUB" />
          </a>

          <nav className="site-nav" aria-label="Main navigation">
            <a href="#about">ABOUT</a>
            <a href="#work">WORKS</a>
            <a href="#contacts">CONTACTS</a>
          </nav>
        </div>
      </header>

      <section className="hero-home" aria-label="Homepage hero">
        <div className="hero-home__frame">
          <div className="hero-home__stage">
            <div className="hero-media">
              {loading && (
                <div className="hero-media__placeholder">
                  <span>Loading video...</span>
                </div>
              )}

              {!loading && error && (
                <div className="hero-media__placeholder">
                  <span>Failed to load video</span>
                </div>
              )}

              {!loading && !error && videoUrl && (
                <video
                  key={videoUrl}
                  className="hero-media__video"
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-label={title}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}