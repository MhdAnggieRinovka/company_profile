import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import WorkDetailPage from "./pages/work-detail/WorkDetailPage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage initialPage="home" />}
      />

      <Route
        path="/about_us"
        element={<HomePage initialPage="about" />}
      />

      <Route
        path="/works"
        element={<HomePage initialPage="works" />}
      />

      <Route
        path="/contacts"
        element={<HomePage initialPage="contacts" />}
      />

      <Route
        path="/work/:slug"
        element={<WorkDetailPage />}
      />
    </Routes>
  );
}