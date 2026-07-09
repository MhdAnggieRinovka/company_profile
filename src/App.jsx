import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import WorkDetail from "./WorkDetail.jsx";
import "./App.css";

const HOME_API_URL = "https://cms.kyubstudio.com/wp-json/wp/v2/home_video";
const WORKS_API_URL =
  "https://cms.kyubstudio.com/wp-json/wp/v2/portfolio?_embed&orderby=date&order=desc";

const FILTERS = ["All", "Branding", "Illustration", "Invitation", "Packaging"];

function HomePage() {
  const [activePage, setActivePage] = useState("about");
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("Home Video");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [worksData, setWorksData] = useState([]);
  const [worksLoading, setWorksLoading] = useState(false);
  const [worksError, setWorksError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    let result =
      activeFilter === "All"
        ? [...worksData]
        : worksData.filter((item) => item.category === activeFilter);

    if (activeFilter === "Branding") {
      const drEllsIndex = result.findIndex((item) => item.slug === "907");

      if (drEllsIndex > 0) {
        const [drEllsItem] = result.splice(drEllsIndex, 1);
        result.unshift(drEllsItem);
      }
    }

    return result;
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

  function goToWorkByOffset(offset) {
    if (!filteredWorks.length) return;
    const index =
      (activeWorkIndex + offset + filteredWorks.length) % filteredWorks.length;
    setActiveWorkIndex(index);
  }

  const leftItemOne = getSideItem(-2);
  const leftItemTwo = getSideItem(-1);
  const rightItemOne = getSideItem(1);
  const rightItemTwo = getSideItem(2);

  return (
    <main
      className={
        showWorks ? "home-page home-page--works" : "home-page home-page--about"
      }
    >
      <header className="site-header">
        <div className="site-header__inner">
          <button
            type="button"
            className="brand-button"
            aria-label="KYUB home"
            onClick={() => setActivePage("about")}
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
          <div className="works-filter-wrap">
            <div className="works-filter-row">
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
              <div className="works-carousel">
                <h2 className="works-carousel__title">{activeWork.title}</h2>

                <div className="works-carousel__media-row">
                  {!isMobile && (
                    <div className="works-carousel__side">
                      {leftItemOne && (
                        <button
                          type="button"
                          className="works-side-card"
                          onClick={() => goToWorkByOffset(-2)}
                          aria-label={`Show ${leftItemOne.title}`}
                        >
                          <span className="works-side-card__year">
                            {leftItemOne.year}
                          </span>
                          <span className="works-side-card__category">
                            {leftItemOne.category}
                          </span>
                          <span className="works-side-card__name">
                            {leftItemOne.title}
                          </span>
                        </button>
                      )}

                      {leftItemTwo && (
                        <button
                          type="button"
                          className="works-side-card"
                          onClick={() => goToWorkByOffset(-1)}
                          aria-label={`Show ${leftItemTwo.title}`}
                        >
                          <span className="works-side-card__year">
                            {leftItemTwo.year}
                          </span>
                          <span className="works-side-card__category">
                            {leftItemTwo.category}
                          </span>
                          <span className="works-side-card__name">
                            {leftItemTwo.title}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  <Link
                    to={`/work/${activeWork.slug}`}
                    className="works-carousel__hero-link"
                  >
                    <div className="works-carousel__hero">
                      <img
                        src={activeWork.image}
                        alt={activeWork.alt}
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {!isMobile && (
                    <div className="works-carousel__side">
                      {rightItemOne && (
                        <button
                          type="button"
                          className="works-side-card"
                          onClick={() => goToWorkByOffset(1)}
                          aria-label={`Show ${rightItemOne.title}`}
                        >
                          <span className="works-side-card__year">
                            {rightItemOne.year}
                          </span>
                          <span className="works-side-card__category">
                            {rightItemOne.category}
                          </span>
                          <span className="works-side-card__name">
                            {rightItemOne.title}
                          </span>
                        </button>
                      )}

                      {rightItemTwo && (
                        <button
                          type="button"
                          className="works-side-card"
                          onClick={() => goToWorkByOffset(2)}
                          aria-label={`Show ${rightItemTwo.title}`}
                        >
                          <span className="works-side-card__year">
                            {rightItemTwo.year}
                          </span>
                          <span className="works-side-card__category">
                            {rightItemTwo.category}
                          </span>
                          <span className="works-side-card__name">
                            {rightItemTwo.title}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="works-carousel__footer">
                  <button
                    type="button"
                    onClick={goPrevWork}
                    aria-label="Previous work"
                    className="works-carousel__footer-arrow"
                  >
                    &#8249;
                  </button>

                  <Link
                    to={`/work/${activeWork.slug}`}
                    className="works-carousel__story-link"
                  >
                    Read the story
                  </Link>

                  <button
                    type="button"
                    onClick={goNextWork}
                    aria-label="Next work"
                    className="works-carousel__footer-arrow"
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