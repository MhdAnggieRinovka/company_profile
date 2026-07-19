import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

export default function WorkDetailPage() {
  const { slug } = useParams();
  const [workItem, setWorkItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedWorks, setRelatedWorks] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function fetchWorkDetail() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${WORK_DETAIL_API}${slug}`, {
          method: "GET",
          headers: { Accept: "application/json" },
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

  useEffect(() => {
    if (!workItem?.id) return;

    let ignore = false;

    async function fetchRelatedWorks() {
      try {
        const response = await fetch(`${RELATED_WORKS_API}${workItem.id}`, {
          method: "GET",
          headers: { Accept: "application/json" },
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

  const galleryItems = useMemo(() => {
    if (!workItem?.acf) return [];

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

  async function handleShare() {
    const shareData = {
      title: decodeHtml(workItem?.title?.rendered || "KYUB Work"),
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied");
        return;
      }

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

  if (loading) {
    return (
      <main className="work-detail-page">
        <header className="site-header work-detail-site-header">
          <div className="site-header__inner">
            <Link to="/" className="brand-button" aria-label="KYUB home">
              <img src="/logo-kyub.jpeg" alt="KYUB" />
            </Link>

            <nav className="site-nav" aria-label="Main navigation">
              <Link to="/" className="nav-link">
                ABOUT
              </Link>
              <Link to="/?page=works" className="nav-link active">
                WORK
              </Link>
              <Link to="/?page=contacts" className="nav-link">
                CONTACTS
              </Link>
            </nav>

            <div className="site-header__spacer" />
          </div>
        </header>

        <div className="work-detail__feedback">Loading work detail...</div>
      </main>
    );
  }

  if (error || !workItem) {
    return (
      <main className="work-detail-page">
        <header className="site-header work-detail-site-header">
          <div className="site-header__inner">
            <Link to="/" className="brand-button" aria-label="KYUB home">
              <img src="/logo-kyub.jpeg" alt="KYUB" />
            </Link>

            <nav className="site-nav" aria-label="Main navigation">
              <Link to="/" className="nav-link">
                ABOUT
              </Link>
              <Link to="/?page=works" className="nav-link active">
                WORK
              </Link>
              <Link to="/?page=contacts" className="nav-link">
                CONTACTS
              </Link>
            </nav>

            <div className="site-header__spacer" />
          </div>
        </header>

        <div className="work-detail__feedback">
          {error || "Work detail tidak ditemukan."}
        </div>
      </main>
    );
  }

  const year = workItem.acf?.year || "";
  const category =
    workItem.acf?.portfolio_category?.name ||
    workItem.acf?.portfoliocategory?.name ||
    "Uncategorized";

  return (
    <main className="work-detail-page">
      <header className="site-header work-detail-site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand-button" aria-label="KYUB home">
            <img src="/logo-kyub.jpeg" alt="KYUB" />
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            <Link to="/" className="nav-link">
              ABOUT
            </Link>
            <Link to="/?page=works" className="nav-link active">
              WORK
            </Link>
            <Link to="/?page=contacts" className="nav-link">
              CONTACTS
            </Link>
          </nav>

          <div className="site-header__spacer" />
        </div>
      </header>

      <section className="work-detail">
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
                  <img src={item.image} alt={item.alt} loading="lazy" />
                </figure>

                {index === 0 ? (
                  <>
                    <div className="work-detail__actions">
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
                        <span className="work-detail__action-text">Close</span>
                      </Link>

                      <button
                        type="button"
                        className="work-detail__action-button"
                        onClick={handleShare}
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
                        <span className="work-detail__action-text">Share</span>
                      </button>
                    </div>

                    {hasCaption ? (
                      <div className="work-detail__caption-wrap">
                        <p className="work-detail__caption">
                          {item.description}
                        </p>
                      </div>
                    ) : null}
                  </>
                ) : hasCaption ? (
                  <div className="work-detail__caption-wrap">
                    <p className="work-detail__caption">{item.description}</p>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        {relatedWorks.length > 0 && (
          <section className="related-projects">
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
    </main>
  );
}
