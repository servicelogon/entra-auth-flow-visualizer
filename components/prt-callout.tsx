import { Laptop } from "lucide-react";
import { TermLink } from "@/components/term-link";

export function PrtCallout() {
  return (
    <aside className="rounded-2xl border border-border bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-magenta-soft text-magenta">
          <Laptop className="size-5" />
        </span>
        <div>
          <p className="text-[11px] font-medium tracking-[0.14em] text-magenta uppercase">
            On a work laptop
          </p>
          <h3 className="mt-1 font-semibold tracking-tight">
            Why the password never appears
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            If the device is Entra-joined, Windows (or the Authenticator broker)
            already holds a <TermLink id="prt">Primary Refresh Token</TermLink>.
            Apps ask the OS for tokens. You still get access and ID tokens — they
            just were not collected through a browser password form.
          </p>
        </div>
      </div>
    </aside>
  );
}
