import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carstair Wi-Fi Tracker",
  description:
    "Is Carstair Wi-Fi on your flight? Check for Starlink availability on your flight up to three days before departure. Search by flight number.",
  openGraph: {
    title: "Carstair Wi-Fi Tracker",
    description:
      "Is Carstair Wi-Fi on your flight? Check for Starlink availability on your flight up to three days before departure. Search by flight number.",
    type: "website",
  },
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
