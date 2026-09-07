import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Share2,
  Zap, Ticket, Menu, X, HelpCircle, LogOut,
  ClipboardList, BookOpen, CheckSquare, Handshake,
  MessageSquare, LifeBuoy, Receipt
} from 'lucide-react';
import { getProfileImageUrl } from "../../apiConfig";
import SafeImage from "../SafeImage";
import { useGlobalModalScrollLock } from "../../hooks/useScrollLock";

const AdminLayout = () => {
  useGlobalModalScrollLock();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isCollapsed = false;
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      try {
        const u = localStorage.getItem('user');
        setUserData(u ? JSON.parse(u) : null);
      } catch {
        setUserData(null);
      }
    };
    window.addEventListener("user-login", handleUserUpdate);
    window.addEventListener("user-logout", handleUserUpdate);
    return () => {
      window.removeEventListener("user-login", handleUserUpdate);
      window.removeEventListener("user-logout", handleUserUpdate);
    };
  }, []);

  const userRole = userData?.role;
  const isAdmin = userRole === 'ADMIN';
  const isInstructor = userRole === 'INSTRUCTOR';

  // Strict route protection: Admin panel & Lead management is strictly for ADMIN and INSTRUCTOR, not USER
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!userData && !token) {
      navigate('/my-account', { replace: true });
      return;
    }

    if (userData && !isAdmin && !isInstructor) {
      navigate('/dashboard/profile', { replace: true });
      return;
    }

    if (isInstructor) {
      const allowedPaths = [
        '/admin/news-flash',
        '/admin/support-tickets',
        '/admin/invoice',
        '/admin/leads',
        '/admin/partner-list'
      ];
      const isAllowed = allowedPaths.some(p => location.pathname.startsWith(p));
      if (!isAllowed) {
        navigate('/admin/leads', { replace: true });
      }
    }
  }, [userData, isAdmin, isInstructor, location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event("user-logout"));
    navigate('/my-account');
  };

  const allSidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard", roles: ["ADMIN"] },
    { icon: BookOpen, label: "Courses", path: "/admin/courses", roles: ["ADMIN"] },
    { icon: Users, label: "Users", path: "/admin/users", roles: ["ADMIN"] },
    { icon: FileText, label: "Pages", path: "/admin/pages", roles: ["ADMIN"] },
    { icon: Share2, label: "Posts", path: "/admin/posts", roles: ["ADMIN"] },
    { icon: CheckSquare, label: "Mock Test", path: "/admin/mock-test", roles: ["ADMIN"] },
    { icon: MessageSquare, label: "News Flash", path: "/admin/news-flash", roles: ["ADMIN", "INSTRUCTOR"] },
    { icon: LifeBuoy, label: "Support Tickets", path: "/admin/support-tickets", roles: ["ADMIN", "INSTRUCTOR"] },
    { icon: Receipt, label: "Invoice", path: "/admin/invoice", roles: ["ADMIN", "INSTRUCTOR"] },
    { icon: ClipboardList, label: "Leads Dashboard", path: "/admin/leads", roles: ["ADMIN", "INSTRUCTOR"] },
    { icon: Handshake, label: "Partner List", path: "/admin/partner-list", roles: ["ADMIN", "INSTRUCTOR"] },
  ];

  const sidebarItems = isInstructor
    ? allSidebarItems.filter(item => item.roles.includes("INSTRUCTOR"))
    : allSidebarItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden bg-white/95 backdrop-blur-md border-r border-slate-200/70 shadow-xs">
      {/* Brand Header */}
      <div className={`h-[64px] flex items-center justify-between border-b border-slate-100 ${isCollapsed ? 'justify-center px-4' : 'px-5'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
            <Zap className="text-white fill-white/20" size={16} />
          </div>
          {!isCollapsed && (
            <div className="leading-none">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                {isInstructor ? 'Instructor Panel' : 'FETC'}
              </h2>
              <span className="text-[10px] font-semibold text-slate-400 tracking-[0.1em] uppercase leading-none mt-0.5 block">
                {isInstructor ? 'Instructor Portal' : 'Admin Portal'}
              </span>
            </div>
          )}
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 rounded-xl transition-all">
          <X size={18} />
        </button>
      </div>

      {/* Menu Navigation */}
      <div className={`flex-1 overflow-y-auto py-3 space-y-1 custom-scrollbar transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {sidebarItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end={item.path === "/admin"}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => `
              group relative flex items-center rounded-xl transition-all duration-200 font-medium text-[13.5px] leading-tight
              ${isCollapsed
                ? 'justify-center w-10 h-10 mx-auto'
                : 'gap-3 px-3.5 py-2.5 mx-0 w-full'}
              ${isActive
                ? 'bg-blue-50/90 text-blue-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'}
            `}
            title={isCollapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={18}
                  className={`shrink-0 stroke-[1.8px] transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? "text-blue-600 stroke-[2.2px]" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {!isCollapsed && <span>{item.label}</span>}
                {isActive && (
                  <div className={`absolute bg-blue-600 rounded-full ${isCollapsed
                      ? 'right-1 top-2 bottom-2 w-1'
                      : 'left-0 top-2 bottom-2 w-1 rounded-r-full'
                    }`} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* User Profile & Logout at bottom */}
      <div className={`border-t border-slate-100/80 bg-slate-50/50 transition-all duration-300 ${isCollapsed
          ? 'p-3 flex flex-col items-center gap-3'
          : 'p-4 space-y-3'
        }`}>
        <div className="flex items-center gap-3 w-full">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white border border-slate-200/80 shadow-xs">
            {userData?.profile_image ? (
              <SafeImage src={getProfileImageUrl(userData.profile_image)} alt={userData.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs">
                {userData?.name ? userData.name[0].toUpperCase() : 'A'}
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-slate-800 truncate leading-snug">{userData?.name || "Admin User"}</h4>
              <span className="text-[10px] font-medium text-slate-400 capitalize tracking-wider">{userData?.role?.toLowerCase() || "admin"} user</span>
            </div>
          )}
        </div>

        {isCollapsed ? (
          <button
            onClick={handleLogout}
            className="w-9 h-9 flex items-center justify-center border border-slate-200/80 rounded-xl text-slate-500 hover:bg-white hover:text-slate-800 transition-all shadow-xs"
            title="Logout"
          >
            <LogOut size={15} className="stroke-[1.8]" />
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-all shadow-xs"
          >
            <LogOut size={14} className="stroke-[1.8]" />
            LOGOUT
          </button>
        )}
      </div>
    </div>
  );

  if (!isAdmin && !isInstructor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative">
      {/* Dynamic Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[0%] w-[45%] h-[45%] bg-blue-200/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-100/10 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Header Overlay - Adjusted for main Navbar presence */}
      <div className="lg:hidden fixed top-24 left-6 right-6 z-[4000] flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-4 bg-white border border-slate-200 rounded-md shadow-md text-slate-800 hover:text-brand-600 transition-all active:scale-95"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-md border border-slate-200 shadow-sm">
          <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white">
            <Zap size={12} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            {isInstructor ? 'Instructor' : 'Admin'}
          </span>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col h-[calc(100vh-80px)] fixed top-[80px] left-0 bottom-0 z-[2000] bg-white border-r border-slate-200 shrink-0 transition-all duration-300 ${isCollapsed ? 'w-[76px]' : 'w-[260px]'}`}>
        <div className="h-full flex flex-col relative">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[5000] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white lg:hidden flex flex-col overflow-hidden border-r border-slate-200 z-[5001] shadow-2xl"
            >
              <div className="relative z-10 h-full">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`flex-1 relative z-10 w-full transition-all duration-300 ${isCollapsed ? 'lg:ml-[76px]' : 'lg:ml-[260px]'}`}>
        <div className="pt-28 pb-16 px-4 md:px-6 lg:pt-5 lg:pb-16 lg:px-8 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
