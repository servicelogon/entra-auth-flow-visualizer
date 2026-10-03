import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlossaryProvider } from "@/components/glossary-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Entra Token Lab · New Frontier Security",
  description:
    "An interactive walkthrough of access tokens, refresh tokens, ID tokens, and Entra ID session cookies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <TooltipProvider>
          <GlossaryProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </GlossaryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
