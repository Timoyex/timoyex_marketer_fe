// app/(dashboard)/page.tsx
import { Metadata } from "next";
import { OverviewSection } from "./components/overview-section";
import { FE_URL } from "@/app.config";

export const metadata: Metadata = {
  title: "Overview | Affiliate Dashboard",
  description: "Overview of your affiliate account performance and stats",
  keywords: ["overview", "stats", "Affiliate", "dashboard"],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "Overview | Affiliate Dashboard",
    description: "Overview of your affiliate account performance and stats",
    type: "website",
    url: `${FE_URL}/overview`,
    siteName: "Markerters Affiliate Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Overview | Affiliate Dashboard",
    description: "Overview of your affiliate account performance and stats",
    site: "@marketershq",
    creator: "@Ghosted34",
  },
};

export default function DashboardOverviewPage() {
  return <OverviewSection />;
}
