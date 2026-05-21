import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const spring = {
  type: "spring",
  stiffness: 140,
  damping: 18,
  mass: 0.95,
};

function getMetrics(isMobile) {
  if (isMobile) {
    return {
      front: { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 4 },
      middle: { x: 0, y: 22, scale: 0.94, opacity: 0.72, zIndex: 3 },
      back: { x: 0, y: 46, scale: 0.88, opacity: 0.42, zIndex: 2 },
      incoming: { x: 0, y: 78, scale: 0.82, opacity: 0.18, zIndex: 1 },
      exitNext: { x: -28, y: -10, scale: 1.03, opacity: 0 },
      exitPrev: { x: 28, y: -10, scale: 1.03, opacity: 0 },
    };
  }

  return {
    front: { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 4 },
    middle: { x: 0, y: 30, scale: 0.93, opacity: 0.74, zIndex: 3 },
    back: { x: 0, y: 62, scale: 0.86, opacity: 0.46, zIndex: 2 },
    incoming: { x: 0, y: 98, scale: 0.79, opacity: 0.22, zIndex: 1 },
    exitNext: { x: -60, y: -16, scale: 1.04, opacity: 0 },
    exitPrev: { x: 60, y: -16, scale: 1.04, opacity: 0 },
  };
}

function PaperContent({ project, showStory, onReadStory }) {
  return (
    <>
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

      {showStory && (
        <button
          className="story-link"
          type="button"
          onClick={() => onReadStory(project)}
        >
          Read the story
        </button>
      )}
    </>
  );
}

function StackCard({
  project,
  slot,
  metrics,
  isFront,
  isMobile,
  onReadStory,
  onSwipeNext,
  onSwipePrev,
}) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    if (!isFront || !isMobile) return;
    touchStartX.current = e.changedTouches[0].clientX;
    touchStartY.current = e.changedTouches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!isFront || !isMobile) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX.current;
    const diffY = touchEndY - touchStartY.current;

    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) onSwipeNext();
      else onSwipePrev();
    }
  };

  return (
    <motion.article
      className={`paper-card ${slot}-card`}
      initial={false}
      animate={metrics[slot]}
      transition={spring}
      style={{ willChange: "transform, opacity" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <PaperContent
        project={project}
        showStory={isFront}
        onReadStory={onReadStory}
      />
    </motion.article>
  );
}

function LeavingCard({ project, direction, metrics, onReadStory }) {
  return (
    <motion.article
      className="paper-card leaving-card"
      initial={metrics.front}
      animate={direction === "next" ? metrics.exitNext : metrics.exitPrev}
      transition={spring}
      style={{ willChange: "transform, opacity" }}
    >
      <PaperContent project={project} showStory onReadStory={onReadStory} />
    </motion.article>
  );
}

function PaperStack({ projects, onReadStory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [leavingProject, setLeavingProject] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const metrics = useMemo(() => getMetrics(isMobile), [isMobile]);

  const getIndex = (index) => (index + projects.length) % projects.length;

  const stack = useMemo(() => {
    return {
      front: projects[getIndex(activeIndex)],
      middle: projects[getIndex(activeIndex + 1)],
      back: projects[getIndex(activeIndex + 2)],
      incoming: projects[getIndex(activeIndex + 3)],
    };
  }, [activeIndex, projects]);

  const runTransition = (dir) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setDirection(dir);
    setLeavingProject(stack.front);

    setTimeout(() => {
      setActiveIndex((prev) =>
        dir === "next" ? getIndex(prev + 1) : getIndex(prev - 1)
      );
    }, 70);

    setTimeout(() => {
      setLeavingProject(null);
      setIsAnimating(false);
    }, 650);
  };

  const goNext = () => runTransition("next");
  const goPrev = () => runTransition("prev");

  return (
    <section className="stack-wrap">
      <button
        className="nav-btn"
        onClick={goPrev}
        aria-label="Previous project"
        type="button"
        disabled={isAnimating}
      >
        ‹
      </button>

      <div className="stack-stage">
        <StackCard
          key={`incoming-${stack.incoming.id}`}
          project={stack.incoming}
          slot="incoming"
          metrics={metrics}
          isFront={false}
          isMobile={isMobile}
          onReadStory={onReadStory}
          onSwipeNext={goNext}
          onSwipePrev={goPrev}
        />

        <StackCard
          key={`back-${stack.back.id}`}
          project={stack.back}
          slot="back"
          metrics={metrics}
          isFront={false}
          isMobile={isMobile}
          onReadStory={onReadStory}
          onSwipeNext={goNext}
          onSwipePrev={goPrev}
        />

        <StackCard
          key={`middle-${stack.middle.id}`}
          project={stack.middle}
          slot="middle"
          metrics={metrics}
          isFront={false}
          isMobile={isMobile}
          onReadStory={onReadStory}
          onSwipeNext={goNext}
          onSwipePrev={goPrev}
        />

        <StackCard
          key={`front-${stack.front.id}`}
          project={stack.front}
          slot="front"
          metrics={metrics}
          isFront
          isMobile={isMobile}
          onReadStory={onReadStory}
          onSwipeNext={goNext}
          onSwipePrev={goPrev}
        />

        <AnimatePresence>
          {leavingProject && (
            <LeavingCard
              key={`leaving-${leavingProject.id}-${direction}`}
              project={leavingProject}
              direction={direction}
              metrics={metrics}
              onReadStory={onReadStory}
            />
          )}
        </AnimatePresence>
      </div>

      <button
        className="nav-btn"
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