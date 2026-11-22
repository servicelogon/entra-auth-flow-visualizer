import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="page shell">
      <div className="page-body">
        <header className="step-head">
          <p className="kicker">404</p>
          <h2>This page is not part of the lab</h2>
          <p className="lede">The link may be old, or the address may have a typo.</p>
        </header>
      </div>
      <nav className="pager" aria-label="Section navigation">
        <Link className="pager-link pager-next" href="/">
          <span className="pager-kicker">Go to</span>
          <span className="pager-title">
            The lab
            <span className="arrow-icon" aria-hidden="true" />
          </span>
        </Link>
      </nav>
    </main>
  );
}
