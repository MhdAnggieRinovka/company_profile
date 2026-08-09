// src/pages/home/components/AboutPage.jsx
import { useEffect, useState } from "react";

export default function AboutPage({ onGoToContacts }) {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch(
          "https://cms.kyubstudio.com/wp-json/wp/v2/page_about_us",
        );
        const json = await res.json();
        setAbout(json[0]); // ambil item pertama
      } catch (e) {
        console.error("Failed to load about page", e);
      }
    }
    fetchAbout();
  }, []);

  if (!about) return null;

  const acf = about.acf || {};

  // ==== PEC AH description_2 JADI DUA BAGIAN ====
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
