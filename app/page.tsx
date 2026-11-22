import Link from "next/link";
import { FlowLab } from "@/components/flow-lab";
import { PrtCallout } from "@/components/prt-callout";
import { TokenComparison } from "@/components/token-comparison";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="page shell">
      <div className="page-body">
        <FlowLab />
        <TokenComparison />
        <PrtCallout />
      </div>
      <nav className="pager" aria-label="Section navigation">
        <Link className="pager-link pager-next" href="/glossary">
          <span className="pager-kicker">Next</span>
          <span className="pager-title">
            Glossary
            <span className="arrow-icon" aria-hidden="true" />
          </span>
        </Link>
      </nav>
    </main>
  );
}
