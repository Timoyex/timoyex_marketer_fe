import type { Metadata } from "next";
import { FE_URL } from "@/app.config";
import EmailVerifiedPage from "./components/verify";
import { Suspense } from "react";
import LandingPage from "@/app/page";

export const metadata: Metadata = {
  title: "Verification | Affiliate Dashboard",
  description:
    "Verification page for Affiliate Dashboard. Verify your email to access your dashboard and manage your account.",
  keywords: ["auth", "login", "register", "Affiliate", "sign in"],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "Auth | Affiliate Dashboard",
    description:
      "Verification page for Affiliate Dashboard. Verify your email to access your dashboard and manage your account.",
    type: "website",
    url: `${FE_URL}/verify`,
    siteName: "Markerters Affiliate Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auth | Affiliate Dashboard",
    description:
      "Verification page for Affiliate Dashboard. Verify your email to access your dashboard and manage your account.",
    site: "@marketershq",
    creator: "@Ghosted34",
  },
};
const Page = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<LandingPage />}>
        <EmailVerifiedPage />
      </Suspense>
    </div>
  );
};

export default Page;
