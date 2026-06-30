import { useEffect, useMemo, useState } from "react";
import "./app.css";

const HOME_API_URL = "https://cms.kyubstudio.com/wp-json/wp/v2/home_video";
const WORKS_API_URL =
  "https://cms.kyubstudio.com/wp-json/wp/v2/portfolio?_embed&orderby=date&order=desc";

const FILTERS = ["All", "Branding", "Illustration", "Invitation", "Packaging"];

export default function HomePage() {
  const [activePage, setActivePage] = useState("home");
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("Home Video");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [worksData, setWorksData] = useState([]);
  const [worksLoading, setWorksLoading] = useState(false);
  const [worksError, setWorksError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    let ignore = false;

    async function fetchHomeVideo() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(HOME_API_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
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

  useEffect(() => {
    if (activePage !== "works") return;

    let ignore = false;

    async function fetchWorks() {
      try {
        setWorksLoading(true);
        setWorksError("");

        const response = await fetch(WORKS_API_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch works API: ${response.status}`);
        }

        const json = await response.json();

        const mapped = json.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title?.rendered?.replace(/&#038;/g, "&") || "",
          category: item.acf?.portfolio_category?.name || "Uncategorized",
          image:
            item.acf?.cover_image?.sizes?.medium_large ||
            item.acf?.cover_image?.sizes?.large ||
            item.acf?.cover_image?.sizes?.medium ||
            item.acf?.cover_image?.url ||
            "",
          alt: item.acf?.cover_image?.alt || item.title?.rendered || "",
        }));

        if (!ignore) setWorksData(mapped);
      } catch (err) {
        if (!ignore) setWorksError(err.message || "Failed to load works.");
      } finally {
        if (!ignore) setWorksLoading(false);
      }
    }

    fetchWorks();

    return () => {
      ignore = true;
    };
  }, [activePage]);

  const filteredWorks = useMemo(() => {
    if (activeFilter === "All") return worksData;
    return worksData.filter((item) => item.category === activeFilter);
  }, [worksData, activeFilter]);

  const showWorks = activePage === "works";

  return (
    <main className="home-page">
      <header className="site-header">
        <div className="site-header__inner">
          <button
            type="button"
            className="brand-button"
            aria-label="KYUB home"
            onClick={() => setActivePage("home")}
          >
            <img src="/logo-kyub.jpeg" alt="KYUB" />
          </button>

          <nav className="site-nav" aria-label="Main navigation">
            <button
              type="button"
              className={activePage === "about" ? "nav-link active" : "nav-link"}
              onClick={() => setActivePage("about")}
            >
              ABOUT
            </button>

            <button
              type="button"
              className={showWorks ? "nav-link active" : "nav-link"}
              onClick={() => setActivePage("works")}
            >
              WORK
            </button>

            <button
              type="button"
              className={activePage === "contacts" ? "nav-link active" : "nav-link"}
              onClick={() => setActivePage("contacts")}
            >
              CONTACTS
            </button>
          </nav>

          <div className="site-header__spacer" />
        </div>
      </header>

      {showWorks ? (
        <section 
          className="works-page" 
          aria-label="Works listing"
          style={{
            width: "100%",
            maxWidth: "100%",
            padding: "0 32px 72px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {/* --- FIXED FILTER ROW VIA INLINE STYLE --- */}
          <div
            className="works-filter-wrap"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              borderBottom: "1px solid rgba(22, 22, 22, 0.06)",
            }}
          >
            <div
              className="works-filter-row"
              style={{
                width: "100%",
                maxWidth: "980px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "34px",
                padding: "22px 0 36px",
                margin: "0 auto",
                flexWrap: "wrap",
              }}
            >
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    className={isActive ? "filter-button active" : "filter-button"}
                    onClick={() => setActiveFilter(filter)}
                    style={{
                      border: "0",
                      background: "transparent",
                      padding: "8px 12px",
                      margin: "0",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "color 0.2s ease, font-weight 0.2s ease",
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "12px",
                      lineHeight: "1",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: isActive ? "#17130f" : "#b8b1ab",
                      fontWeight: isActive ? "700" : "400",
                    }}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          {worksLoading && (
            <div className="works-feedback">Loading works...</div>
          )}

          {!worksLoading && worksError && (
            <div className="works-feedback">Failed to load works</div>
          )}

          {!worksLoading && !worksError && (
            /* --- FIXED GRID VIA INLINE STYLE --- */
            <div
              className="works-grid"
              style={{
                display: "grid",
                width: "100%",
                maxWidth: "980px",
                margin: "36px auto 0",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                columnGap: "28px",
                rowGap: "40px",
              }}
            >
              {filteredWorks.map((item) => (
                <article className="work-card" key={item.id} style={{ width: "100%" }}>
                  <a href={`/work/${item.slug}`} className="work-card__link">
                    <div className="work-card__media">
                      <img src={item.image} alt={item.alt} loading="lazy" />
                    </div>
                    <h3>{item.title}</h3>
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
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
      )}
    </main>
  );
}