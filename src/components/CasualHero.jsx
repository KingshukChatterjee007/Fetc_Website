import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Users, GraduationCap, Briefcase, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssetUrl } from "../apiConfig";

// Import new full-length banners
import banner1 from "../assets/logo/banner 1.png";
import banner2 from "../assets/logo/banner 2.png";
import banner3 from "../assets/logo/banner 3.png";

const CasualHero = ({ content }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
    };
    window.addEventListener("user-login", checkLogin);
    window.addEventListener("user-logout", checkLogin);
    return () => {
      window.removeEventListener("user-login", checkLogin);
      window.removeEventListener("user-logout", checkLogin);
    };
  }, []);

  const defaultSlides = [
    {
      image: banner1,
      field: "Medical & Health",
      position: "object-right"
    },
    {
      image: banner2,
      field: "Law & Justice",
      position: "object-right md:object-[95%_center]"
    },
    {
      image: banner3,
      field: "Engineering & Tech",
      position: "object-right md:object-[95%_center]"
    }
  ];

  const rawBanners = content?.banners || (content?.bgImage ? [content.bgImage] : null);
  const validCustomBanners = Array.isArray(rawBanners) 
    ? rawBanners.filter(img => {
        if (!img) return false;
        if (typeof img === 'string') return img.trim() !== '';
        return Boolean(img.url || img.image);
      })
    : null;

  const slides = (validCustomBanners && validCustomBanners.length > 0)
    ? validCustomBanners.map((img, idx) => ({
        image: typeof img === 'string' ? getAssetUrl(img) : getAssetUrl(img.url || img.image || img),
        field: `Banner ${idx + 1}`,
        position: "object-right"
      }))
    : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (slides.length || 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const defaultContent = {
    badge: "Your Future, Simplified ✨",
    titleMain: "Dream Big. We'll",
    titleHighlight: "Handle the Rest.",
    subtitle: "Forget the stress of paperwork. We make your journey to international education smooth, fun, and totally achievable.",
    buttonText: "Let's Get Started"
  };

  const finalContent = { ...defaultContent, ...content };

  return (
    <section className="relative flex items-center pt-28 pb-10 overflow-hidden bg-slate-50">
      {/* Textured Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-10" 
        style={{ backgroundImage: `radial-gradient(#1e293b 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}
      />

      {/* Dynamic Full-Length Background Banner Slider */}
      <div className="absolute inset-0 z-0 select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={slides[currentIndex]?.image || defaultSlides[currentIndex % defaultSlides.length]?.image || defaultSlides[0].image} 
              alt={slides[currentIndex]?.field || 'Hero Banner'} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultSlides[currentIndex % defaultSlides.length]?.image || defaultSlides[0].image;
              }}
              className={`w-full h-full object-cover ${slides[currentIndex]?.position || 'object-right'}`}
            />
            {/* Soft gradient overlay to blend left side with white background for maximum text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full flex justify-center lg:justify-start">
        {/* Beautiful Glassmorphic Box Behind Heading Content */}
        <div className="max-w-[580px] w-full bg-white/55 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-white/80 shadow-[0_45px_90px_rgba(0,0,0,0.05)] space-y-5 text-center lg:text-left relative overflow-hidden">
          {/* Subtle light leak effect inside the box */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-200/10 rounded-full blur-[60px] pointer-events-none" />

          {/* Sparkles Badge & Interactive Field Switchers */}
          <div className="space-y-3 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/90 border border-orange-100 rounded-full text-orange-600 text-sm font-bold shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {finalContent.badge}
            </motion.div>


          </div>

          {/* Heading with Underline Svg */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative z-10"
          >
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              {finalContent.titleMain} <br />
              <span className="relative inline-block bg-gradient-to-r from-brand-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                {finalContent.titleHighlight}
                <motion.svg 
                  viewBox="0 0 300 20" 
                  className="absolute -bottom-2 left-0 w-full h-4 text-orange-400/60"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <path 
                    d="M5 15Q150 5 295 15" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                  />
                </motion.svg>
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-700 font-semibold leading-relaxed max-w-xl mx-auto lg:mx-0 relative z-10"
          >
            {finalContent.subtitle}
          </motion.p>

          {/* Action Buttons with Proper Padding */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 relative z-10"
          >
            <Link
              to={isLoggedIn ? "/dashboard/verification" : "/career-assessment/behaviour-and-career-analysis"}
              className="group flex items-center justify-center gap-3 bg-brand-600 text-white font-bold px-8 py-3.5 rounded-full text-base transition-all hover:bg-brand-700 hover:shadow-lg hover:-translate-y-1 active:translate-y-0"
            >
              <span>{isLoggedIn ? "Start Enrollment" : finalContent.buttonText}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            
            <Link
              to="/about/company-profile"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/80 backdrop-blur-sm rounded-full font-bold text-slate-700 hover:bg-white border border-slate-200 shadow-sm transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Combined Quick Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-4 flex flex-wrap justify-center lg:justify-start gap-6 items-center border-t border-slate-200/60 mt-6 relative z-10"
          >
            <div className="flex items-center gap-2.5 text-slate-700 font-bold text-sm">
              <Users className="w-5 h-5 text-brand-600" />
              <span>5k+ Happy Students</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 font-bold text-sm">
              <GraduationCap className="w-5 h-5 text-brand-600" />
              <span>100+ Universities</span>
            </div>
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-100 shadow-md">
              <span className="text-2xl font-black text-brand-600 leading-none">98%</span>
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Visa</p>
                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none">Success</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CasualHero;
