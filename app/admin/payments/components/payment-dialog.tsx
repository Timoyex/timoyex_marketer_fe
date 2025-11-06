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
import { Textarea } from "@/components/ui/textarea";
import { AdminPaymentsList } from "@/lib/api";
import { getChangedValues } from "@/lib/form.utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminPayments } from "@/hooks/admin-payments.hook";

const paymentSchema = z.object({
  note: z.string().optional(),
});

export const PaymentDialog = ({
  payment,
  type,
}: {
  payment?: Partial<AdminPaymentsList>;
  type: "approve" | "reject";
}) => {
  const { updatePayment } = useAdminPayments({});
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      note: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof paymentSchema>) => {
    const { dirtyFields } = paymentForm.formState;

    const changedValues = getChangedValues(dirtyFields, values);

    console.log(changedValues);

    const status = type === "approve" ? "processing" : "rejected";
    await updatePayment({
      id: payment?.id!,
      data: { note: changedValues.note, status },
    });

    return;
  };

  return (
    <Form {...paymentForm}>
      <form
        onSubmit={paymentForm.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        {paymentForm.formState.errors.root && (
          <Alert className="border-red-200 bg-red-50 mb-7 mt-2 p-4">
            <AlertDescription className="text-red-700">
              {paymentForm.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600">
            Payment ID: <span className="font-medium">{payment?.id}</span>
          </p>
          <p className="text-sm text-slate-600">
            User:{" "}
            <span className="font-medium">
              {payment?.user?.firstName} {payment?.user?.lastName}{" "}
            </span>
          </p>
          <p className="text-sm text-slate-600">
            Amount: <span className="font-medium">{payment?.amount}</span>
          </p>
          <p className="text-sm text-slate-600">
            Bank:{" "}
            <span className="font-medium">
              {payment?.user?.bankAccount?.bankName} -{" "}
              {payment?.user?.bankAccount?.bankName}
            </span>
          </p>
        </div>

        <FormField
          control={paymentForm.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-slate-700 mb-2">
                {type === "approve" ? "Approval Note" : "Rejection Reason"}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    type === "approve"
                      ? "Add approval note..."
                      : "Explain reason for rejection..."
                  }
                  rows={3}
                  {...field}
                  disabled={paymentForm.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="flex justify-end gap-3">
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="outline"
            disabled={paymentForm.formState.isSubmitting}
            type="submit"
          >
            {type === "approve" ? "Approve Payment" : "Reject Request"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
