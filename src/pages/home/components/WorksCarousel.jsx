import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import chevronLeft from "../../../assets/chevron-left.svg";
import chevronRight from "../../../assets/chevron-right.svg";

export default function WorksCarousel({
  isMobile,
  worksLoading,
  worksError,
  filteredWorks,
  activeWork,
  leftItemOne,
  leftItemTwo,
  rightItemOne,
  rightItemTwo,
  goPrevWork,
  goNextWork,
}) {
  const [cursorSide, setCursorSide] = useState("right");
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const [animateHero, setAnimateHero] = useState(false);

  useEffect(() => {
    if (!activeWork) return;

    setAnimateHero(true);

    const timeout = setTimeout(() => {
      setAnimateHero(false);
    }, 480);

    return () => clearTimeout(timeout);
  }, [activeWork]);

  function handleAreaMouseMove(event) {
    if (isMobile) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const middleX = rect.left + rect.width / 2;
    const nextSide = event.clientX < middleX ? "left" : "right";

    setCursorSide(nextSide);
    setCursorVisible(true);
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  function handleAreaMouseEnter() {
    if (isMobile) return;
    setCursorVisible(true);
  }

  function handleAreaMouseLeave() {
    if (isMobile) return;
    setCursorVisible(false);
  }

  function handleAreaClick(event) {
    if (isMobile) return;

    const interactiveTarget = event.target.closest(
      ".works-carousel__story-link, .works-carousel__mobile-nav",
    );
    if (interactiveTarget) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const middleX = rect.left + rect.width / 2;

    if (event.clientX < middleX) {
      goPrevWork();
    } else {
      goNextWork();
    }
  }

  function handleAreaKeyDown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevWork();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNextWork();
    }
  }

  const cursorIcon = cursorSide === "left" ? chevronLeft : chevronRight;

  return (
    <section className="works-page" aria-label="Works listing">
      <SkeletonTheme baseColor="#ece7e1" highlightColor="#f7f3ef">
        {worksLoading && (
          <div className="works-carousel">
            <div className="works-carousel__title works-carousel__title--skeleton">
              <Skeleton width={180} height={26} />
            </div>

            <div className="works-carousel__media-row works-carousel__media-row--skeleton">
              {!isMobile && (
                <div className="works-carousel__side" aria-hidden="true">
                  <div className="works-side-card works-side-card--skeleton">
                    <Skeleton width={14} height={120} />
                  </div>
                  <div className="works-side-card works-side-card--skeleton">
                    <Skeleton width={14} height={120} />
                  </div>
                </div>
              )}

              <div className="works-carousel__preview">
                <div className="works-carousel__hero">
                  <Skeleton
                    height="100%"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 0,
                      lineHeight: 1,
                      display: "block",
                    }}
                  />
                </div>
              </div>

              {!isMobile && (
                <div className="works-carousel__side" aria-hidden="true">
                  <div className="works-side-card works-side-card--skeleton">
                    <Skeleton width={14} height={120} />
                  </div>
                  <div className="works-side-card works-side-card--skeleton">
                    <Skeleton width={14} height={120} />
                  </div>
                </div>
              )}
            </div>

            <div className="works-carousel__footer">
              {isMobile && (
                <button
                  type="button"
                  className="works-carousel__mobile-nav works-carousel__mobile-nav--prev"
                  aria-label="Previous work"
                  disabled
                >
                  <img src={chevronLeft} alt="" />
                </button>
              )}

              <span className="works-carousel__story-link works-carousel__story-link--skeleton">
                <Skeleton width={120} height={18} />
              </span>

              {isMobile && (
                <button
                  type="button"
                  className="works-carousel__mobile-nav works-carousel__mobile-nav--next"
                  aria-label="Next work"
                  disabled
                >
                  <img src={chevronRight} alt="" />
                </button>
              )}
            </div>
          </div>
        )}

        {!worksLoading && worksError && (
          <div className="works-feedback">Failed to load works</div>
        )}

        {!worksLoading &&
          !worksError &&
          filteredWorks.length > 0 &&
          activeWork && (
            <div className="works-carousel">
              <h2 className="works-carousel__title">{activeWork.title}</h2>

              <div
                className={`works-carousel__media-row ${
                  cursorVisible ? "is-cursor-visible" : ""
                }`}
                onMouseMove={handleAreaMouseMove}
                onMouseEnter={handleAreaMouseEnter}
                onMouseLeave={handleAreaMouseLeave}
                onClick={handleAreaClick}
                onKeyDown={handleAreaKeyDown}
                tabIndex={isMobile ? -1 : 0}
                role={isMobile ? undefined : "button"}
                aria-label={
                  isMobile
                    ? undefined
                    : "Click left side for previous work and right side for next work"
                }
              >
                {!isMobile && (
                  <span
                    className="works-carousel__custom-cursor"
                    aria-hidden="true"
                    style={{
                      left: `${cursorPosition.x}px`,
                      top: `${cursorPosition.y}px`,
                    }}
                  >
                    <img src={cursorIcon} alt="" />
                  </span>
                )}

                {!isMobile && (
                  <div className="works-carousel__side" aria-hidden="true">
                    {leftItemOne && (
                      <div className="works-side-card">
                        <span className="works-side-card__year">
                          {leftItemOne.year}
                        </span>
                        <span className="works-side-card__category">
                          {leftItemOne.category}
                        </span>
                        <span className="works-side-card__name">
                          {leftItemOne.title}
                        </span>
                      </div>
                    )}

                    {leftItemTwo && (
                      <div className="works-side-card">
                        <span className="works-side-card__year">
                          {leftItemTwo.year}
                        </span>
                        <span className="works-side-card__category">
                          {leftItemTwo.category}
                        </span>
                        <span className="works-side-card__name">
                          {leftItemTwo.title}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="works-carousel__preview">
                  <Link
                    to={`/work/${activeWork.slug}`}
                    className="works-carousel__hero works-carousel__hero--animated"
                    aria-label={activeWork.title || "View work detail"}
                  >
                    <img
                      src={activeWork.image}
                      alt={activeWork.alt}
                      loading="lazy"
                    />
                  </Link>
                </div>

                {!isMobile && (
                  <div className="works-carousel__side" aria-hidden="true">
                    {rightItemOne && (
                      <div className="works-side-card">
                        <span className="works-side-card__year">
                          {rightItemOne.year}
                        </span>
                        <span className="works-side-card__category">
                          {rightItemOne.category}
                        </span>
                        <span className="works-side-card__name">
                          {rightItemOne.title}
                        </span>
                      </div>
                    )}

                    {rightItemTwo && (
                      <div className="works-side-card">
                        <span className="works-side-card__year">
                          {rightItemTwo.year}
                        </span>
                        <span className="works-side-card__category">
                          {rightItemTwo.category}
                        </span>
                        <span className="works-side-card__name">
                          {rightItemTwo.title}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="works-carousel__footer">
                {isMobile && (
                  <button
                    type="button"
                    className="works-carousel__mobile-nav works-carousel__mobile-nav--prev"
                    onClick={goPrevWork}
                    aria-label="Previous work"
                  >
                    <img src={chevronLeft} alt="" />
                  </button>
                )}

                <Link
                  to={`/work/${activeWork.slug}`}
                  className="works-carousel__story-link"
                >
                  Read the Story
                </Link>

                {isMobile && (
                  <button
                    type="button"
                    className="works-carousel__mobile-nav works-carousel__mobile-nav--next"
                    onClick={goNextWork}
                    aria-label="Next work"
                  >
                    <img src={chevronRight} alt="" />
                  </button>
                )}
              </div>
            </div>
          )}

        {!worksLoading && !worksError && filteredWorks.length === 0 && (
          <div className="works-feedback">No works found</div>
        )}
      </SkeletonTheme>
    </section>
  );
}