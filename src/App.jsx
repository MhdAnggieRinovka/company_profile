import { useState } from "react";
import "./App.css";
import PaperStack from "./components/PaperStack";
import { projects } from "./data/projects";
import Footer from "./components/Footer";

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Our Proposal</p>
        <h1>Company Profile Prototype</h1>
      </section>

      <PaperStack projects={projects} onReadStory={setSelectedProject} />

      {selectedProject && (
        <div
          className="detail-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div className="detail-shell" onClick={(e) => e.stopPropagation()}>
            <button
              className="detail-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close detail"
            >
              ×
            </button>

            <p className="eyebrow">{selectedProject.category}</p>
            <h2 className="detail-title">{selectedProject.title}</h2>
            <p className="detail-description">{selectedProject.description}</p>

            <div className="detail-gallery">
              <div className="detail-block detail-block-sm" />
              <div className="detail-block detail-block-lg" />
              <div className="detail-block detail-block-sm" />
            </div>
          </div>
        </div>
      )}
      {!selectedProject && <Footer />}
    </main>
  );
}

export default App;
