import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TelegramInit } from "@/components/TelegramInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFCE00",
};

export const metadata: Metadata = {
  title: "Real HR — Real Education AI HR Platforması",
  description: "Real Education AI Recruitment & Onboarding System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-amber-950/30 dark:via-[#09090b] dark:to-[#040405]">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <TelegramInit />
        {children}
      </body>
    </html>
  );
}
