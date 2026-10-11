import type { Metadata } from "next";
import "./globals.css";
import { WellnessReminder } from "@/components/WellnessReminder";

export const metadata: Metadata = {
  title: "CARSTAIR — Intelligence Infrastructure for Futures & Macro",
  description: "Systems for indices, FX, commodities and futures. Delayed quant previews, limited QUIN, GEX & IV walls.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-[#e8e8e8] antialiased min-h-screen">
        {children}
        <WellnessReminder />
      </body>
    </html>
  );
}
