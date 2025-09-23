import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query.provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Affiliate Dashboard",
  description: "Modern affiliate marketer dashboard",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="font-sans">
        <Toaster position="bottom-center" />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
