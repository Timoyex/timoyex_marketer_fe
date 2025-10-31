"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Shield,
  Mail,
  Lock,
  User,
  Phone,
  Layers2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useAuth } from "@/hooks";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Image from "next/image";

// Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isAdmin: z.boolean(),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    memberOf: z.string().min(2, "Upline Code must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^(\+234|234|0)[789][01]\d{8}$/, "Invalid Nigerian phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain uppercase, lowercase, and number",
      }),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });
export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const tag = params.tag as string;

  if (!["login", "register", "admin"].includes(tag)) {
    notFound();
  }

  const { login, register } = useAuth();

  const referralCode =
    searchParams.get("ref") || searchParams.get("code") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(tag);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      memberOf: referralCode,
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });
  const adminLoginForm = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      isAdmin: true,
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      console.log(values);
      login(values);
    } catch (error) {
      toast.error("Login failed. Please try again.");
      loginForm.setError("root", {
        message: "Invalid credentials. Please try again.",
      });
    }
  };

  const handleRegister = async (payload: z.infer<typeof registerSchema>) => {
    try {
      const { confirmPassword, agreeToTerms, ...values } = payload;
      register(values);
      localStorage.setItem("verification-email", values.email);
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      registerForm.setError("root", {
        message: "Registration failed. Please try again.",
      });
    }
  };

  const handleTabChange = (value: string) => {
    // Navigate to the new auth route
    router.push(`/${value}`);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ${
        activeTab === "admin"
          ? "from-slate-900 via-slate-800 to-slate-900"
          : "from-blue-50 via-white to-purple-50"
      }`}
    >
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg flex items-center justify-center text-white text-2xl font-bold">
                {/* TI */}
                <Image
                  src="/timoyex-logo.jpg"
                  alt="TIMOYEX INTERNATIONAL"
                  width={80}
                  height={80}
                  className="mx-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
            {activeTab === "admin" ? (
              <>
                <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-4">
                  <Shield className="w-5 h-5 text-red-500" />
                  <span className="text-red-400 font-medium text-sm">
                    ADMIN ACCESS ONLY
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Secure Login
                </h2>
                <p className="text-slate-400">
                  Enter your administrator credentials
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to TIMOYEX!
                </h2>
                <p className="text-gray-600">
                  Making Lives Better Through Innovation
                </p>
              </>
            )}
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full rounded-lg p-1"
          >
            <TabsList
              className={`grid w-full grid-cols-3 mb-6 ${
                activeTab === "admin" ? "bg-slate-800/50" : "bg-gray-100"
              }`}
            >
              <TabsTrigger
                value="login"
                className={activeTab === "admin" ? "text-white" : ""}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className={activeTab === "admin" ? "text-white" : ""}
              >
                Register
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
              >
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-4"
                >
                  {/* Header */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Sign In
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enter your credentials to access your dashboard
                    </p>
                  </div>

                  <div>
                    {loginForm.formState.errors.root && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">
                          {loginForm.formState.errors.root.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                placeholder="john@example.com"
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-10 pr-10"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between mb-4">
                          {/* <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-gray-300"
                            />
                            <FormLabel className="text-sm">
                              Remember me
                            </FormLabel>
                          </div> */}
                          <Link
                            href="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Forgot password?
                          </Link>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={loginForm.formState.isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                      // className="w-full"
                    >
                      {loginForm.formState.isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Signing In...
                        </div>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* Register Tab Content */}
            <TabsContent value="register">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(handleRegister)}
                  className="space-y-4 "
                >
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Create Account
                    </h3>
                    <p className="text-sm text-gray-600">
                      Join thousands of successful marketers
                    </p>
                  </div>

                  <div>
                    {registerForm.formState.errors.root && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">
                          {registerForm.formState.errors.root.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  placeholder="John"
                                  className="pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Doe" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="john@example.com"
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="memberOf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upline Code</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Layers2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                placeholder="MKT-12345"
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type="tel"
                                placeholder="+234 800 000 0000"
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                className="pl-10 pr-10"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="pl-10 pr-10"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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

                    <FormField
                      control={registerForm.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2 justify-center">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <FormLabel className="text-sm font-normal leading-relaxed mb-4">
                              I agree to the
                              <Link
                                href="/terms"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                href="/privacy"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Privacy Policy
                              </Link>
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={registerForm.formState.isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                    >
                      {registerForm.formState.isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Creating Account...
                        </div>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* Admin Tab Content */}
            <TabsContent value="admin">
              <Form {...adminLoginForm}>
                <form
                  onSubmit={adminLoginForm.handleSubmit(handleLogin)}
                  className="space-y-4 bg-slate-800/30 rounded-lg backdrop-blur-sm"
                >
                  {adminLoginForm.formState.errors.root && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">
                        {adminLoginForm.formState.errors.root.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <FormField
                      control={adminLoginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-slate-300 mb-2">
                            Adminstrator Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                placeholder="admin@timoyex.com"
                                className="w-full pl-10 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adminLoginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full pl-10 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
                      control={adminLoginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between mb-4">
                          {/* <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-gray-300"
                              id="rememberMe"
                            />
                            <FormLabel
                              className="text-sm text-gray-600"
                              htmlFor="rememberMe"
                            >
                              Remember me
                            </FormLabel>
                          </div> */}
                          <Link
                            href="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Forgot password?
                          </Link>
                        </FormItem>
                      )}
                    />
                    {/* Sign In Button */}
                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                      disabled={adminLoginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Accessing...
                        </div>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Access Admin Panel
                        </>
                      )}
                    </Button>

                    <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 text-amber-500 mt-0.5">⚠️</div>
                        <div>
                          <h4 className="text-amber-400 font-medium text-sm mb-1">
                            Security Notice
                          </h4>
                          <p className="text-amber-300/80 text-xs">
                            This is a restricted area. All access attempts are
                            logged and monitored. Unauthorized access is
                            strictly prohibited.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
