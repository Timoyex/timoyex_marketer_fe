import { Metadata } from "next";
import { EarningsSection } from "./components/earnings-section";
import { FE_URL } from "@/app.config";

export const metadata: Metadata = {
  title: "Earnings | Affiliate Dashboard",
  description: "Earnings and revenue information for your affiliate account",
  keywords: ["earning", "earnings", "revenue", "Affiliate"],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "Earnings | Affiliate Dashboard",
    description: "Earnings and revenue information for your affiliate account",
    type: "website",
    url: `${FE_URL}/earnings`,
    siteName: "Markerters Affiliate Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Earnings | Affiliate Dashboard",
    description: "Earnings and revenue information for your affiliate account",
    site: "@marketershq",
    creator: "@Ghosted34",
  },
};

export default function ProfilePage() {
  return <EarningsSection />;
}
