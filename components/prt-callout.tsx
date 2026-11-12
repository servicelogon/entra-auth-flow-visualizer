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
          <h3 className="font-semibold tracking-tight">On a work laptop</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            When the device is Entra joined, Windows or the Authenticator broker
            already holds a <TermLink id="prt">Primary Refresh Token</TermLink>.
            Apps ask the operating system for tokens. Entra ID still issues access
            tokens and ID tokens, without a browser password form.
          </p>
        </div>
      </div>
    </aside>
  );
}
