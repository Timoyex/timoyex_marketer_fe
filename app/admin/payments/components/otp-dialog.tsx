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
import { AdminPaymentsList } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminPayments } from "@/hooks/admin-payments.hook";
import { Input } from "@/components/ui/input";

const OTPSchema = z.object({
  otp: z.string().optional(),
});

export const OTPDialog = ({
  payment,
}: {
  payment?: Partial<AdminPaymentsList>;
}) => {
  const { finalizePayment } = useAdminPayments({});
  const otpForm = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof OTPSchema>) => {
    await finalizePayment({
      id: payment?.id!,
      data: { otp: values.otp!, userId: payment?.user?.id! },
    });

    return;
  };

  return (
    <Form {...otpForm}>
      <form onSubmit={otpForm.handleSubmit(handleSubmit)} className="space-y-4">
        {otpForm.formState.errors.root && (
          <Alert className="border-red-200 bg-red-50 mb-7 mt-2 p-4">
            <AlertDescription className="text-red-700">
              {otpForm.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-slate-50 p-4 rounded-lg">
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
              {payment?.user?.bankAccount?.accountNumber}
            </span>
          </p>
        </div>

        <FormField
          control={otpForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-slate-700 mb-2"></FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter OTP code here"
                  {...field}
                  disabled={otpForm.formState.isSubmitting}
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
            disabled={
              otpForm.formState.isSubmitting || otpForm.getValues("otp") === ""
            }
            type="submit"
          >
            Approve Payment
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
