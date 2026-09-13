import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  ArrowLeft, 
  Loader2, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  ShieldAlert
} from "lucide-react";
import { getApiUrl } from "../apiConfig";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  // Multi-step state: 1 = Enter Email, 2 = Verify OTP & Reset Password, 3 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Cooldown countdown for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email || !email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(getApiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await response.json();

      if (data.success) {
        setStep(2);
        setCountdown(30); // 30 second resend timer
        if (data.devOtp) {
          setDevOtp(data.devOtp);
        }
        setSuccessMessage(data.message || "A 6-digit verification code has been generated.");
      } else {
        setError(data.message || "No account found with this email.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Unable to connect to the server. Please ensure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(getApiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setStep(3);
      } else {
        setError(data.message || "Failed to reset password. Please check the code.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2 shadow-sm border border-blue-100">
            {step === 3 ? <CheckCircle2 size={34} className="text-emerald-500" /> : <KeyRound size={32} />}
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          {step === 1 && "Forgot Password?"}
          {step === 2 && "Reset Your Password"}
          {step === 3 && "Password Reset Done!"}
        </h2>
        
        <p className="mt-2 text-center text-sm text-slate-600 px-4">
          {step === 1 && "Enter your registered email address to receive your 6-digit verification code."}
          {step === 2 && `Enter the 6-digit code sent to ${email} and choose a new password.`}
          {step === 3 && "Your password has been updated securely. You can now log in to your account."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 sm:px-8 shadow-sm rounded-2xl border border-slate-200/80">
          
          {/* Error notification */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs font-medium animate-shake">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Dev OTP Helper Banner (Shown if SMTP is unconfigured or in local testing) */}
          {step === 2 && devOtp && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldAlert size={15} className="text-amber-600" />
                <span>Verification Code</span>
              </div>
              <p className="text-slate-600 mb-2">
                Use code <strong className="text-blue-600 font-mono text-sm tracking-wider font-bold bg-white px-2 py-0.5 rounded border border-blue-200">{devOtp}</strong> to reset:
              </p>
              <button
                type="button"
                onClick={() => setOtp(devOtp)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
              >
                Auto-fill Code
              </button>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div className="space-y-1.5 group">
                <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Registered Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white transition-all bg-blue-600 hover:bg-blue-700 active:scale-[0.98] ${
                    isSubmitting || !email ? "opacity-70 cursor-not-allowed" : "shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending Verification Code...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <Link
                  to="/my-account"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Log In
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: Enter OTP & New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* OTP Field */}
              <div className="space-y-1.5 group">
                <div className="flex justify-between items-center">
                  <label htmlFor="otp" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    disabled={countdown > 0 || isSubmitting}
                    onClick={() => handleRequestOtp()}
                    className={`text-xs font-bold flex items-center gap-1 ${
                      countdown > 0 ? "text-slate-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    <RefreshCw size={12} className={isSubmitting ? "animate-spin" : ""} />
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <KeyRound size={18} />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setOtp(val);
                      if (error) setError("");
                    }}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-widest font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-center sm:text-left"
                    placeholder="123456"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5 group">
                <label htmlFor="newPassword" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError("");
                    }}
                    className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5 group">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !otp || !newPassword || !confirmPassword}
                  className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white transition-all bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] ${
                    isSubmitting || !otp || !newPassword || !confirmPassword
                      ? "opacity-70 cursor-not-allowed"
                      : "shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  className="font-bold text-slate-500 hover:text-slate-800"
                >
                  Change Email
                </button>

                <Link
                  to="/my-account"
                  className="font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Back to Log In
                </Link>
              </div>
            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <div className="text-center py-3 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Password Changed!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your password has been successfully reset. You can now use your new password to access your FETC account.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => navigate("/my-account", { state: { tab: "login" } })}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                  Log In Now
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
