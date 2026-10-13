import type { Metadata } from "next";
import "./globals.css";
import BubbleBackground from "@/components/BubbleBackground";

export const metadata: Metadata = {
  title: "CARSTAIR",
  description: "Charts, models, papers, world chat and board.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <BubbleBackground />
        <div className="page-wrap relative z-[1]">{children}</div>
      </body>
    </html>
  );
}
