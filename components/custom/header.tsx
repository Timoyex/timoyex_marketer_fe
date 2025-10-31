"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, User, Settings, Menu, ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useUIStore } from "@/lib/stores";
import { useAuth } from "@/hooks";
import { useProfile } from "@/hooks/profile.hook";
import SkeletalHeaderDropDown from "./skeleton/Dropdoown";
import { useNotificationStore } from "@/lib/stores/notifications.store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useNotifications } from "@/hooks/notifications.hook";

export function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { profileQuery, isLoading, getError } = useProfile();

  const profile = profileQuery.data;

  const {
    setSidebarOpen, //set for moibile
  } = useUIStore();

  const { logout } = useAuth();

  const { notifications, markAllAsRead, markAsRead, unreadCount } =
    useNotificationStore();

  const { markAllAsRead: allRead, markAsRead: read } = useNotifications();

  // handle click (mark as read)
  const handleClick = (id: string) => {
    markAsRead(id);
    read(id);
  };

  const handleMarkAll = () => {
    markAllAsRead();
    allRead();
  };

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

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 sm:h-10 sm:w-10"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-72 sm:w-80 max-w-[calc(100vw-2rem)]"
            >
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="font-semibold text-sm">Notifications</span>
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkAll}>
                    Mark all as read
                  </Button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="text-sm text-muted-foreground px-2 py-4 text-center">
                  No notifications
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <AnimatePresence initial={false}>
                    {notifications.map((n) => {
                      return (
                        <motion.div
                          key={n.id}
                          className={`rounded-md border p-2 hover:bg-accent cursor-pointer`}
                          onClick={() => handleClick(n.id)}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          layout
                        >
                          <div className="flex flex-row gap-4 items-center">
                            <div className="font-medium">{n.title}</div>
                          </div>
                          {n.message && (
                            <div className="text-sm text-muted-foreground">
                              {n.message}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </PopoverContent>
          </Popover>
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
                  <Link
                    href="/login"
                    className="flex flex-row justify-center items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
