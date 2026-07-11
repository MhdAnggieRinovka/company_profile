export default function SiteHeader({ activePage, showWorks, onNavigate }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button
          type="button"
          className="brand-button"
          aria-label="KYUB home"
          onClick={() => onNavigate("about")}
        >
          <img src="/logo-kyub.jpeg" alt="KYUB" />
        </button>

        <nav className="site-nav" aria-label="Main navigation">
          <button
            type="button"
            className={activePage === "about" ? "nav-link active" : "nav-link"}
            onClick={() => onNavigate("about")}
          >
            ABOUT
          </button>

          <button
            type="button"
            className={showWorks ? "nav-link active" : "nav-link"}
            onClick={() => onNavigate("works")}
          >
            WORK
          </button>

          <button
            type="button"
            className={activePage === "contacts" ? "nav-link active" : "nav-link"}
            onClick={() => onNavigate("contacts")}
          >
            CONTACTS
          </button>
        </nav>

        <div className="site-header__spacer" />
      </div>
    </header>
  );
}