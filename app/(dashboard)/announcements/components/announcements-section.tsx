"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Megaphone,
  Bell,
  Calendar,
  User,
  AlertCircle,
  Award,
  DollarSign,
  Check,
  Banknote,
} from "lucide-react";
import { InfoCard } from "@/components/custom/infocard";
import { formatDate } from "@/lib/utils";
import { PaginatedTable } from "@/components/custom/dataTable";
import { useNotifications } from "@/hooks/notifications.hook";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NotificationType =
  | "payment"
  | "team"
  | "achievement"
  | "action"
  | "commission"
  | "bonus"
  | "earning"
  | "maintenance";

const getNotificationIcon = (type: NotificationType | unknown) => {
  switch (type) {
    case "achievement":
      return <Award className="h-5 w-5 text-purple-600" />;
    case "payment":
      return <DollarSign className="h-5 w-5 text-green-600" />;
    case "earning":
      return <Banknote className="h-5 w-5 text-cyan-600" />;
    case "team":
      return <User className="h-5 w-5 text-blue-600" />;
    case "action":
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

const getPriorityColor = (
  priority: "high" | "low" | "medium" | "urgent" | unknown
) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getTypeColor = (
  type: "payment" | "team" | "achievement" | "action" | "earning"
) => {
  switch (type) {
    case "achievement":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "payment":
      return "bg-green-100 text-green-800 border-green-200";
    case "earning":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "team":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "action":
      return "bg-orange-100 text-orange-800 border-orange-200";

    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
      <Megaphone className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No notifications yet.</h3>
    <p className="text-muted-foreground text-center max-w-md">
      You're all caught up! Check back later for new announcements and updates.
    </p>
  </div>
);

export function AnnouncementsSection() {
  const [activeTab, setActiveTab] = useState("announcements");
  const [infoCursor, setInfoCursor] = useState<string | undefined>(undefined);
  const [generalCursor, setGeneralCursor] = useState<string | undefined>(
    undefined
  );
  const [infoCursorHistory, setInfoCursorHistory] = useState<
    (string | undefined)[]
  >([]);
  const [generalCursorHistory, setGeneralCursorHistory] = useState<
    (string | undefined)[]
  >([]);

  const { markAsRead, markTypeAsRead } = useNotifications();
  const { notificationsTypeQuery: infoQuery, isTypeLoading: infoLoading } =
    useNotifications(
      {
        limit: 3,
        cursor: infoCursor,
      },
      "info"
    );

  const {
    notificationsTypeQuery: generalQuery,
    isTypeLoading: generalLoading,
  } = useNotifications(
    {
      limit: 3,
      cursor: generalCursor,
    },
    "general"
  );

  // Navigation handlers
  const handleNextPage = (
    data: Record<string, any>,
    type: "info" | "general"
  ) => {
    if (data?.nextCursor) {
      switch (type) {
        case "info":
          setInfoCursorHistory((prev) => [...prev, infoCursor]);
          setInfoCursor(data.nextCursor);
          break;
        case "general":
          setGeneralCursorHistory((prev) => [...prev, generalCursor]);
          setGeneralCursor(data.nextCursor);
          break;

        default:
          break;
      }
    }
  };

  const handlePreviousPage = (
    data: Record<string, any>,
    type: "info" | "general"
  ) => {
    if (data?.prevCursor) {
      // Go back to previous cursor

      switch (type) {
        case "info":
          let previousCursor = infoCursorHistory[infoCursorHistory.length - 1];
          setInfoCursorHistory((prev) => prev.slice(0, -1));
          setInfoCursor(previousCursor);
          break;
        case "general":
          previousCursor =
            generalCursorHistory[generalCursorHistory.length - 1];
          setGeneralCursorHistory((prev) => prev.slice(0, -1));
          setGeneralCursor(previousCursor);
          break;

        default:
          break;
      }
    }
  };

  const handleFirstPage = (type: "info" | "general") => {
    switch (type) {
      case "info":
        setInfoCursor(undefined);
        setInfoCursorHistory([]);
        break;
      case "general":
        setGeneralCursor(undefined);
        setGeneralCursorHistory([]);
        break;

      default:
        break;
    }
  };

  // Determine button states
  const canGoNext = (data: Record<string, any>) =>
    Boolean(data?.hasMore && data?.nextCursor);
  const canGoPrevious = (data: Record<string, any>) =>
    Boolean(data?.prevCursor);
  const isFirstPage = (type: "info" | "general") => {
    switch (type) {
      case "info":
        return infoCursor === undefined;

      case "general":
        return generalCursor === undefined;
      default:
        break;
    }
  };

  const unreadAnnouncements = generalQuery.data?.unreadCount || 0;
  const unreadNotifications = infoQuery.data?.unreadCount || 0;

  const notificationStats = [
    {
      title: "Unread Announcements",
      icon: <Megaphone className="h-4 w-4 text-blue-600" />,
      value: generalQuery.data?.unreadCount || 0,
      desc: "New company updates",
    },
    {
      title: "Personal Notifications",
      icon: <Bell className="h-4 w-4 text-green-600" />,
      value: infoQuery.data?.unreadCount || 0,
      desc: "Requires your attention",
    },
  ];

  const renderNotification = (notification: Record<string, any>) => (
    <Card
      key={notification.id}
      className={`bg-card border-border shadow-sm ${
        !notification.isRead ? "ring-2 ring-primary/20" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            {getNotificationIcon(notification.messageType)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-card-foreground flex-1 min-w-0">
                {notification.title}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {notification.message}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {formatDate(notification.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              {notification.type === "info" && (
                <Badge
                  variant="outline"
                  className={getTypeColor(notification.messageType)}
                >
                  {notification.messageType || "action"}
                </Badge>
              )}

              {notification.type === "general" && (
                <Badge
                  variant="outline"
                  className={getPriorityColor(notification.priority)}
                >
                  {notification.priority}
                </Badge>
              )}
              {!notification.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>

            {!notification.isRead && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as read</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          Announcements & Notifications
        </h2>
        <p className="text-muted-foreground">
          Stay updated with the latest news and personal notifications.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
        {notificationStats?.map((stat) => (
          <InfoCard
            title={stat.title}
            desc={stat.desc}
            icon={stat.icon}
            value={stat.value}
            key={stat.title}
          />
        ))}
      </div>

      {/* Tabs for Announcements and Notifications */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-auto sm:h-10">
          <TabsTrigger
            value="announcements"
            className="flex items-center gap-2 justify-center py-2"
          >
            <Megaphone className="h-4 w-4" />
            General Announcements
            {unreadAnnouncements > 0 && (
              <Badge
                variant="destructive"
                className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadAnnouncements}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 justify-center py-2"
          >
            <Bell className="h-4 w-4" />
            Personal Notifications
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground">
              Company Announcements
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => markTypeAsRead("general")}
            >
              Mark All as Read
            </Button>
          </div>

          <PaginatedTable
            data={generalQuery.data?.notifications || []}
            renderItem={renderNotification}
            emptyState={<EmptyState />}
            handleFirst={() => handleFirstPage("general")}
            handleNextPage={() =>
              handleNextPage(generalQuery.data || [], "general")
            }
            handlePrevPage={() =>
              handlePreviousPage(generalQuery.data || [], "general")
            }
            canGoNext={canGoNext(generalQuery.data || {})}
            canGoPrev={canGoPrevious(generalQuery.data || {})}
            isFirstPage={() => isFirstPage("general")}
            isLoading={generalLoading}
            hasMore={!!generalQuery.data?.nextCursor}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground">
              Your Notifications
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => markTypeAsRead("info")}
            >
              Mark All as Read
            </Button>
          </div>

          <PaginatedTable
            data={infoQuery.data?.notifications || []}
            renderItem={renderNotification}
            emptyState={<EmptyState />}
            handleFirst={() => handleFirstPage("info")}
            handleNextPage={() => handleNextPage(infoQuery.data || [], "info")}
            handlePrevPage={() =>
              handlePreviousPage(infoQuery.data || [], "info")
            }
            canGoNext={canGoNext(infoQuery.data || {})}
            canGoPrev={canGoPrevious(infoQuery.data || {})}
            isFirstPage={() => isFirstPage("info")}
            isLoading={infoLoading}
            hasMore={!!infoQuery.data?.nextCursor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
