"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Shield,
  Download,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.85 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.73 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.25 },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 750 },
  { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18.5 },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rate: 110 },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", rate: 12 },
  { code: "EGP", symbol: "£E", name: "Egyptian Pound", rate: 31 },
  { code: "MAD", symbol: "DH", name: "Moroccan Dirham", rate: 10 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 110 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 6.5 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.35 },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", rate: 0.92 },
];

const timezones = [
  { value: "Africa/Lagos", label: "West Africa Time (WAT)" },
  { value: "Africa/Cairo", label: "Egypt Standard Time" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time" },
  { value: "Africa/Nairobi", label: "East Africa Time" },
  { value: "Africa/Casablanca", label: "Morocco Standard Time" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Toronto", label: "Eastern Time - Toronto" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time" },
  { value: "Europe/Berlin", label: "Central European Time - Berlin" },
  { value: "Europe/Rome", label: "Central European Time - Rome" },
  { value: "Asia/Tokyo", label: "Japan Standard Time" },
  { value: "Asia/Shanghai", label: "China Standard Time" },
  { value: "Asia/Kolkata", label: "India Standard Time" },
  { value: "Asia/Dubai", label: "Gulf Standard Time" },
  { value: "Australia/Sydney", label: "Australian Eastern Time" },
  { value: "Pacific/Auckland", label: "New Zealand Standard Time" },
];

export function SettingsSection() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: {
      active: true,
      announcements: true,
      teamUpdates: true,
      paymentAlerts: true,
      marketingEmails: false,
    },
    sms: {
      active: true,
      paymentAlerts: true,
      urgentUpdates: true,
      teamNotifications: false,
    },
    inApp: {
      active: true,
      allNotifications: true,
      sounds: true,
      desktop: true,
    },
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "Africa/Lagos", // Default to WAT timezone
    currency: "NGN", // Default to Nigerian Naira
    dateFormat: "MM/DD/YYYY",
  });

  const handleNotificationChange = (
    category: keyof typeof notifications,
    setting: string,
    value: boolean
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handlePreferenceChange = (
    setting: keyof typeof preferences,
    value: string
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [setting]: value,
    }));

    if (setting === "currency") {
      localStorage.setItem("selectedCurrency", value);
      // Trigger a custom event to notify other components of currency change
      window.dispatchEvent(
        new CustomEvent("currencyChanged", { detail: value })
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          Customize your dashboard, preferences notifications and account
          settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appearance Settings */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Settings className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose your preferred theme
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="flex items-center gap-2 h-auto p-3"
                  >
                    <Sun className="h-4 w-4" />
                    <span className="text-sm">Light</span>
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="flex items-center gap-2 h-auto p-3"
                  >
                    <Moon className="h-4 w-4" />
                    <span className="text-sm">Dark</span>
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => setTheme("system")}
                    className="flex items-center gap-2 h-auto p-3"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">System</span>
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Language & Region
                </Label>
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm">
                      Language
                    </Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) =>
                        handlePreferenceChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                        <SelectItem value="sw">Kiswahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm">
                      Timezone
                    </Label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) =>
                        handlePreferenceChange("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {timezones.map((timezone) => (
                          <SelectItem
                            key={timezone.value}
                            value={timezone.value}
                          >
                            {timezone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm">
                      Currency
                    </Label>
                    <Select
                      value={preferences.currency}
                      onValueChange={(value) =>
                        handlePreferenceChange("currency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.name} ({currency.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label
                    className="text-base font-medium"
                    htmlFor="email-active"
                  >
                    Email Notifications
                  </Label>
                </div>
                <Switch
                  id="email-active"
                  checked={notifications.email.active}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("email", "active", checked)
                  }
                />
              </div>

              <div className="space-y-3 ml-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="email-announcements"
                      className="text-sm font-medium"
                    >
                      Company Announcements
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Important updates and news
                    </p>
                  </div>
                  <Switch
                    id="email-announcements"
                    checked={notifications.email.announcements}
                    onCheckedChange={(checked) =>
                      handleNotificationChange(
                        "email",
                        "announcements",
                        checked
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-team" className="text-sm font-medium">
                      Team Updates
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      New team members and achievements
                    </p>
                  </div>
                  <Switch
                    id="email-team"
                    checked={notifications.email.teamUpdates}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("email", "teamUpdates", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="email-payments"
                      className="text-sm font-medium"
                    >
                      Payment Alerts
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Commission payments and withdrawals
                    </p>
                  </div>
                  <Switch
                    id="email-payments"
                    checked={notifications.email.paymentAlerts}
                    onCheckedChange={(checked) =>
                      handleNotificationChange(
                        "email",
                        "paymentAlerts",
                        checked
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="email-marketing"
                      className="text-sm font-medium"
                    >
                      Marketing Emails
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Promotional content and tips
                    </p>
                  </div>
                  <Switch
                    id="email-marketing"
                    checked={notifications.email.marketingEmails}
                    onCheckedChange={(checked) =>
                      handleNotificationChange(
                        "email",
                        "marketingEmails",
                        checked
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* SMS Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-medium" htmlFor="sms-active">
                    SMS Notifications
                  </Label>
                </div>
                <Switch
                  id="sms-active"
                  checked={notifications.sms.active}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("sms", "active", checked)
                  }
                />
              </div>

              <div className="space-y-3 ml-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="sms-payments"
                      className="text-sm font-medium"
                    >
                      Payment Alerts
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Instant payment notifications
                    </p>
                  </div>
                  <Switch
                    id="sms-payments"
                    checked={notifications.sms.paymentAlerts}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("sms", "paymentAlerts", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-urgent" className="text-sm font-medium">
                      Urgent Updates
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Critical account notifications
                    </p>
                  </div>
                  <Switch
                    id="sms-urgent"
                    checked={notifications.sms.urgentUpdates}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("sms", "urgentUpdates", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* In-App Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label
                    className="text-base font-medium"
                    htmlFor="in-app-active"
                  >
                    In-App Notifications
                  </Label>
                </div>
                <Switch
                  id="in-app-active"
                  checked={notifications.inApp.active}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("inApp", "active", checked)
                  }
                />
              </div>

              <div className="space-y-3 ml-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-all" className="text-sm font-medium">
                      All Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show all in-app notifications
                    </p>
                  </div>
                  <Switch
                    id="app-all"
                    checked={notifications.inApp.allNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange(
                        "inApp",
                        "allNotifications",
                        checked
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-sounds" className="text-sm font-medium">
                      Notification Sounds
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Play sound for notifications
                    </p>
                  </div>
                  <Switch
                    id="app-sounds"
                    checked={notifications.inApp.sounds}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("inApp", "sounds", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Section */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">Password</h4>
              <p className="text-sm text-muted-foreground">
                Last updated 3 months ago
              </p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">
                Login Sessions
              </h4>
              <p className="text-sm text-muted-foreground">
                Manage your active login sessions
              </p>
            </div>
            <Button variant="outline">View Sessions</Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Shield className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">Export Data</h4>
              <p className="text-sm text-muted-foreground">
                Download a copy of your account data
              </p>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">
                Data Retention
              </h4>
              <p className="text-sm text-muted-foreground">
                Manage how long we keep your data
              </p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div>
              <h4 className="font-medium text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Delete Account
              </h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
