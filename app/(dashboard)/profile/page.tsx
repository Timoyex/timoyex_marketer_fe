// app/(dashboard)/profile/page.tsx
import { Metadata } from "next";
import { FE_URL } from "@/app.config";
import { ProfileSection } from "./components/profile-section";

export const metadata: Metadata = {
  title: "Profile | Affiliate Dashboard",
  description: "Manage your profile information",
  keywords: ["profile", "information", "Affiliate", "dashboard"],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "Profile | Affiliate Dashboard",
    description: "Manage your profile information",
    type: "website",
    url: `${FE_URL}/profile`,
    siteName: "Markerters Affiliate Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile | Affiliate Dashboard",
    description: "Manage your profile information",
    site: "@marketershq",
    creator: "@Ghosted34",
  },
};

export default function ProfilePage() {
  return <ProfileSection />;
}
