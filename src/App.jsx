import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import WorkDetailPage from "./pages/work-detail/WorkDetailPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage initialPage="home" />} />

      <Route path="/about_us" element={<HomePage initialPage="about" />} />

      <Route path="/works" element={<HomePage initialPage="works" />} />

      <Route path="/contacts" element={<HomePage initialPage="contacts" />} />

      <Route path="/work/:slug" element={<WorkDetailPage />} />
    </Routes>
  );
}
