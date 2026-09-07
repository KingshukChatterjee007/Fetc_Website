const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const db = require('../../db');

const missingPages = [
  // 1. CAREER ASSESSMENT (Currently 0 on live site)
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
  },

  // 2. MAIN STUDY ABROAD LISTING PAGE (Study Abroad is 9 on live instead of 10)
  {
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
  },

  // 3. MAIN EXAM TRAINING LISTING PAGE (Exam & Training is 8 on live instead of 9)
  {
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
  },

  // 4. CONTACT US (Category: Other - Currently 0 on live)
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

  // 5. FAQ (Category: Other - Currently 0 on live)
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
        }
      ]
    }
  },

  // 6. TERMS AND CONDITIONS (Category: Other - Currently 0 on live)
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

  // 7. PRIVACY POLICY (Category: Other - Currently 0 on live)
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

  // 8. REFUND POLICY (Category: Other - Currently 0 on live)
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
  }
];

async function seedMissingPages() {
  console.log("🌱 Starting Seeder for Missing Live Pages...");
  try {
    for (const page of missingPages) {
      const existing = await db.query('SELECT id FROM pages WHERE slug = $1', [page.slug]);
      if (existing.rows.length > 0) {
        await db.query(
          `UPDATE pages 
           SET title = $1, status = $2, nav_visibility = $3, seo_title = $4, seo_description = $5, content = $6, updated_at = CURRENT_TIMESTAMP 
           WHERE slug = $7`,
          [page.title, page.status, page.nav_visibility, page.seo_title, page.seo_description, JSON.stringify(page.content), page.slug]
        );
        console.log(`✅ Updated existing page: ${page.slug} (${page.title})`);
      } else {
        await db.query(
          `INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [page.slug, page.title, page.status, page.nav_visibility, page.seo_title, page.seo_description, JSON.stringify(page.content)]
        );
        console.log(`✨ Inserted missing page: ${page.slug} (${page.title})`);
      }
    }
    console.log(`\n🎉 Completed! Successfully seeded ${missingPages.length} missing pages.`);
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    process.exit();
  }
}

seedMissingPages();
