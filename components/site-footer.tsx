import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <a
          href="https://newfrontiersecurity.net"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-[min(13.5rem,70vw)] shrink-0"
        >
          <Image
            src="/new-frontier-security-logo.png"
            alt="New Frontier Security"
            width={2010}
            height={529}
            className="h-auto w-full invert"
          />
        </a>
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
