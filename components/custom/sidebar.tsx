"use client";
import {
  Home,
  Users,
  DollarSign,
  Megaphone,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores";
import { useAuth } from "@/hooks";
import { useProfile } from "@/hooks/profile.hook";
import { Skeleton } from "../ui/skeleton";

// Define your sidebar items
const sidebarItems = [
  { id: "overview", label: "Overview", icon: Home, href: "/overview" },
  { id: "team", label: "My Team", icon: Users, href: "/team" },
  { id: "earnings", label: "Earnings", icon: DollarSign, href: "/earnings" },
  {
    id: "announcements",
    label: "Announcements",
    icon: Megaphone,
    href: "/announcements",
  },
];

export function Sidebar() {
  const {
    sidebarOpen, //mobile
    sidebarCollapsed, //desktop
    setSidebarOpen, //set for moibile
    toggleSidebarCollapsed, //toggle for desktop
    setSidebarCollapsed, //set for desktop
  } = useUIStore();

  const { profileQuery, isLoading, getError } = useProfile();
  const profile = profileQuery.data;

  const { logout } = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    return router.push("/login");
  };

  return (
    <>
      {/* Desktop Sidebar - Always rendered, conditionally styled */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:pt-14 lg:pt-16 transition-all duration-300 ease-in-out z-40",
          sidebarCollapsed ? "md:w-16" : "md:w-60 lg:w-64"
        )}
        onMouseEnter={() => {
          setSidebarCollapsed(false);
        }}
        onMouseLeave={() => {
          setSidebarCollapsed(true);
        }}
      >
        <div className="flex flex-col flex-1 min-h-0 bg-sidebar border-r border-sidebar-border">
          {/* Toggle Button for Desktop */}
          <div className="flex justify-end p-2 border-b border-sidebar-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebarCollapsed}
              className="h-8 w-8"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* User Profile Section */}
          <div
            className={cn(
              "border-b border-sidebar-border transition-all duration-300",
              sidebarCollapsed ? "p-2" : "p-3 lg:p-4"
            )}
          >
            <div
              className={cn(
                "flex items-center space-y-2 transition-all duration-300",
                sidebarCollapsed
                  ? "flex-col justify-center"
                  : "flex-col text-center"
              )}
            >
              <Avatar
                className={cn(
                  "transition-all duration-300",
                  sidebarCollapsed ? "h-8 w-8" : "h-12 w-12 lg:h-16 lg:w-16"
                )}
              >
                <AvatarImage
                  src={(profile?.avatar as string) || "/placeholder-user.jpg"}
                />
                <AvatarFallback
                  className={cn(
                    sidebarCollapsed ? "text-xs" : "text-sm lg:text-lg"
                  )}
                >
                  <AvatarImage src="/placeholder-user.jpg" />
                </AvatarFallback>
              </Avatar>

              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 }}
                >
                  <h3 className="font-semibold text-sidebar-foreground text-sm lg:text-base">
                    {isLoading ? (
                      <Skeleton className="inline-block" />
                    ) : (
                      `${profile?.firstName || ""} ${profile?.lastName || ""} `
                    )}
                  </h3>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="inline-block" />
                    ) : (
                      `Level ${profileQuery.data?.level || 0}`
                    )}
                  </p>
                  <div className="flex gap-1 flex-wrap justify-center mt-2">
                    {/*                    
                    <Badge variant="secondary" className="text-xs">
                      {isLoading ? <Skeleton /> : `🔥 Active Marketer`}
                    </Badge> */}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav
            className={cn(
              "flex-1 py-4 lg:py-6 space-y-1 lg:space-y-2 transition-all duration-300",
              sidebarCollapsed ? "px-2" : "px-3 lg:px-4"
            )}
          >
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <div key={item.id} className="relative group">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full transition-all duration-300",
                      sidebarCollapsed
                        ? "justify-center p-2"
                        : "justify-start gap-3",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  </Button>

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div
            className={cn(
              "py-4 lg:py-6 space-y-1 lg:space-y-2 border-t border-sidebar-border transition-all duration-300",
              sidebarCollapsed ? "px-2" : "px-3 lg:px-4"
            )}
          >
            <div className="relative group">
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300",
                  sidebarCollapsed
                    ? "justify-center p-2"
                    : "justify-start gap-3"
                )}
                asChild
              >
                <Link href="/login" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>Logout</span>}
                </Link>
              </Button>

              {/* Tooltip for collapsed logout */}
              {sidebarCollapsed && (
                <div
                  className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50"
                  onClick={handleLogout}
                >
                  Logout
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              onClick={closeMobileSidebar}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border md:hidden flex flex-col"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-end p-4 border-b border-sidebar-border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileSidebar}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile User Profile */}
              <div className="p-4 border-b border-sidebar-border">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        (profile?.avatar as string) || "/placeholder-user.jpg"
                      }
                    />
                    <AvatarFallback
                      className={cn(
                        sidebarCollapsed ? "text-xs" : "text-sm lg:text-lg"
                      )}
                    >
                      <AvatarImage src="/placeholder-user.jpg" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sidebar-foreground text-sm">
                      {isLoading ? (
                        <Skeleton className="inline-block" />
                      ) : (
                        `${profile?.firstName || ""} ${
                          profile?.lastName || ""
                        } `
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {" "}
                      {isLoading ? (
                        <Skeleton className="inline-block" />
                      ) : (
                        `Level ${profileQuery.data?.level || 0}`
                      )}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-center">
                    {/* <Badge variant="secondary" className="text-xs">
                      ⭐ Top Recruiter
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      🔥 Active Marketer
                    </Badge> */}
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      asChild
                      onClick={closeMobileSidebar}
                    >
                      <Link href={item.href}>
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
              </nav>

              {/* Mobile Logout */}
              <div className="px-4 py-6 space-y-2 border-t border-sidebar-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  asChild
                  onClick={closeMobileSidebar}
                >
                  <Link href="/login" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Link>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
