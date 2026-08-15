// src/pages/home/components/ContactsBody.jsx

import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import useContactsPage from "../hooks/useContactsPage";

import visitUsIcon from "../../../assets/visit-us.svg";
import sendUsEmailIcon from "../../../assets/send-us-email.svg";
import chatUsIcon from "../../../assets/chat-us.svg";

export default function ContactsBody() {
  const {
    loading,
    error,
    videoUrl,
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
    <SkeletonTheme
      baseColor="#ece7e1"
      highlightColor="#f7f3ef"
    >
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
        >
          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <Skeleton
              width="100%"
              height="100%"
              borderRadius={0}
              style={{
                display: "block",
                lineHeight: 1,
              }}
            />
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && <div>{error}</div>}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {!loading && !error && videoUrl && (
            <img
              src={videoUrl}
              alt="Contacts background"
              className={
                isMobile
                  ? "contacts-page__video-media contacts-page__video-media--mobile"
                  : "contacts-page__video-media contacts-page__video-media--desktop"
              }
            />
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
                <Skeleton
                  width={isMobile ? 24 : 28}
                  height={isMobile ? 24 : 28}
                  circle
                />

                <Skeleton
                  width={isMobile ? 70 : 82}
                  height={16}
                />
              </div>

              {/* SEND EMAIL */}
              <div className="contacts-page__action contacts-page__action--skeleton">
                <Skeleton
                  width={isMobile ? 24 : 28}
                  height={isMobile ? 24 : 28}
                  circle
                />

                <Skeleton
                  width={isMobile ? 95 : 115}
                  height={16}
                />
              </div>

              {/* CHAT US */}
              <div className="contacts-page__action contacts-page__action--skeleton">
                <Skeleton
                  width={isMobile ? 24 : 28}
                  height={isMobile ? 24 : 28}
                  circle
                />

                <Skeleton
                  width={isMobile ? 55 : 65}
                  height={16}
                />
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
                <span>Visit Us</span>
              </button>

              {/* =================================================
                  SEND US EMAIL
              ================================================= */}

              <button
                type="button"
                className="contacts-page__action"
                onClick={handleSendEmail}
              >
                <span>Send us Email</span>
              </button>

              {/* =================================================
                  CHAT US
              ================================================= */}

              <button
                type="button"
                className="contacts-page__action"
                onClick={handleChatUs}
              >
                <span>Chat Us</span>
              </button>
            </>
          )}
        </div>
      </section>
    </SkeletonTheme>
  );
}