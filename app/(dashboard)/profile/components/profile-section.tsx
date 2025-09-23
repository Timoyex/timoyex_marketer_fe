// components/sections/profile-section.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Edit3,
  Save,
  X,
  Camera,
  User,
  CreditCard,
  Users,
  Loader2,
  FileText,
  Upload,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useProfile } from "@/hooks/profile.hook";
import { getChangedValues } from "@/lib/form.utils";
import { toast } from "sonner";

// Schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(2),
  middleName: z.string().optional(),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  alternatePhone: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().min(10),
});

const bankDetailsSchema = z.object({
  bankName: z.string().min(1),
  accountName: z.string().optional(),
  accountNumber: z.string().min(10).max(10),
  bvn: z.string().min(11).max(11).optional(),
});

const nextOfKinSchema = z.object({
  name: z.string().optional(),
  relationship: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
});

export const identificationSchema = z.object({
  type: z.enum(["nin", "voters-id", "passport"], {
    required_error: "Please select an ID type",
  }),
  key: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "File must be <= 10MB")
    .optional(),
});

// Options
const nigerianBanks = [
  "Access Bank",
  "GTB",
  "Guaranty Trust Bank (GTB)",
  "First Bank",
  "UBA",
  "Zenith Bank",
  "Others",
];
const relationshipOptions = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Spouse",
  "Friend",
  "Guardian",
  "Other",
];

export function ProfileSection() {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [updatingSections, setUpdatingSections] = useState<
    Record<string, boolean>
  >({});

  // Single consolidated hook
  const { profileQuery, updateProfile, isLoading, isUpdating } = useProfile();

  // Forms
  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: profileQuery.data || {},
  });
  const bankForm = useForm({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: profileQuery.data?.bankAccount || {},
  });
  const nextOfKinForm = useForm({
    resolver: zodResolver(nextOfKinSchema),
    defaultValues: profileQuery.data?.nextOfKin || {},
  });

  const identificationForm = useForm({
    resolver: zodResolver(identificationSchema),
    defaultValues: profileQuery.data?.identification || {},
  });

  // Reset forms when data changes
  useEffect(() => {
    if (profileQuery.data) personalForm.reset(profileQuery.data);
  }, [profileQuery.data]);
  useEffect(() => {
    if (profileQuery.data?.bankAccount)
      bankForm.reset(profileQuery.data.bankAccount);
  }, [profileQuery.data?.bankAccount]);
  useEffect(() => {
    if (profileQuery.data?.nextOfKin)
      nextOfKinForm.reset(profileQuery.data.nextOfKin);
  }, [profileQuery.data?.nextOfKin]);

  // Save handlers
  const handleSave = async (section: string) => {
    setUpdatingSections((prev) => ({ ...prev, [section]: true }));

    const formMap: Record<
      string,
      { form: any; key?: string; hasImage?: boolean }
    > = {
      personal: { form: personalForm },
      bank: { form: bankForm, key: "bankAccount" },
      nextOfKin: { form: nextOfKinForm, key: "nextOfKin" },
      identification: {
        form: identificationForm,
        key: "identification",
        hasImage: true,
      },
    };

    const selected = formMap[section];
    if (!selected) return;

    const { form, key, hasImage } = selected;

    if (!(await form.trigger())) return;

    // Get changed values
    const changedValues = getChangedValues(
      form.formState.dirtyFields,
      form.getValues()
    );

    if (Object.keys(changedValues).length <= 0) {
      toast.info("No changes made");
      return;
    }

    const payload = key ? { [key]: changedValues } : changedValues;

    updateProfile(payload, hasImage);
    setUpdatingSections((prev) => ({ ...prev, [section]: false }));
    setEditingSection(null);
  };

  // Cancel resets the correct form
  const handleCancel = (section: string) => {
    switch (section) {
      case "personal":
        personalForm.reset();
        break;
      case "bank":
        bankForm.reset();
        break;
      case "nextOfKin":
        nextOfKinForm.reset();
        break;
    }
    setEditingSection(null);
  };

  const handleFileUpload = (file: File) => {
    console.log("upload file");
    console.log(file);
    if (file) updateProfile({ avatar: file }, true);
  };

  const SectionHeader = ({
    title,
    icon: Icon,
    sectionKey,
    extra: Extra,
  }: any) => {
    const isEditing = editingSection === sectionKey;
    const isUpdating = updatingSections?.[sectionKey] ?? false;
    return (
      <CardHeader className="flex justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}

          {Extra && <Extra className="h-5 w-5" />}
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

  const profileOverview = {
    fullName: profileQuery.data
      ? `${profileQuery.data.firstName} ${profileQuery.data.lastName}`
      : "Loading...",
    joinDate: profileQuery.data?.createdAt || new Date().toISOString(),
    level: 1,
    totalEarnings: profileQuery.data?.totalEarnings || 0,
    totalRecruits: profileQuery.data?.totalRecruits || 0,
    avatar: profileQuery.data?.avatar,
    status: profileQuery.data?.status || "active",
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const getLevelBadgeColor = (level: number) =>
    ({
      1: "bg-gray-100 text-gray-800 border-gray-200",
      2: "bg-blue-100 text-blue-800 border-blue-200",
      3: "bg-green-100 text-green-800 border-green-200",
      4: "bg-purple-100 text-purple-800 border-purple-200",
      5: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }[level] || "bg-gray-100 text-gray-800 border-gray-200");

  const isEditing = (section: string) => editingSection === section;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Profile</h2>
          <p className="text-muted-foreground">
            Manage your personal information and account settings.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="bg-card border-border shadow-sm lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={profileOverview.avatar as string} />
                <AvatarFallback className="text-lg">
                  {profileOverview.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                id="avatar-upload"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardTitle className="text-card-foreground">
              {profileOverview.fullName}
            </CardTitle>
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant="outline"
                className={getLevelBadgeColor(profileOverview.level)}
              >
                Level {profileOverview.level}
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 border-green-200"
              >
                {profileOverview.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Member since</p>
              <p className="font-medium text-card-foreground">
                {formatDate(profileOverview.joinDate)}
              </p>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Earnings
                </span>
                <span className="font-medium text-card-foreground">
                  ${profileOverview.totalEarnings.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Recruits
                </span>
                <span className="font-medium text-card-foreground">
                  {profileOverview.totalRecruits.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-card border-border shadow-sm">
            <SectionHeader
              title="Personal Information"
              icon={User}
              sectionKey="personal"
            />
            <CardContent className="space-y-4">
              <Form {...personalForm}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={personalForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing("personal")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing("personal")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing("personal")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled={!isEditing("personal")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing("personal")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="altPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing("personal")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>

                        <Select
                          disabled={!isEditing("personal")}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                profileQuery.data?.gender || "Select your bank"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Of Birth</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value?.toString() ?? ""}
                            disabled={!isEditing("personal")}
                            type="date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={personalForm.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          disabled={!isEditing("personal")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          disabled={!isEditing("personal")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </CardContent>
          </Card>

          {/* Identification Details Card */}
          <Card className="bg-card border-border shadow-sm">
            <SectionHeader
              title="Identification Details"
              icon={FileText}
              sectionKey="identification"
              extra={profileQuery.data?.status === "active" && BadgeCheck}
            />

            <CardContent className="space-y-4">
              <Form {...identificationForm}>
                <div className="space-y-2">
                  <FormField
                    control={identificationForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Type</FormLabel>

                        <Select
                          disabled={!isEditing("identification")}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nin">NIN</SelectItem>
                            <SelectItem value="voters-id">
                              Voter's ID Card
                            </SelectItem>
                            <SelectItem value="passport">Passport</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={identificationForm.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Upload</FormLabel>

                        <div
                          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (!isEditing("identification")) return;

                            const file = e.dataTransfer.files?.[0];
                            if (file) field.onChange(file);
                          }}
                          onClick={() => {
                            if (!isEditing("identification")) return;
                            document.getElementById("file-input")?.click();
                          }}
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, PDF up to 10MB
                          </p>
                          <Button
                            variant="outline"
                            className="mt-2 bg-transparent"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById("file-input")?.click();
                            }}
                            disabled={!isEditing("identification")}
                          >
                            Choose File
                          </Button>
                          <input
                            id="file-input"
                            type="file"
                            className="hidden"
                            accept=".png,.jpg,.jpeg,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) field.onChange(file);
                            }}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="bg-card border-border shadow-sm">
            <SectionHeader
              title="Bank Details"
              icon={CreditCard}
              sectionKey="bank"
            />
            <CardContent className="space-y-4">
              <Form {...bankForm}>
                <FormField
                  control={bankForm.control}
                  name="bvn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BVN</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing("bank")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={bankForm.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <Select
                          disabled={!isEditing("bank")}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                profileQuery.data?.bankAccount?.bankName ||
                                "Select your bank"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {nigerianBanks.map((bank) => (
                              <SelectItem key={bank} value={bank}>
                                {bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bankForm.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing("bank")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bankForm.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing("bank")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </CardContent>
          </Card>

          {/* Next of Kin */}
          <Card className="bg-card border-border shadow-sm">
            <SectionHeader
              title="Next of Kin"
              icon={Users}
              sectionKey="nextOfKin"
            />
            <CardContent className="space-y-4">
              <Form {...nextOfKinForm}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={nextOfKinForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing("nextOfKin")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={nextOfKinForm.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <Select
                          disabled={!isEditing("nextOfKin")}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                profileQuery.data?.nextOfKin?.relationship ||
                                "Select Relationship"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {relationshipOptions.map((rel) => (
                              <SelectItem
                                key={rel}
                                value={rel.toLowerCase().replace(/\s+/g, "-")}
                              >
                                {rel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={nextOfKinForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing("nextOfKin")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={nextOfKinForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled={!isEditing("nextOfKin")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={nextOfKinForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          disabled={!isEditing("nextOfKin")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
