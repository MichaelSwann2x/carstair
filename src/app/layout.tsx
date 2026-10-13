import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CARSTAIR",
  description: "Charts, models, papers, world chat and board for serious market work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
