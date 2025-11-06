import { Button } from "@/components/ui/button";

import { Edit, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { Announcement } from "@/lib/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DialogContainer } from "@/components/custom/dialog-container";
import { AnnouncementDialog } from "./announcements-dialog";
import { useAnnouncements } from "@/hooks/announcememts.hook";

export const AnnCTACells = ({
  announcement,
}: {
  announcement: Partial<Announcement>;
}) => {
  const { remove } = useAnnouncements({});

  const handleRemove = async () => {
    // await remove(announcement.id!);
    console.log(announcement.id);
    await remove(announcement.id!);
  };

  return (
    <div className="flex items-center gap-2 pl-4">
      {announcement.status === "draft" && (
        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
          <Send className="w-4 h-4" />
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={announcement.status === "sent"}
            onSelect={(e) => e.preventDefault()}
          >
            <DialogContainer
              title="Update Your Announcement"
              desc="Change What You Need"
              dialogComp={<AnnouncementDialog announcement={announcement} />}
            >
              <div className="flex items-center justify-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </div>
            </DialogContainer>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onSelect={(e) => e.preventDefault()}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex items-center justify-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRemove}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
