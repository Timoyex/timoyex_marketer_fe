import type { Metadata } from "next";
import { FE_URL } from "@/app.config";

import { Suspense } from "react";
// import LandingPage from "@/app/page";
import { ForgotPasswordPage } from "./components/forgot-password";

export const metadata: Metadata = {
  title: "Forgot Password | Affiliate Dashboard",
  description:
    "Forgotten Password page for Affiliate Dashboard. Verify your email to get a reset token sent to your mail",
  keywords: [
    "auth",
    "login",
    "register",
    "Affiliate",
    "sign in",
    "forgot-password",
  ],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "Forgot Password | Affiliate Dashboard",
    description:
      "Forgotten Password page for Affiliate Dashboard. Verify your email to get a reset token sent to your mail",
    type: "website",
    url: `${FE_URL}/forgot-password`,
    siteName: "Timoyex Global Marketers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forgot Password | Affiliate Dashboard",
    description:
      "Forgotten Password page for Affiliate Dashboard. Verify your email to get a reset token sent to your mail",
    site: "@marketershq",
    creator: "@Ghosted34",
  },
};
const Page = () => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<br />}>
        <ForgotPasswordPage />
      </Suspense>
    </div>
  );
};

export default Page;
