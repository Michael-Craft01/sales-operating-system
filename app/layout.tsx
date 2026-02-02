import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/Layout/Shell";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHOC | Sales OS",
  description: "Personal Sales Operating System - Close more deals with CHOC",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "CHOC | Sales OS",
    description: "Personal Sales Operating System - Close more deals with CHOC",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CHOC Sales OS",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CHOC | Sales OS",
    description: "Personal Sales Operating System - Close more deals with CHOC",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased flex bg-background text-foreground min-h-screen`}
      >
        <Providers>
          <Shell>
            {children}
            <Toaster />
          </Shell>
        </Providers>
      </body>
    </html>
  );
}
