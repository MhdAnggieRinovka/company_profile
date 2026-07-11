import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import WorkDetailPage from "./pages/work-detail/WorkDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/work/:slug" element={<WorkDetailPage />} />
    </Routes>
  );
}