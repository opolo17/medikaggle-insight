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
  title: "MediKaggle Insight | Clinical AI Experiment Navigator",
  description:
    "Navigate medical Kaggle competitions with interactive filters, SOTA model trends, and copy-ready PyTorch pipelines.",
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
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950" />
        <div className="pointer-events-none fixed -left-40 top-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-sky-500/5 blur-3xl" />
        <div className="pointer-events-none fixed -right-40 top-1/4 -z-10 h-[28rem] w-[28rem] rounded-full bg-emerald-500/5 blur-3xl" />
        {children}
      </body>
    </html>
  );
}
