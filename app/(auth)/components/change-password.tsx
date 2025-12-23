"use client";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";

const changePwdSchema = z
  .object({
    oldPwd: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain uppercase, lowercase, and number",
      }),
    newPwd: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain uppercase, lowercase, and number",
      }),
    confirmPwd: z.string(),
  })
  .refine((data) => data.newPwd === data.confirmPwd, {
    path: ["confirmPwd"],
    message: "Passwords must match",
  });

export const ChangePasswordModal = () => {
  const { changePwd, changePwdError, changePwdSuccess, logout } = useAuth();

  const router = useRouter();

  const changePwdForm = useForm<z.infer<typeof changePwdSchema>>({
    resolver: zodResolver(changePwdSchema),
    defaultValues: {
      oldPwd: "",
      newPwd: "",
      confirmPwd: "",
    },
  });

  const handleChange = async (payload: z.infer<typeof changePwdSchema>) => {
    try {
      const { confirmPwd, ...values } = payload;

      await changePwd(values);
      await logout();

      router.push("/login");
    } catch (error) {
      changePwdForm.setError("root", {
        message: `${changePwdError?.response?.data.message || ""}`,
      });
    }
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const newPwd = changePwdForm.watch("newPwd");
  const requirements = [
    { text: "At least 8 characters", met: newPwd.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(newPwd) },
    { text: "One lowercase letter", met: /[a-z]/.test(newPwd) },
    { text: "One number", met: /[0-9]/.test(newPwd) },
  ];

  return (
    <div className="p-8 space-y-6">
      {changePwdSuccess ? (
        <Alert variant="default">
          <div>
            <p className="font-semibold">Password changed successfully!</p>
            <p className="text-sm mt-1">Your password has been updated.</p>
          </div>
        </Alert>
      ) : (
        <Form {...changePwdForm}>
          <form
            onSubmit={changePwdForm.handleSubmit(handleChange)}
            className="space-y-4"
          >
            <div>
              {changePwdForm.formState.errors.root && (
                <Alert className="border-red-200 bg-red-50 mb-7 mt-2 p-4">
                  <AlertDescription className="text-red-700">
                    {changePwdForm.formState.errors.root.message}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={changePwdForm.control}
                name="oldPwd"
                render={({ field }) => (
                  <FormItem className="mb-4 gap-1">
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={changePwdForm.control}
                name="newPwd"
                render={({ field }) => (
                  <FormItem className="mb-4 gap-1">
                    <FormLabel>Enter New password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={changePwdForm.control}
                name="confirmPwd"
                render={({ field }) => (
                  <FormItem className="mb-4 gap-1">
                    <FormLabel>Confirm New password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requiremets and Close/Submit*/}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-3">
                  Password requirements:
                </p>
                <div className="space-y-2">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                          req.met ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        {req.met && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span
                        className={`text-sm transition-colors ${
                          req.met
                            ? "text-green-600 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex gap-3 pt-2">
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={changePwdForm.formState.isSubmitting}
                >
                  {changePwdForm.formState.isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </div>
                  ) : (
                    <>Change Password</>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
