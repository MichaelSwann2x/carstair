import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carstair — CFD & Forex Journal",
  description: "Trading journal for CFD and forex. MetaTrader 5, Liquid Score, shareable PnL cards.",
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
      <body className="antialiased min-h-screen bg-[#050608] text-[#f1f5f9]">{children}</body>
    </html>
  );
}
