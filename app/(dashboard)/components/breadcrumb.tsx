// components/breadcrumb.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routeLabels: Record<string, string> = {
  "/overview": "Overview",
  "/team": "My Team",
  "/earnings": "Earnings",
  "/announcements": "Announcements",
  "/profile": "Profile",
  "/settings": "Settings",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/overview" className="hover:text-gray-900 transition-colors">
        Dashboard
      </Link>
      {pathSegments.length > 0 && (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="font-medium text-gray-900">
            {routeLabels[pathname] || pathSegments[pathSegments.length - 1]}
          </span>
        </>
      )}
    </nav>
  );
}
