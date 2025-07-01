// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import {
  Inter,
  Poppins,
  Montserrat,
  Roboto,
  Open_Sans,
  Lato,
  Raleway,
} from "next/font/google";
import { GeistSans, GeistMono } from "geist/font"; // Correct import for Geist
import "./globals.css";
import { cn } from "../lib/utils";

// Main UI system font (Inter as per Tailwind config)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"], // Add weights
});

// Geist fonts (sans and mono)
const geistSans = GeistSans; // Use the direct import
const geistMono = GeistMono; // Use the direct import

// Additional fonts (based on your tailwind config)
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "My Modern Next.js Project",
    template: "%s | My Modern Next.js Project",
  },
  description:
    "A modern Next.js project with enhanced styling and functionality.",
  keywords: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Modern UI"],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }], // Optional: Add your URL
  creator: "Your Name",
  publisher: "Your Name or Company", // Optional
  // openGraph: { // Optional: For social media sharing
  //   title: "My Modern Next.js Project",
  //   description: "A modern Next.js project with enhanced styling.",
  //   url: "https://yourwebsite.com",
  //   siteName: "My Project Name",
  //   images: [
  //     {
  //       url: "https://yourwebsite.com/og-image.png", // Must be an absolute URL
  //       width: 1200,
  //       height: 630,
  //       alt: "My Modern Next.js Project Open Graph Image",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },
  // twitter: { // Optional: For Twitter cards
  //   card: "summary_large_image",
  //   title: "My Modern Next.js Project",
  //   description: "A modern Next.js project with enhanced styling.",
  //   // siteId: "YourTwitterSiteId", // Optional
  //   creator: "@YourTwitterHandle", // Optional
  //   // creatorId: "YourTwitterCreatorId", // Optional
  //   images: ["https://yourwebsite.com/twitter-image.png"], // Must be an absolute URL
  // },
  // icons: { // Optional: Favicons
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png",
  // },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Optional: Prevents zooming on mobile if desired
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" }, // Matches --background light
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }, // Matches --background dark
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // Recommended for Next.js with class-based dark mode
      className={cn(
        "scroll-smooth", // Added for consistent smooth scrolling
        // Apply all font variables
        inter.variable,
        geistSans.variable, // From geist/font
        geistMono.variable, // From geist/font
        poppins.variable,
        montserrat.variable,
        roboto.variable,
        openSans.variable,
        lato.variable,
        raleway.variable
      )}
    >
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          "transition-colors duration-300 ease-in-out" // Smooth transition for color changes
        )}
      >
        {/* 
          A common pattern for layout structure, e.g., with a ThemeProvider for dark mode toggle
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem> 
        */}
        <div className="relative flex min-h-screen flex-col">
          {/* <SiteHeader /> // Example: Your site header component */}
          <main className="flex-1">{children}</main>
          {/* <SiteFooter /> // Example: Your site footer component */}
        </div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
