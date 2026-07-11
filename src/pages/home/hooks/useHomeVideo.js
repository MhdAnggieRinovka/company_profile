import { useEffect, useState } from "react";
import { HOME_API_URL } from "../../../services/api";

export default function useHomeVideo() {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("Home Video");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchHomeVideo() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(HOME_API_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch API: ${response.status}`);
        }

        const json = await response.json();
        const firstItem = Array.isArray(json) ? json[0] : json;
        const videoData = firstItem?.acf?.wide_video;

        let finalVideoUrl = "";
        if (typeof videoData === "string") {
          finalVideoUrl = videoData;
        } else if (videoData && typeof videoData === "object") {
          finalVideoUrl = videoData.url;
        }

        if (!finalVideoUrl) {
          throw new Error("Video URL tidak ditemukan dalam data API.");
        }

        if (ignore) return;
        setVideoUrl(finalVideoUrl);
        setTitle(firstItem?.title?.rendered || "Home Video");
      } catch (err) {
        if (ignore) return;
        setError(err.message || "Failed to load homepage video.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchHomeVideo();

    return () => {
      ignore = true;
    };
  }, []);

  return {
    videoUrl,
    title,
    loading,
    error,
  };
}