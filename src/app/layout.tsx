import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carstair — Forex & CFD Journal · MT5 · Shareable PnL",
  description:
    "Trading journal for forex and CFD. MetaTrader 5 import, Liquid Score, downloadable PnL cards with custom media backgrounds.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#0a0b0f] text-[#e2e8f0]">{children}</body>
    </html>
  );
}
