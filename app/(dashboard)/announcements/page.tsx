import { Metadata } from "next";
import { AnnouncementsSection } from "./components/announcements-section";
import { FE_URL } from "@/app.config";

export const metadata: Metadata = {
  title: "Announcements | Affiliate Dashboard",
  description: "Announcements and notifications for your affiliate account",
  keywords: [
    "announcement",
    "notification",
    "notifications",
    "Affiliate",
    "announcements",
  ],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "Announcements | Affiliate Dashboard",
    description: "Announcements and notifications for your affiliate account",
    type: "website",
    url: `${FE_URL}/announcements`,
    siteName: "Markerters Affiliate Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auth | Affiliate Dashboard",
    description: "Announcements and notifications for your affiliate account",
    site: "@marketershq",
    creator: "@Ghosted34",
  },
};

export default function AnnouncementsPage() {
  return <AnnouncementsSection />;
}
