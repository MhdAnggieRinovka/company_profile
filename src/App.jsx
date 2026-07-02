import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import WorkDetail from "./WorkDetail.jsx";
import "./App.css";

const HOME_API_URL = "https://cms.kyubstudio.com/wp-json/wp/v2/home_video";
const WORKS_API_URL =
  "https://cms.kyubstudio.com/wp-json/wp/v2/portfolio?_embed&orderby=date&order=desc";

const FILTERS = ["All", "Branding", "Illustration", "Invitation", "Packaging"];

function HomePage() {
  const [activePage, setActivePage] = useState("home");
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("Home Video");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [worksData, setWorksData] = useState([]);
  const [worksLoading, setWorksLoading] = useState(false);
  const [worksError, setWorksError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);

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
          year: item.acf?.year || "2024",
          image:
            item.acf?.cover_image?.sizes?.large ||
            item.acf?.cover_image?.sizes?.medium_large ||
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

  useEffect(() => {
    setActiveWorkIndex(0);
  }, [activeFilter]);

  useEffect(() => {
    if (activeWorkIndex > filteredWorks.length - 1) {
      setActiveWorkIndex(0);
    }
  }, [filteredWorks, activeWorkIndex]);

  const showWorks = activePage === "works";
  const activeWork = filteredWorks[activeWorkIndex];

  function goPrevWork() {
    if (!filteredWorks.length) return;
    setActiveWorkIndex((prev) =>
      prev === 0 ? filteredWorks.length - 1 : prev - 1,
    );
  }

  function goNextWork() {
    if (!filteredWorks.length) return;
    setActiveWorkIndex((prev) =>
      prev === filteredWorks.length - 1 ? 0 : prev + 1,
    );
  }

  function getSideItem(offset) {
    if (!filteredWorks.length) return null;
    const index =
      (activeWorkIndex + offset + filteredWorks.length) % filteredWorks.length;
    return filteredWorks[index];
  }

  const leftItemOne = getSideItem(-2);
  const leftItemTwo = getSideItem(-1);
  const rightItemOne = getSideItem(1);
  const rightItemTwo = getSideItem(2);

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
              className={
                activePage === "about" ? "nav-link active" : "nav-link"
              }
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
              className={
                activePage === "contacts" ? "nav-link active" : "nav-link"
              }
              onClick={() => setActivePage("contacts")}
            >
              CONTACTS
            </button>
          </nav>

          <div className="site-header__spacer" />
        </div>
      </header>

      {showWorks ? (
        <section className="works-page" aria-label="Works listing">
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
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={
                    activeFilter === filter
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {worksLoading && (
            <div className="works-feedback">Loading works...</div>
          )}

          {!worksLoading && worksError && (
            <div className="works-feedback">Failed to load works</div>
          )}

          {!worksLoading &&
            !worksError &&
            filteredWorks.length > 0 &&
            activeWork && (
              <div
                style={{
                  width: "100%",
                  maxWidth: "1240px",
                  margin: "0 auto",
                  padding: "26px 0 40px",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 24px",
                    textAlign: "center",
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: "28px",
                    fontWeight: 400,
                    lineHeight: 1.2,
                    color: "#2b2621",
                  }}
                >
                  {activeWork.title}
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      window.innerWidth <= 768
                        ? "34px minmax(0, 1fr) 34px"
                        : "44px 140px minmax(0, 560px) 140px 44px",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: window.innerWidth <= 768 ? "10px" : "18px",
                  }}
                >
                  <button
                    type="button"
                    onClick={goPrevWork}
                    aria-label="Previous work"
                    style={{
                      border: 0,
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: window.innerWidth <= 768 ? "38px" : "56px",
                      lineHeight: 1,
                      color: "#2b2621",
                    }}
                  >
                    &#8249;
                  </button>

                  {window.innerWidth > 768 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "18px",
                      }}
                    >
                      {leftItemOne && (
                        <div
                          style={{
                            width: "64px",
                            height: "400px",
                            border: "1px solid rgba(22,22,22,0.12)",
                            background: "#fff",
                            padding: "12px 8px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "11px",
                              color: "#c0b8b0",
                            }}
                          >
                            {leftItemOne.year}
                          </span>
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "12px",
                              color: "#8b847d",
                            }}
                          >
                            {leftItemOne.category}
                          </span>
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "12px",
                              color: "#6b645d",
                              fontFamily: 'Georgia, "Times New Roman", serif',
                            }}
                          >
                            {leftItemOne.title}
                          </span>
                        </div>
                      )}

                      {leftItemTwo && (
                        <div
                          style={{
                            width: "64px",
                            height: "400px",
                            border: "1px solid rgba(22,22,22,0.12)",
                            background: "#fff",
                            padding: "12px 8px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "11px",
                              color: "#c0b8b0",
                            }}
                          >
                            {leftItemTwo.year}
                          </span>
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "12px",
                              color: "#8b847d",
                            }}
                          >
                            {leftItemTwo.category}
                          </span>
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "12px",
                              color: "#6b645d",
                              fontFamily: 'Georgia, "Times New Roman", serif',
                            }}
                          >
                            {leftItemTwo.title}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <a
                      href={`/work/${activeWork.slug}`}
                      style={{
                        display: "block",
                        width: "100%",
                        textDecoration: "none",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          overflow: "hidden",
                          background: "#f1ece6",
                        }}
                      >
                        <img
                          src={activeWork.image}
                          alt={activeWork.alt}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "block",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </a>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: window.innerWidth <= 768 ? "24px" : "56px",
                        marginTop: window.innerWidth <= 768 ? "18px" : "24px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={goPrevWork}
                        aria-label="Previous work"
                        style={{
                          border: 0,
                          background: "transparent",
                          padding: 0,
                          cursor: "pointer",
                          fontSize: window.innerWidth <= 768 ? "38px" : "48px",
                          lineHeight: 1,
                          color: "#2b2621",
                        }}
                      >
                        &#8249;
                      </button>

                      <Link
                        to={`/work/${activeWork.slug}`}
                        style={{
                          display: "block",
                          width: "100%",
                          textDecoration: "none",
                        }}
                      >
                        Read the story
                      </Link>

                      <button
                        type="button"
                        onClick={goNextWork}
                        aria-label="Next work"
                        style={{
                          border: 0,
                          background: "transparent",
                          padding: 0,
                          cursor: "pointer",
                          fontSize: window.innerWidth <= 768 ? "38px" : "48px",
                          lineHeight: 1,
                          color: "#2b2621",
                        }}
                      >
                        &#8250;
                      </button>
                    </div>
                  </div>

                  {window.innerWidth > 768 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "18px",
                      }}
                    >
                      {rightItemOne && (
                        <div
                          style={{
                            width: "64px",
                            height: "400px",
                            border: "1px solid rgba(22,22,22,0.12)",
                            background: "#fff",
                            padding: "12px 8px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "11px",
                              color: "#c0b8b0",
                            }}
                          >
                            {rightItemOne.year}
                          </span>
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "12px",
                              color: "#8b847d",
                            }}
                          >
                            {rightItemOne.category}
                          </span>
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "12px",
                              color: "#6b645d",
                              fontFamily: 'Georgia, "Times New Roman", serif',
                            }}
                          >
                            {rightItemOne.title}
                          </span>
                        </div>
                      )}

                      {rightItemTwo && (
                        <div
                          style={{
                            width: "64px",
                            height: "400px",
                            border: "1px solid rgba(22,22,22,0.12)",
                            background: "#fff",
                            padding: "12px 8px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "11px",
                              color: "#c0b8b0",
                            }}
                          >
                            {rightItemTwo.year}
                          </span>
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "12px",
                              color: "#8b847d",
                            }}
                          >
                            {rightItemTwo.category}
                          </span>
                          <span
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                              fontSize: "12px",
                              color: "#6b645d",
                              fontFamily: 'Georgia, "Times New Roman", serif',
                            }}
                          >
                            {rightItemTwo.title}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={goNextWork}
                    aria-label="Next work"
                    style={{
                      border: 0,
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: window.innerWidth <= 768 ? "38px" : "56px",
                      lineHeight: 1,
                      color: "#2b2621",
                    }}
                  >
                    &#8250;
                  </button>
                </div>
              </div>
            )}

          {!worksLoading && !worksError && filteredWorks.length === 0 && (
            <div className="works-feedback">No works found</div>
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/work/:slug" element={<WorkDetail />} />
    </Routes>
  );
}
