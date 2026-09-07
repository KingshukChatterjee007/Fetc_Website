const db = require('../../db');

const initialPageData = [
  // 1. HOME PAGE - Exact word-for-word text matching live website components
  {
    slug: '/',
    title: 'Home',
    status: 'PUBLISHED',
    nav_visibility: 'navbar',
    seo_title: 'FETC - Foreign English Tests Capital | Study Abroad & Exam Prep',
    seo_description: 'Empowering students with digital classrooms, official IELTS/PTE training, and international university admissions.',
    content: {
      hero: {
        badge: "Your Future, Simplified ✨",
        banners: [
          "/assets/logo/banner 1.png",
          "/assets/logo/banner 2.png",
          "/assets/logo/banner 3.png"
        ],
        titleMain: "Dream Big. We'll",
        titleHighlight: "Handle the Rest.",
        subtitle: "Forget the stress of paperwork. We make your journey to international education smooth, fun, and totally achievable.",
        buttonText: "Start Enrollment"
      },
      trustBar: {
        message: "WORKING WITH 100+ AMAZING UNIVERSITIES TO GET YOU THERE"
      },
      studyAbroad: {
        title: "Explore the World",
        badgeText: "Global Vibes",
        description: "Pick your dream destination and let us handle the boring stuff. We've helped thousands of students settle in over 10+ countries.",
        linkText: "Start My Adventure",
        stats: [
          { value: "100+", label: "Universities" },
          { value: "10+", label: "Destinations" },
          { value: "98%", label: "Visa Success" }
        ]
      },
      features: {
        sectionTitle: "Why Students Love Us",
        sectionSubtitle: "We're not your typical consultants. We care about your journey as much as you do.",
        items: [
          {
            title: "Friendly Mentors",
            desc: "Learn from people who have been there. Our mentors are here to guide you, not just lecture you.",
            metric: "50+",
            label: "Elite Mentors"
          },
          {
            title: "98% Visa Success",
            desc: "We've got visa processing down to a science. Relax, we've done this thousands of times.",
            metric: "98%",
            label: "Approval Rate"
          },
          {
            title: "Real Result Boost",
            desc: "Our AI-powered mock tests show you exactly where to improve so you can ace your exams.",
            metric: "2+",
            label: "Band Increase"
          },
          {
            title: "Global Reach",
            desc: "From London to Sydney, we have partners all over the world waiting to welcome you.",
            metric: "10+",
            label: "Countries"
          }
        ]
      },
      examTraining: {
        title: "Ace Your Exams",
        badgeText: "Top Coaching",
        description: "We make exam prep feel like a breeze with expert coaching and real mock tests.",
        linkText: "Check Courses",
        stats: [
          { value: "100%", label: "Result Boost" },
          { value: "200+", label: "Mock Tests" },
          { value: "Expert", label: "1-on-1 Mentors" }
        ]
      },
      howItWorks: {
        badgeText: "Your Success Blueprint",
        title: "How We Get You There",
        subtitle: "A proven 3-step process that has helped 5,000+ students achieve their global education dreams.",
        steps: [
          {
            number: "01",
            title: "Discovery Call",
            desc: "Connect with our senior experts to map out your ambitions, evaluate your profile, and build a personalized roadmap."
          },
          {
            number: "02",
            title: "Strategic Training",
            desc: "Enroll in our high-precision prep programs — IELTS, PTE, TOEFL — with AI-driven mock tests and 1-on-1 mentoring."
          },
          {
            number: "03",
            title: "Arrival & Success",
            desc: "Secure your visa, finalize admissions, and begin your international journey with end-to-end post-landing support."
          }
        ]
      },
      careerAssessment: {
        title: "Find Your Path",
        badgeText: "Smart Career",
        description: "Not sure what to study? Our AI-powered analysis helps you discover your strengths and the perfect career to match."
      },
      welcomeSection: {
        badge: "Together with Gina Abroad",
        title: "Why Choose FETC?",
        subtitle: "We're more than just consultants. We're your friends on this big journey, making sure every step—from exams to your new dorm—is as easy as it should be.",
        highlights: [
          "Learning That Fits You",
          "Smart AI Mock Tests",
          "Stress-Free Visa Help",
          "Support Even After You Land"
        ],
        cards: [
          {
            title: "Learn Your Way",
            desc: "Casual, fun, and super effective language training with mentors who actually care.",
            tag: "Learning"
          },
          {
            title: "Testing Made Easy",
            desc: "We're an official center for all the big exams. We'll help you ace them without the stress.",
            tag: "Testing"
          },
          {
            title: "Go Anywhere",
            desc: "10+ countries, hundreds of universities. We'll help you find the one that feels like home.",
            tag: "Global"
          },
          {
            title: "Smart Futures",
            desc: "Our AI helps you figure out what you're naturally good at, so you pick the right career.",
            tag: "AI Powered"
          }
        ]
      },
      contactCTA: {
        badge: "Let's Connect",
        title: "Ready to Start Your Global Chapter?",
        subtitle: "Schedule your one-on-one session with our senior experts today. Your success story begins with a single conversation.",
        contacts: [
          { label: "Call Us Directly", value: "+91-9033347200 to 09" },
          { label: "Email Support", value: "info@fetc.in" },
          { label: "Visit Our Centre", value: "Surat, Gujarat, India" },
          { label: "Working Hours", value: "Mon – Sat, 9AM – 7PM" }
        ]
      }
    }
  },

  // 2. COMPANY PROFILE / ABOUT US - Exact word-for-word text
  {
    slug: '/about',
    title: 'Company Profile',
    status: 'PUBLISHED',
    nav_visibility: 'navbar',
    seo_title: 'About FETC | Foreign English Tests Capital',
    seo_description: 'Learn about FETC, an authorized English examination and training center headquartered in Surat, Gujarat under Gina Abroad Pvt. Ltd.',
    content: {
      hero: {
        badge: "About FETC",
        title: "Building Global Careers",
        titleHighlight: "Since 1999",
        description: "FETC is an authorized, state-of-the-art English examination and training center headquartered in Surat, Gujarat. We are a dream project under Gina Abroad Pvt. Ltd., empowering students with digital classrooms and authorized examination spaces."
      },
      stats: [
        { value: "27+", label: "Years of Industry Experience" },
        { value: "5,000+", label: "Candidates Trained" },
        { value: "5+", label: "State-of-the-art Centres" },
        { value: "15+", label: "Countries Served" },
        { value: "100%", label: "Tech-enabled Testing Labs" }
      ],
      aboutUs: {
        partnershipTag: "Our Partnership",
        partnershipTitle: "Expanding Opportunities Together",
        partnershipDesc1: "We're excited to collaborate with R.H. Patel Institute of Technology to expand opportunities for your students and enhance faculty development. Our comprehensive approach combines international university partnerships, career counseling excellence, and certified training programs.",
        partnershipDesc2: "This partnership opens doors to global education while supporting your institution's growth and your students' success.",
        aboutUsTag: "About Us",
        aboutUsTitle: "At FETC, We Offer Excellence in English Language Training",
        aboutUsDesc: "We are dedicated to helping students and professionals achieve their dreams of studying, working, or settling abroad. We connect you with a world of opportunities through top-notch English language support, making your application process for international education and careers smooth and successful."
      },
      campusVisits: [
        {
          icon: "🗓️",
          tag: "First Visit",
          title: "Bill Boozing – 3rd April 2026",
          desc: "Curry College representative will visit your campus, sharing opportunities for American education."
        },
        {
          icon: "🇬🇧",
          tag: "Follow-Up Visits",
          title: "UK University Representatives",
          desc: "UK University Representatives will visit, showcasing British higher education options and pathways."
        },
        {
          icon: "🌍",
          tag: "Ongoing Access",
          title: "Continued University Partnerships",
          desc: "Continued university partnerships expanding your students' global education choices."
        }
      ],
      agenda: [
        {
          icon: "📜",
          title: "Professional Training",
          desc: "Certified TOEFL and SELT training programs for faculty members, enhancing teaching capabilities and career advancement opportunities."
        },
        {
          icon: "🎯",
          title: "Career Counselling",
          desc: "Expert guidance helping students navigate career paths, university selections, and global opportunities with confidence."
        },
        {
          icon: "🏫",
          title: "University Visits",
          desc: "Direct campus visits from international university representatives, providing students with firsthand information about study abroad options."
        },
        {
          icon: "🎓",
          title: "City College Birmingham (2+1)",
          desc: "Explore your path to Accredited qualifications. Complete your first two years in India, pathway to abroad."
        }
      ],
      facultyBenefits: [
        {
          icon: "🏅",
          title: "Certified Training Programs",
          desc: "Official TOEFL and SELT certification training that enhances your teaching credentials and opens new career opportunities."
        },
        {
          icon: "📈",
          title: "Professional Development",
          desc: "Stay current with international education standards and improve your ability to guide students toward global opportunities."
        },
        {
          icon: "💰",
          title: "Referral Incentives",
          desc: "Earn referral incentives when your students enroll through our partnerships, creating additional income streams for dedicated faculty."
        }
      ],
      globalPrograms: {
        tag: "Global Tech Education",
        title: "Top-Notch Skill Based Online Programs",
        subtitle: "IT | Computing | Digital Technology",
        pathways: [
          "Software Developer/ Web Developer",
          "IT Support Specialist",
          "Network Engineer/ Cybersecurity Analyst",
          "Data Scientist/ Business Intelligence Analyst",
          "E-Commerce Manager",
          "Tech Project Manager"
        ]
      },
      directorsNote: {
        title: "Our Story",
        timelineYear: "1999",
        timelineTitle: "The Inception",
        timelineDesc: "Specifically for exams and training and study abroad services this company has been formed under the umbrella of Ms. Bhumika Dilkhush proprietor of Gina Abroad.",
        quote: "Be Great. Do Good. Learn Always.",
        message: "Whether organizing mock tests or conducting staff alignment meetings in our conference halls, our core value remains the same: student success comes first."
      },
      visionSection: {
        badge: "OUR PILLARS",
        titlePrefix: "The team",
        titleHighlight: "behind your success",
        values: [
          { icon: "Target", title: "Student-First Counseling", desc: "Certified examiners, tech support teams, and counseling heads work in unison to provide an error-free, supportive testing and coaching environment." },
          { icon: "Lightbulb", title: "Testing Excellence", desc: "State-of-the-art computer labs with authorized examination space under Gina Abroad Pvt. Ltd." },
          { icon: "Compass", title: "Global Opportunities", desc: "Direct university tie-ups and official representation across UK, USA, Europe, Canada, Australia, and more." }
        ]
      },
      officeShowcase: {
        title: "Our Certifications & Testing Facilities",
        description: "Globally recognized credentials that back every examination and counseling process.",
        images: [
          "/assets/certificates/Screenshot 2026-06-10 111633.png",
          "/assets/certificates/Screenshot 2026-06-10 111657.png",
          "/assets/certificates/Screenshot 2026-06-10 111719.png",
          "/assets/certificates/Screenshot 2026-06-10 111730.png"
        ]
      },
      programDownloads: [
        { name: "Business Management", filename: "Business Management.pdf", category: "Management", icon: "💼" },
        { name: "Diploma in Health & Social Care", filename: "Diploma in Health & Social Care.pdf", category: "Health & Social Care", icon: "🏥" },
        { name: "Diploma in IT - Web Design", filename: "Diploma in Information Technology - Web Design.pdf", category: "IT & Computing", icon: "💻" },
        { name: "Diploma in IT - E Commerce", filename: "Diploma in IT - E Commerce F.pdf", category: "IT & Computing", icon: "🛒" },
        { name: "Hospitality & Tourism Management", filename: "Hospitality & Tourism Management.pdf", category: "Hospitality", icon: "🏨" },
        { name: "Gina Abroad - British Degree Route", filename: "Gina Abroad_Your-Smartest-Route-to-a-British-Degree.pdf", category: "Academic Guide", icon: "🇬🇧" }
      ],
      accreditations: [
        { src: "/assets/certificates/Screenshot 2026-06-10 111633.png", alt: "Certificate of Representation" },
        { src: "/assets/certificates/Screenshot 2026-06-10 111657.png", alt: "City College Birmingham Appointment Letter" },
        { src: "/assets/certificates/Screenshot 2026-06-10 111719.png", alt: "Certificate of Attendance" },
        { src: "/assets/certificates/Screenshot 2026-06-10 111730.png", alt: "ICEF Accredited Certificate" }
      ]
    }
  },
  {
    slug: '/about/company-profile',
    title: 'Company Profile',
    status: 'PUBLISHED',
    nav_visibility: 'navbar',
    seo_title: 'About FETC | Foreign English Tests Capital',
    seo_description: 'Learn about FETC, an authorized English examination and training center headquartered in Surat, Gujarat under Gina Abroad Pvt. Ltd.',
    content: {
      hero: {
        badge: "About FETC",
        title: "Building Global Careers",
        titleHighlight: "Since 1999",
        description: "FETC is an authorized, state-of-the-art English examination and training center headquartered in Surat, Gujarat. We are a dream project under Gina Abroad Pvt. Ltd., empowering students with digital classrooms and authorized examination spaces."
      },
      stats: [
        { value: "27+", label: "Years of Industry Experience" },
        { value: "5,000+", label: "Candidates Trained" },
        { value: "5+", label: "State-of-the-art Centres" },
        { value: "15+", label: "Countries Served" },
        { value: "100%", label: "Tech-enabled Testing Labs" }
      ],
      aboutUs: {
        partnershipTag: "Our Partnership",
        partnershipTitle: "Expanding Opportunities Together",
        partnershipDesc1: "We're excited to collaborate with R.H. Patel Institute of Technology to expand opportunities for your students and enhance faculty development. Our comprehensive approach combines international university partnerships, career counseling excellence, and certified training programs.",
        partnershipDesc2: "This partnership opens doors to global education while supporting your institution's growth and your students' success.",
        aboutUsTag: "About Us",
        aboutUsTitle: "At FETC, We Offer Excellence in English Language Training",
        aboutUsDesc: "We are dedicated to helping students and professionals achieve their dreams of studying, working, or settling abroad. We connect you with a world of opportunities through top-notch English language support, making your application process for international education and careers smooth and successful."
      },
      campusVisits: [
        {
          icon: "🗓️",
          tag: "First Visit",
          title: "Bill Boozing – 3rd April 2026",
          desc: "Curry College representative will visit your campus, sharing opportunities for American education."
        },
        {
          icon: "🇬🇧",
          tag: "Follow-Up Visits",
          title: "UK University Representatives",
          desc: "UK University Representatives will visit, showcasing British higher education options and pathways."
        },
        {
          icon: "🌍",
          tag: "Ongoing Access",
          title: "Continued University Partnerships",
          desc: "Continued university partnerships expanding your students' global education choices."
        }
      ],
      agenda: [
        {
          icon: "📜",
          title: "Professional Training",
          desc: "Certified TOEFL and SELT training programs for faculty members, enhancing teaching capabilities and career advancement opportunities."
        },
        {
          icon: "🎯",
          title: "Career Counselling",
          desc: "Expert guidance helping students navigate career paths, university selections, and global opportunities with confidence."
        },
        {
          icon: "🏫",
          title: "University Visits",
          desc: "Direct campus visits from international university representatives, providing students with firsthand information about study abroad options."
        },
        {
          icon: "🎓",
          title: "City College Birmingham (2+1)",
          desc: "Explore your path to Accredited qualifications. Complete your first two years in India, pathway to abroad."
        }
      ],
      facultyBenefits: [
        {
          icon: "🏅",
          title: "Certified Training Programs",
          desc: "Official TOEFL and SELT certification training that enhances your teaching credentials and opens new career opportunities."
        },
        {
          icon: "📈",
          title: "Professional Development",
          desc: "Stay current with international education standards and improve your ability to guide students toward global opportunities."
        },
        {
          icon: "💰",
          title: "Referral Incentives",
          desc: "Earn referral incentives when your students enroll through our partnerships, creating additional income streams for dedicated faculty."
        }
      ],
      globalPrograms: {
        tag: "Global Tech Education",
        title: "Top-Notch Skill Based Online Programs",
        subtitle: "IT | Computing | Digital Technology",
        pathways: [
          "Software Developer/ Web Developer",
          "IT Support Specialist",
          "Network Engineer/ Cybersecurity Analyst",
          "Data Scientist/ Business Intelligence Analyst",
          "E-Commerce Manager",
          "Tech Project Manager"
        ]
      },
      directorsNote: {
        title: "Our Story",
        timelineYear: "1999",
        timelineTitle: "The Inception",
        timelineDesc: "Specifically for exams and training and study abroad services this company has been formed under the umbrella of Ms. Bhumika Dilkhush proprietor of Gina Abroad.",
        quote: "Be Great. Do Good. Learn Always.",
        message: "Whether organizing mock tests or conducting staff alignment meetings in our conference halls, our core value remains the same: student success comes first."
      },
      visionSection: {
        badge: "OUR PILLARS",
        titlePrefix: "The team",
        titleHighlight: "behind your success",
        values: [
          { icon: "Target", title: "Student-First Counseling", desc: "Certified examiners, tech support teams, and counseling heads work in unison to provide an error-free, supportive testing and coaching environment." },
          { icon: "Lightbulb", title: "Testing Excellence", desc: "State-of-the-art computer labs with authorized examination space under Gina Abroad Pvt. Ltd." },
          { icon: "Compass", title: "Global Opportunities", desc: "Direct university tie-ups and official representation across UK, USA, Europe, Canada, Australia, and more." }
        ]
      },
      officeShowcase: {
        title: "Our Certifications & Testing Facilities",
        description: "Globally recognized credentials that back every examination and counseling process.",
        images: [
          "/assets/certificates/Screenshot 2026-06-10 111633.png",
          "/assets/certificates/Screenshot 2026-06-10 111657.png",
          "/assets/certificates/Screenshot 2026-06-10 111719.png",
          "/assets/certificates/Screenshot 2026-06-10 111730.png"
        ]
      },
      programDownloads: [
        { name: "Business Management", filename: "Business Management.pdf", category: "Management", icon: "💼" },
        { name: "Diploma in Health & Social Care", filename: "Diploma in Health & Social Care.pdf", category: "Health & Social Care", icon: "🏥" },
        { name: "Diploma in IT - Web Design", filename: "Diploma in Information Technology - Web Design.pdf", category: "IT & Computing", icon: "💻" },
        { name: "Diploma in IT - E Commerce", filename: "Diploma in IT - E Commerce F.pdf", category: "IT & Computing", icon: "🛒" },
        { name: "Hospitality & Tourism Management", filename: "Hospitality & Tourism Management.pdf", category: "Hospitality", icon: "🏨" },
        { name: "Gina Abroad - British Degree Route", filename: "Gina Abroad_Your-Smartest-Route-to-a-British-Degree.pdf", category: "Academic Guide", icon: "🇬🇧" }
      ],
      accreditations: [
        { src: "/assets/certificates/Screenshot 2026-06-10 111633.png", alt: "Certificate of Representation" },
        { src: "/assets/certificates/Screenshot 2026-06-10 111657.png", alt: "City College Birmingham Appointment Letter" },
        { src: "/assets/certificates/Screenshot 2026-06-10 111719.png", alt: "Certificate of Attendance" },
        { src: "/assets/certificates/Screenshot 2026-06-10 111730.png", alt: "ICEF Accredited Certificate" }
      ]
    }
  },

  // 3. CONTACT US PAGE - Exact word-for-word text
  {
    slug: '/contact',
    title: 'Contact Us',
    status: 'PUBLISHED',
    nav_visibility: 'navbar',
    seo_title: 'Contact Us | FETC',
    seo_description: 'Get in touch with FETC head office in Surat, Gujarat for study abroad and exam preparation inquiries.',
    content: {
      mapSection: {
        title: "Visit Our Head Office",
        subtitle: "Located in Surat, Gujarat. Drop by for a coffee and chat about your future.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.218556637389!2d72.76615557602058!3d21.1437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0532454645281%3A0xcb1b689b91e5e01c!2sRoongta%20Signature!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin"
      },
      infoSection: {
        title: "Get In Touch With Us",
        description: "Have questions about our courses, study abroad programs, or anything else? We'd love to hear from you."
      },
      workingHours: {
        title: "Working Hours",
        weekdays: "Mon - Sat: 9:00 AM - 7:00 PM",
        sunday: "Sunday: Closed",
        timing: "Monday - Saturday: 9:00 AM - 7:00 PM"
      },
      contactDetails: {
        address: {
          lines: [
            "2nd floor, 239, Roongta Signature",
            "Nr. Shyam Mandir Vesu",
            "Surat - 395007"
          ]
        },
        phone: {
          number: "+91 9033347200"
        },
        email: {
          address: "info@fetc.in"
        }
      }
    }
  },

  // 4. FAQ PAGE - Exact word-for-word text
  {
    slug: '/faq',
    title: 'Frequently Asked Questions',
    status: 'PUBLISHED',
    nav_visibility: 'footer',
    seo_title: 'FAQ | FETC Study Abroad & Exam Prep',
    seo_description: 'Find answers to common questions about our services, study abroad programs, and examination preparation below.',
    content: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about our services, study abroad programs, and examination preparation below.",
      faqs: [
        {
          question: "What services do you offer?",
          answer: "We provide comprehensive study abroad services including, counselling, university selection, application assistance, visa processing, pre-departure orientation, and post-arrival support."
        },
        {
          question: "Why should I choose your consultancy over others?",
          answer: "Our consultancy boasts a high success rate, personalized guidance from experienced advisors, and partnerships with top universities worldwide. We also offer ongoing support throughout your study abroad journey."
        },
        {
          question: "How do I start the application process?",
          answer: "Begin by scheduling a consultation with one of our advisors. We will assess your academic background, financial background, career goals, and preferences to help you select suitable programs and universities."
        },
        {
          question: "What documents are required for the application?",
          answer: "Typically, you will need your academic transcripts, financials, a statement of purpose, letters of recommendation, a resume, standardized test scores (if applicable), and proof of language proficiency."
        },
        {
          question: "Do you assist with writing the Statement of Purpose (SOP) and essays?",
          answer: "Yes, we only write the SOPs. Students just need to provide craft compelling SOPs and essays that reflect your strengths and aspirations."
        },
        {
          question: "How much does studying abroad cost?",
          answer: "Costs vary depending on the country, university, and program. They include tuition fees, accommodation, living expenses, insurance, and travel costs. We can provide detailed estimates during your consultation."
        },
        {
          question: "Are there scholarships or financial aid available?",
          answer: "Yes, many universities offer scholarships and financial aid. We can assist you in identifying and applying for these opportunities to help reduce your expenses."
        },
        {
          question: "Do you charge for your services?",
          answer: "Yes, we charge a fee for our services, which covers the personalized support and expertise we provide throughout the application and visa process. Detailed fee information can be provided during your initial consultation."
        },
        {
          question: "How do you assist with the visa application process?",
          answer: "We provide step-by-step guidance on visa requirements, help you prepare the necessary documentation, and conduct mock visa interviews to ensure you are well-prepared."
        },
        {
          question: "What if my visa application is denied?",
          answer: "Firstly, we have 99% of visa ratio. In case, if your visa application is denied, we will analyze the reasons for denial, assist in addressing any issues, and guide you through the reapplication process."
        },
        {
          question: "Can you help me choose the right program and university?",
          answer: "Absolutely! Our advisors have extensive knowledge of programs and universities worldwide and will help match your interests, curriculam, and career goals with the right options."
        },
        {
          question: "How far in advance should I start the application process?",
          answer: "It’s best to start the application process at least 06-12 months before your intended start date to ensure ample time for research, test preparation, application submission, financials check and visa processing."
        },
        {
          question: "Can you help with applications for both undergraduate and postgraduate programs?",
          answer: "Yes, we assist with applications for undergraduate, postgraduate, and doctoral programs across various fields of study."
        }
      ],
      sections: [
        {
          category: "1. General Information",
          faqs: [
            {
              question: "What services do you offer?",
              answer: "We provide comprehensive study abroad services including, counselling, university selection, application assistance, visa processing, pre-departure orientation, and post-arrival support."
            },
            {
              question: "Why should I choose your consultancy over others?",
              answer: "Our consultancy boasts a high success rate, personalized guidance from experienced advisors, and partnerships with top universities worldwide. We also offer ongoing support throughout your study abroad journey."
            }
          ]
        },
        {
          category: "2. Application Process",
          faqs: [
            {
              question: "How do I start the application process?",
              answer: "Begin by scheduling a consultation with one of our advisors. We will assess your academic background, financial background, career goals, and preferences to help you select suitable programs and universities."
            },
            {
              question: "What documents are required for the application?",
              answer: "Typically, you will need your academic transcripts, financials, a statement of purpose, letters of recommendation, a resume, standardized test scores (if applicable), and proof of language proficiency."
            },
            {
              question: "Do you assist with writing the Statement of Purpose (SOP) and essays?",
              answer: "Yes, we only write the SOPs. Students just need to provide craft compelling SOPs and essays that reflect your strengths and aspirations."
            }
          ]
        },
        {
          category: "3. Financial Information",
          faqs: [
            {
              question: "How much does studying abroad cost?",
              answer: "Costs vary depending on the country, university, and program. They include tuition fees, accommodation, living expenses, insurance, and travel costs. We can provide detailed estimates during your consultation."
            },
            {
              question: "Are there scholarships or financial aid available?",
              answer: "Yes, many universities offer scholarships and financial aid. We can assist you in identifying and applying for these opportunities to help reduce your expenses."
            },
            {
              question: "Do you charge for your services?",
              answer: "Yes, we charge a fee for our services, which covers the personalized support and expertise we provide throughout the application and visa process. Detailed fee information can be provided during your initial consultation."
            }
          ]
        },
        {
          category: "4. Visa and Travel",
          faqs: [
            {
              question: "How do you assist with the visa application process?",
              answer: "We provide step-by-step guidance on visa requirements, help you prepare the necessary documentation, and conduct mock visa interviews to ensure you are well-prepared."
            },
            {
              question: "What if my visa application is denied?",
              answer: "Firstly, we have 99% of visa ratio. In case, if your visa application is denied, we will analyze the reasons for denial, assist in addressing any issues, and guide you through the reapplication process."
            }
          ]
        },
        {
          category: "5. Miscellaneous",
          faqs: [
            {
              question: "Can you help me choose the right program and university?",
              answer: "Absolutely! Our advisors have extensive knowledge of programs and universities worldwide and will help match your interests, curriculam, and career goals with the right options."
            },
            {
              question: "How far in advance should I start the application process?",
              answer: "It’s best to start the application process at least 06-12 months before your intended start date to ensure ample time for research, test preparation, application submission, financials check and visa processing."
            },
            {
              question: "Can you help with applications for both undergraduate and postgraduate programs?",
              answer: "Yes, we assist with applications for undergraduate, postgraduate, and doctoral programs across various fields of study."
            }
          ]
        }
      ]
    }
  },

  // 5. TERMS AND CONDITIONS - Exact word-for-word text
  {
    slug: '/terms',
    title: 'Terms and Conditions',
    status: 'PUBLISHED',
    nav_visibility: 'footer',
    seo_title: 'Terms and Conditions | FETC',
    seo_description: 'Terms and Conditions governing your use of FETC website and services.',
    content: {
      lastUpdated: "February 03, 2025",
      sections: [
        {
          title: "1. Introduction",
          body: "Country: Gujarat, India\nCompany: GINA ABROAD PRIVATE LIMITED, 238–239, Second Floor, Roongta Signature, Opp. Shyam Mandir, VIP Road, Vesu, Surat, India\nDevice: Any device that can access the Service such as a computer, mobile phone, or tablet\nService: Refers to the Website\nTerms: These Terms form the agreement between You and the Company\nSocial Media: Any third-party services or content available through the Service\nWebsite: GINA ABROAD PRIVATE LIMITED – http://www.fetc.in\nYou: The individual or legal entity using the Service"
        },
        {
          title: "2. Acknowledgment",
          body: "These Terms and Conditions govern your use of the Service and form a binding agreement between You and the Company.\n- Your use of the Service is conditional upon acceptance of these Terms\n- By accessing or using the Service, you agree to be bound by these Terms\n- If you do not agree, you must not use the Service\n- You must be at least 18 years old to use this Service\n- Please review our Privacy Policy before using the Service"
        },
        {
          title: "3. Links to Other Websites",
          body: "- Our Service may contain links to third-party websites\n- These websites are not operated or controlled by us\n- We are not responsible for their content, policies, or practices\n- We recommend reviewing their terms and privacy policies before use"
        },
        {
          title: "4. Termination",
          body: "- We reserve the right to suspend or terminate your access immediately if you violate these Terms\n- Upon termination, your right to use the Service will cease"
        },
        {
          title: "5. Limitation of Liability",
          body: "- Our total liability is limited to the amount you paid through the Service\n- We are not responsible for any indirect, incidental, or consequential damages, even if advised of the possibility"
        },
        {
          title: "6. Severability and Waiver",
          body: "- Severability: If any provision is found invalid, it will be adjusted to achieve its intent while the remaining provisions remain in effect\n- Waiver: Failure to enforce any right does not waive the ability to enforce it later"
        },
        {
          title: "7. Translation Interpretation",
          body: "- If these Terms are translated into other languages, the English version will prevail in case of any dispute"
        },
        {
          title: "8. Changes to These Terms and Conditions",
          body: "- We reserve the right to update or modify these Terms at any time\n- Significant changes will be notified at least 30 days in advance\n- Continued use of the Service indicates acceptance of the updated Terms"
        },
        {
          title: "9. Contact Us",
          body: "If you have any questions regarding these Terms and Conditions, you can contact us via:\n- Website: https://fetc.in/contact-us"
        }
      ]
    }
  },

  // 6. PRIVACY POLICY - Exact word-for-word text
  {
    slug: '/privacy',
    title: 'Privacy Policy',
    status: 'PUBLISHED',
    nav_visibility: 'footer',
    seo_title: 'Privacy Policy | FETC',
    seo_description: 'Privacy Policy explaining how we collect, use, and protect your personal data at FETC.',
    content: {
      lastUpdated: "February 03, 2025",
      sections: [
        {
          title: "1. Introduction",
          body: "This Privacy Policy explains how we collect, use, and protect your personal information when you access our website and services.\nBy using our Service, you agree to the terms described in this Privacy Policy."
        },
        {
          title: "2. Information Collection",
          body: "We collect personal information that you provide to us, such as:\n- Name\n- Email address\n- Payment details\nWe also collect usage data such as:\n- IP address\n- Browser type\nThis helps us improve our services and understand user behavior."
        },
        {
          title: "3. How We Use Your Information",
          body: "We use the information we collect to:\n- Provide and improve our services\n- Communicate with you regarding your account or service-related matters\n- Personalize your experience\n- Respond to your inquiries"
        },
        {
          title: "4. Data Security",
          body: "We implement reasonable security measures to protect your personal data from unauthorized access, alteration, or destruction.\nHowever, please note that no method of electronic storage or transmission over the internet is completely secure."
        },
        {
          title: "5. Sharing of Data",
          body: "- We do not sell or rent your personal information to third parties\n- We may share your information with trusted service providers to help us deliver our services"
        },
        {
          title: "6. Your Rights",
          body: "You have the right to:\n- Access your personal data\n- Update your information\n- Request deletion of your data\nTo exercise these rights, please contact us using the details below."
        },
        {
          title: "7. Changes to This Privacy Policy",
          body: "We may update this Privacy Policy from time to time.\n- Any changes will be posted on this page\n- The \"Last Updated\" date will be revised accordingly\nWe recommend reviewing this page periodically."
        },
        {
          title: "8. Contact Us",
          body: "If you have any questions or concerns about this Privacy Policy, you can contact us at:\n- Email: info@fetc.in"
        }
      ]
    }
  },

  // 7. REFUND POLICY - Exact word-for-word text
  {
    slug: '/refund',
    title: 'Refund Policy',
    status: 'PUBLISHED',
    nav_visibility: 'footer',
    seo_title: 'Refund Policy | FETC',
    seo_description: 'Refund Policy detailing conditions and process for requesting a refund at FETC.',
    content: {
      lastUpdated: "February 3, 2025",
      sections: [
        {
          title: "1. Introduction",
          body: "We strive to provide high-quality online English learning services.\nIf you are not satisfied with your purchase, this Refund Policy explains the conditions and process for requesting a refund."
        },
        {
          title: "2. Refund Process",
          body: "- If your refund request meets our eligibility criteria, it will be processed accordingly\n- The refund will be credited to your original payment method\n- Refunds are typically processed within 5 business days"
        },
        {
          title: "3. Contact Us",
          body: "If you have any questions about our Refund Policy, please contact us:\n- Email: info@fetc.in"
        }
      ]
    }
  },

  // 8. CAREER ASSESSMENT - Exact word-for-word text
  {
    slug: '/career-assessment/behaviour-and-career-analysis',
    title: 'Behaviour and Career Analysis',
    status: 'PUBLISHED',
    nav_visibility: 'navbar',
    seo_title: 'Behavioral & Career Analysis Report | FETC',
    seo_description: 'A comprehensive data-driven evaluation mapping your intrinsic behavioral patterns, cognitive learning styles, and verified competencies to optimal industry pathways.',
    content: {
      hero: {
        badge: "Verified Assessment",
        title: "Behavioral & Career",
        titleHighlight: "Analysis Report",
        description: "A comprehensive data-driven evaluation mapping your intrinsic behavioral patterns, cognitive learning styles, and verified competencies to optimal industry pathways.",
        primaryProfile: "Consultative Leader",
        peakIndustryMatch: "Hospitality & Healthcare"
      },
      overview: {
        title: "Assessment Overview",
        summary: "The ComPAS Now™ analysis indicates a strong alignment with roles requiring methodical organization, interpersonal diplomacy, and contextual consistency. High scores in democratic values suggest proficiency in collaborative environments.",
        primaryModality: "Visual-Dominant",
        modalityDesc: "Primary cognitive processing occurs through spatial and observational engagement.",
        strengths: [
          "Effectively processes and utilizes feedback",
          "Engages positively in recognition exchanges",
          "Consistently identifies potential in peers",
          "Demonstrates high emotional intelligence",
          "Accurately assesses human motivations",
          "Maintains high proactive engagement",
          "Structures personal time efficiently",
          "Processes information in linear, logical steps",
          "Prefers contextual stability over disruption",
          "Exhibits strong visual-spatial imagination"
        ]
      },
      vakData: [
        { name: "Visual", score: 80, color: "#0ea5e9" },
        { name: "Kinesthetic", score: 60, color: "#3b82f6" },
        { name: "Auditory", score: 40, color: "#64748b" }
      ],
      competencies: [
        { subject: "Democratic values", score: 90 },
        { subject: "Helping attitude", score: 85 },
        { subject: "Democratic decision", score: 75 },
        { subject: "Consultative Process", score: 80 },
        { subject: "Repeated Action", score: 65 },
        { subject: "Organizing", score: 70 },
        { subject: "Market research", score: 75 },
        { subject: "Attention to detail", score: 85 },
        { subject: "Conflict Management", score: 80 },
        { subject: "Interpersonal Skill", score: 85 }
      ],
      careerAlignments: [
        { subject: "Hospitality", score: 95 },
        { subject: "Counseling", score: 88 },
        { subject: "Healthcare", score: 85 },
        { subject: "Production Eng", score: 82 },
        { subject: "Criminology", score: 84 },
        { subject: "Navigation", score: 80 }
      ]
    }
  }
];

// DYNAMICALLY ADD ALL STUDY ABROAD COUNTRY PAGES WORD-FOR-WORD
const countries = [
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    flag: "https://flagcdn.com/w80/gb.png",
    image: "/assets/countries/uk.png",
    description: "Study in globally recognized UK institutions with excellent academic support, scholarships, and post-study work opportunities.",
    sopLinks: [
      { label: "Download UK SOP", url: "https://drive.google.com/file/d/1B8woekjA86ypLvtVr9OMYXRWCktk-4F1/view?usp=sharing" },
      { label: "Download Birmingham SOP", url: "https://drive.google.com/file/d/1UPXSyf1pQCDwig2wLHoc-3chCZpb929g/view?usp=sharing" }
    ]
  },
  {
    slug: "europe",
    name: "Europe",
    flag: "https://flagcdn.com/w80/eu.png",
    image: "/assets/countries/europe.png",
    description: "Explore affordable and high-quality education options across Europe with multicultural learning environments and career pathways. Now offering MBBS programs in Italy, Hungary, and Slovakia."
  },
  {
    slug: "usa",
    name: "USA",
    flag: "https://flagcdn.com/w80/us.png",
    image: "/assets/countries/usa.png",
    description: "Access world-class universities, cutting-edge research opportunities, and diverse campus experiences in the United States.",
    sopLinks: [{ label: "Download USA SOP", url: "https://drive.google.com/file/d/1KVCqKaaMkmR3f6AntE6ozke8Q6KMgi8p/view?usp=sharing" }]
  },
  {
    slug: "australia",
    name: "Australia",
    flag: "https://flagcdn.com/w80/au.png",
    image: "/assets/countries/australia.png",
    description: "Choose from top-ranked Australian universities known for practical learning, innovation, and student-friendly cities.",
    sopLinks: [{ label: "Download Australia SOP", url: "https://drive.google.com/file/d/1O7WaRkNDy0jJVvixXTuWiGorXHSliZZu/view?usp=sharing" }]
  },
  {
    slug: "canada",
    name: "Canada",
    flag: "https://flagcdn.com/w80/ca.png",
    image: "/assets/Study abroad/Canada.png",
    description: "Explore world-class academic institutions, diverse culture, and vast post-study opportunities in Canada."
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    flag: "https://flagcdn.com/w80/nz.png",
    image: "/assets/countries/new-zealand.png",
    description: "Build your future in New Zealand with globally valued qualifications and a safe, welcoming student lifestyle."
  },
  {
    slug: "ireland",
    name: "Ireland",
    flag: "https://flagcdn.com/w80/ie.png",
    image: "/assets/countries/ireland.png",
    description: "Study in Ireland for strong industry connections, international exposure, and a vibrant academic atmosphere.",
    sopLinks: [{ label: "Download Ireland SOP", url: "https://drive.google.com/file/d/15uyRlYmQJiU6fv4YFnSaja3yplxaic2j/view?usp=sharing" }]
  },
  {
    slug: "dubai",
    name: "Dubai",
    flag: "https://flagcdn.com/w80/ae.png",
    image: "/assets/countries/dubai.png",
    description: "Pursue modern education programs in Dubai with strong global links and a fast-growing professional ecosystem."
  },
  {
    slug: "singapore",
    name: "Singapore",
    flag: "https://flagcdn.com/w80/sg.png",
    image: "/assets/countries/Singapore.png",
    description: "Experience modern education in Singapore with unparalleled technological and business advancements."
  }
];

countries.forEach(country => {
  initialPageData.push({
    slug: `/study-abroad/${country.slug}`,
    title: `Study in ${country.name}`,
    status: 'PUBLISHED',
    nav_visibility: 'navbar',
    seo_title: `Study in ${country.name} | Universities & Visa Guidance | FETC`,
    seo_description: country.description,
    content: {
      name: country.name,
      description: country.description,
      image: country.image,
      flag: country.flag,
      sopLinks: country.sopLinks || [],
      hero: {
        title: `Study in ${country.name}`,
        flag: country.flag,
        image: country.image,
        description: country.description,
        sopLinks: country.sopLinks || []
      }
    }
  });
});

// MAIN STUDY ABROAD LISTING PAGE
initialPageData.push({
  slug: "/study-abroad",
  title: "Study Abroad Destinations",
  status: 'PUBLISHED',
  nav_visibility: 'navbar',
  seo_title: "Study Abroad Destinations | Overseas Education | FETC",
  seo_description: "We've helped thousands of students settle in over 10+ countries. Pick your dream destination and let us handle admissions, visa prep, and landing guidelines.",
  content: {
    hero: {
      badge: "Explore the World",
      title: "Choose Your Study Destination",
      description: "We've helped thousands of students settle in over 10+ countries. Pick your dream destination and let us handle the admissions, visa preparation, and landing guidelines."
    }
  }
});

// MAIN EXAM TRAINING LISTING PAGE
initialPageData.push({
  slug: "/exam-training",
  title: "Master Your Standardized Exams",
  status: 'PUBLISHED',
  nav_visibility: 'navbar',
  seo_title: "Master Your Standardized Exams | SELT, IELTS, TOEFL, GRE, GMAT, SAT | FETC",
  seo_description: "Access top-tier language training, computer-based mock modules, and expert mentors. Achieve the target score you need to study, work, or live abroad.",
  content: {
    hero: {
      badge: "Accredited Prep Programs",
      title: "Master Your Standardized Exams",
      description: "Access top-tier language training, computer-based mock modules, and expert mentors. Achieve the target score you need to study, work, or live abroad."
    }
  }
});

// GALLERY PAGE
initialPageData.push({
  slug: "/gallery",
  title: "Visual Portfolio & Gallery",
  status: 'PUBLISHED',
  nav_visibility: 'footer',
  seo_title: "Visual Portfolio & Campus Moments | FETC",
  seo_description: "A glimpse into our events, student achievements, and campus moments.",
  content: {
    hero: {
      badge: "Visual Portfolio",
      title: "Our Moments & Milestones",
      description: "A glimpse into our events, student achievements, and campus moments."
    }
  }
});

// DYNAMICALLY ADD ALL EXAM TRAINING PAGES WORD-FOR-WORD
const exams = [
  {
    slug: "selt",
    name: "SELT",
    shortLabel: "SELT",
    description: "Essential English proficiency tests for UK visa and immigration applications, including IELTS for UKVI and PTE Academic UKVI.",
    fullDescription: "The Secure English Language Test (SELT) is a recognized English language proficiency exam required for visa and immigration purposes, particularly in the UK. It is mandated by the UK Visas and Immigration (UKVI) department for individuals seeking to study, work, or settle in the UK. The SELT is designed to assess your English language skills across key areas essential for everyday communication.\n\nExam Format and Structure\nThe SELT exam is offered at various levels—A1, A2, B1, and B2—each corresponding to different visa and immigration requirements. The levels indicate the complexity of the language skills being tested, from basic (A1, A2) to more advanced (B1, B2) proficiency. The exam comprises four sections: Listening, Reading, Writing, and Speaking. It is conducted only in a computer-based format, and results are securely transmitted to the relevant authorities.\n\nWho Needs to Take SELT?\nSELT is required for individuals applying for specific UK visas, including work, study, and settlement visas. Depending on the visa type, candidates must achieve a qualifying score at the required level (A1, A2, B1, or B2). Whether you are looking to work, study, or live in the UK, achieving the appropriate SELT level is a crucial step in the process.\n\nAccepted Countries and Cost\nThe SELT is specifically required for UK immigration purposes and is a prerequisite for entry to the UK. The cost of the exam is INR 15,900/-, making it a crucial investment for your UK visa journey.",
    metadata: [
      { label: "Cost", value: "INR 15,900/-" },
      { label: "Frequency", value: "Weekly / On-demand" },
      { label: "Duration", value: "15m - 3h" },
      { label: "Validity", value: "2 Years" }
    ],
    features: [
      { highlight: "UKVI", label: "Approved" },
      { highlight: "Fast", label: "Booking" },
      { highlight: "Global", label: "Recognition" },
      { highlight: "Expert", label: "Guidance" }
    ]
  },
  {
    slug: "gre-gmat",
    name: "GRE & GMAT",
    shortLabel: "GRE/GMAT",
    description: "Advanced standardized tests for graduate school and business school admissions worldwide, measuring verbal, quantitative, and analytical skills.",
    fullDescription: "The Graduate Record Examination (GRE) and the Graduate Management Admission Test (GMAT) are two of the most recognized standardized tests for admission to graduate and business schools worldwide. While the GRE is broadly accepted by various graduate programs, the GMAT is specifically designed for business school admissions. Both exams assess your readiness for advanced academic and professional studies.\n\nExam Format and Structure\nThe GRE consists of three sections: Verbal Reasoning, Quantitative Reasoning, and Analytical Writing. It evaluates your critical thinking, analytical writing, and problem-solving abilities.\nThe GMAT includes four sections: Analytical Writing Assessment, Integrated Reasoning, Quantitative Reasoning, and Verbal Reasoning. It focuses on skills relevant to business and management studies.\nBoth tests are computer-based and adaptive, meaning the difficulty of questions adjusts based on your performance.\n\nWho Needs to Take GRE/GMAT?\nThe GRE is required for admission to a wide range of graduate programs, including master’s and doctoral degrees across various disciplines. The GMAT is essential for students applying to MBA programs and other business-related graduate degrees. These exams are critical steps for anyone pursuing advanced education in their chosen field.\n\nAccepted Countries and Cost\nBoth the GRE and GMAT are accepted by universities and business schools in the USA, Canada, the UK, Australia, and many other countries. The cost of the exams ranges between INR 22,000/- to 25,000/-. These exams are significant investments in your future, opening doors to prestigious programs and career opportunities worldwide.",
    metadata: [
      { label: "Cost", value: "INR 22,000/- to 25,000/-" },
      { label: "Frequency", value: "Flexible" },
      { label: "Duration", value: "2h - 2.5h" },
      { label: "Validity", value: "5 Years" }
    ],
    features: [
      { highlight: "Global", label: "Admissions" },
      { highlight: "High", label: "Target Scores" },
      { highlight: "Advanced", label: "Analytics" },
      { highlight: "Full", label: "Support" }
    ]
  },
  {
    slug: "sat",
    name: "SAT",
    shortLabel: "SAT",
    description: "A standardized test widely used for college admissions in the USA and other countries, assessing readiness for undergraduate education.",
    fullDescription: "The Scholastic Assessment Test (SAT) is a standardized test widely used for college admissions in the USA and other countries. It assesses a student's readiness for college and provides colleges with a common data point for comparing applicants. The SAT is a key component of the college application process for students aiming to pursue undergraduate education.\n\nExam Format and Structure\nThe SAT consists of two main sections: Evidence-Based Reading and Writing, and Math. There is also an optional Essay section, which some colleges may require. The exam is paper-based, and it measures skills that are essential for academic success in college.\n\nWho Needs to Take SAT?\nThe SAT is required for students applying to undergraduate programs in the USA and other countries. It is used by colleges to evaluate a student's academic abilities and potential for success in higher education. The SAT is crucial for students aiming to secure admission to top universities worldwide.\n\nAccepted Countries and Cost\nThe SAT is accepted primarily in the USA but is also recognized by universities in Canada, the UK, Australia, and other countries. The cost of the SAT exam is INR 12,300/-, making it a crucial investment for your undergraduate studies. This investment is essential for students aiming to pursue higher education abroad.",
    metadata: [
      { label: "Cost", value: "INR 12,300/-" },
      { label: "Frequency", value: "7 Times / Year" },
      { label: "Duration", value: "3 Hours" },
      { label: "Validity", value: "5 Years" }
    ],
    features: [
      { highlight: "USA", label: "Undergraduate" },
      { highlight: "1500+", label: "Target Score" },
      { highlight: "Math/Eng", label: "Focus" },
      { highlight: "Expert", label: "Training" }
    ]
  },
  {
    slug: "idp-for-ielts",
    name: "IELTS",
    shortLabel: "IELTS",
    description: "Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.",
    fullDescription: "The International English Language Testing System (IELTS) is a widely recognized English language proficiency exam required for study, work, and immigration purposes. It is accepted by educational institutions, employers, and immigration authorities in countries like the UK, USA, Australia, Canada, and New Zealand. IELTS assesses your ability to communicate effectively in English across all key skills.\n\nExam Format and Structure\nThe IELTS exam comprises four sections: Listening, Reading, Writing, and Speaking. Each section is designed to evaluate your English language proficiency in academic or general contexts. The test is available in both pen-and-paper and computer-based formats, providing flexibility to candidates.\n\nWho Needs to Take IELTS?\nIELTS is essential for individuals seeking to study, work, or migrate to English-speaking countries. It is required by universities for admission, by employers for job applications, and by immigration authorities for visa processing. The test is a key step for anyone planning to pursue opportunities abroad.\n\nAccepted Countries and Cost\nIELTS is accepted in the UK, USA, Australia, Canada, New Zealand, and other countries for educational, professional, and immigration purposes. The cost of the exam is INR 18,000/-, making it a crucial investment for your future abroad.",
    metadata: [
      { label: "Cost", value: "INR 18,000/-" },
      { label: "Frequency", value: "Weekly / 48 times a year" },
      { label: "Duration", value: "2 Hrs 45 Mins" },
      { label: "Validity", value: "2 Years" }
    ],
    features: [
      { highlight: "550+", label: "Comprehensive Assessment" },
      { highlight: "100%", label: "Rapid Results" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  },
  {
    slug: "toefl",
    name: "TOEFL",
    shortLabel: "TOEFL",
    description: "Target your TOEFL score through skill-based training sessions for reading, listening, writing, and speaking.",
    fullDescription: "The Test of English as a Foreign Language (TOEFL) is a globally recognized English proficiency test that is essential for students, professionals, and immigrants. It is widely accepted by universities, colleges, and institutions in the USA, Canada, Australia, and other English-speaking countries. TOEFL assesses your ability to use and understand English in academic settings.\n\nExam Format and Structure\nTOEFL consists of four sections: Reading, Listening, Speaking, and Writing. Each section measures a different aspect of your academic English proficiency. The test is available only in a computer-based format, ensuring a standardized and secure testing experience for all candidates.\n\nWho Needs to Take TOEFL?\nTOEFL is required for non-native English speakers seeking admission to English-speaking universities and colleges. It is also often needed for professional certifications and immigration purposes. Whether you are pursuing higher education or professional opportunities, TOEFL is a vital step in demonstrating your English proficiency.\n\nAccepted Countries and Cost\nTOEFL is accepted by institutions in the USA, Canada, Australia, and more, making it a preferred choice for students and professionals. The cost of the TOEFL exam is INR 18,000/-, reflecting its importance in achieving your educational and career goals.",
    metadata: [
      { label: "Cost", value: "INR 18,000/-" },
      { label: "Frequency", value: "Over 60 times a year" },
      { label: "Duration", value: "1 Hr 56 Mins" },
      { label: "Validity", value: "2 Years" }
    ],
    features: [
      { highlight: "550+", label: "Comprehensive Assessment" },
      { highlight: "100%", label: "Rapid Results" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  },
  {
    slug: "pte",
    name: "PTE",
    shortLabel: "PTE",
    description: "Prepare for PTE with AI-driven patterns, timed practice, and structured guidance to improve your score quickly.",
    fullDescription: "The Pearson Test of English Academic (PTE-A) is a computer-based English language proficiency exam designed for non-native English speakers. It is widely accepted by universities, colleges, and governments for study, work, and migration purposes. PTE-A is recognized for its accurate and unbiased assessment, making it a preferred choice for students and professionals alike.\n\nExam Format and Structure\nThe PTE-A exam comprises three main sections: Speaking & Writing, Reading, and Listening. Each section is designed to evaluate your ability to use English in academic and real-life settings. The test is conducted entirely on a computer, and the results are typically available within a few days, making it one of the fastest options for English proficiency testing.\n\nWho Needs to Take PTE-A?\nPTE-A is ideal for individuals seeking to study, work, or migrate to English-speaking countries such as the UK, USA, Australia, Canada, and New Zealand. It is required by universities for admissions, by employers for job applications, and by immigration authorities for visa processing. Achieving a qualifying score on the PTE-A is a key step toward pursuing your goals abroad.\n\nAccepted Countries and Cost\nPTE-A is accepted by universities, colleges, and governments in the UK, USA, Australia, Canada, New Zealand, and other countries. The cost of the PTE-A exam is INR 18,900/-. This investment is crucial for those aiming to advance their education, career, or settlement opportunities in an English-speaking environment.",
    metadata: [
      { label: "Cost", value: "INR 18,900/-" },
      { label: "Frequency", value: "Almost Daily" },
      { label: "Duration", value: "2 Hours" },
      { label: "Validity", value: "2 Years" }
    ],
    features: [
      { highlight: "AI-Driven", label: "Pattern Mastery" },
      { highlight: "Instant", label: "Scoring" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  }
];

exams.forEach(exam => {
  initialPageData.push({
    slug: `/exam-training/${exam.slug}`,
    title: `${exam.name} Coaching`,
    status: 'PUBLISHED',
    nav_visibility: 'navbar',
    seo_title: `${exam.name} Preparation & Coaching | FETC`,
    seo_description: exam.description,
    content: {
      name: exam.name,
      shortLabel: exam.shortLabel,
      description: exam.description,
      fullDescription: exam.fullDescription,
      hero: {
        title: exam.name,
        shortLabel: exam.shortLabel,
        description: exam.description,
        fullDescription: exam.fullDescription
      },
      metadata: exam.metadata || [],
      features: exam.features || []
    }
  });
});

async function seedPages() {
  console.log("🌱 Starting 100% Comprehensive Word-for-Word Page Content Seeder...");
  try {
    await db.query("SET client_encoding = 'UTF8'");
    for (const page of initialPageData) {
      const existing = await db.query('SELECT id FROM pages WHERE slug = $1', [page.slug]);
      if (existing.rows.length > 0) {
        await db.query(
          `UPDATE pages 
           SET title = $1, status = $2, nav_visibility = $3, seo_title = $4, seo_description = $5, content = $6, updated_at = CURRENT_TIMESTAMP 
           WHERE slug = $7`,
          [page.title, page.status, page.nav_visibility, page.seo_title, page.seo_description, JSON.stringify(page.content), page.slug]
        );
        console.log(`✅ Updated page: ${page.slug} (${page.title})`);
      } else {
        await db.query(
          `INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [page.slug, page.title, page.status, page.nav_visibility, page.seo_title, page.seo_description, JSON.stringify(page.content)]
        );
        console.log(`✨ Inserted page: ${page.slug} (${page.title})`);
      }
    }
    console.log(`\n🎉 Seeding completed successfully! Processed ${initialPageData.length} total pages with 100% exact text, headings, badges, and emojis.`);
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    process.exit();
  }
}

seedPages();
