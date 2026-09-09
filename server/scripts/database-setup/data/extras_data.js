const newsFlashes = [
  { content: "Upcoming Webinar: Study in UK 2026 - Register Now!", link: "/webinar", priority: 10 },
  { content: "New Intake open for USA Universities. Get 50% Scholarship!", link: "/study-abroad/usa", priority: 5 },
  { content: "FETC students achieve record 8.5 Band in IELTS!", link: "/success-stories", priority: 0 }
];

const blogPosts = [
  {
    title: "Top 10 Universities in the UK for International Students",
    slug: "top-10-uk-universities",
    status: "PUBLISHED",
    content: {
      summary: "Discover premier higher education institutions across the UK offering world-class academics, generous scholarships, and graduate visa work rights.",
      author: "FETC Editorial Team",
      tags: ["Study in UK", "Higher Education", "Scholarships"]
    }
  },
  {
    title: "How to Prepare for IELTS in 30 Days",
    slug: "ielts-prep-guide",
    status: "PUBLISHED",
    content: {
      summary: "A practical 4-week study plan targeting band 7.5+ across Reading, Listening, Writing, and Speaking modules with real simulator tests.",
      author: "Senior IELTS Mentor",
      tags: ["IELTS", "Exam Prep", "Study Tips"]
    }
  },
  {
    title: "Understanding the New Student Visa Rules for Australia",
    slug: "australia-visa-update",
    status: "PUBLISHED",
    content: {
      summary: "Key immigration and Genuine Student (GS) requirement updates for applicants seeking admission into Australian universities in 2025-2026.",
      author: "Visa Counsel Team",
      tags: ["Australia", "Visa Updates", "Immigration"]
    }
  }
];

const interactiveGuides = [
  {
    title: "UK Student Visa Process",
    slug: "uk-visa-guide",
    description: "Step-by-step roadmap for CAS issuance, biometric scheduling, and UK student visa application.",
    pages: [
      {
        page_number: 1,
        image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800"
      }
    ]
  },
  {
    title: "USA Application Journey",
    slug: "usa-journey",
    description: "End-to-end guidance from shortlisting universities to I-20 and DS-160 consular interview.",
    pages: [
      {
        page_number: 1,
        image_url: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=800"
      }
    ]
  }
];

const samplePartners = [
  {
    full_name: "Kingshuk Chatterjee",
    email: "kingshuk.chatterjee770@gmail.com",
    phone: "09136074394",
    organization_name: "Nvidia Education Partner",
    organization_website: "https://nvidia.com",
    partnership_types: ["Visitor Visa Services", "Work Permit Services", "Study Abroad Consultancy", "English Language Teaching"],
    status: "active"
  }
];

module.exports = { newsFlashes, blogPosts, interactiveGuides, samplePartners };
