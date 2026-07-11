const FILTERS = ["All", "Branding", "Illustration", "Invitation", "Packaging"];

export default function WorksFilters({ activeFilter, onChangeFilter }) {
  return (
    <div className="works-filter-wrap">
      <div className="works-filter-row">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={
              activeFilter === filter ? "filter-button active" : "filter-button"
            }
            onClick={() => onChangeFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}