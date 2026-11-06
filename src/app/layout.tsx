import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Carstair Wi-Fi Tracker",
    template: "%s · Carstair",
  },
  description:
    "Is Carstair Wi-Fi on your flight? Check for Starlink availability on your flight up to three days before departure. Search by flight number.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Carstair Wi-Fi Tracker",
    description:
      "Is Carstair Wi-Fi on your flight? Check for Starlink availability on your flight up to three days before departure. Search by flight number.",
    type: "website",
  },
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
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
