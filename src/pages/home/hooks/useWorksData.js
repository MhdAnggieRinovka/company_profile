import { useEffect, useState } from "react";
import { WORKS_API_URL } from "../../../services/api";

export default function useWorksData(activePage) {
  const [worksData, setWorksData] = useState([]);
  const [worksLoading, setWorksLoading] = useState(false);
  const [worksError, setWorksError] = useState("");

  useEffect(() => {
    if (activePage !== "works") return;

    let ignore = false;

    async function fetchWorks() {
      try {
        setWorksLoading(true);
        setWorksError("");

        const response = await fetch(WORKS_API_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch works API: ${response.status}`);
        }

        const json = await response.json();

        const mapped = json.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title?.rendered?.replace(/&#038;/g, "&") || "",
          category:
            item.acf?.portfolio_category?.name ||
            item.acf?.portfoliocategory?.name ||
            "Uncategorized",
          year: item.acf?.year || "2024",
          image:
            item.acf?.cover_image?.sizes?.large ||
            item.acf?.cover_image?.sizes?.medium_large ||
            item.acf?.cover_image?.sizes?.medium ||
            item.acf?.cover_image?.url ||
            item.acf?.coverimage?.sizes?.large ||
            item.acf?.coverimage?.sizes?.medium_large ||
            item.acf?.coverimage?.sizes?.medium ||
            item.acf?.coverimage?.url ||
            "",
          alt:
            item.acf?.cover_image?.alt ||
            item.acf?.coverimage?.alt ||
            item.title?.rendered ||
            "",
        }));

        if (!ignore) setWorksData(mapped);
      } catch (err) {
        if (!ignore) setWorksError(err.message || "Failed to load works.");
      } finally {
        if (!ignore) setWorksLoading(false);
      }
    }

    fetchWorks();

    return () => {
      ignore = true;
    };
  }, [activePage]);

  return {
    worksData,
    worksLoading,
    worksError,
  };
}