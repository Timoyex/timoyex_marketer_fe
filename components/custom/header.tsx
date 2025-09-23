"use client";

import { Bell, User, Settings, Menu, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";
import { useUIStore } from "@/lib/stores";
import { useAuth } from "@/hooks";
import { useProfile } from "@/hooks/profile.hook";
import SkeletalHeaderDropDown from "./skeleton/Dropdoown";

export function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { profileQuery, isLoading, getError } = useProfile();
  const profile = profileQuery.data;

  const {
    setSidebarOpen, //set for moibile
  } = useUIStore();

  const { logout } = useAuth();

  const notifications = [
    {
      id: 1,
      message: "John Doe joined your team",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      message: "Commission payout processed",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 3,
      message: "New announcement posted",
      time: "2 days ago",
      unread: false,
    },
    {
      id: 4,
      message: "Level 3 achievement unlocked",
      time: "3 days ago",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 sm:h-10 sm:w-10"
            onClick={() => {
              setSidebarOpen(true);
            }}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
            Marketer Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <DropdownMenu
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 sm:h-10 sm:w-10"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-xs"
                >
                  {notifications.filter((n) => n.unread).length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 sm:w-80 max-w-[calc(100vw-2rem)]"
            >
              <div className="p-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          notification.unread
                            ? "font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {notification.message}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}

          {isLoading ? (
            <SkeletalHeaderDropDown />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 h-8 sm:h-10"
                >
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage src={profile?.avatar as string} />
                    <AvatarFallback>
                      <AvatarImage src="/placeholder-user.jpg" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block text-sm">
                    {`${profile?.firstName || ""} ${profile?.lastName || ""} `}
                  </span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
