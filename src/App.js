import React, { useEffect } from "react";
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useLocation,
  useNavigate
} from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { getApiUrl } from "./apiConfig";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CareerAssessmentPage from "./pages/CareerAssessmentPage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import MyAccountPage from "./pages/MyAccountPage";
import ExamDetailPage from "./pages/ExamDetailPage";
import ExamTrainingPage from "./pages/ExamTrainingPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import StudyAbroadPage from "./pages/StudyAbroadPage";
import StudyAbroadListingPage from "./pages/StudyAbroadListingPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import BecomePartnerPage from "./pages/BecomePartnerPage";
import GenericPage from "./pages/GenericPage";
import MockTestsPage from "./pages/MockTestsPage";
import ScrollToTop from "./components/ScrollToTop";
import NewsFlashBanner from "./components/NewsFlashBanner";
import WhatsAppWidget from "./components/WhatsAppWidget";
// User Imports
import UserLayout from "./components/user/UserLayout";
import ProfilePage from "./pages/ProfilePage";
import StartJourneyPage from "./pages/StartJourneyPage";
import UserSupport from "./pages/user/UserSupport";
import UserDoubts from "./pages/user/UserDoubts";
import UserVerification from "./pages/user/UserVerification";
import UserPayments from "./pages/user/UserPayments";
import UserMockTests from "./pages/user/UserMockTests";
import UserOrders from "./pages/user/UserOrders";

// Admin Imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPages from "./pages/admin/AdminPages";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminMockTest from "./pages/admin/AdminMockTest";
import AdminNewsFlash from "./pages/admin/AdminNewsFlash";
import AdminSupportTickets from "./pages/admin/AdminSupportTickets";
import AdminInvoice from "./pages/admin/AdminInvoice";
import AdminDoubts from "./pages/admin/AdminDoubts";
import AdminLeads from "./pages/admin/AdminLeads";
import EditLead from "./pages/admin/EditLead";

import AdminGuides from "./pages/admin/AdminGuides";
import AdminPartners from "./pages/admin/AdminPartners";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPath = location.pathname.startsWith('/admin');

  // Global Session Guard: Automatically logs out users if an admin deletes their account from DB
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      try {
        const user = JSON.parse(userStr);
        if (!user || (!user.id && !user.email)) return;

        const identifier = user.id ? `userId=${user.id}` : `email=${encodeURIComponent(user.email)}`;
        const response = await fetch(getApiUrl(`/api/auth/verify-session?${identifier}`), {
          headers: { "ngrok-skip-browser-warning": "true" }
        });

        const data = await response.json();

        // If user is deleted or not found in database
        if (!data.success && (response.status === 404 || data.deleted)) {
          if (!isMounted) return;
          console.warn("User account deleted in database. Terminating session.");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("user-logout"));

          const isProtectedRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
          if (isProtectedRoute) {
            navigate('/my-account', { 
              replace: true, 
              state: { deletedNotice: "Your account has been deleted by an administrator. You have been logged out." } 
            });
          }
        }
      } catch (err) {
        // Silently catch network errors during offline / loading states
      }
    };

    // Check on navigation
    verifySession();

    // Check when user switches back to this tab/window
    const handleFocus = () => verifySession();
    window.addEventListener("focus", handleFocus);

    // Heartbeat check every 12 seconds
    const interval = setInterval(verifySession, 12000);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!isAdminPath && <NewsFlashBanner />}
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/become-partner" element={<BecomePartnerPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about/company-profile" element={<CompanyProfilePage />} />
          <Route path="/study-abroad" element={<StudyAbroadListingPage />} />
          <Route path="/study-abroad/:country" element={<StudyAbroadPage />} />
          <Route path="/start-journey" element={<StartJourneyPage />} />
          <Route
            path="/career-assessment/behaviour-and-career-analysis"
            element={<CareerAssessmentPage />}
          />
          <Route path="/exam-training" element={<ExamTrainingPage />} />
          <Route path="/exam-training/:exam" element={<ExamDetailPage />} />
          {/* <Route path="/gallery" element={<GalleryPage />} /> */}
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/mock" element={<MockTestsPage />} />
          
          {/* Dynamic Catch-all Page Route */}
          <Route path="/p/*" element={<GenericPage />} />
          {/* Fallback for top-level slugs like /happy */}
          <Route path="/:slug" element={<GenericPage />} />
          
          {/* Admin Nested Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="mock-test" element={<AdminMockTest />} />
            <Route path="news-flash" element={<AdminNewsFlash />} />
            <Route path="support-tickets" element={<AdminSupportTickets />} />
            <Route path="invoice" element={<AdminInvoice />} />
            <Route path="doubts" element={<Navigate to="/admin/support-tickets" replace />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="leads/edit/:id" element={<EditLead />} />

            <Route path="partner-list" element={<AdminPartners />} />
            <Route path="guides" element={<AdminGuides />} />
          </Route>

          {/* User Dashboard Nested Routes */}
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="courses" element={<div className="p-8 text-slate-400 italic">My Courses component coming soon...</div>} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="payments" element={<Navigate to="/dashboard/orders" replace />} />
            <Route path="support" element={<UserSupport />} />
            <Route path="doubts" element={<Navigate to="/dashboard/support" replace />} />
            <Route path="verification" element={<UserVerification />} />
            <Route path="mock-tests" element={<UserMockTests />} />
          </Route>

          <Route path="/about" element={<Navigate to="/about/company-profile" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <WhatsAppWidget />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ScrollToTop />
        <AppContent />
      </MotionConfig>
    </BrowserRouter>
  );
}

export default App;
