// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font";
import "./globals.css";
import { cn } from "../lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider"; // NEW: Import ThemeProvider
import { SiteHeader } from "@/components/SiteHeader"; // NEW: Import SiteHeader

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Berlitz Report Dashboard",
    template: "%s | Berlitz Reporter",
  },
  description: "An interactive dashboard for reviewing Berlitz class data.",
  keywords: ["Next.js", "Berlitz", "Report", "Dashboard", "AI"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          inter.variable,
          GeistSans.variable
        )}
      >
        {/* NEW: Wrap with ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            {/* NEW: Add the SiteHeader */}
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
