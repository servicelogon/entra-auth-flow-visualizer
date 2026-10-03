export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>New Frontier Security · Exploring identity and cloud security</p>
        <p>
          Simulated flows only. No real tokens leave this page.{" "}
          <a
            href="https://medium.com/hybrid-identity-security"
            className="font-medium text-foreground underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Publication
          </a>
        </p>
      </div>
    </footer>
  );
}
