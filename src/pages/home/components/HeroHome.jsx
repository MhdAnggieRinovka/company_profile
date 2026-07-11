export default function HeroHome({ loading, error, videoUrl, title }) {
  return (
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
  );
}