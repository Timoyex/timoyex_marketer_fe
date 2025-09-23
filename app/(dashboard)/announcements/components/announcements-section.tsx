"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Megaphone,
  Bell,
  Calendar,
  User,
  TrendingUp,
  Gift,
  AlertCircle,
  Clock,
  Star,
  Award,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { InfoCard } from "@/components/custom/infocard";
import Demo from "@/components/custom/demo";

// Sample announcements data
const generalAnnouncements = [
  {
    id: 1,
    title: "New Commission Structure Launched",
    content:
      "We're excited to announce our enhanced commission structure with higher rates for top performers. Level 4 and 5 affiliates now earn up to 15% more on team commissions.",
    type: "update",
    priority: "high",
    date: "2024-03-20",
    author: "Admin Team",
    isRead: false,
  },
  {
    id: 2,
    title: "Q1 Performance Bonuses Available",
    content:
      "Congratulations to all affiliates who exceeded their Q1 targets! Bonus payments will be processed with your next regular payout. Check your earnings section for details.",
    type: "bonus",
    priority: "medium",
    date: "2024-03-18",
    author: "Finance Team",
    isRead: true,
  },
  {
    id: 3,
    title: "System Maintenance Scheduled",
    content:
      "Our platform will undergo scheduled maintenance on March 25th from 2:00 AM to 4:00 AM EST. During this time, the dashboard may be temporarily unavailable.",
    type: "maintenance",
    priority: "medium",
    date: "2024-03-15",
    author: "Tech Team",
    isRead: true,
  },
  {
    id: 4,
    title: "New Training Materials Available",
    content:
      "We've added comprehensive training modules covering advanced sales techniques and team building strategies. Access them through your learning portal.",
    type: "training",
    priority: "low",
    date: "2024-03-12",
    author: "Training Team",
    isRead: true,
  },
];

const personalNotifications = [
  {
    id: 1,
    title: "Congratulations! Level 4 Achieved",
    content:
      "You've successfully reached Level 4 with 89 direct recruits. Your new commission rate is now active and will apply to all future earnings.",
    type: "achievement",
    date: "2024-03-19",
    isRead: false,
  },
  {
    id: 2,
    title: "Payment Processed Successfully",
    content:
      "Your commission payment of $6,720 has been processed and will arrive in your account within 2-3 business days.",
    type: "payment",
    date: "2024-03-15",
    isRead: false,
  },
  {
    id: 3,
    title: "New Team Member Joined",
    content:
      "Sarah Johnson has joined your team as a direct recruit. Welcome them and help them get started with their affiliate journey.",
    type: "team",
    date: "2024-03-14",
    isRead: true,
  },
  {
    id: 4,
    title: "Monthly Target Reminder",
    content:
      "You're 85% towards your monthly recruitment target. Just 3 more recruits needed to unlock your bonus for March!",
    type: "reminder",
    date: "2024-03-10",
    isRead: true,
  },
  {
    id: 5,
    title: "Profile Update Required",
    content:
      "Please update your tax information in your profile settings to ensure uninterrupted payment processing.",
    type: "action",
    date: "2024-03-08",
    isRead: true,
  },
];

export function AnnouncementsSection() {
  const [activeTab, setActiveTab] = useState("announcements");
  const [announcementsPage, setAnnouncementsPage] = useState(1);
  const [notificationsPage, setNotificationsPage] = useState(1);
  const itemsPerPage = 3;

  const totalAnnouncementPages = Math.ceil(
    generalAnnouncements.length / itemsPerPage
  );
  const startAnnouncementIndex = (announcementsPage - 1) * itemsPerPage;
  const paginatedAnnouncements = generalAnnouncements.slice(
    startAnnouncementIndex,
    startAnnouncementIndex + itemsPerPage
  );

  const totalNotificationPages = Math.ceil(
    personalNotifications.length / itemsPerPage
  );
  const startNotificationIndex = (notificationsPage - 1) * itemsPerPage;
  const paginatedNotifications = personalNotifications.slice(
    startNotificationIndex,
    startNotificationIndex + itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "update":
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case "bonus":
        return <Gift className="h-5 w-5 text-green-600" />;
      case "maintenance":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "training":
        return <Star className="h-5 w-5 text-purple-600" />;
      default:
        return <Megaphone className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Award className="h-5 w-5 text-purple-600" />;
      case "payment":
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case "team":
        return <User className="h-5 w-5 text-blue-600" />;
      case "reminder":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "action":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "payment":
        return "bg-green-100 text-green-800 border-green-200";
      case "team":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "reminder":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "action":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const unreadAnnouncements = generalAnnouncements.filter(
    (a) => !a.isRead
  ).length;
  const unreadNotifications = personalNotifications.filter(
    (n) => !n.isRead
  ).length;

  const notificationStats = [
    {
      title: "Unread Announcements",
      icon: <Megaphone className="h-4 w-4 text-blue-600" />,
      value: unreadAnnouncements,
      desc: "New company updates",
    },
    {
      title: "Personal Notifications",
      icon: <Bell className="h-4 w-4 text-green-600" />,
      value: unreadNotifications,
      desc: "Requires your attention",
    },
  ];

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
            isDemo
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
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </div>

          <div className="space-y-4">
            {paginatedAnnouncements.map((announcement) => (
              <Card
                key={announcement.id}
                className={`bg-card border-border shadow-sm relative ${
                  !announcement.isRead ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <Demo />
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {getAnnouncementIcon(announcement.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base text-card-foreground">
                          {announcement.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            By {announcement.author}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            •
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(announcement.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={getPriorityColor(announcement.priority)}
                      >
                        {announcement.priority}
                      </Badge>
                      {!announcement.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {announcement.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalAnnouncementPages > 1 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Showing {startAnnouncementIndex + 1} to{" "}
                {Math.min(
                  startAnnouncementIndex + itemsPerPage,
                  generalAnnouncements.length
                )}{" "}
                of {generalAnnouncements.length} announcements
              </p>
              <div className="flex flex-wrap items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAnnouncementsPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={announcementsPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {announcementsPage} of {totalAnnouncementPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAnnouncementsPage((prev) =>
                      Math.min(prev + 1, totalAnnouncementPages)
                    )
                  }
                  disabled={announcementsPage === totalAnnouncementPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground">
              Your Notifications
            </h3>
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </div>

          <div className="space-y-4">
            {paginatedNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-card border-border shadow-sm ${
                  !notification.isRead ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-card-foreground flex-1 min-w-0">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge
                            variant="outline"
                            className={getTypeColor(notification.type)}
                          >
                            {notification.type}
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {notification.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalNotificationPages > 1 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Showing {startNotificationIndex + 1} to{" "}
                {Math.min(
                  startNotificationIndex + itemsPerPage,
                  personalNotifications.length
                )}{" "}
                of {personalNotifications.length} notifications
              </p>
              <div className="flex flex-wrap items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setNotificationsPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={notificationsPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {notificationsPage} of {totalNotificationPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setNotificationsPage((prev) =>
                      Math.min(prev + 1, totalNotificationPages)
                    )
                  }
                  disabled={notificationsPage === totalNotificationPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
