import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./work-detail.css";

const WORK_DETAIL_API =
  "https://cms.kyubstudio.com/wp-json/wp/v2/portfolio?slug=";

const RELATED_WORKS_API =
  "https://cms.kyubstudio.com/wp-json/wp/v2/portfolio?_embed&per_page=4&orderby=date&order=desc&page=1&exclude=";

const FALLBACK_TEXTS = [
  "Lorem ipsum dolor sit amet consectetur. Dui eu velit adipiscing sit imperdiet arcu aliquam massa. Lorem ipsum dolor sit amet consectetur adipiscing elit.",
  "Lorem ipsum dolor sit amet consectetur. Quis at adipiscing et imperdiet et ipsum in nunc. Purus fermentum nisl at augue viverra luctus.",
  "Lorem ipsum dolor sit amet consectetur. Aenean commodo justo at faucibus gravida, tortor lectus tincidunt augue, sed posuere libero purus in risus.",
  "Lorem ipsum dolor sit amet consectetur. Sed non justo sed lorem feugiat gravida quis nec velit. Integer aliquet tortor vel lacus tempor varius.",
];

export default function WorkDetail() {
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
    if (!workItem?.acf?.portfolio_category?.name) return;

    let ignore = false;

    async function fetchRelatedWorks() {
      try {
        console.log(workItem)
        const response = await fetch(`${RELATED_WORKS_API}${workItem.id}&portfolio-category=${encodeURIComponent(workItem["portfolio-category"]?.[0])}`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch related works: ${response.status}`);
        }

        const json = await response.json();
        const currentCategory = workItem.acf?.portfolio_category?.name;

        let mapped = json
          // .filter((item) => item.slug !== workItem.slug)
          // .filter(
          //   (item) => item.acf?.portfolio_category?.name === currentCategory,
          // )
          .map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title?.rendered?.replace(/&#038;/g, "&") || "Untitled",
            image:
              item.acf?.cover_image?.sizes?.medium_large ||
              item.acf?.cover_image?.sizes?.large ||
              item.acf?.cover_image?.sizes?.medium ||
              item.acf?.cover_image?.url ||
              "",
            year: item.acf?.year || "",
          }))
          .filter((item) => item.image);

        if (mapped.length < 4) {
          const fallback = json
            .filter((item) => item.slug !== workItem.slug)
            .map((item) => ({
              id: item.id,
              slug: item.slug,
              title: item.title?.rendered?.replace(/&#038;/g, "&") || "Untitled",
              image:
                item.acf?.cover_image?.sizes?.medium_large ||
                item.acf?.cover_image?.sizes?.large ||
                item.acf?.cover_image?.sizes?.medium ||
                item.acf?.cover_image?.url ||
                "",
              year: item.acf?.year || "",
            }))
            .filter((item) => item.image);

          const merged = [...mapped];
          fallback.forEach((item) => {
            if (!merged.find((existing) => existing.id === item.id) && merged.length < 4) {
              merged.push(item);
            }
          });

          mapped = merged;
        }

        if (!ignore) {
          setRelatedWorks(mapped.slice(0, 4));
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

    // if (acf.cover_image?.url) {
    //   items.push({
    //     key: "cover_image",
    //     image:
    //       acf.cover_image.sizes?.large ||
    //       acf.cover_image.sizes?.medium_large ||
    //       acf.cover_image.sizes?.medium ||
    //       acf.cover_image.url,
    //     alt: acf.cover_image.alt || workItem.title?.rendered || "",
    //     description: "",
    //   });
    // }

    for (let i = 1; i <= 10; i += 1) {
      const imageField = acf[`image_${i}`];
      const descriptionField = acf[`description_${i}`] || "";

      if (imageField?.url) {
        items.push({
          key: `image_${i}`,
          image:
            imageField.sizes?.large ||
            imageField.sizes?.medium_large ||
            imageField.sizes?.medium ||
            imageField.url,
          alt: imageField.alt || workItem.title?.rendered || `Work image ${i}`,
          description:
            descriptionField ||
            FALLBACK_TEXTS[(i - 1) % FALLBACK_TEXTS.length],
        });
      }
    }

    return items;
  }, [workItem]);

  if (loading) {
    return (
      <main className="work-detail-page">
        <div className="work-detail__feedback">Loading work detail...</div>
      </main>
    );
  }

  if (error || !workItem) {
    return (
      <main className="work-detail-page">
        <div className="work-detail__feedback">
          {error || "Work detail tidak ditemukan."}
        </div>
      </main>
    );
  }

  const year = workItem.acf?.year || "";
  const category = workItem.acf?.portfolio_category?.name || "Uncategorized";

  return (
    <main className="work-detail-page">
      <section className="work-detail">
        <div className="work-detail__topbar">
          <Link to="/" className="work-detail__back">
            Back to works
          </Link>
        </div>

        <header className="work-detail__header">
          <p className="work-detail__meta">
            {category}
            {year ? ` / ${year}` : ""}
          </p>

          <h1
            className="work-detail__title"
            dangerouslySetInnerHTML={{
              __html: workItem.title?.rendered || "Untitled",
            }}
          />
        </header>

        <div className="work-detail__gallery">
          {galleryItems.map((item, index) => (
            <section className="work-detail__block" key={item.key}>
              <figure className="work-detail__figure">
                <img src={item.image} alt={item.alt} loading="lazy" />
              </figure>

              {index > 0 && item.description ? (
                <div className="work-detail__caption-wrap">
                  <p className="work-detail__caption">{item.description}</p>
                </div>
              ) : null}
            </section>
          ))}
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