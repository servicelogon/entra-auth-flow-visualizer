import { Laptop } from "lucide-react";
import { TermLink } from "@/components/term-link";

export function PrtCallout() {
  return (
    <aside className="aside-note" aria-labelledby="prt-title">
      <Laptop aria-hidden />
      <h3 id="prt-title">On a work laptop</h3>
      <p>
        When the device is Entra joined, Windows or the Authenticator broker already
        holds a <TermLink id="prt">Primary Refresh Token</TermLink>. Apps ask the
        operating system for tokens. Entra ID still issues access tokens and ID tokens,
        without a browser password form.
      </p>
    </aside>
  );
}
