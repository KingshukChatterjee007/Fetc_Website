import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react";

/**
 * MyAccountPage Component
 * A premium, glassmorphism-based authentication portal for FETC.
 */
export default function MyAccountPage() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (location.state?.tab === 'signup') {
      setIsLogin(false);
    } else if (location.state?.tab === 'login') {
      setIsLogin(true);
    }
    if (location.state?.deletedNotice) {
      setError(location.state.deletedNotice);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch((window.API_BASE || "") + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        if (isLogin) {
          setSuccess("Welcome back! Redirecting...");
          // Save user data to localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          
          // Dispatch custom event for Navbar to sync
          window.dispatchEvent(new Event("user-login"));
          
          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = data.user.role === "ADMIN"
              ? "/admin/dashboard"
              : data.user.role === "INSTRUCTOR"
                ? "/"
                : "/dashboard/profile";
          }, 1000);
        } else {
          setSuccess("Account created successfully! You can now login.");
          setIsLogin(true);
          setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
        }
      } else {
        setError(data.message || "Authentication failed. Please try again.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Unable to connect to the server. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const formVariants = {
    initial: { opacity: 0, x: isLogin ? 20 : -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: isLogin ? -20 : 20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#F8FAFC]">
      {/* Ambient Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.4 },
          scale: { duration: 0.4 }
        }}
        className="w-full max-w-[1000px] grid lg:grid-cols-2 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden relative z-10"
      >
        {/* Left Side: Visual/Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/40 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10">
            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">FETC Portal</span>
            </motion.div>
            
            <motion.h2 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-4xl font-extrabold leading-[1.1] mb-6">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                Global Potential.
              </span>
            </motion.h2>
            <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-slate-400 text-lg font-medium max-w-sm mb-12">
              Join thousands of students who have successfully transformed their careers through our elite training and guidance.
            </motion.p>
            
            <div className="space-y-6">
              {[
                { text: "Personalized Career Analysis" },
                { text: "Exclusive Study Resources" },
                { text: "Direct Mentor Access" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="text-emerald-400" size={20} />
                  <span className="text-slate-300 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="relative z-10 pt-12 border-t border-white/10 flex items-center gap-4">
             <p className="text-xs text-slate-500 font-medium italic">
               "This platform completely changed my preparation strategy!"
             </p>
          </motion.div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white/40">
          <motion.div layout className="max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div 
                key={isLogin ? 'login-header' : 'signup-header'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-10 text-center lg:text-left"
              >
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-slate-500 font-medium">
                  {isLogin 
                    ? "Enter your credentials to access your dashboard." 
                    : "Start your journey with us today."}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mode Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 border border-slate-200 relative">
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-y-1 bg-white rounded-xl shadow-sm border border-slate-200/50"
                style={{ width: 'calc(50% - 4px)', left: isLogin ? '4px' : 'calc(50%)' }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
              <button 
                onClick={() => !isLogin && toggleMode()}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors relative z-10 ${isLogin ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Login
              </button>
              <button 
                onClick={() => isLogin && toggleMode()}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors relative z-10 ${!isLogin ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign Up
              </button>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium overflow-hidden"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-sm font-medium overflow-hidden"
                >
                  <CheckCircle2 size={18} className="shrink-0" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login-fields' : 'signup-fields'}
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-5"
                >
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                          <User size={18} />
                        </div>
                        <input 
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                      {isLogin && (
                        <Link 
                          to="/forgot-password" 
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                        >
                          Forgot Password?
                        </Link>
                      )}
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-300"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                          <Lock size={18} />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <motion.button 
                layout
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={isLogin ? 'signin-text' : 'signup-text'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight size={18} />
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.button>
            </form>

            <motion.p layout className="mt-10 text-center text-sm font-medium text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={toggleMode}
                className="ml-2 text-blue-600 font-bold hover:underline"
              >
                {isLogin ? "Join now" : "Log in"}
              </button>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}