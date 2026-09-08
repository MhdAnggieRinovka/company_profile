import { useEffect, useState } from "react";
import { HOME_API_URL } from "../../../services/api";

export default function useHomeVideo() {
  const [videoUrl, setVideoUrl] = useState("");
  const [squareVideoUrl, setSquareVideoUrl] = useState("");
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
        const acf = firstItem?.acf ?? {};

        const wideVideoData = acf.wide_video;
        const squareVideoData = acf.square_video;

        let finalWideVideoUrl = "";
        if (typeof wideVideoData === "string") {
          finalWideVideoUrl = wideVideoData;
        } else if (wideVideoData && typeof wideVideoData === "object") {
          finalWideVideoUrl = wideVideoData.url;
        }

        let finalSquareVideoUrl = "";
        if (typeof squareVideoData === "string") {
          finalSquareVideoUrl = squareVideoData;
        } else if (squareVideoData && typeof squareVideoData === "object") {
          finalSquareVideoUrl = squareVideoData.url;
        }

        if (!finalWideVideoUrl && !finalSquareVideoUrl) {
          throw new Error("Video URL tidak ditemukan dalam data API.");
        }

        if (ignore) return;
        setVideoUrl(finalWideVideoUrl);
        setSquareVideoUrl(finalSquareVideoUrl);
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
    squareVideoUrl,
    title,
    loading,
    error,
  };
}