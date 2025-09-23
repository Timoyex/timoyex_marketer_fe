// app/(dashboard)/team/page.tsx
import { Metadata } from "next";
import { TeamSection } from "./components/team-section";
import { FE_URL } from "@/app.config";

export const metadata: Metadata = {
  title: "My Team | Affiliate Dashboard",
  description: "Manage your team members and their roles",
  keywords: ["team", "my team", "roles", "Affiliate", "members"],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "My Team | Affiliate Dashboard",
    description: "Manage your team members and their roles",
    type: "website",
    url: `${FE_URL}/team`,
    siteName: "Markerters Affiliate Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Team | Affiliate Dashboard",
    description: "Manage your team members and their roles",
    site: "@marketershq",
    creator: "@Ghosted34",
  },
};

export default function TeamPage() {
  return <TeamSection />;
}
