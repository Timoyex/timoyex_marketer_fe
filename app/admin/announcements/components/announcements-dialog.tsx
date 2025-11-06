import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Edit, Send } from "lucide-react";
import { Announcement } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getChangedValues } from "@/lib/form.utils";
import { useAnnouncements } from "@/hooks/announcememts.hook";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  scheduledAt: z.string().optional(),
});

export const AnnouncementDialog = ({
  announcement,
}: {
  announcement?: Partial<Announcement>;
}) => {
  const { create, update } = useAnnouncements({});
  const isEditMode = !!announcement?.id;

  const formatScheduledAt = (
    value: string | Date | null | undefined
  ): string => {
    console.log(value);
    if (!value) return "";
    if (typeof value === "string") return value;
    return value.toISOString().slice(0, 16);
  };

  const announcementForm = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement?.title || "",
      content: announcement?.content || "",
      priority: announcement?.priority || "low",
      scheduledAt: formatScheduledAt(announcement?.scheduledAt),
    },
  });

  const scheduledAt = announcementForm.watch("scheduledAt");
  const isScheduled = !!scheduledAt && scheduledAt.trim() !== "";
  const handleSubmit = async (values: z.infer<typeof announcementSchema>) => {
    if (isEditMode) {
      const { dirtyFields } = announcementForm.formState;

      if (!dirtyFields) {
        return;
      }

      const changedValues = getChangedValues(
        dirtyFields,
        announcementForm.getValues()
      );

      await update({
        id: announcement.id!,
        data: {
          ...changedValues,
          scheduledAt: changedValues.scheduledAt
            ? new Date(changedValues.scheduledAt).toISOString()
            : undefined,
          status:
            announcement.status !== "draft"
              ? announcement.status
              : isScheduled
              ? "scheduled"
              : "sent",
        },
      });
    } else {
      await create({
        ...values,
        scheduledAt: values.scheduledAt
          ? new Date(values.scheduledAt).toISOString()
          : undefined,
        status: isScheduled ? "scheduled" : "sent",
      });
    }

    announcementForm.reset();
    return;
  };

  const handleDraft = async () => {
    const { dirtyFields } = announcementForm.formState;

    if (!dirtyFields) {
      return;
    }
    const changedValues = getChangedValues(
      dirtyFields,
      announcementForm.getValues()
    );

    console.log("Changed values only:", changedValues);
    await create({
      title: changedValues.title!,
      content: changedValues.content!,
      priority: changedValues.priority!,
      scheduledAt: changedValues.scheduledAt
        ? new Date(changedValues.scheduledAt).toISOString()
        : undefined,
      status: "draft",
    });

    announcementForm.reset();

    return;
  };

  const getButtonContent = () => {
    if (isEditMode) {
      return (
        <>
          <Edit className="w-4 h-4 mr-2" />
          Update
        </>
      );
    }

    if (isScheduled) {
      return (
        <>
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </>
      );
    }

    return (
      <>
        <Send className="w-4 h-4 mr-2" />
        Send Now
      </>
    );
  };

  return (
    <Form {...announcementForm}>
      <form
        className="space-y-6"
        onSubmit={announcementForm.handleSubmit(handleSubmit)}
      >
        {announcementForm.formState.errors.root && (
          <Alert className="border-red-200 bg-red-50 mb-7 mt-2 p-4">
            <AlertDescription className="text-red-700">
              {announcementForm.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={announcementForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={announcementForm.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-slate-700 mb-2">
                Content
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Enter message" rows={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={announcementForm.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select A Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={announcementForm.control}
            name="scheduledAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-slate-700 mb-2">
                  Schedule Date (Optional)
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="outline"
            disabled={isEditMode || announcementForm.formState.isSubmitting}
            type="button"
            onClick={handleDraft}
          >
            Save as Draft
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700 "
            type="submit"
            disabled={announcementForm.formState.isSubmitting}
          >
            {getButtonContent()}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
