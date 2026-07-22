import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function HeroHome({ loading, error, videoUrl, title }) {
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
      </SkeletonTheme>
    </section>
  );
}