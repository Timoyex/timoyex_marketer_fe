import { Button } from "@/components/ui/button";

import { Ban, Delete, MoreHorizontal } from "lucide-react";

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

import { UserProfile } from "@/lib/stores/profile.store";
import { useUsers } from "@/hooks/users.hook";

export const UserCTACells = ({ user }: { user: Partial<UserProfile> }) => {
  const { updateUser, deleteUser } = useUsers();

  const handleSuspend = async () => {
    console.log(user.id);
    await updateUser({ id: user.id!, dto: { status: "inactive" } });
    return;
  };
  const handleDelete = async () => {
    console.log(user.id);
    await deleteUser(user.id!);
    return;
  };

  return (
    <div className="flex items-center gap-2 pl-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-red-300"
            onSelect={(e) => e.preventDefault()}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex items-center justify-center">
                  <Ban className="w-4 h-4 mr-2" />
                  Mark User As Inactive
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Mark As Inactive?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSuspend}>
                    Mark
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-900"
            onSelect={(e) => e.preventDefault()}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex items-center justify-center">
                  <Delete className="w-4 h-4 mr-2" />
                  Delete User
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete User?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
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
