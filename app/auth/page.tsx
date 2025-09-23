import type { Metadata } from "next";
import { FE_URL } from "@/app.config";
import Auth from "./components/auth";
import { Suspense } from "react";
import LandingPage from "../page";

export const metadata: Metadata = {
  title: "Auth | Affiliate Dashboard",
  description:
    "Authentication page for Affiliate Dashboard. Sign in or register to access your dashboard and manage your account.",
  keywords: ["auth", "login", "register", "Affiliate", "sign in"],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "Auth | Affiliate Dashboard",
    description:
      "Authentication page for Affiliate Dashboard. Sign in or register to access your dashboard and manage your account.",
    type: "website",
    url: `${FE_URL}/auth`,
    siteName: "Markerters Affiliate Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auth | Affiliate Dashboard",
    description:
      "Authentication page for Affiliate Dashboard. Sign in or register to access your dashboard and manage your account.",
    site: "@marketershq",
    creator: "@Ghosted34",
  },
};
const Page = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<LandingPage />}>
        <Auth />
      </Suspense>
    </div>
  );
};

export default Page;
