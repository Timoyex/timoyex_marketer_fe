"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  ArrowRight,
  Loader2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks";

export default function EmailVerifiedPage() {
  const { isVerifyPending, verifyError, verify, verifySuccess } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      return;
    }

    //test

    verify({ token });
  }, [token]); // Only depend on token

  useEffect(() => {
    // Handle countdown in separate effect
    if (!verifySuccess) {
      return;
    }

    localStorage.removeItem("verification-email");

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/overview";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [verifySuccess]); // Only run when verifySuccess changes

  const handleResendVerification = () => {
    router.push("/verify-email");
  };

  const renderContent = () => {
    switch (true) {
      case isVerifyPending:
        return (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl">Verifying Your Email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
          </Card>
        );

      case verifySuccess:
        return (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">
                Email Verified Successfully!
              </CardTitle>
              <CardDescription>
                Welcome to Marketer Dashboard! Your account is now active.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Success Message */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Your email has been verified and your account is ready to use!
                </AlertDescription>
              </Alert>

              {/* Welcome Message */}
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    You're All Set!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Time to start your affiliate marketing journey. You'll be
                    redirected to your dashboard automatically.
                  </p>
                </div>

                {/* Quick Stats Preview */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-xs text-gray-500">Team Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₦0</div>
                    <div className="text-xs text-gray-500">Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">1</div>
                    <div className="text-xs text-gray-500">Level</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href="/overview">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Redirecting automatically in {countdown} seconds...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case verifyError === "Token is expired":
        return (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-orange-700">
                Verification Link Expired
              </CardTitle>
              <CardDescription>
                This verification link is no longer valid
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert className="border-orange-200 bg-orange-50">
                <XCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  {verifyError}
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Don't worry! You can request a new verification email.
                </p>
                <Button onClick={handleResendVerification} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Get New Verification Email
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case verifyError === "User is already Verified":
        return (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-orange-700">
                You are already verified
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Your email has been verified and your account is ready to use!
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <Button asChild className="w-full" size="lg">
                  <Link href="/login">
                    Log In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case verifyError:
      case verifyError === "Invalid token":
        return (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-700">
                Verification Failed
              </CardTitle>
              <CardDescription>
                We couldn't verify your email address
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {verifyError}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button onClick={handleResendVerification} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Request New Verification Email
                </Button>

                <Button variant="outline" asChild className="w-full">
                  <Link href="/support">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderContent()}

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
