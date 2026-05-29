import { useEffect, useState } from "react";
import { motion } from "motion/react";

const spring = {
  type: "spring",
  stiffness: 155,
  damping: 22,
  mass: 0.9,
};

function wrap(index, total) {
  return (index + total) % total;
}

function getRelativePosition(index, activeIndex, total) {
  const raw = index - activeIndex;
  if (raw > total / 2) return raw - total;
  if (raw < -total / 2) return raw + total;
  return raw;
}

function getDesktopCardStyle(pos) {
  if (pos === 0) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotate: 0,
      zIndex: 40,
      filter: "blur(0px)",
      pointerEvents: "auto",
    };
  }

  if (pos === 1) {
    return {
      x: 48,
      y: 10,
      scale: 0.985,
      opacity: 0.42,
      rotate: 4,
      zIndex: 30,
      filter: "blur(0px)",
      pointerEvents: "none",
    };
  }

  if (pos === -1) {
    return {
      x: -42,
      y: 14,
      scale: 0.982,
      opacity: 0.24,
      rotate: -4,
      zIndex: 20,
      filter: "blur(0px)",
      pointerEvents: "none",
    };
  }

  return {
    x: pos > 0 ? 96 : -96,
    y: 22,
    scale: 0.97,
    opacity: 0,
    rotate: pos > 0 ? 5 : -5,
    zIndex: 0,
    filter: "blur(0px)",
    pointerEvents: "none",
  };
}

function getMobileCardStyle(pos) {
  if (pos === 0) {
    return {
      x: 0,            // Tepat di tengah
      y: 0,
      scale: 1,
      opacity: 1,
      rotate: 0,
      zIndex: 40,
      pointerEvents: "auto",
    };
  }

  if (pos === 1) {
    return {
      x: 14,           // Geser ke kanan sedikit untuk efek tumpukan
      y: 10,
      scale: 0.97,
      opacity: 0.18,
      rotate: 4,
      zIndex: 20,
      pointerEvents: "none",
    };
  }

  if (pos === -1) {
    return {
      x: -14,          // Geser ke kiri sedikit untuk efek tumpukan
      y: 10,
      scale: 0.97,
      opacity: 0.12,
      rotate: -4,
      zIndex: 10,
      pointerEvents: "none",
    };
  }

  return {
    x: pos > 0 ? 24 : -24,
    y: 14,
    scale: 0.95,
    opacity: 0,
    rotate: pos > 0 ? 5 : -5,
    zIndex: 0,
    pointerEvents: "none",
  };
}

function PaperStack({ projects, onReadStory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => wrap(prev + 1, projects.length));
    window.setTimeout(() => setIsAnimating(false), 700);
  };

  const goPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => wrap(prev - 1, projects.length));
    window.setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <section className="stack-wrap">
      <button
        className="nav-btn nav-btn-left"
        onClick={goPrev}
        aria-label="Previous project"
        type="button"
        disabled={isAnimating}
      >
        ‹
      </button>

      <div className="stack-stage">
        {projects.map((project, index) => {
          const pos = getRelativePosition(index, activeIndex, projects.length);
          const style = isMobile
            ? getMobileCardStyle(pos)
            : getDesktopCardStyle(pos);

          const isFront = pos === 0;

          return (
            <motion.article
              key={project.id}
              className={`paper-card ${isFront ? "front-card" : "ghost-card"}`}
              animate={style}
              transition={spring}
              style={{
                zIndex: style.zIndex,
                pointerEvents: style.pointerEvents,
                willChange: "transform, opacity",
              }}
            >
              <div className="paper-copy">
                <p className="eyebrow">{project.category}</p>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
              </div>

              <div className="paper-grid">
                <div className="paper-block tall" />
                <div className="paper-side">
                  <div className="paper-block" />
                  <div className="paper-block" />
                </div>
              </div>

              {isFront && (
                <button
                  className="story-link"
                  type="button"
                  onClick={() => onReadStory(project)}
                >
                  Read the story
                </button>
              )}
            </motion.article>
          );
        })}
      </div>

      <button
        className="nav-btn nav-btn-right"
        onClick={goNext}
        aria-label="Next project"
        type="button"
        disabled={isAnimating}
      >
        ›
      </button>
    </section>
  );
}

export default PaperStack;
