import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const spring = {
  type: "spring",
  stiffness: 280,
  damping: 24,
  mass: 0.6,
};

function StaticCard({ project, className }) {
  return (
    <article className={`paper-card ${className}`}>
      <p className="eyebrow">{project.category}</p>
      <h2>{project.title}</h2>
      <p>{project.description}</p>

      <div className="paper-grid">
        <div className="paper-block tall" />
        <div className="paper-side">
          <div className="paper-block" />
          <div className="paper-block" />
        </div>
      </div>

      <button className="story-link" type="button">
        Read the story
      </button>
    </article>
  );
}

function AnimatedFrontCard({
  project,
  direction,
  onReadStory,
  onSwipeNext,
  onSwipePrev,
  isMobile,
}) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    touchStartX.current = e.changedTouches[0].clientX;
    touchStartY.current = e.changedTouches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX.current;
    const diffY = touchEndY - touchStartY.current;

    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        onSwipeNext();
      } else {
        onSwipePrev();
      }
    }
  };

  const mobileOffset = 24;
  const desktopOffset = 120;
  const offset = isMobile ? mobileOffset : desktopOffset;

  return (
    <motion.article
      key={project.id}
      className="paper-card front-card"
      initial={{
        x: direction === "next" ? offset : -offset,
        y: 10,
        rotate: isMobile ? 0 : direction === "next" ? 6 : -6,
        opacity: 0,
        scale: 0.98,
      }}
      animate={{
        x: 0,
        y: 0,
        rotate: isMobile ? 0 : -3,
        opacity: 1,
        scale: 1,
      }}
      exit={{
        x: direction === "next" ? -offset : offset,
        y: -4,
        rotate: isMobile ? 0 : direction === "next" ? -6 : 6,
        opacity: 0,
        scale: 0.98,
      }}
      transition={spring}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ willChange: "transform" }}
    >
      <p className="eyebrow">{project.category}</p>
      <h2>{project.title}</h2>
      <p>{project.description}</p>

      <div className="paper-grid">
        <div className="paper-block tall" />
        <div className="paper-side">
          <div className="paper-block" />
          <div className="paper-block" />
        </div>
      </div>

      <button
        className="story-link"
        type="button"
        onClick={() => onReadStory(project)}
      >
        Read the story
      </button>
    </motion.article>
  );
}

function PaperStack({ projects, onReadStory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  const prevIndex = (activeIndex + projects.length - 1) % projects.length;
  const nextIndex = (activeIndex + 1) % projects.length;

  const goPrev = () => {
    setDirection("prev");
    setActiveIndex(prevIndex);
  };

  const goNext = () => {
    setDirection("next");
    setActiveIndex(nextIndex);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="stack-wrap">
      <button
        className="nav-btn"
        onClick={goPrev}
        aria-label="Previous project"
      >
        ‹
      </button>

      <div className="stack-stage">
        <StaticCard project={projects[prevIndex]} className="back-card" />
        <StaticCard project={projects[nextIndex]} className="middle-card" />

        <AnimatePresence mode="sync" initial={false}>
          <AnimatedFrontCard
            key={projects[activeIndex].id}
            project={projects[activeIndex]}
            direction={direction}
            onReadStory={onReadStory}
            onSwipeNext={goNext}
            onSwipePrev={goPrev}
            isMobile={isMobile}
          />
        </AnimatePresence>
      </div>

      <button className="nav-btn" onClick={goNext} aria-label="Next project">
        ›
      </button>
    </section>
  );
}

export default PaperStack;
