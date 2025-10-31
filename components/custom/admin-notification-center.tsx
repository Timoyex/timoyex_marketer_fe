"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle,
  DollarSign,
  TrendingUp,
  KanbanSquareDashed as MarkAsUnread,
  Archive,
} from "lucide-react";
import useSWR from "swr";

interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  marketer_id: string;
  data: any;
  status: "unread" | "read" | "archived";
  created_at: string;
  marketers?: {
    name: string;
    level: number;
    team_revenue: number;
    monthly_revenue: number;
  };
}

interface NotificationCounts {
  total: number;
  unread: number;
  payment_qualification: number;
  level_promotion: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AdminNotificationCenter() {
  const [filter, setFilter] = useState<
    "all" | "unread" | "payment_qualification"
  >("unread");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );

  const { data, error, mutate } = useSWR(
    `/api/admin/notifications?status=${filter}&limit=100`,
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: true,
    }
  );

  const notifications: AdminNotification[] = data?.notifications || [];
  const counts: NotificationCounts = data?.counts || {
    total: 0,
    unread: 0,
    payment_qualification: 0,
    level_promotion: 0,
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds, status: "read" }),
      });
      mutate();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const markAsUnread = async (notificationIds: string[]) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds, status: "unread" }),
      });
      mutate();
    } catch (error) {
      console.error("Failed to mark notifications as unread:", error);
    }
  };

  const archiveNotifications = async (notificationIds: string[]) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds, status: "archived" }),
      });
      mutate();
      setSelectedNotifications([]);
    } catch (error) {
      console.error("Failed to archive notifications:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment_qualification":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "level_promotion":
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "payment_qualification":
        return "bg-green-50 border-green-200";
      case "level_promotion":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Admin Notifications
            </h3>
            <p className="text-sm text-gray-600">
              {counts.unread} unread • {counts.payment_qualification} payment
              qualifications
            </p>
          </div>
        </div>

        {counts.unread > 0 && (
          <Badge variant="destructive" className="bg-red-500">
            {counts.unread}
          </Badge>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={
            filter === "all" ? "bg-orange-500 hover:bg-orange-600" : ""
          }
        >
          All ({counts.total})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
          className={
            filter === "unread" ? "bg-orange-500 hover:bg-orange-600" : ""
          }
        >
          Unread ({counts.unread})
        </Button>
        <Button
          variant={filter === "payment_qualification" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("payment_qualification")}
          className={
            filter === "payment_qualification"
              ? "bg-orange-500 hover:bg-orange-600"
              : ""
          }
        >
          <DollarSign className="w-4 h-4 mr-1" />
          Payments ({counts.payment_qualification})
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600 mr-2">
            {selectedNotifications.length} selected
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => markAsRead(selectedNotifications)}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Mark Read
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => markAsUnread(selectedNotifications)}
          >
            <MarkAsUnread className="w-4 h-4 mr-1" />
            Mark Unread
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => archiveNotifications(selectedNotifications)}
          >
            <Archive className="w-4 h-4 mr-1" />
            Archive
          </Button>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No notifications found</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                notification.status === "unread"
                  ? getNotificationColor(notification.type)
                  : "bg-white border-gray-200"
              } ${
                selectedNotifications.includes(notification.id)
                  ? "ring-2 ring-orange-500"
                  : ""
              }`}
              onClick={() => {
                if (selectedNotifications.includes(notification.id)) {
                  setSelectedNotifications((prev) =>
                    prev.filter((id) => id !== notification.id)
                  );
                } else {
                  setSelectedNotifications((prev) => [
                    ...prev,
                    notification.id,
                  ]);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => {}}
                  className="mt-1"
                />

                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4
                        className={`text-sm font-medium ${
                          notification.status === "unread"
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <p
                        className={`text-sm mt-1 ${
                          notification.status === "unread"
                            ? "text-gray-700"
                            : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>

                      {/* Additional data for payment qualifications */}
                      {notification.type === "payment_qualification" &&
                        notification.data && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                            <div className="flex justify-between">
                              <span>
                                Marketer: {notification.data.marketer_name}
                              </span>
                              <span>Level: {notification.data.level}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>
                                Team Revenue: ₦
                                {(
                                  notification.data.team_revenue / 1000000
                                ).toFixed(1)}
                                M
                              </span>
                              <span className="font-semibold text-green-700">
                                Salary: ₦
                                {notification.data.salary_amount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 ml-3">
                      {notification.status === "unread" && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {counts.unread > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              markAsRead(
                notifications
                  .filter((n) => n.status === "unread")
                  .map((n) => n.id)
              )
            }
            className="w-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      )}
    </Card>
  );
}
