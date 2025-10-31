"use client";

import { ThemeProvider } from "@/components/custom/theme-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex items-center justify-center">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableColorScheme
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
