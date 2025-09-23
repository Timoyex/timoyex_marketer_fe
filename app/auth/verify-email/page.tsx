import type { Metadata } from "next";
import { FE_URL } from "@/app.config";
import VerifyEmailPage from "./components/verify-email";

export const metadata: Metadata = {
  title: "Verification | Affiliate Dashboard",
  description:
    "Verification page for Affiliate Dashboard. Verify your email to access your dashboard and manage your account.",
  keywords: ["auth", "login", "register", "Affiliate", "verify"],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "Auth | Affiliate Dashboard",
    description:
      "Verification page for Affiliate Dashboard. Verify your email to access your dashboard and manage your account.",
    type: "website",
    url: `${FE_URL}/auth/verify-email`,
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
      <VerifyEmailPage />
    </div>
  );
};

export default Page;
