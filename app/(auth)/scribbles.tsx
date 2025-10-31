import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
} from "lucide-react";

// Custom UI Components matching the dashboard vibe
const Button = ({
  children,
  className = "",
  variant = "default",
  disabled = false,
  ...props
}) => {
  const baseStyle =
    "px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 bg-white",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
  };
  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", error = false, icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    )}
    <input
      className={`w-full ${
        Icon ? "pl-10" : "pl-4"
      } pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all ${
        error ? "border-red-300 focus:ring-red-500" : "border-gray-200"
      } ${className}`}
      {...props}
    />
  </div>
);

const Label = ({ children, className = "", ...props }) => (
  <label
    className={`block text-sm font-semibold text-gray-700 mb-2 ${className}`}
    {...props}
  >
    {children}
  </label>
);

const Alert = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };
  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${variants[variant]} flex items-start gap-3`}
    >
      {variant === "error" && (
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
      )}
      {variant === "success" && (
        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

// Forgot Password Page Component
export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
              <p className="font-semibold text-gray-900 mt-1">{email}</p>
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
                onClick={() => setSubmitted(false)}
              >
                Try another email
              </Button>

              <button
                onClick={() => (window.location.href = "/login")}
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

        <div className="space-y-6">
          {error && <Alert variant="error">{error}</Alert>}

          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              error={!!error}
              icon={Mail}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>

          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>
        </div>
      </Card>
    </div>
  );
};

// Reset Password Page Component
export const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain a number";
    return "";
  };

  const handleSubmit = async () => {
    setError("");

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        // router.push('/login');
      }, 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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

        <div className="space-y-6">
          {error && <Alert variant="error">{error}</Alert>}

          <div>
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                error={!!error}
                icon={Lock}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                error={!!error}
                icon={Lock}
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
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
                    {req.met && <CheckCircle2 className="w-3 h-3 text-white" />}
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

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Change Password Modal Component
export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain a number";
    return "";
  };

  const handleSubmit = async () => {
    setError("");

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(
        "Failed to change password. Please check your current password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    { text: "At least 8 characters", met: newPassword.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
    { text: "One lowercase letter", met: /[a-z]/.test(newPassword) },
    { text: "One number", met: /[0-9]/.test(newPassword) },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Change password
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Update your account password
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {success ? (
            <Alert variant="success">
              <div>
                <p className="font-semibold">Password changed successfully!</p>
                <p className="text-sm mt-1">Your password has been updated.</p>
              </div>
            </Alert>
          ) : (
            <div className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}

              <div>
                <Label htmlFor="currentPassword">Current password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    error={!!error}
                    icon={Lock}
                  />
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">New password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    error={!!error}
                    icon={Lock}
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    error={!!error}
                    icon={Lock}
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
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

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change password"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Demo Component to show all three
export default function PasswordFlowDemo() {
  const [view, setView] = useState("forgot");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <Card className="fixed top-4 left-4 z-50 p-4 shadow-xl">
        <p className="text-sm font-semibold mb-3 text-gray-700">
          Demo Navigation:
        </p>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => setView("forgot")}
            className="text-sm py-2"
          >
            Forgot Password
          </Button>
          <Button
            variant="outline"
            onClick={() => setView("reset")}
            className="text-sm py-2"
          >
            Reset Password
          </Button>
          <Button
            variant="outline"
            onClick={() => setModalOpen(true)}
            className="text-sm py-2"
          >
            Change Password
          </Button>
        </div>
      </Card>

      {view === "forgot" && <ForgotPasswordPage />}
      {view === "reset" && <ResetPasswordPage />}

      <ChangePasswordModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
