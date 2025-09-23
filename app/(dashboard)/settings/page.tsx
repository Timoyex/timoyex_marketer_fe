// app/(dashboard)/settings/page.tsx
import { Metadata } from "next";
import { SettingsSection } from "./components/settings-section";
import { FE_URL } from "@/app.config";

export const metadata: Metadata = {
  title: "Settings | Affiliate Dashboard",
  description: "Manage your account settings and preferences",
  keywords: ["settings", "Affiliate", "dashboard"],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "Settings | Affiliate Dashboard",
    description: "Manage your account settings and preferences",
    type: "website",
    url: `${FE_URL}/settings`,
    siteName: "Markerters Affiliate Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Settings | Affiliate Dashboard",
    description: "Manage your account settings and preferences",
    site: "@marketershq",
    creator: "@Ghosted34",
  },
};

export default function SettingsPage() {
  return <SettingsSection />;
}
