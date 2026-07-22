import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../App.css";
import HeroHome from "./components/HeroHome";
import SiteHeader from "./components/SiteHeader";
import WorksCarousel from "./components/WorksCarousel";
import WorksFilters from "./components/WorksFilters";
import useHomeVideo from "./hooks/useHomeVideo";
import useWorksData from "./hooks/useWorksData";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getPageFromParams = () => {
    const pageParam = searchParams.get("page");
    if (pageParam === "works") return "works";
    if (pageParam === "contacts") return "contacts";
    return "about";
  };

  const [activePage, setActivePage] = useState(getPageFromParams());
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { videoUrl, title, loading, error } = useHomeVideo();
  const { worksData, worksLoading, worksError } = useWorksData(activePage);

  useEffect(() => {
    setActivePage(getPageFromParams());
  }, [searchParams]);

  function handleNavChange(page) {
    setActivePage(page);

    if (page === "about") {
      setSearchParams({});
      return;
    }

    setSearchParams({ page });
  }

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  if (isMobile && showWorks) {
    return (
      <main className="home-page home-page--works">
        <div className="home-page__mobile-top">
          <SiteHeader
            activePage={activePage}
            showWorks={false}
            onNavigate={handleNavChange}
          />

          <WorksCarousel
            isMobile={isMobile}
            worksLoading={worksLoading}
            worksError={worksError}
            filteredWorks={filteredWorks}
            activeWork={activeWork}
            leftItemOne={leftItemOne}
            leftItemTwo={leftItemTwo}
            rightItemOne={rightItemOne}
            rightItemTwo={rightItemTwo}
            goPrevWork={goPrevWork}
            goNextWork={goNextWork}
            goToWorkByOffset={goToWorkByOffset}
          />

          <WorksFilters
            activeFilter={activeFilter}
            onChangeFilter={setActiveFilter}
          />

          <div className="home-page__mobile-bottom-nav">
            <SiteHeader
              activePage={activePage}
              showWorks={true}
              onNavigate={handleNavChange}
            />
          </div>
        </div>
      </main>
    );
  }

  if (isMobile && !showWorks) {
    return (
      <main className="home-page home-page--about">
        <div className="home-page__mobile-top">
          <SiteHeader
            activePage={activePage}
            showWorks={false}
            onNavigate={handleNavChange}
          />

          <HeroHome
            loading={loading}
            error={error}
            videoUrl={videoUrl}
            title={title}
          />

          <div className="home-page__mobile-bottom-nav">
            <SiteHeader
              activePage={activePage}
              showWorks={true}
              onNavigate={handleNavChange}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={
        showWorks ? "home-page home-page--works" : "home-page home-page--about"
      }
    >
      <SiteHeader
        activePage={activePage}
        showWorks={showWorks}
        onNavigate={handleNavChange}
      />

      {showWorks ? (
        <>
          <WorksFilters
            activeFilter={activeFilter}
            onChangeFilter={setActiveFilter}
          />

          <WorksCarousel
            isMobile={isMobile}
            worksLoading={worksLoading}
            worksError={worksError}
            filteredWorks={filteredWorks}
            activeWork={activeWork}
            leftItemOne={leftItemOne}
            leftItemTwo={leftItemTwo}
            rightItemOne={rightItemOne}
            rightItemTwo={rightItemTwo}
            goPrevWork={goPrevWork}
            goNextWork={goNextWork}
            goToWorkByOffset={goToWorkByOffset}
          />
        </>
      ) : (
        <HeroHome
          loading={loading}
          error={error}
          videoUrl={videoUrl}
          title={title}
        />
      )}
    </main>
  );
}