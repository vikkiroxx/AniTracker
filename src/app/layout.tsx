import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AniTracker",
  description: "A modern, minimal PWA for tracking anime using the AniList API.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AniTracker",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b", // dark background color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      style={{ fontFamily: "'Proxima Nova', sans-serif" }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground md:pt-16 pb-16 md:pb-0" style={{ fontFamily: "'Proxima Nova', sans-serif" }}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
