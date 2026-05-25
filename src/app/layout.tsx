import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "MediKaggle Insight | New Competition Analyzer",
  description:
    "Enter medical AI challenge constraints and get SOTA baseline recommendations with match-ranked pipeline templates.",
  icons: {
    icon: [
      { url: "/icon", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: "/icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans`}
      >
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed -left-40 top-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-sky-500/5 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed -right-40 top-1/4 -z-10 h-[28rem] w-[28rem] rounded-full bg-emerald-500/5 blur-3xl"
          aria-hidden
        />
        <div className="relative z-0 isolate">{children}</div>
      </body>
    </html>
  );
}
