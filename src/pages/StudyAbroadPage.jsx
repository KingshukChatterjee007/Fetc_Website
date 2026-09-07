import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Search, MapPin, Sparkles, Download, ChevronDown } from "lucide-react";
import { countryData as STATIC_FALLBACKS } from "../data/siteData";
import { getAssetUrl, getApiUrl } from "../apiConfig";
import { allUniversities } from "../data/allUniversitiesData";
import SafeImage from "../components/SafeImage";

function StudyAbroadPage() {
  const { country } = useParams();
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSopDropdownOpen, setIsSopDropdownOpen] = useState(false);

  const fetchCountryData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fallbackKey = country === 'united-kingdom' ? 'uk' : country;
      const fallback = STATIC_FALLBACKS[fallbackKey] || STATIC_FALLBACKS[country] || {};

      const apiUrl = getApiUrl(`/api/pages/study-abroad/${country}`);
      const response = await fetch(apiUrl, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success && data.page && data.page.content) {
        const dbContent = data.page.content;
        const mergedUniversities = (Array.isArray(dbContent.universities) && dbContent.universities.length > 0)
          ? dbContent.universities
          : (fallback.universities || []);

        const mergedSopLinks = (Array.isArray(dbContent.sopLinks) && dbContent.sopLinks.length > 0)
          ? dbContent.sopLinks
          : (dbContent.sopLink ? [{ label: "Download SOP", url: dbContent.sopLink }] : (fallback.sopLinks || (fallback.sopLink ? [{ label: "Download SOP", url: fallback.sopLink }] : [])));

        setPageData({
          ...fallback,
          ...dbContent,
          universities: mergedUniversities,
          sopLinks: mergedSopLinks
        });
      } else {
        setPageData(fallback && Object.keys(fallback).length > 0 ? fallback : null);
      }
    } catch (err) {
      console.error('Failed to fetch study abroad data:', err);
      const fallbackKey = country === 'united-kingdom' ? 'uk' : country;
      setPageData(STATIC_FALLBACKS[fallbackKey] || STATIC_FALLBACKS[country] || null);
    } finally {
      setIsLoading(false);
    }
  }, [country]);

  useEffect(() => {
    fetchCountryData();
  }, [fetchCountryData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold tracking-tight italic">Exploring {country.replace('-', ' ')}...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
          <Search size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">Oops! Country Info Missing</h1>
        <p className="text-slate-500 mb-8 font-medium">We haven't added the details for this destination to our CMS yet.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:underline">
          Go back home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
        <Link to="/" className="text-brand-600 hover:text-brand-800 transition-colors">
          Home
        </Link>
        <span className="mx-2 opacity-30">/</span>
        <span>Study Abroad</span>
        <span className="mx-2 opacity-30">/</span>
        <span className="text-slate-900">{pageData.name}</span>
      </div>

      {/* Hero Card */}
      <div className="grid gap-10 rounded-[3rem] bg-white p-6 shadow-soft ring-1 ring-slate-100/50 md:grid-cols-2 md:p-12 transition-all duration-500 hover:shadow-xl">
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-lg group aspect-[4/3] md:aspect-auto">
          <img
            src={pageData.image || "https://images.unsplash.com/photo-1526137630142-fca52b75e6e1?q=80&w=1287&auto=format&fit=crop"}
            alt={pageData.name}
            className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-10 h-1 bg-brand-600 rounded-full" />
            <span className="text-xs font-black text-brand-600 uppercase tracking-widest">Top Destination</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 md:text-6xl text-balance flex flex-wrap items-center gap-4">
            <span>Study in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">{pageData.name}</span></span>
            {(STATIC_FALLBACKS[country]?.flag || pageData.flag) && (
              <img
                src={STATIC_FALLBACKS[country]?.flag || pageData.flag}
                alt={`${pageData.name} flag`}
                className="h-10 md:h-12 w-auto object-contain rounded-lg filter drop-shadow-md select-none"
              />
            )}
          </h1>
          <p className="mt-8 text-lg md:text-xl leading-relaxed text-slate-500 font-medium">
            {pageData.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to={`/start-journey?country=${pageData.name}`}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-xl shadow-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600 hover:shadow-brand-100 active:scale-95"
            >
              Start Your Journey
            </Link>
            {Array.isArray(pageData.sopLinks) && pageData.sopLinks.filter(s => s && (typeof s === 'string' || s.url)).length > 1 ? (
              <div className="relative">
                <button
                  onClick={() => setIsSopDropdownOpen(!isSopDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsSopDropdownOpen(false), 200)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl shadow-slate-200 ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:text-brand-600 hover:shadow-brand-100/50 active:scale-95"
                >
                  <Download size={20} />
                  Download SOP
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isSopDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSopDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full min-w-[240px] rounded-2xl bg-white p-2 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 z-50">
                    {pageData.sopLinks.filter(s => s && (typeof s === 'string' || s.url)).map((sop, idx) => {
                      const href = typeof sop === 'string' ? sop : sop?.url;
                      const label = typeof sop === 'string' ? `SOP ${idx + 1}` : sop?.label || `SOP ${idx + 1}`;
                      return (
                        <a
                          key={idx}
                          href={href}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
                        >
                          <Download size={16} />
                          {label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (() => {
              const validSopLinks = Array.isArray(pageData.sopLinks)
                ? pageData.sopLinks.filter(s => s && (typeof s === 'string' || s.url))
                : [];
              const singleSopUrl = validSopLinks.length > 0
                ? (typeof validSopLinks[0] === 'string' ? validSopLinks[0] : validSopLinks[0].url)
                : (typeof pageData.sopLink === 'string' ? pageData.sopLink : pageData.sopLink?.url);

              if (!singleSopUrl) return null;

              return (
                <a
                  href={singleSopUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl shadow-slate-200 ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:text-brand-600 hover:shadow-brand-100/50 active:scale-95"
                >
                  <Download size={20} />
                  Download SOP
                </a>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Universities Grid */}
      {pageData.universities && pageData.universities.length > 0 && (
        <div className="mt-24">
          <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                Elite Universities
              </h2>
              <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest italic flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" /> Discover your perfect match in {pageData.name}
              </p>
            </div>

            <div className="relative w-full max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder={`Search universities...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-100 bg-white py-4 pl-14 pr-6 text-sm font-bold text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-300 hover:border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:shadow-[0_0_25px_rgba(59,130,246,0.15)] shadow-soft"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pageData.universities
              .filter(uni => !uni.name.toLowerCase().includes("mbbs") && uni.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((uni, idx) => (
                <Link
                  key={idx}
                  to="/contact"
                  className="group relative flex h-full flex-col justify-between rounded-[2.5rem] bg-white p-8 border border-slate-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-brand-100"
                >
                  {uni.exclusive && (
                    <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2 text-[9px] font-black uppercase tracking-widest text-white shadow-xl ring-4 ring-white">
                      Exclusive Partner
                    </span>
                  )}

                  <div className="mb-10 flex h-32 w-full items-center justify-center relative p-4">
                    <div className="absolute inset-0 bg-slate-50/50 rounded-3xl -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {(() => {
                      const findLocalLogo = (name) => {
                        if (!name) return null;
                        const lower = name.toLowerCase().trim();
                        for (const list of Object.values(allUniversities)) {
                          if (!Array.isArray(list)) continue;
                          const found = list.find(u => u.name && (u.name.toLowerCase().includes(lower) || lower.includes(u.name.toLowerCase())));
                          if (found && found.image) return found.image;
                        }
                        return null;
                      };

                      const localLogo = findLocalLogo(uni.name);
                      const resolvedImg = localLogo
                        ? localLogo
                        : (uni.image && typeof uni.image === 'string' && !uni.image.includes('wikimedia') ? getAssetUrl(uni.image) : null);

                      return resolvedImg ? (
                        <SafeImage
                          src={resolvedImg}
                          alt={uni.name}
                          className="h-full w-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 text-2xl font-black text-brand-600 relative z-10 shadow-inner">
                          {uni.name ? uni.name.charAt(0) : "U"}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-center text-base font-black text-slate-800 transition-colors duration-300 group-hover:text-brand-600 leading-tight mb-4">
                      {uni.name}
                    </h3>

                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-50 relative group-hover:border-brand-50 transition-colors">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400">
                        <span className="flex items-center gap-1.5 group-hover:text-amber-500 transition-colors">
                          <MapPin size={12} /> {uni.location || pageData.name}
                        </span>
                        <span className="px-2 py-1 bg-slate-50 rounded-lg group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                          {uni.ranking || "Top Ranked"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Indicator */}
                  <div className="mt-6 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-1.5">
                      Contact Us <Sparkles size={10} />
                    </span>
                  </div>
                </Link>
              ))}
          </div>

          {pageData.universities.filter(uni => !uni.name.toLowerCase().includes("mbbs") && uni.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-bold italic">No universities match your search...</p>
            </div>
          )}
        </div>
      )}

      {/* MBBS Section (Only for Europe) */}
      {country === "europe" && (
        <div className="mt-28 border-t border-slate-100 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-4 px-4 py-2 bg-brand-50 rounded-full">
              <Sparkles size={12} className="text-amber-400" /> Medical Education
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Study <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">MBBS in Europe</span>
            </h2>
            <p className="mt-4 text-base text-slate-500 font-semibold leading-relaxed">
              Explore premier destinations in Europe offering globally recognized medical programs with state-of-the-art infrastructure. Download brochures and guides below.
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            {[
              {
                country: "Italy",
                flag: "/assets/countries/italy.jpeg",
                university: "Top Public Medical Universities",
                tagline: "DSU Scholarships & World-Class Education",
                pdfs: [
                  {
                    label: "Free Education in Italy",
                    url: "/Free Education in Italy.pdf"
                  }
                ],
                details: (
                  <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                    <p className="font-bold text-slate-800 text-base">Why Study in Italy?</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>English-Medium Programs:</strong> Numerous top-tier public universities offer MBBS completely in English.</li>
                      <li><strong>World-Ranked Education:</strong> Medical degrees are recognized globally, including WHO, NMC, GMC &amp; UK.</li>
                      <li><strong>Low Tuition Fees:</strong> Public university fees range from just €500 to €4,000 per year.</li>
                      <li><strong>DSU Scholarship:</strong> Up to 100% scholarship from 1st year onwards, covering tuition, accommodation, and meal allowance.</li>
                      <li><strong>IMAT Entrance Exam:</strong> Unified admission exam required for public medical schools.</li>
                    </ul>
                  </div>
                )
              },
              {
                country: "Hungary",
                flag: "/assets/countries/hungary.jpeg",
                university: "University of Pécs",
                tagline: "The Oldest University in Hungary",
                pdfs: [],
                details: (
                  <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                    <div>
                      <p className="font-bold text-slate-800 text-base">General Medicine (MBBS Equivalent)</p>
                      <p className="text-brand-600 font-bold">Duration: 6 Years</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-slate-800">Why Choose Pécs?</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>EU-Recognized Degree</li>
                          <li>UK Career Pathway Available</li>
                          <li>Practice Across Multiple European Countries</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Fee Structure</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Application &amp; Entrance Exam Fee: 500 Euros</li>
                          <li>Tuition Fee: 16,900 Euros per Year (Approx.)</li>
                        </ul>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                      <div>
                        <p className="font-bold text-slate-800">Scholarship Opportunity</p>
                        <p className="text-green-600 font-bold">Up to 100% Scholarship from 2nd Year Onwards*</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Other Programs Available</p>
                        <p className="text-xs">Dentistry, Pharmacy, MSc Biotechnology, BSc Biotechnology</p>
                      </div>
                    </div>
                  </div>
                )
              },
              {
                country: "Slovakia",
                flag: "/assets/countries/slovakia.jpeg",
                university: "Comenius University",
                tagline: "Build a Global Medical Career",
                pdfs: [],
                details: (
                  <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                    <div>
                      <p className="font-bold text-slate-800 text-base">MBBS Program</p>
                      <p className="text-brand-600 font-bold">Duration: 6 Years</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-slate-800">Key Advantages</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Strong Hospital-Based Clinical Training</li>
                          <li>Career Opportunities in Germany, France, Finland &amp; UK</li>
                          <li>PR-Friendly Destination</li>
                          <li>Excellent International Career Prospects</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Fee Structure</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Application Fee: 70 Euros</li>
                          <li>Tuition Fee: 11,500 Euros per Year</li>
                        </ul>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                      <div>
                        <p className="font-bold text-slate-800">Scholarship Opportunity</p>
                        <p className="text-green-600 font-bold">Up to 50% Scholarship from 2nd Year Onwards*</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Career Potential</p>
                        <p className="text-xs">Average Medical Professional Salary: <strong>€80,000–€90,000 per Year*</strong> (dependent on country, licensing, specialization &amp; experience)</p>
                      </div>
                    </div>
                  </div>
                )
              },
              {
                country: "Czech Republic",
                flag: "/assets/countries/czech-republic.png",
                university: "University of Ostrava",
                tagline: "Study Medicine in the Heart of Europe",
                pdfs: [],
                details: (
                  <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                    <div>
                      <p className="font-bold text-slate-800 text-base">Medicine Program</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-slate-800">Why Students Choose Ostrava</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Multiple Teaching Hospitals</li>
                          <li>Career Opportunities in Germany, France, Finland &amp; UK</li>
                          <li>International Mobility &amp; Recognition</li>
                          <li>PR &amp; Settlement Opportunities</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Fee Structure</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Application Fee: 80 Euros</li>
                          <li>Tuition Fee: 12,000 Euros per Year</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              }
            ].map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-soft hover:shadow-[0_30px_60px_rgba(59,130,246,0.06)] hover:-translate-y-1 transition-all duration-500"
              >
                {/* Left side: Country Box */}
                <div className="col-span-1 flex flex-col justify-between items-center text-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 min-h-[250px] lg:min-h-auto">
                  <div className="w-full">
                    <div className="mb-4 h-40 w-full flex items-center justify-center relative overflow-hidden">
                      <img
                        src={item.flag}
                        alt={`${item.country} Flag`}
                        className="h-32 w-auto object-contain rounded-xl shadow-md transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                      MBBS in {item.country}
                    </h3>
                    <p className="text-brand-600 font-bold text-xs mt-2 uppercase tracking-wider">
                      {item.university}
                    </p>
                    <p className="text-slate-400 text-[10px] font-semibold mt-1">
                      {item.tagline}
                    </p>
                  </div>

                  {item.pdfs && item.pdfs.length > 0 && (
                    <div className="w-full mt-6 space-y-2">
                      {item.pdfs.map((pdf, pIdx) => (
                        <a
                          key={pIdx}
                          href={pdf.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-3 px-4 shadow-md transition-all duration-300 active:scale-95"
                        >
                          <Download size={14} />
                          {pdf.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side: Detailed Information */}
                <div className="col-span-2 flex flex-col justify-center px-2 lg:px-4">
                  {item.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helpful Resources Section */}
      <div className="mt-28 border-t border-slate-100 pt-20 pb-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-4 px-4 py-2 bg-brand-50 rounded-full">
            <Download size={12} /> Resource Center
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Helpful <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Resources</span>
          </h2>
          <p className="mt-4 text-base text-slate-500 font-semibold leading-relaxed">
            Essential downloads, roadmap guides, and checklists to plan and execute your study abroad journey seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {(country === "europe" ? [
            {
              label: "Free Education in Italy",
              description: "Learn how you can study in Italy with zero tuition fees under various scholarship schemes.",
              url: "/AA.pdf"
            },
            {
              label: "Study Medicine in Europe",
              description: "A comprehensive guide to studying MBBS/MD in top European medical universities.",
              url: "/STUDY Medicine in Europe.pdf"
            },
            {
              label: "Financial Planning Checklist",
              description: "Plan your funds, tuition fees, and living cost estimates with this comprehensive tracking list.",
              url: "https://drive.google.com/file/d/1wX99-y42WJNS8U8uAiS3xQzUrpiivcUM/view?usp=drive_link"
            },
            {
              label: "Road Map Study Abroad",
              description: "A complete step-by-step master plan tracing your timeline from exams to university intake.",
              url: "https://drive.google.com/file/d/139BsYSsVSIPziOebKWNL8StFU7LGs6P3/view?usp=drive_link"
            }
          ] : [
            {
              label: "Financial Planning Checklist",
              description: "Plan your funds, tuition fees, and living cost estimates with this comprehensive tracking list.",
              url: "https://drive.google.com/file/d/1wX99-y42WJNS8U8uAiS3xQzUrpiivcUM/view?usp=drive_link"
            },
            {
              label: "Part time job and internships",
              description: "Explore regulations, work hour limits, and potential job portals for international students.",
              url: "https://drive.google.com/file/d/1iXz--uNuiuBBHnNv8yX3khWjzBhUspyG/view?usp=drive_link"
            },
            {
              label: "Road Map Study Abroad",
              description: "A complete step-by-step master plan tracing your timeline from exams to university intake.",
              url: "https://drive.google.com/file/d/139BsYSsVSIPziOebKWNL8StFU7LGs6P3/view?usp=drive_link"
            },
            {
              label: "Service Provider Agreement",
              description: "Understand the terms of engagement and the transparent guarantees FETC offers.",
              url: "https://drive.google.com/file/d/16RCN90tqMDusAexTX6L2fKCLu92XSZYh/view?usp=drive_link"
            }
          ]).map((res, index) => (
            <a
              key={index}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 shadow-soft hover:shadow-[0_20px_50px_rgba(59,130,246,0.08)] hover:-translate-y-1 hover:border-brand-100 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                  <Download size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2 group-hover:text-brand-600 transition-colors">
                  {res.label}
                </h3>
                <p className="text-xs font-semibold text-slate-400 leading-relaxed mb-6">
                  {res.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-brand-600 group-hover:text-indigo-600 transition-colors">
                Download PDF &rarr;
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

export default StudyAbroadPage;
