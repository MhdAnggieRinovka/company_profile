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

  function PageTitle() {
    const { pathname } = useLocation();

    useEffect(() => {
      if (pathname === "/") {
        document.title = "Home";
      } else if (pathname === "/about_us") {
        document.title = "About";
      } else if (pathname === "/works") {
        document.title = "Works";
      } else if (pathname === "/contacts") {
        document.title = "Contacts";
      } else if (pathname.startsWith("/work/")) {
        document.title = "Work";
      }
    }, [pathname]);

    return null;
  }

  return null;
}

export default function App() {
  return (
    
    <Routes>
      <Route path="/" element={<HomePage initialPage="home" />} />

      <Route path="/about_us" element={<HomePage initialPage="about" />} />

      <Route path="/work" element={<HomePage initialPage="works" />} />

      <Route path="/contact" element={<HomePage initialPage="contacts" />} />

      <Route path="/work/:slug" element={<WorkDetailPage />} />
    </Routes>
  );
}
