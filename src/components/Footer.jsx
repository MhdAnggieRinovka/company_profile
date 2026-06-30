export default function Footer({ activePage, onNavigate }) {
  return (
    <footer className="footer">
      <nav className="footer-nav" aria-label="Section navigation">
        <button type="button" onClick={() => onNavigate("about")}>
          ABOUT
        </button>
        <button
          type="button"
          className={activePage === "works" ? "active" : ""}
          onClick={() => onNavigate("works")}
        >
          WORK
        </button>
        <button type="button" onClick={() => onNavigate("contacts")}>
          CONTACT
        </button>
      </nav>
    </footer>
  );
}
