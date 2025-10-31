"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Trash2,
  AlertTriangle,
  Edit3,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { currencies, timezones } from "@/lib/constants";
import { cleanPayload, getChangedValues } from "@/lib/form.utils";
import { useSettings } from "@/hooks/settings.hook";
import { toast } from "sonner";
import { NotificationSettings, Preferences } from "@/lib/api";
import { cn } from "@/lib/utils";

const currencyCode = currencies.map((c) => c.code);
const zones = timezones.map((t) => t.value);

// Schemas
const preferenceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).nullish(),
  timezone: z
    .string()
    .refine((val) => zones.includes(val), "Invalid timezone")
    .nullish(),
  currency: z
    .string()
    .refine((val) => currencyCode.includes(val), "Invalid currency code")
    .nullish(),
});

const emailNotificationSettingsSchema = z.object({
  isActive: z.boolean(),
  companyAnnouncements: z.boolean(),
  teamUpdates: z.boolean(),
  paymentAlerts: z.boolean(),
  marketingEmails: z.boolean(),
});

const smsNotificationSettingsSchema = z.object({
  isActive: z.boolean(),
  paymentAlerts: z.boolean(),
  urgentUpdates: z.boolean(),
});

const inAppNotificationSettingsSchema = z.object({
  isActive: z.boolean(),
  allNotifications: z.boolean(),
  notificationSounds: z.boolean(),
});

export const notificationsSchema = z.object({
  email: emailNotificationSettingsSchema,
  sms: smsNotificationSettingsSchema,
  inApp: inAppNotificationSettingsSchema,
});

export function SettingsSection() {
  const { settingsQuery, updateSettings, isLoading } = useSettings();
  const { setTheme } = useTheme();

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [updatingSections, setUpdatingSections] = useState<
    Record<string, boolean>
  >({});

  const preferencesForm = useForm({
    resolver: zodResolver(preferenceSchema),
    defaultValues: async () => {
      const data = settingsQuery.data?.preferences;

      return {
        theme: data?.theme ?? "system",
        timezone: data?.timezone ?? "Africa/Lagos",
        currency: data?.currency ?? "NGN",
      };
    },
  });

  const notificationsForm = useForm({
    resolver: zodResolver(notificationsSchema),
    defaultValues: async () => {
      const data = settingsQuery.data?.notifications;
      return {
        email: {
          isActive: data?.email?.isActive ?? false,
          companyAnnouncements: data?.email?.companyAnnouncements ?? false,
          teamUpdates: data?.email?.teamUpdates ?? false,
          paymentAlerts: data?.email?.paymentAlerts ?? false,
          marketingEmails: data?.email?.marketingEmails ?? false,
        },
        sms: {
          isActive: data?.sms?.isActive ?? false,
          paymentAlerts: data?.sms?.paymentAlerts ?? false,
          urgentUpdates: data?.sms?.urgentUpdates ?? false,
        },
        inApp: {
          isActive: data?.inApp?.isActive ?? false,
          allNotifications: data?.inApp?.allNotifications ?? false,
          notificationSounds: data?.inApp?.notificationSounds ?? false,
        },
      };
    },
  });

  // Reset forms when backend data loads
  useEffect(() => {
    if (settingsQuery.data?.preferences) {
      preferencesForm.reset(settingsQuery.data.preferences);
    }
    if (settingsQuery.data?.notifications) {
      notificationsForm.reset(settingsQuery.data.notifications);
    }
  }, [settingsQuery.data, preferencesForm, notificationsForm]);

  // Section Header Component
  const SectionHeader = ({
    title,
    icon: Icon,
    sectionKey,
  }: {
    title: string;
    icon: any;
    sectionKey: "preferences" | "notifications";
  }) => {
    const isEditing = editingSection === sectionKey;
    const isUpdating = updatingSections?.[sectionKey] ?? false;

    return (
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        {!isEditing ? (
          <Button
            onClick={() => setEditingSection(sectionKey)}
            disabled={isUpdating}
            className="gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleSave(sectionKey)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancel(sectionKey)}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </CardHeader>
    );
  };

  // Save handler
  const handleSave = async (sectionKey: string) => {
    setUpdatingSections((prev) => ({ ...prev, [sectionKey]: true }));

    const formMap: Record<string, { form: any }> = {
      preferences: { form: preferencesForm },
      notifications: { form: notificationsForm },
    };

    const selected = formMap[sectionKey];

    if (!selected) {
      setUpdatingSections((prev) => ({ ...prev, [sectionKey]: false }));
      return;
    }

    const { form } = selected;

    // Validate form
    if (!(await form.trigger())) {
      setUpdatingSections((prev) => ({ ...prev, [sectionKey]: false }));
      return;
    }

    // Wait for next tick to ensure dirty fields are updated
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Get changed values
    const changedValues = getChangedValues(
      form.formState.dirtyFields,
      form.getValues()
    );

    console.log("=== DETAILED FORM DEBUG ===");
    console.log("Section:", sectionKey);
    console.log("Raw form values:", form.getValues());
    console.log("Raw dirty fields:", form.formState.dirtyFields);
    console.log("Form isDirty:", form.formState.isDirty);
    console.log("Changed values:", changedValues);

    if (Object.keys(changedValues).length <= 0) {
      toast.info("No changes made");
      setUpdatingSections((prev) => ({ ...prev, [sectionKey]: false }));
      return;
    }

    const cleanedValues = cleanPayload(changedValues);

    console.log("Cleaned payload:", cleanedValues);

    // Handle theme change - apply after successful save
    const themeValue = cleanedValues.theme;

    // Call the update settings mutation

    console.log({ sectionKey: cleanedValues });

    switch (sectionKey) {
      case "preferences":
        updateSettings({ preferences: cleanedValues, notifications: {} });
        break;
      case "notifications":
        updateSettings({ notifications: cleanedValues, preferences: {} });
        break;

      default:
        break;
    }

    setUpdatingSections((prev) => ({ ...prev, [sectionKey]: false }));
    setEditingSection(null);
  };

  // Cancel handler
  const handleCancel = (sectionKey: string) => {
    const formMap: Record<string, { form: any }> = {
      preferences: { form: preferencesForm },
      notifications: { form: notificationsForm },
    };

    const selected = formMap[sectionKey];
    if (!selected) return;

    const { form } = selected;

    // Reset form to default values
    form.reset();
    switch (sectionKey) {
      case "preferences":
        preferencesForm.reset();
        const previousTheme = form.formState.defaultValues?.theme;
        if (previousTheme) {
          setTheme(previousTheme);
        }
        break;
      case "notifications":
        notificationsForm.reset();
        break;
    }
    setEditingSection(null);
  };

  const isPreferencesEditing = editingSection === "preferences";
  const isNotificationsEditing = editingSection === "notifications";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const emailActive = notificationsForm.watch("email.isActive");
  const smsActive = notificationsForm.watch("sms.isActive");
  const inAppActive = notificationsForm.watch("inApp.isActive");

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
          <SectionHeader
            title="Appearance"
            icon={Settings}
            sectionKey="preferences"
          />
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose your preferred theme
                </p>
                <Controller
                  name="theme"
                  control={preferencesForm.control}
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        type="button"
                        variant={
                          field.value === "light" ? "default" : "outline"
                        }
                        onClick={() => {
                          if (field.value !== "light") {
                            field.onChange("light");
                            setTheme("light");
                          }
                        }}
                        disabled={!isPreferencesEditing}
                        aria-pressed={field.value === "light"}
                        className="flex items-center gap-2 h-auto p-3"
                      >
                        <Sun className="h-4 w-4" />
                        <span className="text-sm">Light</span>
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "dark" ? "default" : "outline"}
                        onClick={() => {
                          if (field.value !== "dark") {
                            field.onChange("dark");
                            setTheme("dark");
                          }
                        }}
                        disabled={!isPreferencesEditing}
                        aria-pressed={field.value === "dark"}
                        className="flex items-center gap-2 h-auto p-3"
                      >
                        <Moon className="h-4 w-4" />
                        <span className="text-sm">Dark</span>
                      </Button>
                      <Button
                        type="button"
                        variant={
                          field.value === "system" ? "default" : "outline"
                        }
                        onClick={() => {
                          if (field.value !== "system") {
                            field.onChange("system");
                            setTheme("system");
                          }
                        }}
                        disabled={!isPreferencesEditing}
                        aria-pressed={field.value === "system"}
                        className="flex items-center gap-2 h-auto p-3"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="text-sm">System</span>
                      </Button>
                    </div>
                  )}
                />
                {preferencesForm.formState.errors.theme && (
                  <p className="text-sm text-destructive mt-1">
                    {preferencesForm.formState.errors.theme.message}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Currency & Region
                </Label>
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm">
                      Timezone
                    </Label>
                    <Controller
                      name="timezone"
                      control={preferencesForm.control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          disabled={!isPreferencesEditing}
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
                      )}
                    />
                    {preferencesForm.formState.errors.timezone && (
                      <p className="text-sm text-destructive mt-1">
                        {preferencesForm.formState.errors.timezone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm">
                      Currency
                    </Label>
                    <Controller
                      name="currency"
                      control={preferencesForm.control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          disabled={!isPreferencesEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {currencies.map((currency) => (
                              <SelectItem
                                key={currency.code}
                                value={currency.code}
                              >
                                {currency.name} ({currency.symbol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {preferencesForm.formState.errors.currency && (
                      <p className="text-sm text-destructive mt-1">
                        {preferencesForm.formState.errors.currency.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border-border shadow-sm">
          <SectionHeader
            title="Notifications"
            icon={Bell}
            sectionKey="notifications"
          />
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
                <Controller
                  name="email.isActive"
                  control={notificationsForm.control}
                  render={({ field }) => (
                    <Switch
                      id="email-active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isNotificationsEditing}
                    />
                  )}
                />
              </div>

              <div
                className={cn(
                  "space-y-3 ml-6 transition-all duration-200",
                  !emailActive && "opacity-50 pointer-events-none"
                )}
              >
                {!emailActive && (
                  <p className="text-xs text-muted-foreground italic mb-2">
                    Enable email notifications to customize which types you
                    receive.
                  </p>
                )}
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
                  <Controller
                    name="email.companyAnnouncements"
                    control={notificationsForm.control}
                    render={({ field }) => (
                      <Switch
                        id="email-announcements"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isNotificationsEditing}
                      />
                    )}
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
                  <Controller
                    name="email.teamUpdates"
                    control={notificationsForm.control}
                    render={({ field }) => (
                      <Switch
                        id="email-team"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isNotificationsEditing}
                      />
                    )}
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
                  <Controller
                    name="email.paymentAlerts"
                    control={notificationsForm.control}
                    render={({ field }) => (
                      <Switch
                        id="email-payments"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isNotificationsEditing}
                      />
                    )}
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
                  <Controller
                    name="email.marketingEmails"
                    control={notificationsForm.control}
                    render={({ field }) => (
                      <Switch
                        id="email-marketing"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isNotificationsEditing}
                      />
                    )}
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
                <Controller
                  name="sms.isActive"
                  control={notificationsForm.control}
                  render={({ field }) => (
                    <Switch
                      id="sms-active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isNotificationsEditing}
                    />
                  )}
                />
              </div>

              <div
                className={cn(
                  "space-y-3 ml-6 transition-all duration-200",
                  !smsActive && "opacity-50 pointer-events-none"
                )}
              >
                {!smsActive && (
                  <p className="text-xs text-muted-foreground italic mb-2">
                    Enable SMS notifications to customize which alerts you
                    receive.
                  </p>
                )}
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
                  <Controller
                    name="sms.paymentAlerts"
                    control={notificationsForm.control}
                    render={({ field }) => (
                      <Switch
                        id="sms-payments"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isNotificationsEditing}
                      />
                    )}
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
                  <Controller
                    name="sms.urgentUpdates"
                    control={notificationsForm.control}
                    render={({ field }) => (
                      <Switch
                        id="sms-urgent"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isNotificationsEditing}
                      />
                    )}
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
                <Controller
                  name="inApp.isActive"
                  control={notificationsForm.control}
                  render={({ field }) => {
                    console.log(field, "inapp");
                    return (
                      <Switch
                        id="in-app-active"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isNotificationsEditing}
                      />
                    );
                  }}
                />
              </div>

              <div
                className={cn(
                  "space-y-3 ml-6 transition-all duration-200",
                  !inAppActive && "opacity-50 pointer-events-none"
                )}
              >
                {!inAppActive && (
                  <p className="text-xs text-muted-foreground italic mb-2">
                    Enable in-app notifications to customize your alerts.
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-all" className="text-sm font-medium">
                      All Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show all in-app notifications
                    </p>
                  </div>
                  <Controller
                    name="inApp.allNotifications"
                    control={notificationsForm.control}
                    render={({ field }) => (
                      <Switch
                        id="app-all"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isNotificationsEditing}
                      />
                    )}
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
                  <Controller
                    name="inApp.notificationSounds"
                    control={notificationsForm.control}
                    render={({ field }) => (
                      <Switch
                        id="app-sounds"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isNotificationsEditing}
                      />
                    )}
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
