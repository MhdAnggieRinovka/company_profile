import { Link } from "react-router-dom";

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
  goToWorkByOffset,
}) {
  return (
    <section className="works-page" aria-label="Works listing">
      {worksLoading && <div className="works-feedback">Loading works...</div>}

      {!worksLoading && worksError && (
        <div className="works-feedback">Failed to load works</div>
      )}

      {!worksLoading && !worksError && filteredWorks.length > 0 && activeWork && (
        <div className="works-carousel">
          <h2 className="works-carousel__title">{activeWork.title}</h2>

          <div className="works-carousel__media-row">
            {!isMobile && (
              <div className="works-carousel__side">
                {leftItemOne && (
                  <button
                    type="button"
                    className="works-side-card"
                    onClick={() => goToWorkByOffset(-2)}
                    aria-label={`Show ${leftItemOne.title}`}
                  >
                    <span className="works-side-card__year">{leftItemOne.year}</span>
                    <span className="works-side-card__category">
                      {leftItemOne.category}
                    </span>
                    <span className="works-side-card__name">{leftItemOne.title}</span>
                  </button>
                )}

                {leftItemTwo && (
                  <button
                    type="button"
                    className="works-side-card"
                    onClick={() => goToWorkByOffset(-1)}
                    aria-label={`Show ${leftItemTwo.title}`}
                  >
                    <span className="works-side-card__year">{leftItemTwo.year}</span>
                    <span className="works-side-card__category">
                      {leftItemTwo.category}
                    </span>
                    <span className="works-side-card__name">{leftItemTwo.title}</span>
                  </button>
                )}
              </div>
            )}

            <Link
              key={activeWork.id}
              to={`/work/${activeWork.slug}`}
              className="works-carousel__hero-link works-carousel__hero-link--animated"
            >
              <div className="works-carousel__hero">
                <img src={activeWork.image} alt={activeWork.alt} loading="lazy" />
              </div>
            </Link>

            {!isMobile && (
              <div className="works-carousel__side">
                {rightItemOne && (
                  <button
                    type="button"
                    className="works-side-card"
                    onClick={() => goToWorkByOffset(1)}
                    aria-label={`Show ${rightItemOne.title}`}
                  >
                    <span className="works-side-card__year">{rightItemOne.year}</span>
                    <span className="works-side-card__category">
                      {rightItemOne.category}
                    </span>
                    <span className="works-side-card__name">{rightItemOne.title}</span>
                  </button>
                )}

                {rightItemTwo && (
                  <button
                    type="button"
                    className="works-side-card"
                    onClick={() => goToWorkByOffset(2)}
                    aria-label={`Show ${rightItemTwo.title}`}
                  >
                    <span className="works-side-card__year">{rightItemTwo.year}</span>
                    <span className="works-side-card__category">
                      {rightItemTwo.category}
                    </span>
                    <span className="works-side-card__name">{rightItemTwo.title}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="works-carousel__footer">
            <button
              type="button"
              onClick={goPrevWork}
              aria-label="Previous work"
              className="works-carousel__footer-arrow"
            >
              &#8249;
            </button>

            <Link
              to={`/work/${activeWork.slug}`}
              className="works-carousel__story-link"
            >
              Read the story
            </Link>

            <button
              type="button"
              onClick={goNextWork}
              aria-label="Next work"
              className="works-carousel__footer-arrow"
            >
              &#8250;
            </button>
          </div>
        </div>
      )}

      {!worksLoading && !worksError && filteredWorks.length === 0 && (
        <div className="works-feedback">No works found</div>
      )}
    </section>
  );
}