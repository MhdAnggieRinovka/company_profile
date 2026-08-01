import { useEffect, useState } from "react";

const CONTACTS_API =
  "https://cms.kyubstudio.com/wp-json/wp/v2/page_contacts";

export default function useContactsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchContacts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(CONTACTS_API, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch contacts page: ${response.status}`);
        }

        const json = await response.json();
        const firstItem = Array.isArray(json) ? json[0] : null;

        if (!firstItem || !firstItem.acf) {
          throw new Error("Contacts data not found.");
        }

        if (ignore) return;

        const acf = firstItem.acf;

        const wideVideo = acf.wide_video;
        const video =
          wideVideo?.sizes?.medium_large ||
          wideVideo?.sizes?.large ||
          wideVideo?.url ||
          "";

        setVideoUrl(video);
        setGoogleMapsUrl(acf.google_maps_url || "");
        setEmail(acf.contact_email || "");
        setWhatsappNumber(acf.whatsapp_number || "");
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load contacts page.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchContacts();

    return () => {
      ignore = true;
    };
  }, []);

  return {
    loading,
    error,
    videoUrl,
    googleMapsUrl,
    email,
    whatsappNumber,
  };
}