import { Helmet } from "react-helmet-async";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_IMAGE,
  SITE_TWITTER_HANDLE,
} from "../config/site";

function truncate(text = "", maxLength = 160) {
  if (text.length <= maxLength) return text;
  return (
    text
      .slice(0, maxLength)
      .replace(/\s+\S*$/, "")
      .trim() + "…"
  );
}

export default function Seo({
  title,
  description,
  image,
  url,
  type = "website",
  canonical,
  noindex = false,
  children,
}) {
  const fullTitle = !title
    ? SITE_NAME
    : title.startsWith(`${SITE_NAME} —`)
      ? "Home"
      : title.replace(new RegExp(`\\s*—\\s*${SITE_NAME}$`), "");
  const metaDescription = truncate(description || SITE_DEFAULT_DESCRIPTION);
  const metaImage = image || SITE_DEFAULT_IMAGE;
  const metaUrl =
    url || (typeof window !== "undefined" ? window.location.href : SITE_URL);
  const metaCanonical = canonical || metaUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={metaCanonical} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter / X — only render if a handle is configured */}
      {SITE_TWITTER_HANDLE && (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={fullTitle} />
          <meta name="twitter:description" content={metaDescription} />
          <meta name="twitter:image" content={metaImage} />
          <meta name="twitter:site" content={SITE_TWITTER_HANDLE} />
        </>
      )}

      {children}
    </Helmet>
  );
}
