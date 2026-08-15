import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { RELATED_WORKS_API, WORK_DETAIL_API } from "../../services/api";

// import "./work-detail.css";
import "../../App.css";

/* =========================================================
FALLBACK TEXTS
========================================================= */

const FALLBACK_TEXTS = [
  "Lorem ipsum dolor sit amet consectetur. Dui eu velit adipiscing sit imperdiet arcu aliquam massa. Lorem ipsum dolor sit amet consectetur adipiscing elit.",

  "Lorem ipsum dolor sit amet consectetur. Quis at adipiscing et imperdiet et ipsum in nunc. Purus fermentum nisl at augue viverra luctus.",

  "Lorem ipsum dolor sit amet consectetur. Aenean commodo justo at faucibus gravida, tortor lectus tincidunt augue, sed posuere libero purus in risus.",
];

/* =========================================================
HELPER
========================================================= */

function decodeHtml(text = "") {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&nbsp;/g, " ");
}

/* =========================================================
   DESKTOP HEADER
========================================================= */

function WorkDetailDesktopHeader() {
  return (
    <header className="work-detail-desktop-header">
      <div className="work-detail-desktop-header__inner">
        <Link
          to="/"
          className="work-detail-desktop-header__brand"
          aria-label="KYUB home"
        >
          <img src="/logo-kyub.jpeg" alt="KYUB" />
        </Link>

        <nav
          className="work-detail-desktop-header__nav"
          aria-label="Main navigation"
        >
          <Link to="/about_us" className="work-detail-desktop-header__link">
            ABOUT
          </Link>

          <Link
            to="/?page=works"
            className="work-detail-desktop-header__link work-detail-desktop-header__link--active"
          >
            WORK
          </Link>

          <Link
            to="/?page=contacts"
            className="work-detail-desktop-header__link"
          >
            CONTACTS
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* =========================================================
   MOBILE HEADER
========================================================= */

function WorkDetailMobileHeader() {
  return (
    <header className="work-detail-mobile-header">
      <Link
        to="/"
        className="work-detail-mobile-header__brand"
        aria-label="KYUB home"
      >
        <img src="/logo-kyub.jpeg" alt="KYUB" />
      </Link>
    </header>
  );
}

/* =========================================================
   WORK DETAIL HEADER
========================================================= */

function WorkDetailHeader() {
  return (
    <>
      <WorkDetailDesktopHeader />
      <WorkDetailMobileHeader />
    </>
  );
}
/* =========================================================
MOBILE BOTTOM NAVIGATION
========================================================= */

function WorkDetailBottomNav() {
  return (
    <nav className="work-detail-bottom-nav" aria-label="Mobile navigation">
      <Link to="/about_us" className="work-detail-bottom-nav__link">
        ABOUT
      </Link>

      <Link
        to="/?page=works"
        className="work-detail-bottom-nav__link work-detail-bottom-nav__link--active"
      >
        WORK
      </Link>

      <Link to="/?page=contacts" className="work-detail-bottom-nav__link">
        CONTACTS
      </Link>
    </nav>
  );
}

/* =========================================================
CLOSE / SHARE
========================================================= */

function WorkDetailActions({ onShare, isStopped, actionsRef, actionsStyle }) {
  return (
    <div
      ref={actionsRef}
      className={`work-detail__actions ${
        isStopped
          ? "work-detail__actions--stopped"
          : "work-detail__actions--floating"
      }`}
      style={actionsStyle}
    >
      {/* CLOSE */}
      <Link
        to="/?page=works"
        className="work-detail__action-link"
        aria-label="Close"
      >
        <span
          className="work-detail__action-icon work-detail__action-icon--close"
          aria-hidden="true"
        >
          ×
        </span>

        <span className="work-detail__action-text">Close</span>
      </Link>

      {/* SHARE */}
      <button
        type="button"
        className="work-detail__action-button"
        onClick={onShare}
      >
        <span className="work-detail__action-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="18"
              cy="5"
              r="2.2"
              stroke="currentColor"
              strokeWidth="1.6"
            />

            <circle
              cx="6"
              cy="12"
              r="2.2"
              stroke="currentColor"
              strokeWidth="1.6"
            />

            <circle
              cx="18"
              cy="19"
              r="2.2"
              stroke="currentColor"
              strokeWidth="1.6"
            />

            <path
              d="M7.9 10.9L16.1 6.1M7.9 13.1L16.1 17.9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <span className="work-detail__action-text">Share</span>
      </button>
    </div>
  );
}

/* =========================================================
SKELETON
========================================================= */

function WorkDetailSkeleton() {
  return (
    <SkeletonTheme>
      <main className="work-detail-page">
        <WorkDetailHeader />

        <section className="work-detail">
          {/* INTRO */}
          <header className="work-detail__intro">
            <div className="work-detail__intro-meta">
              <Skeleton width={90} height={14} />
            </div>

            <div className="work-detail__intro-title">
              <Skeleton width={260} height={42} />
            </div>
          </header>

          {/* GALLERY */}
          <div className="work-detail__gallery">
            {Array.from({ length: 3 }).map((_, index) => (
              <section className="work-detail__block has-caption" key={index}>
                <figure className="work-detail__figure">
                  <Skeleton
                    height="100%"
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 10",
                      borderRadius: 0,
                      lineHeight: 1,
                      display: "block",
                    }}
                  />
                </figure>

                <div className="work-detail__caption-wrap">
                  <p className="work-detail__caption">
                    <Skeleton count={3} />
                  </p>
                </div>
              </section>
            ))}
          </div>

          {/* RELATED PROJECTS */}
          <section className="related-projects">
            <h2 className="related-projects__title">Related Projects</h2>

            <div className="related-projects__grid">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="related-projects__item">
                  <div className="related-projects__thumb">
                    <Skeleton
                      height="100%"
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        borderRadius: 0,
                        lineHeight: 1,
                        display: "block",
                      }}
                    />
                  </div>

                  <p className="related-projects__name">
                    <Skeleton width="70%" height={18} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <WorkDetailBottomNav />
      </main>
    </SkeletonTheme>
  );
}

/* =========================================================
MAIN PAGE
========================================================= */

export default function WorkDetailPage() {
  const { slug } = useParams();

  /* =======================================================
  STATE
  ======================================================= */

  const [workItem, setWorkItem] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [relatedWorks, setRelatedWorks] = useState([]);

  /*
   * FALSE
   * = Close / Share masih floating
   *
   * TRUE
   * = Close / Share sudah berhenti
   *   tepat sebelum Related Projects
   */
  const [actionsStopped, setActionsStopped] = useState(false);

  /* =======================================================
  REFS
  ======================================================= */

  const relatedProjectsRef = useRef(null);

  const actionsRef = useRef(null);

  /* =======================================================
  ACTION HEIGHT
  ======================================================= */

  /*
   * Tinggi slot desktop.
   */
  const ACTION_HEIGHT = 56;

  /*
   * Tinggi slot mobile.
   *
   * Disamakan dengan konsep CSS
   * yang sebelumnya kita gunakan.
   */
  const MOBILE_ACTION_HEIGHT = 52;

  /* =======================================================
  RESET SCROLL
  ======================================================= */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    const scrollContainer = document.querySelector(".work-detail");

    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }

    setActionsStopped(false);
  }, [slug]);

  /* =======================================================
  FETCH WORK DETAIL
  ======================================================= */

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError("");
    setWorkItem(null);
    setRelatedWorks([]);

    async function fetchWorkDetail() {
      try {
        const response = await fetch(`${WORK_DETAIL_API}${slug}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch work detail: ${response.status}`);
        }

        const json = await response.json();

        const firstItem = Array.isArray(json) ? json[0] : null;

        if (!firstItem) {
          throw new Error("Detail work tidak ditemukan.");
        }

        if (!ignore) {
          setWorkItem(firstItem);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load work detail.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      fetchWorkDetail();
    }

    return () => {
      ignore = true;
    };
  }, [slug]);

  /* =======================================================
  FETCH RELATED WORKS
  ======================================================= */

  useEffect(() => {
    if (!workItem?.id) {
      return;
    }

    let ignore = false;

    async function fetchRelatedWorks() {
      try {
        const response = await fetch(`${RELATED_WORKS_API}${workItem.id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch related works: ${response.status}`);
        }

        const json = await response.json();

        const currentCategorySlug =
          workItem.acf?.portfolio_category?.slug ||
          workItem.acf?.portfoliocategory?.slug ||
          "";

        const mapped = json

          .map((item) => {
            const itemCategorySlug =
              item.acf?.portfolio_category?.slug ||
              item.acf?.portfoliocategory?.slug ||
              "";

            const cover = item.acf?.cover_image || item.acf?.coverimage || null;

            const image =
              cover?.sizes?.medium_large ||
              cover?.sizes?.large ||
              cover?.sizes?.medium ||
              cover?.url ||
              "";

            return {
              id: item.id,

              slug: item.slug,

              title: decodeHtml(item.title?.rendered || "Untitled"),

              image,

              year: item.acf?.year || "",

              categorySlug: itemCategorySlug,
            };
          })

          .filter(
            (item) => item.slug !== workItem.slug && item.id !== workItem.id,
          )

          .filter((item) => item.categorySlug === currentCategorySlug)

          .filter((item) => item.image)

          .slice(0, 4);

        if (!ignore) {
          setRelatedWorks(mapped);
        }
      } catch (err) {
        if (!ignore) {
          setRelatedWorks([]);
        }
      }
    }

    fetchRelatedWorks();

    return () => {
      ignore = true;
    };
  }, [workItem]);

  /* =======================================================
  GALLERY DATA
  ======================================================= */

  const galleryItems = useMemo(() => {
    if (!workItem?.acf) {
      return [];
    }

    const acf = workItem.acf;

    const items = [];

    for (let i = 1; i <= 10; i += 1) {
      const imageField = acf[`image_${i}`] || acf[`image${i}`];

      const descriptionField =
        acf[`description_${i}`] || acf[`description${i}`] || "";

      if (imageField?.url) {
        const imageUrl =
          imageField.sizes?.large ||
          imageField.sizes?.medium_large ||
          imageField.sizes?.medium ||
          imageField.url;

        if (!items.find((existing) => existing.image === imageUrl)) {
          items.push({
            key: `image_${i}`,

            image: imageUrl,

            alt:
              imageField.alt || workItem.title?.rendered || `Work image ${i}`,

            description:
              descriptionField ||
              (i <= 3 ? FALLBACK_TEXTS[(i - 1) % FALLBACK_TEXTS.length] : ""),
          });
        }
      }
    }

    /* =====================================================
      FALLBACK COVER IMAGE
      ===================================================== */

    const coverImage = acf.cover_image || acf.coverimage;

    if (items.length === 0 && coverImage?.url) {
      items.push({
        key: "cover_image",

        image:
          coverImage.sizes?.large ||
          coverImage.sizes?.medium_large ||
          coverImage.sizes?.medium ||
          coverImage.url,

        alt: coverImage.alt || workItem.title?.rendered || "Cover image",

        description: FALLBACK_TEXTS[0],
      });
    }

    return items;
  }, [workItem]);

  /* =======================================================
  SHARE
  ======================================================= */

  async function handleShare() {
    const shareData = {
      title: decodeHtml(workItem?.title?.rendered || "KYUB Work"),

      url: window.location.href,
    };

    try {
      /* -----------------------------------------------
      NATIVE SHARE
      ----------------------------------------------- */

      if (navigator.share) {
        await navigator.share(shareData);

        return;
      }

      /* -----------------------------------------------
      CLIPBOARD
      ----------------------------------------------- */

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);

        alert("Link copied");

        return;
      }

      /* -----------------------------------------------
      FALLBACK
      ----------------------------------------------- */

      const textArea = document.createElement("textarea");

      textArea.value = window.location.href;

      document.body.appendChild(textArea);

      textArea.select();

      document.execCommand("copy");

      document.body.removeChild(textArea);

      alert("Link copied");
    } catch (shareError) {
      console.error("Share failed", shareError);
    }
  }

  /* =======================================================
  CLOSE / SHARE POSITION
  ======================================================= */

  useEffect(() => {
    if (!workItem) {
      return;
    }

    let frameId = null;

    /*
     * =====================================================
     * CHECK POSITION
     * =====================================================
     */

    const updateActionsState = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;

        /*
         * IMPORTANT
         *
         * Ambil Related Projects
         * DI DALAM callback.
         */

        const relatedElement = relatedProjectsRef.current;

        if (!relatedElement) {
          setActionsStopped(false);

          return;
        }

        const relatedRect = relatedElement.getBoundingClientRect();

        const isMobile = window.innerWidth <= 768;

        /* =================================================
              MOBILE
              ================================================= */

        if (isMobile) {
          const bottomNav = document.querySelector(".work-detail-bottom-nav");

          const bottomNavHeight = bottomNav
            ? bottomNav.getBoundingClientRect().height
            : 38;

          /*
           * Action bar berada
           * di atas bottom nav.
           */

          const stopPoint =
            window.innerHeight - bottomNavHeight - MOBILE_ACTION_HEIGHT;

          const shouldStop = relatedRect.top <= stopPoint;

          setActionsStopped(shouldStop);

          return;
        }

        /* =================================================
              DESKTOP
              ================================================= */

        /*
         * Desktop tidak punya
         * bottom navigation.
         *
         * Action bar berada
         * di bagian paling bawah viewport.
         */

        const stopPoint = window.innerHeight - ACTION_HEIGHT;

        const shouldStop = relatedRect.top <= stopPoint;

        setActionsStopped(shouldStop);
      });
    };

    /*
     * Initial check
     */
    updateActionsState();

    /*
     * Scroll
     */
    window.addEventListener("scroll", updateActionsState, {
      passive: true,
    });

    /*
     * Resize
     */
    window.addEventListener("resize", updateActionsState);

    /*
     * =====================================================
     * RESIZE OBSERVER
     * =====================================================
     *
     * Observe BODY agar perubahan tinggi
     * gambar/gallery juga bisa memicu
     * pengecekan ulang.
     */

    let resizeObserver = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateActionsState);

      const relatedElement = relatedProjectsRef.current;

      if (relatedElement) {
        resizeObserver.observe(relatedElement);
      } else {
        resizeObserver.observe(document.body);
      }
    }

    /*
     * =====================================================
     * CLEANUP
     * =====================================================
     */

    return () => {
      window.removeEventListener("scroll", updateActionsState);

      window.removeEventListener("resize", updateActionsState);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [workItem, relatedWorks.length]);

  /* =======================================================
  LOADING
  ======================================================= */

  if (loading) {
    return <WorkDetailSkeleton />;
  }

  /* =======================================================
  ERROR
  ======================================================= */

  if (error || !workItem) {
    return (
      <main className="work-detail-page">
        <WorkDetailHeader />

        <div className="work-detail__feedback">
          {error || "Work detail tidak ditemukan."}
        </div>

        <WorkDetailBottomNav />
      </main>
    );
  }

  /* =======================================================
  CATEGORY
  ======================================================= */

  const category =
    workItem.acf?.portfolio_category?.name ||
    workItem.acf?.portfoliocategory?.name ||
    "Uncategorized";

  /* =======================================================
  RESPONSIVE
  ======================================================= */

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const hasRelatedWorks = relatedWorks.length > 0;

  /*
   * Kalau tidak ada Related Projects,
   * Close / Share HARUS selalu floating.
   */
  const effectiveActionsStopped = hasRelatedWorks && actionsStopped;

  /* =======================================================
  ACTIONS STYLE
  ======================================================= */

  /*
   * =====================================================
   * FLOATING
   * =====================================================
   *
   * Mobile:
   *   fixed di atas bottom navigation.
   *
   * Desktop:
   *   fixed di bagian paling bawah viewport.
   *
   * =====================================================
   *
   * STOPPED
   * =====================================================
   *
   * position: static
   *
   * Karena action berada di dalam
   * actions-slot yang tepat sebelum
   * Related Projects, maka ketika
   * stopped:
   *
   * Close / Share
   *       ↓
   * Related Projects
   *
   * menjadi satu flow normal.
   */

  const actionsStyle = effectiveActionsStopped
    ? {
        position: "static",

        left: "auto",

        right: "auto",

        top: "auto",

        bottom: "auto",

        width: "100%",

        minHeight: isMobile
          ? `${MOBILE_ACTION_HEIGHT}px`
          : `${ACTION_HEIGHT}px`,

        boxSizing: "border-box",

        /*
         * DESKTOP ONLY
         *
         * Close / Share digeser sedikit
         * ke atas agar lebih dekat dengan
         * Related Projects.
         *
         * Mobile tetap tidak berubah.
         */
        transform: isMobile ? "none" : "translateY(-14px)",
      }
    : {
        position: "fixed",

        left: 0,

        right: 0,

        top: "auto",

        bottom: isMobile ? "4vh" : "0px",

        width: "100%",

        minHeight: isMobile
          ? `${MOBILE_ACTION_HEIGHT}px`
          : `${ACTION_HEIGHT}px`,

        boxSizing: "border-box",

        transform: "none",
      };

  /* =======================================================
  ACTION SLOT
  ======================================================= */

  /*
   * SLOT SELALU ADA.
   *
   * Ini sangat penting.
   *
   * Ketika action berubah:
   *
   * fixed -> static
   *
   * Related Projects tidak ikut meloncat
   * karena slot sudah mempunyai tinggi.
   */

  const actionsSlotStyle = {
    width: "100%",

    height: hasRelatedWorks
      ? isMobile
        ? `${MOBILE_ACTION_HEIGHT}px`
        : `${ACTION_HEIGHT}px`
      : "0px",

    flexShrink: 0,
  };

  /* =======================================================
  RENDER
  ======================================================= */

  return (
    <main className="work-detail-page">
      {/* =================================================
      HEADER
      ================================================= */}

      <WorkDetailHeader />

      {/* =================================================
      MAIN CONTENT
      ================================================= */}

      <section className="work-detail">
        {/* =================================================
        INTRO
        ================================================= */}

        <header className="work-detail__intro">
          <div className="work-detail__intro-meta">
            <p className="work-detail__meta">{category}</p>
          </div>

          <div className="work-detail__intro-title">
            <h1
              className="work-detail__title"
              dangerouslySetInnerHTML={{
                __html: workItem.title?.rendered || "Untitled",
              }}
            />
          </div>
        </header>

        {/* =================================================
        GALLERY
        ================================================= */}

        <div className="work-detail__gallery">
          {galleryItems.map((item, index) => {
            const hasCaption = index < 3 && !!item.description;

            return (
              <section
                className={`work-detail__block ${
                  hasCaption ? "has-caption" : "no-caption"
                }`}
                key={item.key}
              >
                <figure className="work-detail__figure">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </figure>

                {hasCaption ? (
                  <div className="work-detail__caption-wrap">
                    <p className="work-detail__caption">{item.description}</p>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        {/* =================================================
        CLOSE / SHARE SLOT
        =================================================

        SLOT INI SELALU ADA.

        Saat gallery:
          [slot]
          Close / Share = fixed

        Saat Related Projects mendekat:
          [slot]
          Close / Share = static
          Related Projects

        ================================================= */}

        <div className="work-detail__actions-slot" style={actionsSlotStyle}>
          <WorkDetailActions
            onShare={handleShare}
            isStopped={effectiveActionsStopped}
            actionsRef={actionsRef}
            actionsStyle={actionsStyle}
          />
        </div>

        {/* =================================================
        RELATED PROJECTS
        ================================================= */}

        {relatedWorks.length > 0 && (
          <section className="related-projects" ref={relatedProjectsRef}>
            <h2 className="related-projects__title">Related Projects</h2>

            <div className="related-projects__grid">
              {relatedWorks.map((item) => (
                <Link
                  key={item.id}
                  to={`/work/${item.slug}`}
                  className="related-projects__item"
                >
                  <div className="related-projects__thumb">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>

                  <p className="related-projects__name">{item.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* =================================================
      MOBILE BOTTOM NAV
      ================================================= */}

      <WorkDetailBottomNav />
    </main>
  );
}
