"use client";

import { useState } from "react";
import { CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";

const resetPwdSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain uppercase, lowercase, and number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export const ResetPasswordPage = ({ token }: { token: string }) => {
  const { resetPwd, resetPwdError, resetPwdSuccess } = useAuth();

  const resetPwdForm = useForm<z.infer<typeof resetPwdSchema>>({
    resolver: zodResolver(resetPwdSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleReset = async (payload: z.infer<typeof resetPwdSchema>) => {
    try {
      const { password } = payload;

      await resetPwd({ token: token!, password });
    } catch (error) {
      resetPwdForm.setError("root", {
        message: `${resetPwdError?.response?.data.message || ""}`,
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (resetPwdSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Password reset successful!
              </h2>
              <p className="text-gray-600">Redirecting you to login...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const password = resetPwdForm.watch("password") || "";
  const requirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { text: "One lowercase letter", met: /[a-z]/.test(password) },
    { text: "One number", met: /[0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Reset your password
          </h2>
          <p className="text-gray-600">Enter your new password below.</p>
        </div>

        <Form {...resetPwdForm}>
          <form
            onSubmit={resetPwdForm.handleSubmit(handleReset)}
            className="space-y-6"
          >
            <div>
              {resetPwdForm.formState.errors.root && (
                <Alert className="border-red-200 bg-red-50 mb-7 mt-2 p-4">
                  <AlertDescription className="text-red-700">
                    {resetPwdForm.formState.errors.root.message}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={resetPwdForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-4 gap-1">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
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
                control={resetPwdForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mb-4 gap-1">
                    <FormLabel>Confirm Password</FormLabel>
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
            </div>

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
                        req.met ? "text-green-600 font-medium" : "text-gray-600"
                      }`}
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={resetPwdForm.formState.isSubmitting}
            >
              {resetPwdForm.formState.isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </div>
              ) : (
                <>Reset Password</>
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};
