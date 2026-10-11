import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CARSTAIR — Intelligence for futures, FX & commodities",
  description:
    "Charts, Nico trading AI, and strategy tools for indices, forex, commodities and futures. Educational platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
