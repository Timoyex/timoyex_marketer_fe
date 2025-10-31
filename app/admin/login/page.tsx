"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    adminCode: "",
    rememberMe: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement admin authentication logic
    console.log("[v0] Admin login attempt:", loginData)
    // Redirect to admin dashboard on successful login
    window.location.href = "/admin/dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            <h1 className="text-xl font-semibold text-white">Admin Control Panel</h1>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Admin Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-4">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-red-400 font-medium text-sm">ADMIN ACCESS ONLY</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Secure Login</h2>
            <p className="text-slate-400">Enter your administrator credentials</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Admin Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Administrator Email</label>
              <Input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="admin@timoyex.com"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {/* Admin Code Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Admin Access Code</label>
              <Input
                type="text"
                value={loginData.adminCode}
                onChange={(e) => setLoginData({ ...loginData, adminCode: e.target.value })}
                placeholder="Enter admin access code"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={loginData.rememberMe}
                  onCheckedChange={(checked) => setLoginData({ ...loginData, rememberMe: checked as boolean })}
                  className="border-slate-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                />
                <label htmlFor="remember" className="text-sm text-slate-300">
                  Keep me signed in
                </label>
              </div>
              <Link href="/admin/forgot-password" className="text-sm text-red-400 hover:text-red-300 transition-colors">
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
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-amber-500 mt-0.5">⚠️</div>
              <div>
                <h4 className="text-amber-400 font-medium text-sm mb-1">Security Notice</h4>
                <p className="text-amber-300/80 text-xs">
                  This is a restricted area. All access attempts are logged and monitored. Unauthorized access is
                  strictly prohibited.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
