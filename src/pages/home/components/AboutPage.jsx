// src/pages/home/components/AboutPage.jsx
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AboutPage({ onGoToContacts }) {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch(
          "https://cms.kyubstudio.com/wp-json/wp/v2/page_about_us"
        );
        const json = await res.json();
        setAbout(json[0]); // ambil item pertama
      } catch (e) {
        console.error("Failed to load about page", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  // ==== STATE LOADING: tampilkan skeleton, layout mirip ABOUT ====
  if (loading) {
    return (
      <section className="about-page">
        <div className="about-content">
          {/* judul skeleton */}
          <div className="about-title">
            <Skeleton width={260} height={18} />
          </div>

          {/* grid skeleton: kiri teks, tengah gambar, kanan teks */}
          <div className="about-grid">
            {/* kiri: description skeleton */}
            <div className="about-grid__col about-grid__col--left">
              <Skeleton count={4} />
            </div>

            {/* tengah: gambar skeleton + paragraf tengah skeleton */}
            <div className="about-grid__col about-grid__col--center">
              <Skeleton width={220} height={140} style={{ marginBottom: 16 }} />
              <Skeleton count={3} />
            </div>

            {/* kanan: description skeleton */}
            <div className="about-grid__col about-grid__col--right">
              <Skeleton count={4} />
            </div>
          </div>

          {/* CTA skeleton */}
          <div className="about-cta">
            <Skeleton width={140} height={16} style={{ marginBottom: 8 }} />
            <Skeleton width={180} height={16} />
          </div>
        </div>
      </section>
    );
  }

  // ==== STATE NORMAL: konten ABOUT kamu sekarang ====
  if (!about) return null;

  const acf = about.acf || {};

  // pecah description_2 jadi dua bagian (desktop)
  const desc2Html = acf.description_2 || "";

  // ambil hanya tag <p> yang berisi teks (abaikan <p>&nbsp;</p>)
  const paragraphs = desc2Html
    .split(/<\/p>/i)
    .map((chunk) => chunk.replace(/<p[^>]*>/i, "").trim())
    .filter((text) => text.length > 0);

  const rightParagraphHtml = paragraphs[0] ? `<p>${paragraphs[0]}</p>` : "";
  const middleParagraphHtml = paragraphs[paragraphs.length - 1]
    ? `<p>${paragraphs[paragraphs.length - 1]}</p>`
    : "";

  const rawTitle = acf.title || "";
  const htmlTitle = rawTitle.replace(/\r?\n/g, "<br />");

  return (
    <section className="about-page">
      <div className="about-content">
        {/* judul */}
        <h1
          className="about-title"
          dangerouslySetInnerHTML={{ __html: htmlTitle }}
        />

        {/* grid: kiri teks, tengah gambar + paragraf tengah, kanan teks */}
        <div className="about-grid">
          {/* kiri: description */}
          <div
            className="about-grid__col about-grid__col--left"
            dangerouslySetInnerHTML={{ __html: acf.description }}
          />

          {/* tengah: gambar + paragraf kedua dari description_2 */}
          <div className="about-grid__col about-grid__col--center">
            {acf.image_desktop?.url && (
              <img
                src={acf.image_desktop.url}
                alt={acf.image_desktop.alt || ""}
                className="about-hero__image"
              />
            )}

            {middleParagraphHtml && (
              <div
                className="about-grid__middle-text"
                dangerouslySetInnerHTML={{ __html: middleParagraphHtml }}
              />
            )}
          </div>

          {/* kanan: paragraf pertama dari description_2 */}
          <div
            className="about-grid__col about-grid__col--right"
            dangerouslySetInnerHTML={{ __html: rightParagraphHtml }}
          />
        </div>

        {/* CTA */}
        <div className="about-cta">
          <p className="about-cta__lead">Let&apos;s Collaborate,</p>
          <button
            type="button"
            className="about-cta__button"
            onClick={onGoToContacts}
          >
            {acf.cta_text || "SEND US A MESSAGE"}
          </button>
        </div>
      </div>
    </section>
  );
}