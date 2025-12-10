import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FE_URL } from "@/app.config";

import { Suspense } from "react";
// import LandingPage from "@/app/page";
import { ResetPasswordPage } from "./components/reset-password";

export const metadata: Metadata = {
  title: "Reset Password | Affiliate Dashboard",
  description:
    "Reset Forgotten Password page for Affiliate Dashboard. Token is verified and new password is required",
  keywords: [
    "auth",
    "login",
    "register",
    "Affiliate",
    "sign in",
    "forgot-password",
    "reset-password",
  ],
  authors: [{ name: "Ghosted34" }],
  openGraph: {
    title: "Reset Password | Affiliate Dashboard",
    description:
      "Reset Forgotten Password page for Affiliate Dashboard. Token is verified and new password is required",
    type: "website",
    url: `${FE_URL}/reset-password`,
    siteName: "Timoyex Global Marketers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset Password | Affiliate Dashboard",
    description:
      "Reset Forgotten Password page for Affiliate Dashboard. Token is verified and new password is required",
    site: "@marketershq",
    creator: "@Ghosted34",
  },
};

type Props = {
  searchParams: Promise<{ token?: string }>; // Now a Promise!
};
const Page = async ({ searchParams }: Props) => {
  const params = await searchParams; // Await it
  const token = params.token;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="w-full h-full">
      <Suspense fallback={<br />}>
        <ResetPasswordPage token={token} />
      </Suspense>
    </div>
  );
};

export default Page;
