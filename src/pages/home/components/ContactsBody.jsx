import { useCallback, useEffect, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import useContactsPage from "../hooks/useContactsPage";

export default function ContactsBody() {
  const {
    loading,
    error,
    wideMedia,
    squareMedia,
    googleMapsUrl,
    email,
    whatsappNumber,
  } = useContactsPage();

  /* =========================================================
     RESPONSIVE
  ========================================================= */

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const mediaRef = useRef(null);

  const handleMediaReady = useCallback(() => {
    setIsMediaLoading(false);
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeMedia = isMobile
    ? squareMedia?.url
      ? squareMedia
      : wideMedia
    : wideMedia?.url
      ? wideMedia
      : squareMedia;

  useEffect(() => {
    if (loading) {
      setIsMediaLoading(true);
      return;
    }

    if (!error && activeMedia?.url) {
      setIsMediaLoading(true);
      return;
    }

    setIsMediaLoading(false);
  }, [loading, error, activeMedia?.url]);

  useEffect(() => {
    if (loading || error || !activeMedia?.url) {
      return;
    }

    const node = mediaRef.current;
    if (!node) {
      return;
    }

    // Some browsers may skip load events for already-cached/ready media.
    if (node.tagName === "IMG" && node.complete) {
      setIsMediaLoading(false);
      return;
    }

    if (node.tagName === "VIDEO" && node.readyState >= 2) {
      setIsMediaLoading(false);
    }
  }, [loading, error, activeMedia?.url, isMobile]);

  const showMediaSkeleton = loading || isMediaLoading;

  /* =========================================================
     ACTIONS
  ========================================================= */

  function handleVisitUs() {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    }
  }

  function handleSendEmail() {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  }

  function handleChatUs() {
    if (whatsappNumber) {
      const sanitized = whatsappNumber.replace(/[^0-9]/g, "");

      window.open(
        `https://wa.me/${sanitized}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  }

  /* =========================================================
     ROOT CLASS
  ========================================================= */

  const rootClass = isMobile
    ? "contacts-page contacts-page--mobile"
    : "contacts-page contacts-page--desktop";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <SkeletonTheme baseColor="#ece7e1" highlightColor="#f7f3ef">
      <section className={rootClass}>
        {/* =====================================================
            DESKTOP / MOBILE IMAGE
        ===================================================== */}

        <div
          className={
            isMobile
              ? "contacts-page__video contacts-page__video--mobile"
              : "contacts-page__video contacts-page__video--desktop"
          }
          style={{
            position: "relative",
          }}
        >
          {/* =================================================
              LOADING
          ================================================= */}

          {showMediaSkeleton && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
              }}
            >
              <Skeleton
                width="100%"
                height="100%"
                borderRadius={0}
                style={{
                  display: "block",
                  lineHeight: 1,
                }}
              />
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && <div>Oops! Something went wrong.</div>}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {!loading && !error && activeMedia?.url && (
            <>
              {activeMedia.mimeType?.startsWith("video/") ? (
                <video
                  key={activeMedia.url}
                  ref={mediaRef}
                  src={activeMedia.url}
                  className={
                    isMobile
                      ? "contacts-page__video-media contacts-page__video-media--mobile"
                      : "contacts-page__video-media contacts-page__video-media--desktop"
                  }
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-label="Contacts background"
                  onLoadedData={handleMediaReady}
                  onCanPlay={handleMediaReady}
                  onError={handleMediaReady}
                />
              ) : (
                <img
                  ref={mediaRef}
                  src={activeMedia.url}
                  alt="Contacts background"
                  className={
                    isMobile
                      ? "contacts-page__video-media contacts-page__video-media--mobile"
                      : "contacts-page__video-media contacts-page__video-media--desktop"
                  }
                  onLoad={handleMediaReady}
                  onError={handleMediaReady}
                />
              )}
            </>
          )}
        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div
          className={
            isMobile
              ? "contacts-page__actions contacts-page__actions--mobile"
              : "contacts-page__actions contacts-page__actions--desktop"
          }
        >
          {/* =================================================
              LOADING SKELETON
          ================================================= */}

          {loading ? (
            <>
              {/* VISIT US */}
              <div className="contacts-page__action contacts-page__action--skeleton">
                {/* <Skeleton
                  width={isMobile ? 24 : 28}
                  height={isMobile ? 24 : 28}
                  circle
                /> */}

                <Skeleton width={isMobile ? 70 : 82} height={16} />
              </div>

              {/* SEND EMAIL */}
              <div className="contacts-page__action contacts-page__action--skeleton">
                {/* <Skeleton
                  width={isMobile ? 24 : 28}
                  height={isMobile ? 24 : 28}
                  circle
                /> */}

                <Skeleton width={isMobile ? 95 : 115} height={16} />
              </div>

              {/* CHAT US */}
              <div className="contacts-page__action contacts-page__action--skeleton">
                {/* <Skeleton
                  width={isMobile ? 24 : 28}
                  height={isMobile ? 24 : 28}
                  circle
                /> */}

                <Skeleton width={isMobile ? 55 : 65} height={16} />
              </div>
            </>
          ) : (
            <>
              {/* =================================================
                  VISIT US
              ================================================= */}

              <button
                type="button"
                className="contacts-page__action"
                onClick={handleVisitUs}
              >
                <span>Visit</span>
              </button>

              {/* =================================================
                  SEND US EMAIL
              ================================================= */}

              <button
                type="button"
                className="contacts-page__action"
                onClick={handleSendEmail}
              >
                <span>Email</span>
              </button>

              {/* =================================================
                  CHAT US
              ================================================= */}

              <button
                type="button"
                className="contacts-page__action"
                onClick={handleChatUs}
              >
                <span>Chat</span>
              </button>
            </>
          )}
        </div>
      </section>
    </SkeletonTheme>
  );
}
