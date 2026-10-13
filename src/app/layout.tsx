import type { Metadata } from "next";
import "./globals.css";
import Ambient from "@/components/Ambient";

export const metadata: Metadata = {
  title: "CARSTAIR",
  description: "Charts, models, papers, world, board",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Ambient />
        <div className="page">{children}</div>
      </body>
    </html>
  );
}
