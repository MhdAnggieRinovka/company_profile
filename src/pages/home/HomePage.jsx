import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../App.css";

import SiteHeader from "./components/SiteHeader";
import WorksCarousel from "./components/WorksCarousel";
import WorksFilters from "./components/WorksFilters";
import ContactsBody from "./components/ContactsBody";

import useHomeVideo from "./hooks/useHomeVideo";
import useWorksData from "./hooks/useWorksData";

import AboutPage from "./components/AboutPage"; // final design ABOUT
import HeroHome from "./components/HeroHome";

export default function HomePage({ initialPage = "home" }) {
  const navigate = useNavigate();

  /* =========================================================
     PAGE
  ========================================================= */

  const [activePage, setActivePage] = useState(initialPage);

  const [activeFilter, setActiveFilter] = useState("All");

  const [activeWorkIndex, setActiveWorkIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  /* =========================================================
     HOME VIDEO
  ========================================================= */

  // masih dipakai untuk HeroHome
  const { videoUrl, title, loading, error } = useHomeVideo();

  /* =========================================================
     WORK DATA
  ========================================================= */

  const { worksData, worksLoading, worksError } = useWorksData(activePage);

  /* =========================================================
     UPDATE ACTIVE PAGE
  ========================================================= */

  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function handleNavChange(page) {
    const routes = {
      home: "/",
      about: "/about_us",
      works: "/works",
      contacts: "/contacts",
    };

    setActivePage(page);
    navigate(routes[page] ?? "/");
  }

  /* =========================================================
     RESPONSIVE
  ========================================================= */

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =========================================================
     FILTER WORKS
  ========================================================= */

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

  /* =========================================================
     RESET WORK INDEX
  ========================================================= */

  useEffect(() => {
    setActiveWorkIndex(0);
  }, [activeFilter]);

  useEffect(() => {
    if (activeWorkIndex > filteredWorks.length - 1) {
      setActiveWorkIndex(0);
    }
  }, [filteredWorks, activeWorkIndex]);

  /* =========================================================
     WORK STATE
  ========================================================= */

  const showWorks = activePage === "works";

  const activeWork = filteredWorks[activeWorkIndex];

  /* =========================================================
     WORK NAVIGATION
  ========================================================= */

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

  /* =========================================================
     HERO HOME
     
     /
     ↓
     HeroHome
  ========================================================= */

  /* ==== HERO HOME ==== */
  /* =========================================================
   HERO HOME
   /
   ↓
   HeroHome
========================================================= */

  if (activePage === "home") {
    return (
      <main className="home-page home-page--hero-home">
        {/* =========================
          DESKTOP HEADER
      ========================= */}
        {!isMobile && (
          <SiteHeader
            activePage={activePage}
            showWorks={false}
            onNavigate={handleNavChange}
          />
        )}

        {/* =========================
          MOBILE TOP HEADER
      ========================= */}
        {isMobile && (
          <div className="home-page__mobile-top-header">
            <SiteHeader
              activePage={activePage}
              showWorks={false}
              onNavigate={handleNavChange}
            />
          </div>
        )}

        {/* =========================
          HERO HOME
      ========================= */}
        <HeroHome
          loading={loading}
          error={error}
          videoUrl={videoUrl}
          title={title}
        />

        {/* =========================
          MOBILE BOTTOM NAV
      ========================= */}
        {isMobile && (
          <div className="home-page__mobile-bottom-nav home-page__mobile-bottom-nav--home">
            <SiteHeader
              activePage={activePage}
              showWorks={false}
              onNavigate={handleNavChange}
            />
          </div>
        )}
      </main>
    );
  }

  /* =========================================================
     MOBILE: WORKS
  ========================================================= */
  if (isMobile && showWorks) {
    return (
      <main className="home-page home-page--works">
        {/* MOBILE TOP HEADER */}
        <div className="home-page__mobile-top-header">
          <SiteHeader
            activePage={activePage}
            showWorks={true}
            onNavigate={handleNavChange}
          />
        </div>

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

        {/* MOBILE BOTTOM NAV */}
        <div className="home-page__mobile-bottom-nav">
          <SiteHeader
            activePage={activePage}
            showWorks={true}
            onNavigate={handleNavChange}
          />
        </div>
      </main>
    );
  }

  /* =========================================================
     MOBILE: ABOUT / CONTACTS
  ========================================================= */

  if (isMobile && !showWorks) {
    return (
      <main className="home-page home-page--about">
        {/* MOBILE TOP HEADER */}
        <div className="home-page__mobile-top-header">
          <SiteHeader
            activePage={activePage}
            showWorks={false}
            onNavigate={handleNavChange}
          />
        </div>

        {/* CONTENT */}
        {activePage === "contacts" ? (
          <ContactsBody />
        ) : (
          <AboutPage onGoToContacts={() => handleNavChange("contacts")} />
        )}

        {/* MOBILE BOTTOM NAV */}
        <div className="home-page__mobile-bottom-nav">
          <SiteHeader
            activePage={activePage}
            showWorks={true}
            onNavigate={handleNavChange}
          />
        </div>
      </main>
    );
  }
  /* =========================================================
     DESKTOP
  ========================================================= */

  return (
    <main
      className={
        showWorks
          ? "home-page home-page--works"
          : activePage === "contacts"
            ? "home-page home-page--about contacts-page-wrapper"
            : "home-page home-page--about"
      }
    >
      {/* HEADER DESKTOP */}
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
      ) : activePage === "contacts" ? (
        <ContactsBody />
      ) : (
        <AboutPage onGoToContacts={() => handleNavChange("contacts")} />
      )}
    </main>
  );
}
