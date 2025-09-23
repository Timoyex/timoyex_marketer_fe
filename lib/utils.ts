import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!", {
      description: "Share to invite new team members.",
    });
  } catch (error) {
    toast.error("Failed to copy", {
      description: "Please try again or copy manually.",
    });
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getLevelBadgeColor = (level: number) => {
  switch (level) {
    case 1:
      return "bg-gray-100 text-gray-800 border-gray-200";
    case 2:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case 3:
      return "bg-green-100 text-green-800 border-green-200";
    case 4:
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
