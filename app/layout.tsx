import type { Metadata, Viewport } from "next";
import { DrawerProvider } from "@/components/glossary-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToolIntro } from "@/components/tool-intro";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entra Token Lab · New Frontier Security",
  description:
    "Watch a Microsoft Entra sign-in hand off its authorization code, ID token, access token, and refresh token. A New Frontier Security tool.",
};

export const viewport: Viewport = {
  themeColor: "#151515",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <DrawerProvider>
          <a className="skip" href="#main">
            Skip to content
          </a>
          <SiteHeader />
          <ToolIntro />
          {children}
          <SiteFooter />
        </DrawerProvider>
      </body>
    </html>
  );
}
