// src/pages/home/components/ContactsBody.jsx
import { useEffect, useState } from "react";
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

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const rootClass = isMobile
    ? "contacts-page contacts-page--mobile"
    : "contacts-page contacts-page--desktop";

  return (
    <section className={rootClass} aria-label="Contacts">
      <div
        className={
          isMobile
            ? "contacts-page__video contacts-page__video--mobile"
            : "contacts-page__video contacts-page__video--desktop"
        }
      >
        {loading && (
          <div className="contacts-page__feedback">Loading video...</div>
        )}
        {!loading && error && (
          <div className="contacts-page__feedback">{error}</div>
        )}
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

      <div
        className={
          isMobile
            ? "contacts-page__actions contacts-page__actions--mobile"
            : "contacts-page__actions contacts-page__actions--desktop"
        }
      >
        <button
          type="button"
          className="contacts-page__action"
          onClick={handleVisitUs}
        >
          <img
            src={visitUsIcon}
            alt="Visit Us"
            className="contacts-page__icon"
          />
          <span>Visit Us</span>
        </button>

        <button
          type="button"
          className="contacts-page__action"
          onClick={handleSendEmail}
        >
          <img
            src={sendUsEmailIcon}
            alt="Send us Email"
            className="contacts-page__icon"
          />
          <span>Send us Email</span>
        </button>

        <button
          type="button"
          className="contacts-page__action"
          onClick={handleChatUs}
        >
          <img
            src={chatUsIcon}
            alt="Chat Us"
            className="contacts-page__icon"
          />
          <span>Chat Us</span>
        </button>
      </div>
    </section>
  );
}