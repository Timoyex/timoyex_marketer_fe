"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import Link from "next/link";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schema
const forgotPwdSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ForgotPasswordPage = () => {
  const router = useRouter();
  const { forgotPwd, forgotPwdSuccess, forgotPwdError, forgotPwdReset } =
    useAuth();

  const forgotPwdForm = useForm<z.infer<typeof forgotPwdSchema>>({
    resolver: zodResolver(forgotPwdSchema),
    defaultValues: { email: "" },
  });

  const handleForgot = async (values: z.infer<typeof forgotPwdSchema>) => {
    try {
      await forgotPwd(values.email);
    } catch (error) {
      forgotPwdForm.setError("root", {
        message: `${forgotPwdError?.response.data.message}`,
      });
    }
  };

  if (forgotPwdSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Check your email
              </h2>
              <p className="text-gray-600">
                We've sent a password reset link to
              </p>
              <p className="font-semibold text-gray-900 mt-1">
                {forgotPwdForm.getValues().email}
              </p>
            </div>

            <Alert variant="default">
              <div>
                <p className="font-semibold mb-1">Didn't receive the email?</p>
                <p className="text-sm">
                  Check your spam folder or try again in a few minutes.
                </p>
              </div>
            </Alert>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  forgotPwdForm.reset();
                  forgotPwdReset();
                }}
              >
                Try another email
              </Button>

              <button
                onClick={() => router.push("/login")}
                className="w-full text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Forgot password?
          </h2>
          <p className="text-gray-600">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <Form {...forgotPwdForm}>
          <form
            onSubmit={forgotPwdForm.handleSubmit(handleForgot)}
            className="space-y-6"
          >
            {forgotPwdForm.formState.errors.root && (
              <Alert className="border-red-200 bg-red-50 mb-7 mt-2 p-4">
                <AlertDescription className="text-red-700">
                  {forgotPwdForm.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <FormField
                control={forgotPwdForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4 gap-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="john@example.com"
                          className="pl-10"
                          required
                          type="email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={forgotPwdForm.formState.isSubmitting}
            >
              {forgotPwdForm.formState.isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </div>
              ) : (
                <>Send Reset Link</>
              )}
            </Button>

            <Link
              href="/login"
              className="w-full text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </form>
        </Form>
      </Card>
    </div>
  );
};
