import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  User, HelpCircle, Settings, LogOut, Menu, X,
  MessageCircle, FileCheck, BookOpen, ShoppingBag,
  CreditCard, ClipboardCheck
} from 'lucide-react';
import { getProfileImageUrl } from "../../apiConfig";
import SafeImage from "../SafeImage";

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => 
    JSON.parse(localStorage.getItem('user') || '{"name":"User"}')
  );

  useEffect(() => {
    const handleUserUpdate = () => {
      setUserData(JSON.parse(localStorage.getItem('user') || '{"name":"User"}'));
    };
    window.addEventListener("user-login", handleUserUpdate);
    window.addEventListener("user-logout", handleUserUpdate);
    return () => {
      window.removeEventListener("user-login", handleUserUpdate);
      window.removeEventListener("user-logout", handleUserUpdate);
    };
  }, []);

  const sidebarItems = [
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: BookOpen, label: "My Courses", path: "/dashboard/courses" },
    { icon: ShoppingBag, label: "My Orders & Payments", path: "/dashboard/orders" },
    { icon: HelpCircle, label: "Support", path: "/dashboard/support" },
    { icon: FileCheck, label: "Document Verification Portal", path: "/dashboard/verification" },
    { icon: ClipboardCheck, label: "Mock Test Remaining", path: "/dashboard/mock-tests" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event("user-logout"));
    navigate('/my-account');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-fit w-full overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden">
             {userData.profile_image ? (
               <SafeImage src={getProfileImageUrl(userData.profile_image)} alt={userData.name} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                 <User className="text-white" size={16} />
               </div>
             )}
          </div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">My<span className="text-slate-500"> Account</span></h2>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <X size={18} />
        </button>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto">
        {sidebarItems.filter(item => !(item.path === "/dashboard/verification" && (userData?.role === "ADMIN" || userData?.role === "INSTRUCTOR"))).map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => `
              w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors
              ${isActive 
                ? "bg-slate-900 text-white" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
            `}
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}

        {userData?.role === "ADMIN" && (
           <NavLink
            to="/admin/dashboard"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-900 hover:bg-slate-50 border border-slate-200 mt-3"
          >
            <Settings size={16} />
            Admin Panel
          </NavLink>
        )}

        {userData?.role === "INSTRUCTOR" && (
           <NavLink
            to="/admin/news-flash"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-900 hover:bg-slate-50 border border-slate-200 mt-3"
          >
            <Settings size={16} />
            Instructor Panel
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-clip">
      {/* Mobile Toolbar */}
      <div className="lg:hidden fixed top-32 left-6 right-6 z-[2000] flex items-center justify-between">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 mt-2 sticky top-24 hidden lg:flex flex-col h-fit max-h-[calc(100vh-140px)] z-20 m-6">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden relative">
          <div className="relative z-10 h-full">
            <SidebarContent />
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay & Panel */}
      {isSidebarOpen && (
        <>
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-[4000] lg:hidden"
          />
          <aside className="fixed top-32 left-6 right-6 md:left-auto md:right-6 md:w-[300px] h-fit bg-white border border-slate-200 z-[5000] rounded-xl shadow-lg lg:hidden flex flex-col overflow-hidden">
            <div className="relative z-10 h-full">
              <SidebarContent />
            </div>
          </aside>
        </>
      )}

      {/* Content */}
      <main className="flex-1 relative z-10">
        <div className="p-6 md:p-8 pt-44 lg:pt-8 min-h-screen">
          <Outlet context={{ user: userData }} />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
