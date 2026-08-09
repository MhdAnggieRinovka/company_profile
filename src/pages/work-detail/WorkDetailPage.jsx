import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RELATED_WORKS_API, WORK_DETAIL_API } from "../../services/api";
import "./work-detail.css";

const FALLBACK_TEXTS = [
  "Lorem ipsum dolor sit amet consectetur. Dui eu velit adipiscing sit imperdiet arcu aliquam massa. Lorem ipsum dolor sit amet consectetur adipiscing elit.",
  "Lorem ipsum dolor sit amet consectetur. Quis at adipiscing et imperdiet et ipsum in nunc. Purus fermentum nisl at augue viverra luctus.",
  "Lorem ipsum dolor sit amet consectetur. Aenean commodo justo at faucibus gravida, tortor lectus tincidunt augue, sed posuere libero purus in risus.",
];

function decodeHtml(text = "") {
  return text
    .replace(/&#038;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&");
}


/* =========================================================
   HEADER
========================================================= */

function WorkDetailHeader() {
  return (
    <header className="site-header work-detail-site-header">
      <div className="site-header__inner">

        <Link
          to="/"
          className="brand-button"
          aria-label="KYUB home"
        >
          <img
            src="/logo-kyub.jpeg"
            alt="KYUB"
          />
        </Link>

        <nav
          className="site-nav"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="nav-link"
          >
            ABOUT
          </Link>

          <Link
            to="/?page=works"
            className="nav-link active"
          >
            WORK
          </Link>

          <Link
            to="/?page=contacts"
            className="nav-link"
          >
            CONTACTS
          </Link>
        </nav>

        <div className="site-header__spacer" />

      </div>
    </header>
  );
}


/* =========================================================
   MOBILE BOTTOM NAVIGATION
========================================================= */

function WorkDetailBottomNav() {
  return (
    <nav
      className="work-detail-bottom-nav"
      aria-label="Mobile bottom navigation"
    >
      <Link
        to="/"
        className="work-detail-bottom-nav__link"
      >
        ABOUT
      </Link>

      <Link
        to="/?page=works"
        className="work-detail-bottom-nav__link work-detail-bottom-nav__link--active"
      >
        WORK
      </Link>

      <Link
        to="/?page=contacts"
        className="work-detail-bottom-nav__link"
      >
        CONTACTS
      </Link>
    </nav>
  );
}


/* =========================================================
   CLOSE / SHARE FOOTER
========================================================= */

function WorkDetailActions({
  onShare,
  bottomOffset = 0,
}) {
  return (
    <div
      className="work-detail__actions"
      style={{
        "--actions-bottom": `${bottomOffset}px`,
      }}
    >

      {/* CLOSE */}
      <Link
        to="/?page=works"
        className="work-detail__action-link"
      >
        <span
          className="work-detail__action-icon work-detail__action-icon--close"
          aria-hidden="true"
        >
          ×
        </span>

        <span className="work-detail__action-text">
          Close
        </span>
      </Link>


      {/* SHARE */}
      <button
        type="button"
        className="work-detail__action-button"
        onClick={onShare}
      >
        <span
          className="work-detail__action-icon"
          aria-hidden="true"
        >
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

        <span className="work-detail__action-text">
          Share
        </span>
      </button>

    </div>
  );
}


/* =========================================================
   SKELETON
========================================================= */

function WorkDetailSkeleton() {
  return (
    <SkeletonTheme
      baseColor="#ece7e1"
      highlightColor="#f7f3ef"
    >
      <main className="work-detail-page">

        <WorkDetailHeader />

        <section className="work-detail">

          {/* INTRO */}
          <header className="work-detail__intro">

            <div className="work-detail__intro-meta">
              <Skeleton
                width={90}
                height={14}
              />
            </div>

            <div className="work-detail__intro-title">
              <Skeleton
                width={260}
                height={42}
              />
            </div>

          </header>


          {/* GALLERY */}
          <div className="work-detail__gallery">

            {Array.from({ length: 3 }).map((_, index) => (
              <section
                className="work-detail__block has-caption"
                key={index}
              >

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

            <h2 className="related-projects__title">
              Related Projects
            </h2>

            <div className="related-projects__grid">

              {Array.from({ length: 3 }).map((_, index) => (

                <div
                  key={index}
                  className="related-projects__item"
                >

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
                    <Skeleton
                      width="70%"
                      height={18}
                    />
                  </p>

                </div>

              ))}

            </div>

          </section>

        </section>


        {/* CLOSE / SHARE */}
        <WorkDetailActions
          onShare={() => {}}
          bottomOffset={0}
        />


        {/* MOBILE NAV */}
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


  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  const [workItem, setWorkItem] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [relatedWorks, setRelatedWorks] = useState([]);


  /*
   * Posisi Close / Share.
   *
   * 0 = tepat di atas bottom viewport.
   *
   * Ketika Related Projects mendekat,
   * nilai ini akan bertambah sehingga
   * Close / Share bergerak ke atas.
   */
  const [actionsBottom, setActionsBottom] = useState(0);


  /*
   * Ref untuk Related Projects.
   *
   * Kita menggunakan ref daripada querySelector
   * supaya lebih aman dan React-friendly.
   */
  const relatedProjectsRef = useRef(null);


  /* =======================================================
     FETCH WORK DETAIL
  ======================================================= */

  useEffect(() => {

    let ignore = false;


    async function fetchWorkDetail() {

      try {

        setLoading(true);

        setError("");


        const response = await fetch(
          `${WORK_DETAIL_API}${slug}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );


        if (!response.ok) {

          throw new Error(
            `Failed to fetch work detail: ${response.status}`
          );

        }


        const json = await response.json();

        const firstItem =
          Array.isArray(json)
            ? json[0]
            : null;


        if (!firstItem) {

          throw new Error(
            "Detail work tidak ditemukan."
          );

        }


        if (!ignore) {

          setWorkItem(firstItem);

        }

      } catch (err) {

        if (!ignore) {

          setError(
            err.message ||
            "Failed to load work detail."
          );

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

        const response = await fetch(
          `${RELATED_WORKS_API}${workItem.id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );


        if (!response.ok) {

          throw new Error(
            `Failed to fetch related works: ${response.status}`
          );

        }


        const json =
          await response.json();


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


            const cover =
              item.acf?.cover_image ||
              item.acf?.coverimage ||
              null;


            const image =
              cover?.sizes?.medium_large ||
              cover?.sizes?.large ||
              cover?.sizes?.medium ||
              cover?.url ||
              "";


            return {

              id: item.id,

              slug: item.slug,

              title: decodeHtml(
                item.title?.rendered ||
                "Untitled"
              ),

              image,

              year:
                item.acf?.year ||
                "",

              categorySlug:
                itemCategorySlug,

            };

          })

          .filter(
            (item) =>
              item.slug !== workItem.slug &&
              item.id !== workItem.id
          )

          .filter(
            (item) =>
              item.categorySlug ===
              currentCategorySlug
          )

          .filter(
            (item) =>
              item.image
          )

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


    for (
      let i = 1;
      i <= 10;
      i += 1
    ) {

      const imageField =
        acf[`image_${i}`] ||
        acf[`image${i}`];


      const descriptionField =
        acf[`description_${i}`] ||
        acf[`description${i}`] ||
        "";


      if (imageField?.url) {

        const imageUrl =
          imageField.sizes?.large ||
          imageField.sizes?.medium_large ||
          imageField.sizes?.medium ||
          imageField.url;


        if (
          !items.find(
            (existing) =>
              existing.image === imageUrl
          )
        ) {

          items.push({

            key:
              `image_${i}`,

            image:
              imageUrl,

            alt:
              imageField.alt ||
              workItem.title?.rendered ||
              `Work image ${i}`,

            description:
              descriptionField ||
              (
                i <= 3
                  ? FALLBACK_TEXTS[
                      (i - 1) %
                      FALLBACK_TEXTS.length
                    ]
                  : ""
              ),

          });

        }

      }

    }


    /*
     * Kalau tidak ada image_1 sampai image_10,
     * gunakan cover image.
     */

    const coverImage =
      acf.cover_image ||
      acf.coverimage;


    if (
      items.length === 0 &&
      coverImage?.url
    ) {

      items.push({

        key:
          "cover_image",

        image:
          coverImage.sizes?.large ||
          coverImage.sizes?.medium_large ||
          coverImage.sizes?.medium ||
          coverImage.url,

        alt:
          coverImage.alt ||
          workItem.title?.rendered ||
          "Cover image",

        description:
          FALLBACK_TEXTS[0],

      });

    }


    return items;

  }, [workItem]);


  /* =======================================================
     SHARE
  ======================================================= */

  async function handleShare() {

    const shareData = {

      title:
        decodeHtml(
          workItem?.title?.rendered ||
          "KYUB Work"
        ),

      url:
        window.location.href,

    };


    try {

      /*
       * Mobile / browser yang support Web Share API
       */
      if (navigator.share) {

        await navigator.share(
          shareData
        );

        return;

      }


      /*
       * Clipboard API
       */
      if (
        navigator.clipboard?.writeText
      ) {

        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Link copied");

        return;

      }


      /*
       * Fallback
       */
      const textArea =
        document.createElement(
          "textarea"
        );


      textArea.value =
        window.location.href;


      document.body.appendChild(
        textArea
      );


      textArea.select();


      document.execCommand(
        "copy"
      );


      document.body.removeChild(
        textArea
      );


      alert("Link copied");

    } catch (shareError) {

      console.error(
        "Share failed",
        shareError
      );

    }

  }


  /* =======================================================
     UPDATE CLOSE / SHARE POSITION
  ======================================================= */

  useEffect(() => {

    /*
     * Jangan jalankan ketika belum ada
     * halaman yang selesai dirender.
     */
    if (!workItem) {
      return;
    }


    let frameId = null;


    const updateActionsPosition = () => {

      /*
       * Batasi requestAnimationFrame supaya
       * scroll tidak terlalu berat.
       */
      if (frameId !== null) {
        return;
      }


      frameId =
        window.requestAnimationFrame(
          () => {

            frameId = null;


            const relatedElement =
              relatedProjectsRef.current;


            /*
             * Tinggi bottom navigation mobile.
             */
            const isMobile =
              window.innerWidth <= 768;


            const bottomNav =
              isMobile
                ? document.querySelector(
                    ".work-detail-bottom-nav"
                  )
                : null;


            const bottomNavHeight =
              bottomNav
                ? bottomNav.getBoundingClientRect()
                    .height
                : 0;


            /*
             * Default:
             *
             * Close / Share berada
             * di atas bottom navigation.
             */
            let bottom =
              bottomNavHeight;


            /*
             * Kalau Related Projects tersedia,
             * cek posisi top-nya terhadap viewport.
             */
            if (relatedElement) {

              const relatedRect =
                relatedElement.getBoundingClientRect();


              /*
               * Tinggi footer Close / Share.
               *
               * Kita gunakan sedikit lebih besar
               * untuk memberi ruang aman.
               */
              const actionsElement =
                document.querySelector(
                  ".work-detail__actions"
                );


              const actionsHeight =
                actionsElement
                  ? actionsElement.getBoundingClientRect()
                      .height
                  : 56;


              /*
               * Kita ingin:
               *
               * ┌──────────────────┐
               * │ Related Projects │
               * └──────────────────┘
               *
               * footer Close / Share
               * berhenti tepat di atasnya.
               *
               * Jadi bottom footer =
               *
               * viewportHeight - relatedTop
               */
              const distanceToRelated =
                window.innerHeight -
                relatedRect.top;


              /*
               * Kalau Related Projects
               * sudah mendekati footer,
               * naikkan footer.
               */
              if (
                distanceToRelated >
                bottomNavHeight
              ) {

                bottom =
                  distanceToRelated;

              }


              /*
               * Jangan sampai footer
               * melewati Related Projects.
               */
              const maxBottom =
                window.innerHeight -
                relatedRect.top;


              if (
                bottom >
                maxBottom
              ) {

                bottom =
                  maxBottom;

              }

            }


            /*
             * Pastikan tidak pernah negatif.
             */
            bottom =
              Math.max(
                bottomNavHeight,
                bottom
              );


            /*
             * Set posisi footer.
             */
            setActionsBottom(
              bottom
            );

          }
        );

    };


    /*
     * Jalankan pertama kali.
     */
    updateActionsPosition();


    /*
     * Window scroll.
     */
    window.addEventListener(
      "scroll",
      updateActionsPosition,
      {
        passive: true,
      }
    );


    /*
     * Mobile punya scroll container sendiri:
     *
     * .work-detail
     */
    const scrollContainer =
      document.querySelector(
        ".work-detail"
      );


    if (scrollContainer) {

      scrollContainer.addEventListener(
        "scroll",
        updateActionsPosition,
        {
          passive: true,
        }
      );

    }


    /*
     * Resize browser.
     */
    window.addEventListener(
      "resize",
      updateActionsPosition
    );


    /*
     * ResizeObserver berguna kalau ukuran
     * gambar / Related Projects berubah
     * setelah image selesai loading.
     */
    let resizeObserver = null;


    if (
      typeof ResizeObserver !==
      "undefined"
    ) {

      resizeObserver =
        new ResizeObserver(
          updateActionsPosition
        );


      if (scrollContainer) {

        resizeObserver.observe(
          scrollContainer
        );

      }


      if (relatedProjectsRef.current) {

        resizeObserver.observe(
          relatedProjectsRef.current
        );

      }

    }


    /*
     * Cleanup.
     */
    return () => {

      window.removeEventListener(
        "scroll",
        updateActionsPosition
      );


      window.removeEventListener(
        "resize",
        updateActionsPosition
      );


      if (scrollContainer) {

        scrollContainer.removeEventListener(
          "scroll",
          updateActionsPosition
        );

      }


      if (resizeObserver) {

        resizeObserver.disconnect();

      }


      if (frameId !== null) {

        window.cancelAnimationFrame(
          frameId
        );

      }

    };

  }, [
    workItem,
    relatedWorks,
  ]);


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (
      <WorkDetailSkeleton />
    );

  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (
    error ||
    !workItem
  ) {

    return (

      <main className="work-detail-page">

        <WorkDetailHeader />

        <div className="work-detail__feedback">

          {
            error ||
            "Work detail tidak ditemukan."
          }

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
     RENDER
  ======================================================= */

  return (

    <main className="work-detail-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <WorkDetailHeader />


      {/* ===================================================
          SCROLLABLE CONTENT
      =================================================== */}

      <section className="work-detail">


        {/* =================================================
            INTRO
        ================================================= */}

        <header className="work-detail__intro">

          <div className="work-detail__intro-meta">

            <p className="work-detail__meta">
              {category}
            </p>

          </div>


          <div className="work-detail__intro-title">

            <h1
              className="work-detail__title"
              dangerouslySetInnerHTML={{
                __html:
                  workItem.title?.rendered ||
                  "Untitled",
              }}
            />

          </div>

        </header>


        {/* =================================================
            GALLERY
        ================================================= */}

        <div className="work-detail__gallery">

          {galleryItems.map(
            (item, index) => {

              const hasCaption =
                index < 3 &&
                !!item.description;


              return (

                <section
                  className={`work-detail__block ${
                    hasCaption
                      ? "has-caption"
                      : "no-caption"
                  }`}
                  key={item.key}
                >

                  <figure
                    className="work-detail__figure"
                  >

                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                    />

                  </figure>


                  {hasCaption ? (

                    <div className="work-detail__caption-wrap">

                      <p className="work-detail__caption">
                        {item.description}
                      </p>

                    </div>

                  ) : null}

                </section>

              );

            }
          )}

        </div>


        {/* =================================================
            RELATED PROJECTS
        ================================================= */}

        {relatedWorks.length > 0 && (

          <section
            className="related-projects"
            ref={relatedProjectsRef}
          >

            <h2 className="related-projects__title">
              Related Projects
            </h2>


            <div className="related-projects__grid">

              {relatedWorks.map(
                (item) => (

                  <Link
                    key={item.id}
                    to={`/work/${item.slug}`}
                    className="related-projects__item"
                  >

                    <div className="related-projects__thumb">

                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                      />

                    </div>


                    <p className="related-projects__name">
                      {item.title}
                    </p>

                  </Link>

                )
              )}

            </div>

          </section>

        )}

      </section>


      {/* ===================================================
          CLOSE / SHARE

          PENTING:
          Ini berada DI LUAR .work-detail
          sehingga tidak ikut tenggelam ketika
          .work-detail melakukan scrolling.
      =================================================== */}

      <WorkDetailActions
        onShare={handleShare}
        bottomOffset={actionsBottom}
      />


      {/* ===================================================
          MOBILE BOTTOM NAV
      =================================================== */}

      <WorkDetailBottomNav />

    </main>

  );

}