"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [adminLoginData, setAdminLoginData] = useState({
    email: "",
    password: "",
    adminCode: "",
    rememberMe: false,
  });

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Admin login attempt:", adminLoginData);
    window.location.href = "/admin/dashboard";
  };

  return (
    <div
      className={`min-h-screen ${
        activeTab === "admin"
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gray-50"
      }`}
    >
      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="mb-6">
              <Image
                src="/timoyex-logo.jpg"
                alt="TIMOYEX INTERNATIONAL"
                width={80}
                height={80}
                className="mx-auto rounded-xl shadow-lg"
              />
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
          <div
            className={`flex mb-6 ${
              activeTab === "admin" ? "bg-slate-800/50" : "bg-gray-100"
            } rounded-lg p-1`}
          >
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "login"
                  ? "bg-white text-gray-900 shadow-sm"
                  : activeTab === "admin"
                  ? "text-slate-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "register"
                  ? "bg-white text-gray-900 shadow-sm"
                  : activeTab === "admin"
                  ? "text-slate-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "admin"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Shield className="w-4 h-4 inline mr-1" />
              Admin
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form className="space-y-4">
              {/* Email Field */}
              <div>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
              >
                Sign In
              </Button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form className="space-y-4">
              {/* Full Name Field */}
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Email Field */}
              <div>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Upline Referral Code Field */}
              <div>
                <Input
                  type="text"
                  placeholder="Upline Referral Code (e.g., MKT-IFEADE5KBK)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the referral code from your upline marketer
                </p>
              </div>

              {/* Password Field */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-green-600 hover:text-green-700"
                  >
                    Terms & Conditions
                  </Link>
                </label>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
              >
                Sign Up
              </Button>
            </form>
          )}

          {/* Admin Login Form */}
          {activeTab === "admin" && (
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              {/* Admin Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Administrator Email
                </label>
                <Input
                  type="email"
                  value={adminLoginData.email}
                  onChange={(e) =>
                    setAdminLoginData({
                      ...adminLoginData,
                      email: e.target.value,
                    })
                  }
                  placeholder="admin@timoyex.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Admin Code Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Access Code
                </label>
                <Input
                  type="text"
                  value={adminLoginData.adminCode}
                  onChange={(e) =>
                    setAdminLoginData({
                      ...adminLoginData,
                      adminCode: e.target.value,
                    })
                  }
                  placeholder="Enter admin access code"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={adminLoginData.password}
                    onChange={(e) =>
                      setAdminLoginData({
                        ...adminLoginData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="adminRemember"
                    checked={adminLoginData.rememberMe}
                    onCheckedChange={(checked) =>
                      setAdminLoginData({
                        ...adminLoginData,
                        rememberMe: checked as boolean,
                      })
                    }
                    className="border-slate-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                  />
                  <label
                    htmlFor="adminRemember"
                    className="text-sm text-slate-300"
                  >
                    Keep me signed in
                  </label>
                </div>
                <Link
                  href="/admin/forgot-password"
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Forgot credentials?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                <Shield className="w-5 h-5 mr-2" />
                Access Admin Panel
              </Button>

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-amber-500 mt-0.5">⚠️</div>
                  <div>
                    <h4 className="text-amber-400 font-medium text-sm mb-1">
                      Security Notice
                    </h4>
                    <p className="text-amber-300/80 text-xs">
                      This is a restricted area. All access attempts are logged
                      and monitored. Unauthorized access is strictly prohibited.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
