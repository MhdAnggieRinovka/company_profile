import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./work-detail.css";

const WORK_DETAIL_API =
  "https://cms.kyubstudio.com/wp-json/wp/v2/portfolio?slug=";

export default function WorkDetail() {
  const { slug } = useParams();
  const [workItem, setWorkItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log("slug:", slug);
  console.log("workItem:", workItem);
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

  const galleryItems = useMemo(() => {
    if (!workItem?.acf) return [];

    const acf = workItem.acf;
    const items = [];

    if (acf.cover_image?.url) {
      items.push({
        key: "cover_image",
        image:
          acf.cover_image.sizes?.large ||
          acf.cover_image.sizes?.medium_large ||
          acf.cover_image.sizes?.medium ||
          acf.cover_image.url,
        alt: acf.cover_image.alt || workItem.title?.rendered || "",
        description: "",
      });
    }

    for (let i = 1; i <= 10; i += 1) {
      const imageField = acf[`image_${i}`];
      const descriptionField = acf[`description_${i}`] || "";

      if (imageField?.url) {
        items.push({
          key: `image${i}`,
          image:
            imageField.sizes?.large ||
            imageField.sizes?.medium_large ||
            imageField.sizes?.mediumlarge ||
            imageField.url,
          alt: imageField.alt || workItem.title?.rendered || `Work image ${i}`,
          description: descriptionField,
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

  const title = workItem.title?.rendered?.replace(/&#038;/g, "&") || "Untitled";
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
            dangerouslySetInnerHTML={{
              __html: workItem.title?.rendered || "Untitled",
            }}
          />
        </header>

        <div className="work-detail__gallery">
          {galleryItems.map((item) => (
            <figure className="work-detail__figure" key={item.key}>
              <img src={item.image} alt={item.alt} loading="lazy" />
              {item.description ? (
                <figcaption>{item.description}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
