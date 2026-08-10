import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import WorkDetailPage from "./pages/work-detail/WorkDetailPage";
import AboutPage from "./pages/home/components/AboutPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about_us" element={<HomePage  />} />
      <Route
        path="/work/:slug"
        element={<WorkDetailPage />}
      />

    </Routes>
  );
}