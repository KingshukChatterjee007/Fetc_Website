-- =========================================================================
-- FETC Standalone Complete PostgreSQL Database Setup & Seeder Script
-- Generated for direct execution in: psql, pgAdmin, DBeaver, Supabase SQL Editor
-- Synchronized with All 21 Tables across Frontend & Backend
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. TABLE DEFINITIONS & INDEXES (21 TABLES DDL)
-- -------------------------------------------------------------------------
-- =========================================================================
-- FETC Complete Database Schema DDL (All 21 Tables)
-- Supported Environments: PostgreSQL 14+, Neon, Supabase, Render, AWS RDS
-- Synchronized with Website Frontend (React) and Backend (Express APIs)
-- =========================================================================

-- 1. Users Table (Authentication, Access Control & Student Profiles)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    bio TEXT,
    profile_image TEXT,
    enrolled_course VARCHAR(255),
    profile_details JSONB DEFAULT '{}'::jsonb,
    
    -- Student Profile Fields
    candidate_name VARCHAR(255),
    age INTEGER,
    dob DATE,
    budget VARCHAR(255),
    subject_interest VARCHAR(255),
    country_preference VARCHAR(255),
    state_preference VARCHAR(255),
    city_preference VARCHAR(255),
    current_status VARCHAR(255),

    -- Standardized Test Scores
    toefl_score VARCHAR(50),
    toefl_mock_score VARCHAR(50),
    toefl_date DATE,
    ielts_score VARCHAR(50),
    ielts_mock_score VARCHAR(50),
    ielts_date DATE,
    gre_score VARCHAR(50),
    gre_mock_score VARCHAR(50),
    gre_date DATE,
    gmat_score VARCHAR(50),
    gmat_mock_score VARCHAR(50),
    gmat_date DATE,
    sat_score VARCHAR(50),
    sat_mock_score VARCHAR(50),
    sat_date DATE,

    -- Academic Background
    tenth_score VARCHAR(50),
    tenth_passing_year VARCHAR(50),
    tenth_school VARCHAR(255),
    twelfth_score VARCHAR(50),
    twelfth_passing_year VARCHAR(50),
    twelfth_stream VARCHAR(255),
    twelfth_school VARCHAR(255),
    diploma_score VARCHAR(50),
    diploma_passing_year VARCHAR(50),
    diploma_name VARCHAR(255),
    diploma_awarding_body VARCHAR(255),
    diploma_duration VARCHAR(100),
    bachelors_score VARCHAR(50),
    bachelors_passing_year VARCHAR(50),
    bachelors_degree VARCHAR(255),
    bachelors_college VARCHAR(255),
    bachelors_university VARCHAR(255),
    bachelors_duration VARCHAR(100),
    bachelors_backlogs VARCHAR(100),
    pg_diploma_score VARCHAR(50),
    pg_diploma_passing_year VARCHAR(50),
    pg_diploma_name VARCHAR(255),
    pg_diploma_awarding_body VARCHAR(255),
    pg_diploma_duration VARCHAR(100),
    masters_score VARCHAR(50),
    masters_passing_year VARCHAR(50),
    masters_degree VARCHAR(255),
    masters_college VARCHAR(255),
    masters_university VARCHAR(255),
    masters_duration VARCHAR(100),
    masters_backlogs VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doubts Table (Student Academic & Visa Inquiries)
CREATE TABLE IF NOT EXISTS doubts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN',
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Leads Table (3-Stage Student Admission & Onboarding Funnel)
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(20) DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    dob DATE,
    gender VARCHAR(50),
    location VARCHAR(100),
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relation VARCHAR(100),
    service VARCHAR(100),
    country VARCHAR(255),
    program VARCHAR(255),
    visa_rejection VARCHAR(50),
    travel_history VARCHAR(50),
    exam_type VARCHAR(100),
    ebd DATE,
    anyspecificlocation TEXT,
    payment VARCHAR(100)
);

-- 4. Lead Documents Table (Uploaded Transcripts, Passports & Proofs)
CREATE TABLE IF NOT EXISTS lead_documents (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (lead_id, document_type)
);

-- 5. Tickets Table (Customer Support & Career Assessment Booking)
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'OPEN',
    admin_reply TEXT,
    replied_at TIMESTAMP,
    category VARCHAR(100) DEFAULT 'SUPPORT',
    assessment_date VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Ticket Messages Table (Interactive Live Support Chat Thread)
CREATE TABLE IF NOT EXISTS ticket_messages (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL,
    sender_name VARCHAR(255),
    sender_id INTEGER,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Site Settings Table (Dynamic Configuration & Assessment Fees)
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Pages Table (Dynamic CMS Content Store with Full JSONB Support)
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    nav_visibility VARCHAR(50) DEFAULT 'none',
    show_in_nav BOOLEAN DEFAULT false,
    seo_title VARCHAR(255),
    seo_description TEXT,
    content JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. News Flash Table (Global Sticky Announcement Banners)
CREATE TABLE IF NOT EXISTS news_flash (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    link TEXT,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Interactive Guides Table
CREATE TABLE IF NOT EXISTS interactive_guides (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Guide Pages Table (Steps in an Interactive Guide)
CREATE TABLE IF NOT EXISTS guide_pages (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER REFERENCES interactive_guides(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    page_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Mock Tests Table (Practice Exam Simulators)
CREATE TABLE IF NOT EXISTS mock_tests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'Published',
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Mock Test Registrations Table (Student Test Registrations & Bookings)
CREATE TABLE IF NOT EXISTS mock_test_registrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    test_title VARCHAR(255) NOT NULL,
    requested_date DATE,
    status VARCHAR(50) DEFAULT 'Form Submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Student Profiles Table (Dual-Compatibility Academic Profile Store)
CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    
    candidate_name VARCHAR(255),
    candidate_age VARCHAR(50),
    age INTEGER,
    dob DATE,
    student_phone VARCHAR(50),
    student_email VARCHAR(255),
    study_budget VARCHAR(255),
    budget VARCHAR(255),
    subject_interest VARCHAR(255),
    target_country VARCHAR(255),
    country_preference VARCHAR(255),
    state_preference VARCHAR(255),
    city_preference VARCHAR(255),
    current_status VARCHAR(255),

    -- Test Scores (Supports both _test_date and _date naming)
    toefl_score VARCHAR(50),
    toefl_mock_score VARCHAR(50),
    toefl_test_date DATE,
    toefl_date DATE,
    ielts_score VARCHAR(50),
    ielts_mock_score VARCHAR(50),
    ielts_test_date DATE,
    ielts_date DATE,
    gre_score VARCHAR(50),
    gre_mock_score VARCHAR(50),
    gre_test_date DATE,
    gre_date DATE,
    gmat_score VARCHAR(50),
    gmat_mock_score VARCHAR(50),
    gmat_test_date DATE,
    gmat_date DATE,
    sat_score VARCHAR(50),
    sat_mock_score VARCHAR(50),
    sat_test_date DATE,
    sat_date DATE,

    -- Academics
    tenth_score VARCHAR(50),
    tenth_passing_year VARCHAR(50),
    tenth_school VARCHAR(255),
    twelfth_score VARCHAR(50),
    twelfth_passing_year VARCHAR(50),
    twelfth_stream VARCHAR(255),
    twelfth_school VARCHAR(255),
    diploma_score VARCHAR(50),
    diploma_passing_year VARCHAR(50),
    diploma_name VARCHAR(255),
    diploma_awarding_body VARCHAR(255),
    diploma_duration VARCHAR(100),
    bachelors_score VARCHAR(50),
    bachelors_passing_year VARCHAR(50),
    bachelors_degree VARCHAR(255),
    bachelors_college VARCHAR(255),
    bachelors_university VARCHAR(255),
    bachelors_duration VARCHAR(100),
    bachelors_backlogs VARCHAR(100),
    pg_diploma_score VARCHAR(50),
    pg_diploma_passing_year VARCHAR(50),
    pg_diploma_name VARCHAR(255),
    pg_diploma_awarding_body VARCHAR(255),
    pg_diploma_duration VARCHAR(100),
    masters_score VARCHAR(50),
    masters_passing_year VARCHAR(50),
    masters_degree VARCHAR(255),
    masters_college VARCHAR(255),
    masters_university VARCHAR(255),
    masters_duration VARCHAR(100),
    masters_backlogs VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Partners Table (Institutional & Educational Partner Inquiries)
CREATE TABLE IF NOT EXISTS partners (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    organization_name VARCHAR(255),
    organization_website VARCHAR(255),
    partnership_types JSONB,
    other_type_detail TEXT,
    organization_description TEXT,
    why_partner TEXT,
    preferred_communication VARCHAR(50),
    candidates_sent VARCHAR(100),
    additional_comments TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Orders Table (Payment Transactions & Purchases)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    merchant_transaction_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(100),
    course_id VARCHAR(100),
    product_type VARCHAR(100),
    amount INT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    return_url VARCHAR(1000),
    assessment_date VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Invoices Table (Billing System, GST & Invoice Generator)
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_no VARCHAR(100) UNIQUE,
    invoice_date DATE DEFAULT CURRENT_DATE,
    payment_method VARCHAR(100) DEFAULT 'Cash',
    upi_ref VARCHAR(255),
    bill_to JSONB DEFAULT '{}'::jsonb,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal DECIMAL(10, 2) DEFAULT 0.00,
    sgst DECIMAL(10, 2) DEFAULT 0.00,
    cgst DECIMAL(10, 2) DEFAULT 0.00,
    total VARCHAR(100),
    issuer_company VARCHAR(255),
    client VARCHAR(255),
    company VARCHAR(255),
    date VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. Courses Table (Training Courses, Syllabus, Pricing & Instructors)
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Exam Prep',
    price DECIMAL(10, 2) DEFAULT 0.00,
    duration VARCHAR(100) DEFAULT '4 Weeks',
    level VARCHAR(50) DEFAULT 'Intermediate',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    students_count INT DEFAULT 0,
    thumbnail VARCHAR(500),
    learning_outcomes TEXT,
    instructor_name VARCHAR(255),
    instructor_bio TEXT,
    featured_image TEXT,
    intro_video TEXT,
    meta_description TEXT,
    language VARCHAR(100) DEFAULT 'English',
    subtitles VARCHAR(100) DEFAULT 'English',
    certificate_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20. News Articles Table (Regional Media Coverage & Press Releases)
CREATE TABLE IF NOT EXISTS news_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    source VARCHAR(100) DEFAULT 'FETC News',
    date VARCHAR(50),
    image_url TEXT,
    category VARCHAR(100) DEFAULT 'General',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 21. Student Reviews Table (Verified Visa & University Testimonials)
CREATE TABLE IF NOT EXISTS student_reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    university VARCHAR(255),
    score VARCHAR(50),
    quote TEXT NOT NULL,
    image_url TEXT,
    visa_image TEXT,
    country VARCHAR(100),
    program VARCHAR(100),
    rating INT DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Safety Migrations for pre-existing tables
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_id VARCHAR(100);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT 'Intermediate';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS students_count INT DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail VARCHAR(500);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS learning_outcomes TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_name VARCHAR(255);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_bio TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS featured_image TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS intro_video TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS language VARCHAR(100) DEFAULT 'English';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS subtitles VARCHAR(100) DEFAULT 'English';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_enabled BOOLEAN DEFAULT false;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'SUPPORT';
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS assessment_date VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS return_url VARCHAR(1000);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assessment_date VARCHAR(100);
ALTER TABLE pages ADD COLUMN IF NOT EXISTS nav_visibility VARCHAR(50) DEFAULT 'none';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS show_in_nav BOOLEAN DEFAULT false;

-- Performance & Unique Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_course_id_unique ON courses(course_id);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_doubts_user_id ON doubts(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant_tx ON orders(merchant_transaction_id);
CREATE INDEX IF NOT EXISTS idx_invoices_no ON invoices(invoice_no);
CREATE INDEX IF NOT EXISTS idx_courses_id ON courses(course_id);
CREATE INDEX IF NOT EXISTS idx_mock_regs_email ON mock_test_registrations(email);

-- -------------------------------------------------------------------------
-- 2. DEFAULT AUTHENTICATION ACCOUNTS
-- -------------------------------------------------------------------------
INSERT INTO users (name, email, password, role, phone, status)
VALUES ('FETC Administrator', 'fetc2026@gmail.com', '$2b$10$ecoyMqdwWtfIVXE/WUXmQeitY3De5aC3pU65eHVqr6oWUoDy84GYK', 'ADMIN', '9033347209', 'ACTIVE')
ON CONFLICT (email) DO UPDATE SET role = 'ADMIN', status = 'ACTIVE';

INSERT INTO users (name, email, password, role, phone, status)
VALUES ('Test Student', 'user2026@gmail.com', '$2b$10$7ujgFj0dLtom5dkACHK.Xu7f.A9ij9AEkPhXVpdk.tjxz3/br0rCa', 'USER', '9876543210', 'ACTIVE')
ON CONFLICT (email) DO UPDATE SET role = 'USER', status = 'ACTIVE';

-- -------------------------------------------------------------------------
-- 3. SITE SETTINGS & CONFIGURATIONS
-- -------------------------------------------------------------------------
INSERT INTO site_settings (key, value, updated_at)
VALUES ('career_assessment_fee', '1000', CURRENT_TIMESTAMP)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- 4. CMS PAGES (27 LIVE PAGES WITH COMPLETE JSONB CONTENT)
-- -------------------------------------------------------------------------
-- [Page: Home (/)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/', 'Home', 'PUBLISHED', 'navbar', false, 'FETC - Foreign English Tests Capital | Study Abroad & Exam Prep', 'Empowering students with digital classrooms, official IELTS/PTE training, and international university admissions.', '{"hero":{"badge":"Your Future, Simplified ✨","banners":["/static/media/banner 1.5b2a7b63144c91257183.png","/static/media/banner 2.ead83debc7c3f5014edf.png","/static/media/banner 3.69af0b8787cdb2d18486.png"],"bgImage":"","subtitle":"Forget the stress of paperwork. We make your journey to international education smooth, fun, and totally achievable.","titleMain":"Dream Big. We''ll","buttonText":"Start Enrollment","titleHighlight":"Handle the Rest."},"features":{"items":[{"desc":"Learn from people who have been there. Our mentors are here to guide you, not just lecture you.","label":"Elite Mentors","title":"Friendly Mentors","metric":"50+"},{"desc":"We''ve got visa processing down to a science. Relax, we''ve done this thousands of times.","label":"Approval Rate","title":"98% Visa Success","metric":"98%"},{"desc":"Our AI-powered mock tests show you exactly where to improve so you can ace your exams.","label":"Band Increase","title":"Real Result Boost","metric":"2+"},{"desc":"From London to Sydney, we have partners all over the world waiting to welcome you.","label":"Countries","title":"Global Reach","metric":"10+"}],"sectionTitle":"Why Students Love Us","sectionSubtitle":"We''re not your typical consultants. We care about your journey as much as you do."},"trustBar":{"message":"WORKING WITH 100+ AMAZING UNIVERSITIES TO GET YOU THERE"},"contactCTA":{"badge":"Let''s Connect","title":"Ready to Start Your Global Chapter?","contacts":[{"label":"Call Us Directly","value":"+91-9033347200 to 09"},{"label":"Email Support","value":"info@fetc.in"},{"label":"Visit Our Centre","value":"Surat, Gujarat, India"},{"label":"Working Hours","value":"Mon – Sat, 9AM – 7PM"}],"subtitle":"Schedule your one-on-one session with our senior experts today. Your success story begins with a single conversation."},"howItWorks":{"steps":[{"desc":"Connect with our senior experts to map out your ambitions, evaluate your profile, and build a personalized roadmap.","title":"Discovery Call","number":"01"},{"desc":"Enroll in our high-precision prep programs — IELTS, PTE, TOEFL — with AI-driven mock tests and 1-on-1 mentoring.","title":"Strategic Training","number":"02"},{"desc":"Secure your visa, finalize admissions, and begin your international journey with end-to-end post-landing support.","title":"Arrival & Success","number":"03"}],"title":"How We Get You There","subtitle":"A proven 3-step process that has helped 5,000+ students achieve their global education dreams.","badgeText":"Your Success Blueprint"},"studyAbroad":{"stats":[{"label":"Universities","value":"100+"},{"label":"Destinations","value":"10+"},{"label":"Visa Success","value":"98%"}],"title":"Explore the World","linkText":"Start My Adventure","badgeText":"Global Vibes","description":"Pick your dream destination and let us handle the boring stuff. We''ve helped thousands of students settle in over 10+ countries."},"examTraining":{"stats":[{"label":"Result Boost","value":"100%"},{"label":"Mock Tests","value":"200+"},{"label":"1-on-1 Mentors","value":"Expert"}],"title":"Ace Your Exams","linkText":"Check Courses","badgeText":"Top Coaching","description":"We make exam prep feel like a breeze with expert coaching and real mock tests."},"welcomeSection":{"badge":"Together with Gina Abroad","cards":[{"tag":"Learning","desc":"Casual, fun, and super effective language training with mentors who actually care.","title":"Learn Your Way"},{"tag":"Testing","desc":"We''re an official center for all the big exams. We''ll help you ace them without the stress.","title":"Testing Made Easy"},{"tag":"Global","desc":"10+ countries, hundreds of universities. We''ll help you find the one that feels like home.","title":"Go Anywhere"},{"tag":"AI Powered","desc":"Our AI helps you figure out what you''re naturally good at, so you pick the right career.","title":"Smart Futures"}],"title":"Why Choose FETC?","subtitle":"We''re more than just consultants. We''re your friends on this big journey, making sure every step—from exams to your new dorm—is as easy as it should be.","highlights":["Learning That Fits You","Smart AI Mock Tests","Stress-Free Visa Help","Support Even After You Land"]},"careerAssessment":{"title":"Find Your Path","badgeText":"Smart Career","description":"Not sure what to study? Our AI-powered analysis helps you discover your strengths and the perfect career to match."},"studentSpotlights":{"featured":{"name":"Udit Gangnani","tags":["🇮🇹 Italy","🎓 Data Science","💰 100% Funded"],"badge":"Featured Success Story","image":"","description":"Driven by a passion for higher education, Udit placed his trust in FETC to guide his journey abroad. With our dedicated mentorship and strategic support, he earned a fully funded scholarship to pursue Data Science at the University of Pisa, Italy.","scholarshipBadge":"Full Scholarship"},"students":[{"name":"Mansi Savani","image":"","country":"🇺🇸","achievement":"USA F1 Visa"},{"name":"Naitik Patel","image":"","country":"🇮🇪","achievement":"Ireland Student Visa"},{"name":"Prajal Sonariya","image":"","country":"🇺🇸","achievement":"USA F1 Visa"},{"name":"Prathana Dankhara","image":"","country":"🇺🇸","achievement":"USA F1 Visa"},{"name":"Rutvik Tejani","image":"","country":"🇺🇸","achievement":"USA F1 Visa"},{"name":"Samarth Pachchigar","image":"","country":"🇪🇸","achievement":"Spain Student Visa"}],"subtitle":"Real students. Real visas. Real success stories that inspire the next generation of global achievers.","badgeText":"Student Spotlights","titleMain":"Dreams Turned","titleHighlight":"Reality"},"bestStudentProfile":{"topStudents":[{"name":"Mansi Savani","image":"","country":"🇺🇸","achievement":"USA F1 Visa","fallbackImage":"/static/media/Mansi Savani USA F1 Visa.28b169e5a56943363fd9.png"},{"name":"Naitik Patel","image":"","country":"🇮🇪","achievement":"Ireland Student Visa","fallbackImage":"/static/media/Naitik Patel Ireland Student Visa.ecd5d06b4673a73713f5.png"},{"name":"Prajal Sonariya","image":"","country":"🇺🇸","achievement":"USA F1 Visa","fallbackImage":"/static/media/Prajal Sonariya USA F1 Visa.3f8d3d2ab4c4c361f3a8.png"},{"name":"Prathana Dankhara","image":"","country":"🇺🇸","achievement":"USA F1 Visa","fallbackImage":"/static/media/Prathana Dankhara USA F1 visa.0cd3781df3e8547f02b3.png"},{"name":"Rutvik Tejani","image":"","country":"🇺🇸","achievement":"USA F1 Visa","fallbackImage":"/static/media/Rutvik Tejani USA F1 Visa.9c59d6351ab35fcfeeae.png"},{"name":"Samarth Pachchigar","image":"","country":"🇪🇸","achievement":"Spain Student Visa","fallbackImage":"/static/media/Samarth Pachchigar Spain Student Visa.780bbc84e77166ef71f2.png"}]}}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Company Profile (/about/company-profile)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/about/company-profile', 'Company Profile', 'PUBLISHED', 'navbar', false, 'About FETC | Foreign English Tests Capital', 'Learn about FETC, an authorized English examination and training center headquartered in Surat, Gujarat under Gina Abroad Pvt. Ltd.', '{"hero":{"badge":"About FETC","title":"Building Global Careers","description":"FETC is an authorized, state-of-the-art English examination and training center headquartered in Surat, Gujarat. We are a dream project under Gina Abroad Pvt. Ltd., empowering students with digital classrooms and authorized examination spaces.","titleHighlight":"Since 1999"},"stats":[{"label":"Years of Industry Experience","value":"27+"},{"label":"Candidates Trained","value":"5,000+"},{"label":"State-of-the-art Centres","value":"5+"},{"label":"Countries Served","value":"15+"},{"label":"Tech-enabled Testing Labs","value":"100%"}],"story":{"title":"The Inception"},"agenda":[{"desc":"Certified TOEFL and SELT training programs for faculty members, enhancing teaching capabilities and career advancement opportunities.","icon":"📜","title":"Professional Training"},{"desc":"Expert guidance helping students navigate career paths, university selections, and global opportunities with confidence.","icon":"🎯","title":"Career Counselling"},{"desc":"Direct campus visits from international university representatives, providing students with firsthand information about study abroad options.","icon":"🏫","title":"University Visits"},{"desc":"Explore your path to Accredited qualifications. Complete your first two years in India, pathway to abroad.","icon":"🎓","title":"City College Birmingham (2+1)"}],"aboutUs":{"aboutUsTag":"About Us","aboutUsDesc":"We are dedicated to helping students and professionals achieve their dreams of studying, working, or settling abroad. We connect you with a world of opportunities through top-notch English language support, making your application process for international education and careers smooth and successful.","aboutUsTitle":"At FETC, We Offer Excellence in English Language Training","partnershipTag":"Our Partnership","partnershipDesc1":"We''re excited to collaborate with R.H. Patel Institute of Technology to expand opportunities for your students and enhance faculty development. Our comprehensive approach combines international university partnerships, career counseling excellence, and certified training programs.","partnershipDesc2":"This partnership opens doors to global education while supporting your institution''s growth and your students'' success.","partnershipTitle":"Expanding Opportunities Together"},"teamBanner":{"desc":"Whether organizing mock tests or conducting staff alignment meetings in our conference halls, our core value remains the same: student success comes first.","image":"/uploads/fetc-1788263765588-485672382.png"},"agendaItems":[{"desc":"Certified TOEFL and SELT training programs for faculty members, enhancing teaching capabilities and career advancement opportunities.","icon":"📜","title":"Professional Training"},{"desc":"Expert guidance helping students navigate career paths, university selections, and global opportunities with confidence.","icon":"🎯","title":"Career Counselling"},{"desc":"Direct campus visits from international university representatives, providing students with firsthand information about study abroad options.","icon":"🏫","title":"University Visits"},{"desc":"Explore your path to Accredited qualifications. Complete your first two years in India, pathway to abroad.","icon":"🎓","title":"City College Birmingham (2+1)"}],"campusVisits":[{"tag":"First Visit","desc":"Curry College representative will visit your campus, sharing opportunities for American education.","icon":"🗓️","title":"Bill Boozing – 3rd April 2026"},{"tag":"Follow-Up Visits","desc":"UK University Representatives will visit, showcasing British higher education options and pathways.","icon":"🇬🇧","title":"UK University Representatives"},{"tag":"Ongoing Access","desc":"Continued university partnerships expanding your students'' global education choices.","icon":"🌍","title":"Continued University Partnerships"}],"certificates":[{"alt":"Certificate of Representation","src":"/assets/certificates/Screenshot 2026-06-10 111633.png"},{"alt":"City College Birmingham Appointment Letter","src":"/assets/certificates/Screenshot 2026-06-10 111657.png"},{"alt":"Certificate of Attendance","src":"/assets/certificates/Screenshot 2026-06-10 111719.png"},{"alt":"ICEF Accredited Certificate","src":"/assets/certificates/Screenshot 2026-06-10 111730.png"}],"galleryItems":[{"src":"/assets/office-images/testing-lab.jpg","desc":"State-of-the-art computer labs customized for official IELTS and PTE exam delivery.","title":"High-Capacity Testing Lab","category":"Labs","location":"Surat Vesu Branch"},{"src":"/assets/office-images/vip-conference.jpg","desc":"Professional conference space for academic training and workshops.","title":"VIP Executive Conference","category":"Spaces","location":"Surat Vesu Branch"},{"src":"/assets/office-images/vip-exam-centre.jpg","desc":"Authorised Study Centre for City College Birmingham, UK.","title":"Authorised City College Birmingham Centre","category":"Spaces","location":"Surat Vesu Branch"},{"src":"/assets/office-images/directors-cabin.jpeg","desc":"Our executive administrative space.","title":"Director''s Cabin","category":"Spaces","location":"Surat Vesu Branch"},{"src":"/assets/office-images/p1.jpeg","desc":"Celebration of Navratri festival with staff.","title":"Navratri Traditional Day","category":"Events & News","location":"Surat Vesu Branch"},{"src":"/assets/office-images/p2.jpeg","desc":"Annual festive dinner gathering with staff.","title":"Diwali Celebration Dinner","category":"Events & News","location":"FETC Grand Ballroom"},{"src":"/assets/office-images/p3.jpeg","desc":"Annual retreat promoting team building.","title":"Annual Team Trip & Offsite","category":"Events & News","location":"FETC Offsite"},{"src":"/assets/office-images/p4.jpeg","desc":"Turf cricket championship victory.","title":"Champions of the League","category":"Events & News","location":"Surat Turf Arena"},{"src":"/assets/office-images/p5.jpeg","desc":"Score-optimization bootcamps.","title":"Faculty Training Seminars","category":"Events & News","location":"Surat Vesu Branch"},{"src":"/assets/office-images/p6.jpeg","desc":"Recognizing high scoring students.","title":"Student Success Ceremony","category":"Events & News","location":"Surat Vesu Branch"},{"src":"/assets/news/news1.png","desc":"English mock test for 700+ students.","title":"CBSE Mock Test Initiative","category":"Events & News","location":"Radiant School"},{"src":"/assets/news/news2.png","desc":"Media coverage of mock test.","title":"Foreign Innovation Test","category":"Events & News","location":"Radiant School"},{"src":"/assets/office-images/exterior-roongta-vesu.jpeg","desc":"Flagship training center.","title":"Roongta Business Park Campus","category":"Exterior","location":"Surat Vesu Branch"},{"src":"/assets/office-images/exterior-varachha-prime.jpeg","desc":"Second fully equipped branch.","title":"Varachha Branch Campus","category":"Exterior","location":"Surat Varachha Branch"},{"src":"/assets/office-images/admin-pc.jpeg","desc":"Dedicated administrative workspace.","title":"Administrative Terminal","category":"Workspace","location":"Surat Vesu Branch"},{"src":"/assets/office-images/waiting-area-washroom.jpeg","desc":"Spacious lobby for candidates.","title":"Student Lounge & Waiting Area","category":"Workspace","location":"Surat Vesu Branch"}],"directorsNote":{"quote":"Be Great. Do Good. Learn Always.","title":"Our Story","message":"Whether organizing mock tests or conducting staff alignment meetings in our conference halls, our core value remains the same: student success comes first.","timelineDesc":"Specifically for exams and training and study abroad services this company has been formed under the umbrella of Ms. Bhumika Dilkhush proprietor of Gina Abroad.","timelineYear":"1999","timelineTitle":"The Inception"},"visionSection":{"badge":"OUR PILLARS","values":[{"desc":"Certified examiners, tech support teams, and counseling heads work in unison to provide an error-free, supportive testing and coaching environment.","icon":"Target","title":"Student-First Counseling"},{"desc":"State-of-the-art computer labs with authorized examination space under Gina Abroad Pvt. Ltd.","icon":"Lightbulb","title":"Testing Excellence"},{"desc":"Direct university tie-ups and official representation across UK, USA, Europe, Canada, Australia, and more.","icon":"Compass","title":"Global Opportunities"}],"titlePrefix":"The team","titleHighlight":"behind your success"},"accreditations":[{"alt":"Certificate of Representation","src":"/assets/certificates/Screenshot 2026-06-10 111633.png"},{"alt":"City College Birmingham Appointment Letter","src":"/assets/certificates/Screenshot 2026-06-10 111657.png"},{"alt":"Certificate of Attendance","src":"/assets/certificates/Screenshot 2026-06-10 111719.png"},{"alt":"ICEF Accredited Certificate","src":"/assets/certificates/Screenshot 2026-06-10 111730.png"}],"globalPrograms":{"tag":"Global Tech Education","title":"Top-Notch Skill Based Online Programs","pathways":["Software Developer/ Web Developer","IT Support Specialist","Network Engineer/ Cybersecurity Analyst","Data Scientist/ Business Intelligence Analyst","E-Commerce Manager","Tech Project Manager"],"subtitle":"IT | Computing | Digital Technology"},"officeShowcase":{"title":"Our Certifications & Testing Facilities","images":["/assets/certificates/Screenshot 2026-06-10 111633.png","/assets/certificates/Screenshot 2026-06-10 111657.png","/assets/certificates/Screenshot 2026-06-10 111719.png","/assets/certificates/Screenshot 2026-06-10 111730.png"],"description":"Globally recognized credentials that back every examination and counseling process."},"facultyBenefits":[{"desc":"Official TOEFL and SELT certification training that enhances your teaching credentials and opens new career opportunities.","icon":"🏅","title":"Certified Training Programs"},{"desc":"Stay current with international education standards and improve your ability to guide students toward global opportunities.","icon":"📈","title":"Professional Development"},{"desc":"Earn referral incentives when your students enroll through our partnerships, creating additional income streams for dedicated faculty.","icon":"💰","title":"Referral Incentives"}],"programDownloads":[{"icon":"💼","name":"Business Management","category":"Management","filename":"Business Management.pdf"},{"icon":"🏥","name":"Diploma in Health & Social Care","category":"Health & Social Care","filename":"Diploma in Health & Social Care.pdf"},{"icon":"💻","name":"Diploma in IT - Web Design","category":"IT & Computing","filename":"Diploma in Information Technology - Web Design.pdf"},{"icon":"🛒","name":"Diploma in IT - E Commerce","category":"IT & Computing","filename":"Diploma in IT - E Commerce F.pdf"},{"icon":"🏨","name":"Hospitality & Tourism Management","category":"Hospitality","filename":"Hospitality & Tourism Management.pdf"},{"icon":"🇬🇧","name":"Gina Abroad - British Degree Route","category":"Academic Guide","filename":"Gina Abroad_Your-Smartest-Route-to-a-British-Degree.pdf"}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Behaviour and Career Analysis (/career-assessment/behaviour-and-career-analysis)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/career-assessment/behaviour-and-career-analysis', 'Behaviour and Career Analysis', 'PUBLISHED', 'navbar', false, 'Behavioral & Career Analysis Report | FETC', 'A comprehensive data-driven evaluation mapping your intrinsic behavioral patterns, cognitive learning styles, and verified competencies to optimal industry pathways.', '{"hero":{"badge":"Verified Assessment","title":"Behavioral & Career","description":"A comprehensive data-driven evaluation mapping your intrinsic behavioral patterns, cognitive learning styles, and verified competencies to optimal industry pathways.","primaryProfile":"Consultative Leader","titleHighlight":"Analysis Report","peakIndustryMatch":"Hospitality & Healthcare"},"vakData":[{"name":"Visual","color":"#0ea5e9","score":80},{"name":"Kinesthetic","color":"#3b82f6","score":60},{"name":"Auditory","color":"#64748b","score":40}],"overview":{"title":"Assessment Overview","summary":"The ComPAS Now™ analysis indicates a strong alignment with roles requiring methodical organization, interpersonal diplomacy, and contextual consistency. High scores in democratic values suggest proficiency in collaborative environments.","strengths":["Effectively processes and utilizes feedback","Engages positively in recognition exchanges","Consistently identifies potential in peers","Demonstrates high emotional intelligence","Accurately assesses human motivations","Maintains high proactive engagement","Structures personal time efficiently","Processes information in linear, logical steps","Prefers contextual stability over disruption","Exhibits strong visual-spatial imagination"],"modalityDesc":"Primary cognitive processing occurs through spatial and observational engagement.","primaryModality":"Visual-Dominant"},"competencies":[{"score":90,"subject":"Democratic values"},{"score":85,"subject":"Helping attitude"},{"score":75,"subject":"Democratic decision"},{"score":80,"subject":"Consultative Process"},{"score":65,"subject":"Repeated Action"},{"score":70,"subject":"Organizing"},{"score":75,"subject":"Market research"},{"score":85,"subject":"Attention to detail"},{"score":80,"subject":"Conflict Management"},{"score":85,"subject":"Interpersonal Skill"}],"careerAlignments":[{"score":95,"subject":"Hospitality"},{"score":88,"subject":"Counseling"},{"score":85,"subject":"Healthcare"},{"score":82,"subject":"Production Eng"},{"score":84,"subject":"Criminology"},{"score":80,"subject":"Navigation"}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Contact Us (/contact)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/contact', 'Contact Us', 'PUBLISHED', 'navbar', false, 'Contact Us | FETC', 'Get in touch with FETC head office in Surat, Gujarat for study abroad and exam preparation inquiries.', '{"mapSection":{"title":"Visit Our Head Office","mapUrl":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.218556637389!2d72.76615557602058!3d21.1437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0532454645281%3A0xcb1b689b91e5e01c!2sRoongta%20Signature!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin","subtitle":"Located in Surat, Gujarat. Drop by for a coffee and chat about your future."},"infoSection":{"title":"Get In Touch With Us","description":"Have questions about our courses, study abroad programs, or anything else? We''d love to hear from you."},"workingHours":{"title":"Working Hours","sunday":"Sunday: Closed","timing":"Monday - Saturday: 9:00 AM - 7:00 PM","weekdays":"Mon - Sat: 9:00 AM - 7:00 PM"},"contactDetails":{"email":{"address":"info@fetc.in"},"phone":{"number":"+91 9033347200"},"address":{"lines":["2nd floor, 239, Roongta Signature","Nr. Shyam Mandir Vesu","Surat - 395007"]}}}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Master Your Standardized Exams (/exam-training)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/exam-training', 'Master Your Standardized Exams', 'PUBLISHED', 'navbar', false, 'Master Your Standardized Exams | SELT, IELTS, TOEFL, GRE, GMAT, SAT | FETC', 'Access top-tier language training, computer-based mock modules, and expert mentors. Achieve the target score you need to study, work, or live abroad.', '{"hero":{"badge":"Accredited Prep Programs","title":"Master Your Standardized Exams","description":"Access top-tier language training, computer-based mock modules, and expert mentors. Achieve the target score you need to study, work, or live abroad."}}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: GRE & GMAT Coaching (/exam-training/gre-gmat)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/exam-training/gre-gmat', 'GRE & GMAT Coaching', 'PUBLISHED', 'navbar', false, 'GRE & GMAT Preparation & Coaching | FETC', 'Advanced standardized tests for graduate school and business school admissions worldwide, measuring verbal, quantitative, and analytical skills.', '{"hero":{"title":"GRE & GMAT","shortLabel":"GRE/GMAT","description":"Advanced standardized tests for graduate school and business school admissions worldwide, measuring verbal, quantitative, and analytical skills.","fullDescription":"The Graduate Record Examination (GRE) and the Graduate Management Admission Test (GMAT) are two of the most recognized standardized tests for admission to graduate and business schools worldwide. While the GRE is broadly accepted by various graduate programs, the GMAT is specifically designed for business school admissions. Both exams assess your readiness for advanced academic and professional studies.\n\nExam Format and Structure\nThe GRE consists of three sections: Verbal Reasoning, Quantitative Reasoning, and Analytical Writing. It evaluates your critical thinking, analytical writing, and problem-solving abilities.\nThe GMAT includes four sections: Analytical Writing Assessment, Integrated Reasoning, Quantitative Reasoning, and Verbal Reasoning. It focuses on skills relevant to business and management studies.\nBoth tests are computer-based and adaptive, meaning the difficulty of questions adjusts based on your performance.\n\nWho Needs to Take GRE/GMAT?\nThe GRE is required for admission to a wide range of graduate programs, including master’s and doctoral degrees across various disciplines. The GMAT is essential for students applying to MBA programs and other business-related graduate degrees. These exams are critical steps for anyone pursuing advanced education in their chosen field.\n\nAccepted Countries and Cost\nBoth the GRE and GMAT are accepted by universities and business schools in the USA, Canada, the UK, Australia, and many other countries. The cost of the exams ranges between INR 22,000/- to 25,000/-. These exams are significant investments in your future, opening doors to prestigious programs and career opportunities worldwide."},"name":"GRE & GMAT","features":[{"label":"Admissions","highlight":"Global"},{"label":"Target Scores","highlight":"High"},{"label":"Analytics","highlight":"Advanced"},{"label":"Support","highlight":"Full"}],"metadata":[{"label":"Cost","value":"INR 22,000/- to 25,000/-"},{"label":"Frequency","value":"Flexible"},{"label":"Duration","value":"2h - 2.5h"},{"label":"Validity","value":"5 Years"}],"shortLabel":"GRE/GMAT","description":"Advanced standardized tests for graduate school and business school admissions worldwide, measuring verbal, quantitative, and analytical skills.","fullDescription":"The Graduate Record Examination (GRE) and the Graduate Management Admission Test (GMAT) are two of the most recognized standardized tests for admission to graduate and business schools worldwide. While the GRE is broadly accepted by various graduate programs, the GMAT is specifically designed for business school admissions. Both exams assess your readiness for advanced academic and professional studies.\n\nExam Format and Structure\nThe GRE consists of three sections: Verbal Reasoning, Quantitative Reasoning, and Analytical Writing. It evaluates your critical thinking, analytical writing, and problem-solving abilities.\nThe GMAT includes four sections: Analytical Writing Assessment, Integrated Reasoning, Quantitative Reasoning, and Verbal Reasoning. It focuses on skills relevant to business and management studies.\nBoth tests are computer-based and adaptive, meaning the difficulty of questions adjusts based on your performance.\n\nWho Needs to Take GRE/GMAT?\nThe GRE is required for admission to a wide range of graduate programs, including master’s and doctoral degrees across various disciplines. The GMAT is essential for students applying to MBA programs and other business-related graduate degrees. These exams are critical steps for anyone pursuing advanced education in their chosen field.\n\nAccepted Countries and Cost\nBoth the GRE and GMAT are accepted by universities and business schools in the USA, Canada, the UK, Australia, and many other countries. The cost of the exams ranges between INR 22,000/- to 25,000/-. These exams are significant investments in your future, opening doors to prestigious programs and career opportunities worldwide."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: IELTS Coaching (/exam-training/idp-for-ielts)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/exam-training/idp-for-ielts', 'IELTS Coaching', 'PUBLISHED', 'navbar', false, 'IELTS Preparation & Coaching | FETC', 'Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.', '{"hero":{"title":"IELTS","shortLabel":"IELTS","description":"Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.","fullDescription":"The International English Language Testing System (IELTS) is a widely recognized English language proficiency exam required for study, work, and immigration purposes. It is accepted by educational institutions, employers, and immigration authorities in countries like the UK, USA, Australia, Canada, and New Zealand. IELTS assesses your ability to communicate effectively in English across all key skills.\n\nExam Format and Structure\nThe IELTS exam comprises four sections: Listening, Reading, Writing, and Speaking. Each section is designed to evaluate your English language proficiency in academic or general contexts. The test is available in both pen-and-paper and computer-based formats, providing flexibility to candidates.\n\nWho Needs to Take IELTS?\nIELTS is essential for individuals seeking to study, work, or migrate to English-speaking countries. It is required by universities for admission, by employers for job applications, and by immigration authorities for visa processing. The test is a key step for anyone planning to pursue opportunities abroad.\n\nAccepted Countries and Cost\nIELTS is accepted in the UK, USA, Australia, Canada, New Zealand, and other countries for educational, professional, and immigration purposes. The cost of the exam is INR 18,000/-, making it a crucial investment for your future abroad."},"name":"IELTS","features":[{"label":"Comprehensive Assessment","highlight":"550+"},{"label":"Rapid Results","highlight":"100%"},{"label":"Efficiency and Quality","highlight":"550+"},{"label":"Objective Scoring","highlight":"300+"}],"metadata":[{"label":"Cost","value":"INR 18,000/-"},{"label":"Frequency","value":"Weekly / 48 times a year"},{"label":"Duration","value":"2 Hrs 45 Mins"},{"label":"Validity","value":"2 Years"}],"shortLabel":"IELTS","description":"Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.","fullDescription":"The International English Language Testing System (IELTS) is a widely recognized English language proficiency exam required for study, work, and immigration purposes. It is accepted by educational institutions, employers, and immigration authorities in countries like the UK, USA, Australia, Canada, and New Zealand. IELTS assesses your ability to communicate effectively in English across all key skills.\n\nExam Format and Structure\nThe IELTS exam comprises four sections: Listening, Reading, Writing, and Speaking. Each section is designed to evaluate your English language proficiency in academic or general contexts. The test is available in both pen-and-paper and computer-based formats, providing flexibility to candidates.\n\nWho Needs to Take IELTS?\nIELTS is essential for individuals seeking to study, work, or migrate to English-speaking countries. It is required by universities for admission, by employers for job applications, and by immigration authorities for visa processing. The test is a key step for anyone planning to pursue opportunities abroad.\n\nAccepted Countries and Cost\nIELTS is accepted in the UK, USA, Australia, Canada, New Zealand, and other countries for educational, professional, and immigration purposes. The cost of the exam is INR 18,000/-, making it a crucial investment for your future abroad."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Pearson Versant - Language Assessment (/exam-training/pearson-versant)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/exam-training/pearson-versant', 'Pearson Versant - Language Assessment', 'PUBLISHED', 'none', false, NULL, NULL, '{"title":"Pearson Versant - Language Assessment","features":[{"label":"Score Delivery","highlight":"Instant"},{"label":"Industry Standard","highlight":"Global"},{"label":"Scoring","highlight":"AI-Driven"},{"label":"Results","highlight":"Fast"}],"description":"Measure your automated language proficiency with the world''s most trusted AI-driven assessment tool."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: PSI - Global Testing Leader (/exam-training/psi)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/exam-training/psi', 'PSI - Global Testing Leader', 'PUBLISHED', 'none', false, NULL, NULL, '{"title":"PSI - Global Testing Leader","features":[{"label":"Professional Training","highlight":"Expert Led"},{"label":"Real Exam Simulation","highlight":"100%"},{"label":"Coaching","highlight":"Expert"},{"label":"Strategy","highlight":"Targeted"}],"description":"Prepare for your PSI examinations with our expert-led modules and comprehensive practice materials used by thousands worldwide."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: PTE Coaching (/exam-training/pte)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/exam-training/pte', 'PTE Coaching', 'PUBLISHED', 'navbar', false, 'PTE Preparation & Coaching | FETC', 'Prepare for PTE with AI-driven patterns, timed practice, and structured guidance to improve your score quickly.', '{"hero":{"title":"PTE","shortLabel":"PTE","description":"Prepare for PTE with AI-driven patterns, timed practice, and structured guidance to improve your score quickly.","fullDescription":"The Pearson Test of English Academic (PTE-A) is a computer-based English language proficiency exam designed for non-native English speakers. It is widely accepted by universities, colleges, and governments for study, work, and migration purposes. PTE-A is recognized for its accurate and unbiased assessment, making it a preferred choice for students and professionals alike.\n\nExam Format and Structure\nThe PTE-A exam comprises three main sections: Speaking & Writing, Reading, and Listening. Each section is designed to evaluate your ability to use English in academic and real-life settings. The test is conducted entirely on a computer, and the results are typically available within a few days, making it one of the fastest options for English proficiency testing.\n\nWho Needs to Take PTE-A?\nPTE-A is ideal for individuals seeking to study, work, or migrate to English-speaking countries such as the UK, USA, Australia, Canada, and New Zealand. It is required by universities for admissions, by employers for job applications, and by immigration authorities for visa processing. Achieving a qualifying score on the PTE-A is a key step toward pursuing your goals abroad.\n\nAccepted Countries and Cost\nPTE-A is accepted by universities, colleges, and governments in the UK, USA, Australia, Canada, New Zealand, and other countries. The cost of the PTE-A exam is INR 18,900/-. This investment is crucial for those aiming to advance their education, career, or settlement opportunities in an English-speaking environment."},"name":"PTE","features":[{"label":"Pattern Mastery","highlight":"AI-Driven"},{"label":"Scoring","highlight":"Instant"},{"label":"Efficiency and Quality","highlight":"550+"},{"label":"Objective Scoring","highlight":"300+"}],"metadata":[{"label":"Cost","value":"INR 18,900/-"},{"label":"Frequency","value":"Almost Daily"},{"label":"Duration","value":"2 Hours"},{"label":"Validity","value":"2 Years"}],"shortLabel":"PTE","description":"Prepare for PTE with AI-driven patterns, timed practice, and structured guidance to improve your score quickly.","fullDescription":"The Pearson Test of English Academic (PTE-A) is a computer-based English language proficiency exam designed for non-native English speakers. It is widely accepted by universities, colleges, and governments for study, work, and migration purposes. PTE-A is recognized for its accurate and unbiased assessment, making it a preferred choice for students and professionals alike.\n\nExam Format and Structure\nThe PTE-A exam comprises three main sections: Speaking & Writing, Reading, and Listening. Each section is designed to evaluate your ability to use English in academic and real-life settings. The test is conducted entirely on a computer, and the results are typically available within a few days, making it one of the fastest options for English proficiency testing.\n\nWho Needs to Take PTE-A?\nPTE-A is ideal for individuals seeking to study, work, or migrate to English-speaking countries such as the UK, USA, Australia, Canada, and New Zealand. It is required by universities for admissions, by employers for job applications, and by immigration authorities for visa processing. Achieving a qualifying score on the PTE-A is a key step toward pursuing your goals abroad.\n\nAccepted Countries and Cost\nPTE-A is accepted by universities, colleges, and governments in the UK, USA, Australia, Canada, New Zealand, and other countries. The cost of the PTE-A exam is INR 18,900/-. This investment is crucial for those aiming to advance their education, career, or settlement opportunities in an English-speaking environment."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: SAT Coaching (/exam-training/sat)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/exam-training/sat', 'SAT Coaching', 'PUBLISHED', 'navbar', false, 'SAT Preparation & Coaching | FETC', 'A standardized test widely used for college admissions in the USA and other countries, assessing readiness for undergraduate education.', '{"hero":{"title":"SAT","shortLabel":"SAT","description":"A standardized test widely used for college admissions in the USA and other countries, assessing readiness for undergraduate education.","fullDescription":"The Scholastic Assessment Test (SAT) is a standardized test widely used for college admissions in the USA and other countries. It assesses a student''s readiness for college and provides colleges with a common data point for comparing applicants. The SAT is a key component of the college application process for students aiming to pursue undergraduate education.\n\nExam Format and Structure\nThe SAT consists of two main sections: Evidence-Based Reading and Writing, and Math. There is also an optional Essay section, which some colleges may require. The exam is paper-based, and it measures skills that are essential for academic success in college.\n\nWho Needs to Take SAT?\nThe SAT is required for students applying to undergraduate programs in the USA and other countries. It is used by colleges to evaluate a student''s academic abilities and potential for success in higher education. The SAT is crucial for students aiming to secure admission to top universities worldwide.\n\nAccepted Countries and Cost\nThe SAT is accepted primarily in the USA but is also recognized by universities in Canada, the UK, Australia, and other countries. The cost of the SAT exam is INR 12,300/-, making it a crucial investment for your undergraduate studies. This investment is essential for students aiming to pursue higher education abroad."},"name":"SAT","features":[{"label":"Undergraduate","highlight":"USA"},{"label":"Target Score","highlight":"1500+"},{"label":"Focus","highlight":"Math/Eng"},{"label":"Training","highlight":"Expert"}],"metadata":[{"label":"Cost","value":"INR 12,300/-"},{"label":"Frequency","value":"7 Times / Year"},{"label":"Duration","value":"3 Hours"},{"label":"Validity","value":"5 Years"}],"shortLabel":"SAT","description":"A standardized test widely used for college admissions in the USA and other countries, assessing readiness for undergraduate education.","fullDescription":"The Scholastic Assessment Test (SAT) is a standardized test widely used for college admissions in the USA and other countries. It assesses a student''s readiness for college and provides colleges with a common data point for comparing applicants. The SAT is a key component of the college application process for students aiming to pursue undergraduate education.\n\nExam Format and Structure\nThe SAT consists of two main sections: Evidence-Based Reading and Writing, and Math. There is also an optional Essay section, which some colleges may require. The exam is paper-based, and it measures skills that are essential for academic success in college.\n\nWho Needs to Take SAT?\nThe SAT is required for students applying to undergraduate programs in the USA and other countries. It is used by colleges to evaluate a student''s academic abilities and potential for success in higher education. The SAT is crucial for students aiming to secure admission to top universities worldwide.\n\nAccepted Countries and Cost\nThe SAT is accepted primarily in the USA but is also recognized by universities in Canada, the UK, Australia, and other countries. The cost of the SAT exam is INR 12,300/-, making it a crucial investment for your undergraduate studies. This investment is essential for students aiming to pursue higher education abroad."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: SELT Coaching (/exam-training/selt)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/exam-training/selt', 'SELT Coaching', 'PUBLISHED', 'navbar', false, 'SELT Preparation & Coaching | FETC', 'Essential English proficiency tests for UK visa and immigration applications, including IELTS for UKVI and PTE Academic UKVI.', '{"hero":{"title":"SELT","shortLabel":"SELT","description":"Essential English proficiency tests for UK visa and immigration applications, including IELTS for UKVI and PTE Academic UKVI.","fullDescription":"The Secure English Language Test (SELT) is a recognized English language proficiency exam required for visa and immigration purposes, particularly in the UK. It is mandated by the UK Visas and Immigration (UKVI) department for individuals seeking to study, work, or settle in the UK. The SELT is designed to assess your English language skills across key areas essential for everyday communication.\n\nExam Format and Structure\nThe SELT exam is offered at various levels—A1, A2, B1, and B2—each corresponding to different visa and immigration requirements. The levels indicate the complexity of the language skills being tested, from basic (A1, A2) to more advanced (B1, B2) proficiency. The exam comprises four sections: Listening, Reading, Writing, and Speaking. It is conducted only in a computer-based format, and results are securely transmitted to the relevant authorities.\n\nWho Needs to Take SELT?\nSELT is required for individuals applying for specific UK visas, including work, study, and settlement visas. Depending on the visa type, candidates must achieve a qualifying score at the required level (A1, A2, B1, or B2). Whether you are looking to work, study, or live in the UK, achieving the appropriate SELT level is a crucial step in the process.\n\nAccepted Countries and Cost\nThe SELT is specifically required for UK immigration purposes and is a prerequisite for entry to the UK. The cost of the exam is INR 15,900/-, making it a crucial investment for your UK visa journey."},"name":"SELT","features":[{"label":"Approved","highlight":"UKVI"},{"label":"Booking","highlight":"Fast"},{"label":"Recognition","highlight":"Global"},{"label":"Guidance","highlight":"Expert"}],"metadata":[{"label":"Cost","value":"INR 15,900/-"},{"label":"Frequency","value":"Weekly / On-demand"},{"label":"Duration","value":"15m - 3h"},{"label":"Validity","value":"2 Years"}],"shortLabel":"SELT","description":"Essential English proficiency tests for UK visa and immigration applications, including IELTS for UKVI and PTE Academic UKVI.","fullDescription":"The Secure English Language Test (SELT) is a recognized English language proficiency exam required for visa and immigration purposes, particularly in the UK. It is mandated by the UK Visas and Immigration (UKVI) department for individuals seeking to study, work, or settle in the UK. The SELT is designed to assess your English language skills across key areas essential for everyday communication.\n\nExam Format and Structure\nThe SELT exam is offered at various levels—A1, A2, B1, and B2—each corresponding to different visa and immigration requirements. The levels indicate the complexity of the language skills being tested, from basic (A1, A2) to more advanced (B1, B2) proficiency. The exam comprises four sections: Listening, Reading, Writing, and Speaking. It is conducted only in a computer-based format, and results are securely transmitted to the relevant authorities.\n\nWho Needs to Take SELT?\nSELT is required for individuals applying for specific UK visas, including work, study, and settlement visas. Depending on the visa type, candidates must achieve a qualifying score at the required level (A1, A2, B1, or B2). Whether you are looking to work, study, or live in the UK, achieving the appropriate SELT level is a crucial step in the process.\n\nAccepted Countries and Cost\nThe SELT is specifically required for UK immigration purposes and is a prerequisite for entry to the UK. The cost of the exam is INR 15,900/-, making it a crucial investment for your UK visa journey."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: TOEFL Coaching (/exam-training/toefl)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/exam-training/toefl', 'TOEFL Coaching', 'PUBLISHED', 'navbar', false, 'TOEFL Preparation & Coaching | FETC', 'Target your TOEFL score through skill-based training sessions for reading, listening, writing, and speaking.', '{"hero":{"title":"TOEFL","shortLabel":"TOEFL","description":"Target your TOEFL score through skill-based training sessions for reading, listening, writing, and speaking.","fullDescription":"The Test of English as a Foreign Language (TOEFL) is a globally recognized English proficiency test that is essential for students, professionals, and immigrants. It is widely accepted by universities, colleges, and institutions in the USA, Canada, Australia, and other English-speaking countries. TOEFL assesses your ability to use and understand English in academic settings.\n\nExam Format and Structure\nTOEFL consists of four sections: Reading, Listening, Speaking, and Writing. Each section measures a different aspect of your academic English proficiency. The test is available only in a computer-based format, ensuring a standardized and secure testing experience for all candidates.\n\nWho Needs to Take TOEFL?\nTOEFL is required for non-native English speakers seeking admission to English-speaking universities and colleges. It is also often needed for professional certifications and immigration purposes. Whether you are pursuing higher education or professional opportunities, TOEFL is a vital step in demonstrating your English proficiency.\n\nAccepted Countries and Cost\nTOEFL is accepted by institutions in the USA, Canada, Australia, and more, making it a preferred choice for students and professionals. The cost of the TOEFL exam is INR 18,000/-, reflecting its importance in achieving your educational and career goals."},"name":"TOEFL","features":[{"label":"Comprehensive Assessment","highlight":"550+"},{"label":"Rapid Results","highlight":"100%"},{"label":"Efficiency and Quality","highlight":"550+"},{"label":"Objective Scoring","highlight":"300+"}],"metadata":[{"label":"Cost","value":"INR 18,000/-"},{"label":"Frequency","value":"Over 60 times a year"},{"label":"Duration","value":"1 Hr 56 Mins"},{"label":"Validity","value":"2 Years"}],"shortLabel":"TOEFL","description":"Target your TOEFL score through skill-based training sessions for reading, listening, writing, and speaking.","fullDescription":"The Test of English as a Foreign Language (TOEFL) is a globally recognized English proficiency test that is essential for students, professionals, and immigrants. It is widely accepted by universities, colleges, and institutions in the USA, Canada, Australia, and other English-speaking countries. TOEFL assesses your ability to use and understand English in academic settings.\n\nExam Format and Structure\nTOEFL consists of four sections: Reading, Listening, Speaking, and Writing. Each section measures a different aspect of your academic English proficiency. The test is available only in a computer-based format, ensuring a standardized and secure testing experience for all candidates.\n\nWho Needs to Take TOEFL?\nTOEFL is required for non-native English speakers seeking admission to English-speaking universities and colleges. It is also often needed for professional certifications and immigration purposes. Whether you are pursuing higher education or professional opportunities, TOEFL is a vital step in demonstrating your English proficiency.\n\nAccepted Countries and Cost\nTOEFL is accepted by institutions in the USA, Canada, Australia, and more, making it a preferred choice for students and professionals. The cost of the TOEFL exam is INR 18,000/-, reflecting its importance in achieving your educational and career goals."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Frequently Asked Questions (/faq)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/faq', 'Frequently Asked Questions', 'PUBLISHED', 'footer', false, 'FAQ | FETC Study Abroad & Exam Prep', 'Find answers to common questions about our services, study abroad programs, and examination preparation below.', '{"faqs":[{"answer":"We provide comprehensive study abroad services including, counselling, university selection, application assistance, visa processing, pre-departure orientation, and post-arrival support.","question":"What services do you offer?"},{"answer":"Our consultancy boasts a high success rate, personalized guidance from experienced advisors, and partnerships with top universities worldwide. We also offer ongoing support throughout your study abroad journey.","question":"Why should I choose your consultancy over others?"},{"answer":"Begin by scheduling a consultation with one of our advisors. We will assess your academic background, financial background, career goals, and preferences to help you select suitable programs and universities.","question":"How do I start the application process?"},{"answer":"Typically, you will need your academic transcripts, financials, a statement of purpose, letters of recommendation, a resume, standardized test scores (if applicable), and proof of language proficiency.","question":"What documents are required for the application?"},{"answer":"Yes, we only write the SOPs. Students just need to provide craft compelling SOPs and essays that reflect your strengths and aspirations.","question":"Do you assist with writing the Statement of Purpose (SOP) and essays?"},{"answer":"Costs vary depending on the country, university, and program. They include tuition fees, accommodation, living expenses, insurance, and travel costs. We can provide detailed estimates during your consultation.","question":"How much does studying abroad cost?"}],"title":"Frequently Asked Questions","subtitle":"Find answers to common questions about our services, study abroad programs, and examination preparation below."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Privacy Policy (/privacy)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/privacy', 'Privacy Policy', 'PUBLISHED', 'footer', false, 'Privacy Policy | FETC', 'Privacy Policy explaining how we collect, use, and protect your personal data at FETC.', '{"sections":[{"body":"This Privacy Policy explains how we collect, use, and protect your personal information when you access our website and services.\nBy using our Service, you agree to the terms described in this Privacy Policy.","title":"1. Introduction"},{"body":"We collect personal information that you provide to us, such as:\n- Name\n- Email address\n- Payment details\nWe also collect usage data such as:\n- IP address\n- Browser type\nThis helps us improve our services and understand user behavior.","title":"2. Information Collection"},{"body":"We use the information we collect to:\n- Provide and improve our services\n- Communicate with you regarding your account or service-related matters\n- Personalize your experience\n- Respond to your inquiries","title":"3. How We Use Your Information"},{"body":"We implement reasonable security measures to protect your personal data from unauthorized access, alteration, or destruction.\nHowever, please note that no method of electronic storage or transmission over the internet is completely secure.","title":"4. Data Security"},{"body":"- We do not sell or rent your personal information to third parties\n- We may share your information with trusted service providers to help us deliver our services","title":"5. Sharing of Data"},{"body":"You have the right to:\n- Access your personal data\n- Update your information\n- Request deletion of your data\nTo exercise these rights, please contact us using the details below.","title":"6. Your Rights"},{"body":"We may update this Privacy Policy from time to time.\n- Any changes will be posted on this page\n- The \"Last Updated\" date will be revised accordingly\nWe recommend reviewing this page periodically.","title":"7. Changes to This Privacy Policy"},{"body":"If you have any questions or concerns about this Privacy Policy, you can contact us at:\n- Email: info@fetc.in","title":"8. Contact Us"}],"lastUpdated":"February 03, 2025"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Refund Policy (/refund)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/refund', 'Refund Policy', 'PUBLISHED', 'footer', false, 'Refund Policy | FETC', 'Refund Policy detailing conditions and process for requesting a refund at FETC.', '{"sections":[{"body":"We strive to provide high-quality online English learning services.\nIf you are not satisfied with your purchase, this Refund Policy explains the conditions and process for requesting a refund.","title":"1. Introduction"},{"body":"- If your refund request meets our eligibility criteria, it will be processed accordingly\n- The refund will be credited to your original payment method\n- Refunds are typically processed within 5 business days","title":"2. Refund Process"},{"body":"If you have any questions about our Refund Policy, please contact us:\n- Email: info@fetc.in","title":"3. Contact Us"}],"lastUpdated":"February 3, 2025"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study Abroad Destinations (/study-abroad)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/study-abroad', 'Study Abroad Destinations', 'PUBLISHED', 'navbar', false, 'Study Abroad Destinations | Overseas Education | FETC', 'We''ve helped thousands of students settle in over 10+ countries. Pick your dream destination and let us handle admissions, visa prep, and landing guidelines.', '{"hero":{"badge":"Explore the World","title":"Choose Your Study Destination","description":"We''ve helped thousands of students settle in over 10+ countries. Pick your dream destination and let us handle the admissions, visa preparation, and landing guidelines."}}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study in Australia (/study-abroad/australia)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/study-abroad/australia', 'Study in Australia', 'PUBLISHED', 'navbar', false, 'Study in Australia | Universities & Visa Guidance | FETC', 'Choose from top-ranked Australian universities known for practical learning, innovation, and student-friendly cities.', '{"flag":"https://flagcdn.com/w80/au.png","name":"Australia","image":"/assets/countries/australia.png","sopLinks":[{"url":"https://drive.google.com/file/d/1O7WaRkNDy0jJVvixXTuWiGorXHSliZZu/view?usp=sharing","label":"Download Australia SOP"}],"description":"Choose from top-ranked Australian universities known for practical learning, innovation, and student-friendly cities.","universities":[{"name":"Bond University","image":"/assets/university-logos/australia/Bond University_Australia.png","ranking":"#1 Student Experience Australia","location":"Gold Coast, Queensland, Australia","exclusive":false},{"name":"Charles Darwin University","image":"/assets/university-logos/australia/Charles Darwin University_Australia.png","ranking":"Top 30 Australia","location":"Darwin, NT, Australia","exclusive":false},{"name":"Deakin University","image":"/assets/university-logos/australia/Deakin University_Australia.png","ranking":"#233 Global QS","location":"Melbourne, Victoria, Australia","exclusive":false},{"name":"Federation University Australia","image":"/assets/university-logos/australia/Federation University Australia_Australia.png","ranking":"#1 Graduate Employability VIC","location":"Ballarat, Victoria, Australia","exclusive":false},{"name":"Flinders University","image":"/assets/university-logos/australia/Flinders University_Australia.png","ranking":"Top 300 Global","location":"Adelaide, South Australia","exclusive":false},{"name":"Griffith University","image":"/assets/university-logos/australia/Griffith University_Australia.png","ranking":"#243 Global QS","location":"Brisbane & Gold Coast, Australia","exclusive":false},{"name":"La Trobe University","image":"/assets/university-logos/australia/La Trobe University_Australia.jpg","ranking":"#242 Global QS","location":"Melbourne, Victoria, Australia","exclusive":false},{"name":"RMIT University","image":"/assets/university-logos/australia/RMIT_Australia.png","ranking":"#140 Global QS","location":"Melbourne, Victoria, Australia","exclusive":false},{"name":"Swinburne University of Technology","image":"/assets/university-logos/australia/Swinburne University of Technology - Sydney_Australia.png","ranking":"#285 Global QS","location":"Melbourne & Sydney, Australia","exclusive":false},{"name":"The University of Newcastle Australia","image":"/assets/university-logos/australia/The University of Newcastle Australia_Australia.png","ranking":"#173 Global QS","location":"Newcastle, NSW, Australia","exclusive":false},{"name":"University of Canberra","image":"/assets/university-logos/australia/University of Canberra_Australia.png","ranking":"Top 50 Young Universities","location":"Canberra, ACT, Australia","exclusive":false},{"name":"University of Melbourne","image":"/assets/university-logos/australia/University of Melbourne_Australia.png","ranking":"#14 Global QS","location":"Melbourne, Victoria, Australia","exclusive":false},{"name":"University of New South Wales (UNSW)","image":"/assets/university-logos/australia/University of New South Wales_Australia.png","ranking":"#19 Global QS","location":"Sydney, NSW, Australia","exclusive":false},{"name":"University of Queensland","image":"/assets/university-logos/australia/University of Queensland_Australia.png","ranking":"#43 Global QS","location":"Brisbane, Queensland, Australia","exclusive":false},{"name":"University of South Australia","image":"/assets/university-logos/australia/University of South Australia_Australia.png","ranking":"#326 Global QS","location":"Adelaide, South Australia","exclusive":false},{"name":"University of Southern Queensland","image":"/assets/university-logos/australia/University of Southern Queensland_Australia.jpg","ranking":"Top Regional Campus","location":"Toowoomba, Queensland, Australia","exclusive":false},{"name":"University of Technology Sydney (UTS)","image":"/assets/university-logos/australia/Swinburne University of Technology - Sydney_Australia.png","ranking":"#90 Global QS","location":"Sydney, NSW, Australia","exclusive":false},{"name":"University of Wollongong","image":"/assets/university-logos/australia/University of Wollongong_Australia.png","ranking":"#162 Global QS","location":"Wollongong, NSW, Australia","exclusive":false},{"name":"Victoria University","image":"/assets/university-logos/australia/Victoria University_Australia.png","ranking":"Top 3% Worldwide","location":"Melbourne, Victoria, Australia","exclusive":false},{"name":"Western Sydney University","image":"/assets/university-logos/australia/Western Sydney University_Australia.png","ranking":"#1 Impact Ranking World","location":"Sydney, NSW, Australia","exclusive":false}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study in Canada (/study-abroad/canada)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/study-abroad/canada', 'Study in Canada', 'PUBLISHED', 'navbar', false, 'Study in Canada | Universities & Visa Guidance | FETC', 'Explore world-class academic institutions, diverse culture, and vast post-study opportunities in Canada.', '{"flag":"https://flagcdn.com/w80/ca.png","name":"Canada","image":"/assets/Study abroad/Canada.png","sopLinks":[],"description":"Explore world-class academic institutions, diverse culture, and vast post-study opportunities in Canada.","universities":[{"name":"Algoma University","image":"/assets/university-logos/canada/Algoma University_Canada.png","ranking":"Top Ontario Campus","location":"Sault Ste. Marie, Ontario, Canada","exclusive":false},{"name":"College Avalon","image":"/assets/university-logos/canada/College Avalon_Canada.png","ranking":"Top Vocational College","location":"Montreal, Quebec, Canada","exclusive":false},{"name":"Cypress College Canada","image":"/assets/university-logos/canada/Cypress College_Canada.png","ranking":"Top College","location":"Vancouver, BC, Canada","exclusive":false},{"name":"International Business University (IBU)","image":"/assets/university-logos/canada/International Business University_Canada.png","ranking":"Top Business University","location":"Toronto, Ontario, Canada","exclusive":false},{"name":"Laurentian University","image":"/assets/university-logos/canada/Laurentian University_Canada.png","ranking":"Top Bilingual University","location":"Sudbury, Ontario, Canada","exclusive":false},{"name":"PLC College","image":"","ranking":"Top Career College","location":"Vancouver, BC, Canada","exclusive":false},{"name":"Red Deer Polytechnic","image":"/assets/university-logos/canada/Red Deer Polytechnic_Canada.png","ranking":"Top Polytechnic","location":"Red Deer, Alberta, Canada","exclusive":false},{"name":"Western Community College","image":"/assets/university-logos/canada/Western Community College_Canada.png","ranking":"Top Career Campus","location":"Surrey, BC, Canada","exclusive":false},{"name":"York College of Applied Science","image":"/assets/university-logos/canada/York College of Applied Science_Canada.png","ranking":"Top Applied Science","location":"Toronto, Ontario, Canada","exclusive":false},{"name":"Yorkville University","image":"/assets/university-logos/canada/Yorkville University_Canada.png","ranking":"Top Flexible Degree","location":"Toronto & Vancouver, Canada","exclusive":false}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study in Dubai (/study-abroad/dubai)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/study-abroad/dubai', 'Study in Dubai', 'PUBLISHED', 'navbar', false, 'Study in Dubai | Universities & Visa Guidance | FETC', 'Pursue modern education programs in Dubai with strong global links and a fast-growing professional ecosystem.', '{"flag":"https://flagcdn.com/w80/ae.png","name":"Dubai","image":"/assets/countries/dubai.png","sopLinks":[],"description":"Pursue modern education programs in Dubai with strong global links and a fast-growing professional ecosystem.","universities":[{"name":"De Montfort University (DMU) Dubai","image":"/assets/university-logos/dubai/De Montfort University (DMU) - Dubai.jpg","ranking":"Top UK Branch Campus","location":"Dubai International Academic City, UAE","exclusive":false},{"name":"GBS Dubai","image":"/assets/university-logos/dubai/De Montfort University (DMU) - Dubai.jpg","ranking":"Top Applied Higher Education","location":"Dubai Knowledge Park, UAE","exclusive":false},{"name":"Middlesex University Dubai","image":"/assets/university-logos/dubai/Middlesex University_Dubai.png","ranking":"Top British University in Dubai","location":"Dubai Knowledge Park, UAE","exclusive":false},{"name":"Rochester Institute of Technology (RIT) Dubai","image":"/assets/university-logos/dubai/De Montfort University (DMU) - Dubai.jpg","ranking":"Top American Tech Campus","location":"Dubai Silicon Oasis, UAE","exclusive":false}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study in Europe (/study-abroad/europe)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/study-abroad/europe', 'Study in Europe', 'PUBLISHED', 'navbar', false, 'Study in Europe | Universities & Visa Guidance | FETC', 'Explore affordable and high-quality education options across Europe with multicultural learning environments and career pathways. Now offering MBBS programs in Italy, Hungary, and Slovakia.', '{"flag":"https://flagcdn.com/w80/eu.png","name":"Europe","image":"/assets/countries/europe.png","sopLinks":[],"description":"Explore affordable and high-quality education options across Europe with multicultural learning environments and career pathways. Now offering MBBS programs in Italy, Hungary, and Slovakia.","universities":[{"name":"Aix Marseille Universite","image":"/assets/university-logos/europe/Aix Marseille Universite, France.jpg","ranking":"Top French University","location":"Marseille, France","exclusive":false},{"name":"Berlin School of Business and Innovation","image":"/assets/university-logos/europe/Berlin School of Business and Innovation_Germany.png","ranking":"Top German Business School","location":"Berlin, Germany","exclusive":false},{"name":"Burgundy School of Business","image":"/assets/university-logos/europe/Burgundy School of Business_France.jpg","ranking":"Triple Crown Accredited","location":"Dijon, France","exclusive":false},{"name":"College De Paris","image":"/assets/university-logos/europe/College De Paris, France.png","ranking":"Top International Network","location":"Paris, France","exclusive":false},{"name":"De Vinci University","image":"/assets/university-logos/europe/De Vinci University_France.jpg","ranking":"Top Tech & Management","location":"Paris, France","exclusive":false},{"name":"EADA Business School","image":"/assets/university-logos/europe/EADA Business School_Spain.png","ranking":"#16 European Business School","location":"Barcelona, Spain","exclusive":false},{"name":"EU Business School","image":"/assets/university-logos/europe/EU Business School_Spain.png","ranking":"Top 50 MBA Europe","location":"Barcelona, Geneva, Munich","exclusive":false},{"name":"GISMA University of Applied Sciences","image":"/assets/university-logos/europe/GISMA University of Applied Sciences_Germany.png","ranking":"Top Applied German University","location":"Potsdam & Berlin, Germany","exclusive":false},{"name":"ICN Business School","image":"/assets/university-logos/europe/ICN Business School_France.png","ranking":"Triple Crown Accredited","location":"Paris & Nancy, France","exclusive":false},{"name":"ILA Italy","image":"/assets/university-logos/europe/ILA_Italy.jpg","ranking":"Top Italian Language & Fashion","location":"Milan, Italy","exclusive":true},{"name":"Schiller International University","image":"/assets/university-logos/europe/Schiller International University, France.png","ranking":"American-European Degrees","location":"Paris, Heidelberg, Madrid","exclusive":false},{"name":"University of Europe for Applied Sciences","image":"/assets/university-logos/europe/University of Europe for Applied Sciences_Germany.png","ranking":"Top German Private","location":"Berlin & Hamburg, Germany","exclusive":false},{"name":"University of Lyon","image":"/uploads/fetc-1788771664791-90832944.png","ranking":"Top French Research","location":"Lyon, France","exclusive":false}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study in Ireland (/study-abroad/ireland)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/study-abroad/ireland', 'Study in Ireland', 'PUBLISHED', 'navbar', false, 'Study in Ireland | Universities & Visa Guidance | FETC', 'Study in Ireland for strong industry connections, international exposure, and a vibrant academic atmosphere.', '{"flag":"https://flagcdn.com/w80/ie.png","name":"Ireland","image":"/assets/countries/ireland.png","sopLinks":[{"url":"https://drive.google.com/file/d/15uyRlYmQJiU6fv4YFnSaja3yplxaic2j/view?usp=sharing","label":"Download Ireland SOP"}],"description":"Study in Ireland for strong industry connections, international exposure, and a vibrant academic atmosphere.","universities":[{"name":"Griffith College Ireland","image":"/assets/university-logos/ireland/Griffith Logo Ireland.jpg","ranking":"#1 Private College Ireland","location":"Dublin, Cork, Limerick, Ireland","exclusive":true},{"name":"Trinity College Dublin","image":"/assets/university-logos/ireland/Trinity College Dublin_Ireland.png","ranking":"#81 Global QS","location":"Dublin, Ireland","exclusive":false},{"name":"University College Dublin (UCD)","image":"/assets/university-logos/ireland/IBAT College Dublin_Ireland.png","ranking":"#126 Global QS","location":"Dublin, Ireland","exclusive":false},{"name":"National College of Ireland (NCI)","image":"/assets/university-logos/ireland/Griffith Logo Ireland.jpg","ranking":"Top FinTech & Tech Centre","location":"Dublin, Ireland","exclusive":false},{"name":"TU Dublin","image":"/assets/university-logos/ireland/TU Dublin_Ireland.png","ranking":"Top Technological University","location":"Dublin, Ireland","exclusive":false},{"name":"Maynooth University","image":"/assets/university-logos/ireland/Maynooth university_Ireland.png","ranking":"Top Irish Research","location":"Maynooth, Ireland","exclusive":false},{"name":"University of Ireland Galway","image":"/assets/university-logos/ireland/University of Ireland Galway_Ireland.png","ranking":"#289 Global QS","location":"Galway, Ireland","exclusive":false},{"name":"IBAT College Dublin","image":"/assets/university-logos/ireland/IBAT College Dublin_Ireland.png","ranking":"Top Practical Business","location":"Dublin, Ireland","exclusive":false}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study in New Zealand (/study-abroad/new-zealand)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/study-abroad/new-zealand', 'Study in New Zealand', 'PUBLISHED', 'navbar', false, 'Study in New Zealand | Universities & Visa Guidance | FETC', 'Build your future in New Zealand with globally valued qualifications and a safe, welcoming student lifestyle.', '{"flag":"https://flagcdn.com/w80/nz.png","name":"New Zealand","image":"/assets/countries/new-zealand.png","sopLinks":[],"description":"Build your future in New Zealand with globally valued qualifications and a safe, welcoming student lifestyle.","universities":[{"name":"University of Auckland","image":"","ranking":"#68 Global QS","location":"Auckland, New Zealand","exclusive":false},{"name":"University of Otago","image":"","ranking":"#206 Global QS","location":"Dunedin, New Zealand","exclusive":false},{"name":"Victoria University of Wellington","image":"","ranking":"#241 Global QS","location":"Wellington, New Zealand","exclusive":false}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study in Singapore (/study-abroad/singapore)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/study-abroad/singapore', 'Study in Singapore', 'PUBLISHED', 'navbar', false, 'Study in Singapore | Universities & Visa Guidance | FETC', 'Experience modern education in Singapore with unparalleled technological and business advancements.', '{"flag":"https://flagcdn.com/w80/sg.png","name":"Singapore","image":"/assets/countries/Singapore.png","sopLinks":[],"description":"Experience modern education in Singapore with unparalleled technological and business advancements.","universities":[{"name":"London School of Business and Finance (LSBF) Singapore","image":"/assets/university-logos/singapore/LSBF Singapore.png","ranking":"Top Premier Asia Campus","location":"Tanjong Pagar, Singapore","exclusive":true},{"name":"Nanyang Technological University (NTU)","image":"","ranking":"#15 Global QS","location":"Jurong West, Singapore","exclusive":false},{"name":"National University of Singapore (NUS)","image":"/assets/university-logos/singapore/LSBF Singapore.png","ranking":"#8 Global QS","location":"Kent Ridge, Singapore","exclusive":false}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study in United Kingdom (/study-abroad/united-kingdom)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/study-abroad/united-kingdom', 'Study in United Kingdom', 'PUBLISHED', 'navbar', false, 'Study in United Kingdom | Universities & Visa Guidance | FETC', 'Study in globally recognized UK institutions with excellent academic support, scholarships, and post-study work opportunities.', '{"flag":"https://flagcdn.com/w80/gb.png","name":"United Kingdom","image":"/assets/countries/uk.png","sopLinks":[{"url":"https://drive.google.com/file/d/1B8woekjA86ypLvtVr9OMYXRWCktk-4F1/view?usp=sharing","label":"Download UK SOP"},{"url":"https://drive.google.com/file/d/1UPXSyf1pQCDwig2wLHoc-3chCZpb929g/view?usp=sharing","label":"Download Birmingham SOP"}],"description":"Study in globally recognized UK institutions with excellent academic support, scholarships, and post-study work opportunities.","universities":[{"name":"University of the West of Scotland (UWS)","image":"/assets/university-logos/united-kingdom/University of West London_UK.png","ranking":"#1 Exclusive UK Partner","location":"Scotland, UK","exclusive":true},{"name":"Bangor University","image":"/assets/university-logos/united-kingdom/Bangor University_UK.png","ranking":"Top 40 UK","location":"Bangor, Wales, UK","exclusive":false},{"name":"Buckinghamshire New University","image":"","ranking":"Top Ranked","location":"High Wycombe, UK","exclusive":false},{"name":"Canterbury Christ Church University","image":"/assets/university-logos/united-kingdom/Canterbury Christ Church University_UK.png","ranking":"Top Ranked","location":"Canterbury, UK","exclusive":false},{"name":"De Montfort University","image":"/assets/university-logos/united-kingdom/De Montfort university_UK.png","ranking":"Top 50 UK","location":"Leicester, UK","exclusive":false},{"name":"European School of Economics","image":"/assets/university-logos/united-kingdom/European School of Economics_UK.png","ranking":"Top Business School","location":"London, UK","exclusive":false},{"name":"Leeds Beckett University","image":"/assets/university-logos/united-kingdom/Leeds Beckett University_UK.png","ranking":"Top Ranked","location":"Leeds, UK","exclusive":false},{"name":"London Metropolitan University","image":"/assets/university-logos/united-kingdom/London Metropolitan University_UK.png","ranking":"Top London University","location":"London, UK","exclusive":false},{"name":"London South Bank University (LSBU)","image":"/assets/university-logos/united-kingdom/London Metropolitan University_UK.png","ranking":"Top Ranked","location":"London, UK","exclusive":false},{"name":"Middlesex University London","image":"/assets/university-logos/united-kingdom/Middlesex University London_UK.png","ranking":"Top 100 UK","location":"London, UK","exclusive":false},{"name":"Northumbria University","image":"/assets/university-logos/united-kingdom/Northumbria University_UK.png","ranking":"Top 30 UK","location":"Newcastle, UK","exclusive":false},{"name":"Ravensbourne University","image":"/assets/university-logos/united-kingdom/Ravensbourne University_UK.png","ranking":"Top Design Institute","location":"London, UK","exclusive":false},{"name":"Teesside University","image":"/assets/university-logos/united-kingdom/Teesside University_UK.png","ranking":"Top Ranked","location":"Middlesbrough, UK","exclusive":false},{"name":"Ulster University","image":"/assets/university-logos/united-kingdom/Ulster University_UK.png","ranking":"Top Ranked","location":"Belfast, UK","exclusive":false},{"name":"University College Birmingham","image":"/assets/university-logos/united-kingdom/University College Birmingham_UK.jpg","ranking":"Top Culinary & Business","location":"Birmingham, UK","exclusive":false},{"name":"University of Brighton","image":"/assets/university-logos/united-kingdom/University of Brighton_UK.png","ranking":"Top Ranked","location":"Brighton, UK","exclusive":false},{"name":"University of Chester","image":"/assets/university-logos/united-kingdom/University of Chester_UK.png","ranking":"Top Ranked","location":"Chester, UK","exclusive":false},{"name":"University of Cumbria","image":"/assets/university-logos/united-kingdom/University of Cumbria_UK.png","ranking":"Top Ranked","location":"Carlisle, UK","exclusive":false},{"name":"University of East London","image":"/assets/university-logos/united-kingdom/University of East London -uk.png","ranking":"Top Ranked","location":"London, UK","exclusive":false},{"name":"University of Greenwich","image":"/assets/university-logos/united-kingdom/University of Greenwich_UK.png","ranking":"Top Ranked","location":"London, UK","exclusive":false},{"name":"University of Portsmouth","image":"/assets/university-logos/united-kingdom/University of Portsmouth_UK.png","ranking":"Top 30 UK","location":"Portsmouth, UK","exclusive":false},{"name":"University of Wales Trinity Saint David","image":"/assets/university-logos/united-kingdom/University of Wales Trinity Saint David (UWTSD)_UK.png","ranking":"Top Ranked","location":"Wales, UK","exclusive":false},{"name":"University of West London","image":"/assets/university-logos/united-kingdom/University of West London_UK.png","ranking":"Top 40 UK","location":"London, UK","exclusive":false}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study in USA (/study-abroad/usa)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/study-abroad/usa', 'Study in USA', 'PUBLISHED', 'navbar', false, 'Study in USA | Universities & Visa Guidance | FETC', 'Access world-class universities, cutting-edge research opportunities, and diverse campus experiences in the United States.', '{"flag":"https://flagcdn.com/w80/us.png","name":"USA","image":"/assets/countries/usa.png","sopLinks":[{"url":"https://drive.google.com/file/d/1KVCqKaaMkmR3f6AntE6ozke8Q6KMgi8p/view?usp=sharing","label":"Download USA SOP"}],"description":"Access world-class universities, cutting-edge research opportunities, and diverse campus experiences in the United States.","universities":[{"name":"LIM College","image":"/assets/university-logos/usa/LIM College_USA.png","ranking":"Top Fashion Business","location":"New York, USA","exclusive":true},{"name":"Texas A&M University San Antonio","image":"/assets/university-logos/usa/Texas A&M University-Corpus Christi_USA.jpg","ranking":"Top Public System","location":"San Antonio, Texas, USA","exclusive":true},{"name":"Avila University","image":"/assets/university-logos/usa/Avila University_USA.png","ranking":"Top Private University","location":"Kansas City, Missouri, USA","exclusive":true},{"name":"Adelphi University","image":"/assets/university-logos/usa/Adelphi University_USA.png","ranking":"#182 National Universities","location":"Garden City, New York, USA","exclusive":false},{"name":"American University","image":"/assets/university-logos/usa/American University_USA.png","ranking":"#105 National Universities","location":"Washington, D.C., USA","exclusive":false},{"name":"Auburn University","image":"/assets/university-logos/usa/Auburn University at Montgomery_USA.png","ranking":"#97 National Universities","location":"Auburn, Alabama, USA","exclusive":false},{"name":"Auburn University at Montgomery","image":"/assets/university-logos/usa/Auburn University at Montgomery_USA.png","ranking":"Top Regional","location":"Montgomery, Alabama, USA","exclusive":false},{"name":"California State University Monterey Bay","image":"/assets/university-logos/usa/California State University Monterey Bay_USA.png","ranking":"#26 Regional Universities West","location":"Marina, California, USA","exclusive":false},{"name":"Concordia University St Paul","image":"/assets/university-logos/usa/Concordia University - St Paul_USA.png","ranking":"Top Mid-West","location":"St. Paul, Minnesota, USA","exclusive":false},{"name":"DePaul University","image":"/assets/university-logos/usa/DePaul University_USA.png","ranking":"#151 National Universities","location":"Chicago, Illinois, USA","exclusive":false},{"name":"Florida International University","image":"/assets/university-logos/usa/Florida International University_USA.png","ranking":"#124 National Universities","location":"Miami, Florida, USA","exclusive":false},{"name":"Foothill Deanza College","image":"/assets/university-logos/usa/Foothill Deanza_USA.png","ranking":"#1 Community College USA","location":"Silicon Valley, California, USA","exclusive":false},{"name":"Full Sail University","image":"/assets/university-logos/usa/Full Sail University_USA.png","ranking":"Top Entertainment Media","location":"Winter Park, Florida, USA","exclusive":false},{"name":"Hawaii Pacific University","image":"/assets/university-logos/usa/Hawai Pacific University_USA.png","ranking":"Top Pacific Campus","location":"Honolulu, Hawaii, USA","exclusive":false},{"name":"Long Island University Brooklyn","image":"/assets/university-logos/usa/Long Island University Brooklyn_USA.png","ranking":"Top NYC Campus","location":"Brooklyn, New York, USA","exclusive":false},{"name":"Louisiana State University","image":"/assets/university-logos/usa/Louisiana State University_USA.png","ranking":"#176 National Universities","location":"Baton Rouge, Louisiana, USA","exclusive":false},{"name":"Rowan University","image":"/assets/university-logos/usa/Rowan University_USA.png","ranking":"#88 National Public","location":"Glassboro, New Jersey, USA","exclusive":false},{"name":"Texas A&M University Corpus Christi","image":"/assets/university-logos/usa/Texas A&M University-Corpus Christi_USA.jpg","ranking":"Top Coastal Campus","location":"Corpus Christi, Texas, USA","exclusive":false},{"name":"Tiffin University","image":"/assets/university-logos/usa/Tiffin University_USA.png","ranking":"Top Midwest Private","location":"Tiffin, Ohio, USA","exclusive":false},{"name":"University of Alabama at Birmingham (UAB)","image":"/assets/university-logos/usa/University of Alabama at Birmingham - UAB_USA.png","ranking":"#142 National Universities","location":"Birmingham, Alabama, USA","exclusive":false},{"name":"University of Central Florida","image":"/assets/university-logos/usa/University of Central Florida_USA.png","ranking":"#124 National Universities","location":"Orlando, Florida, USA","exclusive":false},{"name":"University of Dayton","image":"/assets/university-logos/usa/University of Dayton_USA.png","ranking":"#127 National Universities","location":"Dayton, Ohio, USA","exclusive":false},{"name":"University of Hartford","image":"/assets/university-logos/usa/University of Hartford_USA.png","ranking":"Top New England","location":"West Hartford, Connecticut, USA","exclusive":false},{"name":"University of Kansas","image":"/assets/university-logos/usa/University of Kansas_USA.png","ranking":"#121 National Universities","location":"Lawrence, Kansas, USA","exclusive":false},{"name":"University of Massachusetts Boston","image":"/assets/university-logos/usa/University of Massachusetts Boston_USA.png","ranking":"#216 National Universities","location":"Boston, Massachusetts, USA","exclusive":false},{"name":"University of Mississippi","image":"/assets/university-logos/usa/University of Mississippi_USA.png","ranking":"#163 National Universities","location":"Oxford, Mississippi, USA","exclusive":false},{"name":"University of South Carolina","image":"/assets/university-logos/usa/University of South Carolina_USA.png","ranking":"#115 National Universities","location":"Columbia, South Carolina, USA","exclusive":false},{"name":"University of the Pacific","image":"/assets/university-logos/usa/University of the Pacific_USA.png","ranking":"#142 National Universities","location":"Stockton, California, USA","exclusive":false},{"name":"University of Utah","image":"/assets/university-logos/usa/University of Utah_USA.png","ranking":"#105 National Universities","location":"Salt Lake City, Utah, USA","exclusive":false}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Terms and Conditions (/terms)]
INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
VALUES ('/terms', 'Terms and Conditions', 'PUBLISHED', 'footer', false, 'Terms and Conditions | FETC', 'Terms and Conditions governing your use of FETC website and services.', '{"sections":[{"body":"Country: Gujarat, India\nCompany: GINA ABROAD PRIVATE LIMITED, 238–239, Second Floor, Roongta Signature, Opp. Shyam Mandir, VIP Road, Vesu, Surat, India\nDevice: Any device that can access the Service such as a computer, mobile phone, or tablet\nService: Refers to the Website\nTerms: These Terms form the agreement between You and the Company\nSocial Media: Any third-party services or content available through the Service\nWebsite: GINA ABROAD PRIVATE LIMITED – http://www.fetc.in\nYou: The individual or legal entity using the Service","title":"1. Introduction"},{"body":"These Terms and Conditions govern your use of the Service and form a binding agreement between You and the Company.\n- Your use of the Service is conditional upon acceptance of these Terms\n- By accessing or using the Service, you agree to be bound by these Terms\n- If you do not agree, you must not use the Service\n- You must be at least 18 years old to use this Service\n- Please review our Privacy Policy before using the Service","title":"2. Acknowledgment"},{"body":"- Our Service may contain links to third-party websites\n- These websites are not operated or controlled by us\n- We are not responsible for their content, policies, or practices\n- We recommend reviewing their terms and privacy policies before use","title":"3. Links to Other Websites"},{"body":"- We reserve the right to suspend or terminate your access immediately if you violate these Terms\n- Upon termination, your right to use the Service will cease","title":"4. Termination"},{"body":"- Our total liability is limited to the amount you paid through the Service\n- We are not responsible for any indirect, incidental, or consequential damages, even if advised of the possibility","title":"5. Limitation of Liability"},{"body":"- Severability: If any provision is found invalid, it will be adjusted to achieve its intent while the remaining provisions remain in effect\n- Waiver: Failure to enforce any right does not waive the ability to enforce it later","title":"6. Severability and Waiver"},{"body":"- If these Terms are translated into other languages, the English version will prevail in case of any dispute","title":"7. Translation Interpretation"},{"body":"- We reserve the right to update or modify these Terms at any time\n- Significant changes will be notified at least 30 days in advance\n- Continued use of the Service indicates acceptance of the updated Terms","title":"8. Changes to These Terms and Conditions"},{"body":"If you have any questions regarding these Terms and Conditions, you can contact us via:\n- Website: https://fetc.in/contact-us","title":"9. Contact Us"}],"lastUpdated":"February 03, 2025"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  show_in_nav = EXCLUDED.show_in_nav,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- 5. COURSES CATALOG (6 TRAINING MASTERCLASSES)
-- -------------------------------------------------------------------------
INSERT INTO courses (
  course_id, slug, title, description, category, price, duration, level, status,
  students_count, learning_outcomes, instructor_name, instructor_bio, language, subtitles, certificate_enabled
)
VALUES (
  'IELTS_MASTERCLASS', 'ielts-academic-masterclass', 'IELTS Academic Masterclass', 'Comprehensive 8-week IELTS training with live mock feedback, speaking interviews, and essay evaluations.', 'Language Exam',
  14999, '8 Weeks', 'All Levels', 'ACTIVE', 48,
  'Master band 8+ strategies for Reading, Listening, Speaking and Writing.', 'Senior IELTS Faculty', 'Certified British Council and IDP trained instructor with 12+ years experience.',
  'English', 'English', true
)
ON CONFLICT (course_id) DO UPDATE SET
  slug = EXCLUDED.slug, title = EXCLUDED.title, description = EXCLUDED.description,
  category = EXCLUDED.category, price = EXCLUDED.price, duration = EXCLUDED.duration,
  level = EXCLUDED.level, status = EXCLUDED.status, students_count = EXCLUDED.students_count;

INSERT INTO courses (
  course_id, slug, title, description, category, price, duration, level, status,
  students_count, learning_outcomes, instructor_name, instructor_bio, language, subtitles, certificate_enabled
)
VALUES (
  'TOEFL_IBT_PREP', 'toefl-ibt-intensive-training', 'TOEFL iBT Intensive Training', 'Complete speaking, writing, and listening practice with ETS certified curriculum and exam simulators.', 'Language Exam',
  12999, '6 Weeks', 'Intermediate', 'ACTIVE', 32,
  'Achieve 100+ score on TOEFL iBT with computer adaptive test simulation.', 'TOEFL Master Trainer', '10+ years helping students secure Ivy League and top US university admissions.',
  'English', 'English', true
)
ON CONFLICT (course_id) DO UPDATE SET
  slug = EXCLUDED.slug, title = EXCLUDED.title, description = EXCLUDED.description,
  category = EXCLUDED.category, price = EXCLUDED.price, duration = EXCLUDED.duration,
  level = EXCLUDED.level, status = EXCLUDED.status, students_count = EXCLUDED.students_count;

INSERT INTO courses (
  course_id, slug, title, description, category, price, duration, level, status,
  students_count, learning_outcomes, instructor_name, instructor_bio, language, subtitles, certificate_enabled
)
VALUES (
  'PTE_ACADEMIC', 'pte-academic-fasttrack', 'PTE Academic FastTrack', 'AI-assisted scoring practice and strategies for high bands in Pearson Test of English.', 'Language Exam',
  9999, '4 Weeks', 'Intermediate', 'ACTIVE', 27,
  'Crack 79+ in all modules with AI speech recognition and scoring drills.', 'PTE Lead Mentor', 'Expert in Pearson computerized test algorithms and scoring metrics.',
  'English', 'English', true
)
ON CONFLICT (course_id) DO UPDATE SET
  slug = EXCLUDED.slug, title = EXCLUDED.title, description = EXCLUDED.description,
  category = EXCLUDED.category, price = EXCLUDED.price, duration = EXCLUDED.duration,
  level = EXCLUDED.level, status = EXCLUDED.status, students_count = EXCLUDED.students_count;

INSERT INTO courses (
  course_id, slug, title, description, category, price, duration, level, status,
  students_count, learning_outcomes, instructor_name, instructor_bio, language, subtitles, certificate_enabled
)
VALUES (
  'GRE_QUANT_VERBAL', 'gre-quant-verbal-success', 'GRE Quant & Verbal Success', 'High-score strategy drills, practice tests, and math refresher for graduate school admissions worldwide.', 'Graduate Exam',
  18999, '10 Weeks', 'Advanced', 'ACTIVE', 54,
  'Score 320+ with comprehensive Quantitative and Verbal reasoning techniques.', 'GRE Senior Specialist', 'Alumnus mentor specialized in analytical problem solving.',
  'English', 'English', true
)
ON CONFLICT (course_id) DO UPDATE SET
  slug = EXCLUDED.slug, title = EXCLUDED.title, description = EXCLUDED.description,
  category = EXCLUDED.category, price = EXCLUDED.price, duration = EXCLUDED.duration,
  level = EXCLUDED.level, status = EXCLUDED.status, students_count = EXCLUDED.students_count;

INSERT INTO courses (
  course_id, slug, title, description, category, price, duration, level, status,
  students_count, learning_outcomes, instructor_name, instructor_bio, language, subtitles, certificate_enabled
)
VALUES (
  'GMAT_FOCUS_EDITION', 'gmat-focus-edition-training', 'GMAT Focus Edition Training', 'Data insights, problem-solving, and verbal reasoning mastery tailored for elite business schools.', 'Graduate Exam',
  21999, '12 Weeks', 'Advanced', 'ACTIVE', 19,
  'Target 685+ on the GMAT Focus Edition for top global MBA programs.', 'GMAT MBA Coach', 'Former business school admissions advisor with 15+ years experience.',
  'English', 'English', true
)
ON CONFLICT (course_id) DO UPDATE SET
  slug = EXCLUDED.slug, title = EXCLUDED.title, description = EXCLUDED.description,
  category = EXCLUDED.category, price = EXCLUDED.price, duration = EXCLUDED.duration,
  level = EXCLUDED.level, status = EXCLUDED.status, students_count = EXCLUDED.students_count;

INSERT INTO courses (
  course_id, slug, title, description, category, price, duration, level, status,
  students_count, learning_outcomes, instructor_name, instructor_bio, language, subtitles, certificate_enabled
)
VALUES (
  'SAT_DIGITAL_PREP', 'sat-digital-preparation-course', 'SAT Digital Preparation Course', 'Module-based adaptive prep for high school students targeting undergraduate admissions in USA & Canada.', 'Undergrad Exam',
  11999, '6 Weeks', 'Beginner', 'ACTIVE', 41,
  'Reach 1450+ SAT scores with digital adaptive practice modules.', 'SAT Prep Mentor', 'Specialist in Scholastic Assessment Test prep for undergraduate study abroad.',
  'English', 'English', true
)
ON CONFLICT (course_id) DO UPDATE SET
  slug = EXCLUDED.slug, title = EXCLUDED.title, description = EXCLUDED.description,
  category = EXCLUDED.category, price = EXCLUDED.price, duration = EXCLUDED.duration,
  level = EXCLUDED.level, status = EXCLUDED.status, students_count = EXCLUDED.students_count;

-- -------------------------------------------------------------------------
-- 6. MOCK EXAM SIMULATORS
-- -------------------------------------------------------------------------
INSERT INTO mock_tests (title, status, content, image_url, price)
VALUES ('SELT (Secure English Language Test)', 'Published', 'Official mock exam for UKVI, study, work, and immigration requirements.', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60', NULL);
INSERT INTO mock_tests (title, status, content, image_url, price)
VALUES ('IELTS Academic & General Training', 'Published', 'Complete practice tests for Listening, Reading, Writing, and Speaking modules.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60', NULL);
INSERT INTO mock_tests (title, status, content, image_url, price)
VALUES ('TOEFL iBT Practice', 'Published', 'Full-length internet-based tests modeled directly on the ETS syllabus.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60', NULL);
INSERT INTO mock_tests (title, status, content, image_url, price)
VALUES ('PTE Academic Exam Prep', 'Published', 'AI-scored simulated exams aligned with official Pearson guidelines.', 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?w=800&auto=format&fit=crop&q=60', NULL);
INSERT INTO mock_tests (title, status, content, image_url, price)
VALUES ('SAT Prep Simulators', 'Published', 'Adaptive testing pattern mirroring the digital Scholastic Assessment Test.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60', NULL);
INSERT INTO mock_tests (title, status, content, image_url, price)
VALUES ('GMAT Focus Edition Mock', 'Published', 'Quantitative Reasoning, Verbal Reasoning, and Data Insights simulators.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60', NULL);
INSERT INTO mock_tests (title, status, content, image_url, price)
VALUES ('GRE General Test Simulator', 'Published', 'Analytical Writing, Verbal Reasoning, and Quantitative Reasoning sections.', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60', NULL);
INSERT INTO mock_tests (title, status, content, image_url, price)
VALUES ('Pearson Versant Test Simulator', 'Published', 'Simulated speaking and writing assessment with auto-scoring metrics.', 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop&q=60', NULL);

-- -------------------------------------------------------------------------
-- 7. NEWS ARTICLES & PRESS COVERAGE
-- -------------------------------------------------------------------------
INSERT INTO news_articles (title, summary, source, date, image_url, category, is_active)
VALUES ('CBSE Mock Test Initiative for 700+ Students', 'FETC organized an English mock test for 700+ Class 11 CBSE students at Radiant International School, Piplod — boosting confidence and subject clarity through real exam practice.', 'Regional Media', '2025-02-15', '/assets/news/news1.png', 'General', true);
INSERT INTO news_articles (title, summary, source, date, image_url, category, is_active)
VALUES ('Foreign Innovation Test at Radiant School', 'Covered extensively in regional media, FETC''s mock test program at Radiant School showcases 13 years of excellence in preparing students for academic and career success.', 'Regional Media', '2025-01-20', '/assets/news/news2.png', 'General', true);

-- -------------------------------------------------------------------------
-- 8. STUDENT REVIEWS & VISA SUCCESS STORIES
-- -------------------------------------------------------------------------
INSERT INTO student_reviews (name, university, score, quote, image_url, visa_image, country, program, rating, is_active)
VALUES ('Udit Gangnani', 'University of Pisa', 'Fully Funded Scholarship', 'With dreams of advancing his education, Udit entrusted FETC with his journey. Through dedicated support and guidance, he secured a fully funded scholarship to study Data Science at the prestigious University of Pisa.', '/assets/reviews/Udit Gangnami.png', NULL, 'Italy', 'Data Science', 5, true);
INSERT INTO student_reviews (name, university, score, quote, image_url, visa_image, country, program, rating, is_active)
VALUES ('Mansi Savani', 'US University', 'F1 Visa Approved', 'Exceptional guidance for my USA F1 Visa application. FETC made the documentation and interview prep completely smooth and stress-free.', '/assets/reviews/Mansi Savani USA F1 Visa.png', NULL, 'USA', 'Graduate Studies', 5, true);
INSERT INTO student_reviews (name, university, score, quote, image_url, visa_image, country, program, rating, is_active)
VALUES ('Naitik Patel', 'Ireland Institute', 'Student Visa Approved', 'Securing my Ireland student visa seemed daunting until I met the mentors at FETC. Their personalized approach made all the difference.', '/assets/reviews/Naitik Patel Ireland Student Visa.png', NULL, 'Ireland', 'Undergraduate', 5, true);
INSERT INTO student_reviews (name, university, score, quote, image_url, visa_image, country, program, rating, is_active)
VALUES ('Prajal Sonariya', 'US University', 'F1 Visa Approved', 'From exam coaching to visa stamping, the team was always accessible and encouraging.', '/assets/reviews/Prajal Sonariya USA F1 Visa.png', NULL, 'USA', 'Masters Program', 5, true);
INSERT INTO student_reviews (name, university, score, quote, image_url, visa_image, country, program, rating, is_active)
VALUES ('Prathana Dankhara', 'US University', 'F1 Visa Approved', 'Thanks to FETC, my dream of studying in the United States became a reality!', '/assets/reviews/Prathana Dankhara USA F1 visa.png', NULL, 'USA', 'Undergraduate', 5, true);
INSERT INTO student_reviews (name, university, score, quote, image_url, visa_image, country, program, rating, is_active)
VALUES ('Rutvik Tejani', 'US University', 'F1 Visa Approved', 'High quality mock tests and mock interview sessions that boosted my confidence for the consulate interview.', '/assets/reviews/Rutvik Tejani USA F1 Visa.png', NULL, 'USA', 'STEM Degree', 5, true);
INSERT INTO student_reviews (name, university, score, quote, image_url, visa_image, country, program, rating, is_active)
VALUES ('Samarth Pachchigar', 'Spain University', 'Student Visa Approved', 'Smooth visa processing for Spain. Highly recommended consultancy in Gujarat.', '/assets/reviews/Samarth Pachchigar Spain Student Visa.png', NULL, 'Spain', 'Higher Education', 5, true);

-- -------------------------------------------------------------------------
-- 9. NEWS FLASH & PROMOTIONAL BANNERS
-- -------------------------------------------------------------------------
INSERT INTO news_flash (content, link, priority, is_active)
VALUES ('Upcoming Webinar: Study in UK 2026 - Register Now!', '/webinar', 10, true);
INSERT INTO news_flash (content, link, priority, is_active)
VALUES ('New Intake open for USA Universities. Get 50% Scholarship!', '/study-abroad/usa', 5, true);
INSERT INTO news_flash (content, link, priority, is_active)
VALUES ('FETC students achieve record 8.5 Band in IELTS!', '/success-stories', 0, true);

-- -------------------------------------------------------------------------
-- 10. BLOG POSTS
-- -------------------------------------------------------------------------
INSERT INTO posts (title, slug, status, content)
VALUES ('Top 10 Universities in the UK for International Students', 'top-10-uk-universities', 'PUBLISHED', '{"summary":"Discover premier higher education institutions across the UK offering world-class academics, generous scholarships, and graduate visa work rights.","author":"FETC Editorial Team","tags":["Study in UK","Higher Education","Scholarships"]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;
INSERT INTO posts (title, slug, status, content)
VALUES ('How to Prepare for IELTS in 30 Days', 'ielts-prep-guide', 'PUBLISHED', '{"summary":"A practical 4-week study plan targeting band 7.5+ across Reading, Listening, Writing, and Speaking modules with real simulator tests.","author":"Senior IELTS Mentor","tags":["IELTS","Exam Prep","Study Tips"]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;
INSERT INTO posts (title, slug, status, content)
VALUES ('Understanding the New Student Visa Rules for Australia', 'australia-visa-update', 'PUBLISHED', '{"summary":"Key immigration and Genuine Student (GS) requirement updates for applicants seeking admission into Australian universities in 2025-2026.","author":"Visa Counsel Team","tags":["Australia","Visa Updates","Immigration"]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;

-- -------------------------------------------------------------------------
-- 11. INTERACTIVE GUIDES
-- -------------------------------------------------------------------------
INSERT INTO interactive_guides (title, slug, description, is_active)
VALUES ('UK Student Visa Process', 'uk-visa-guide', 'Step-by-step roadmap for CAS issuance, biometric scheduling, and UK student visa application.', true)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO interactive_guides (title, slug, description, is_active)
VALUES ('USA Application Journey', 'usa-journey', 'End-to-end guidance from shortlisting universities to I-20 and DS-160 consular interview.', true)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

-- -------------------------------------------------------------------------
-- 12. SAMPLE INSTITUTIONAL PARTNER
-- -------------------------------------------------------------------------
INSERT INTO partners (full_name, email, phone, organization_name, organization_website, partnership_types, status)
VALUES ('Kingshuk Chatterjee', 'kingshuk.chatterjee770@gmail.com', '09136074394', 'Nvidia Education Partner', 'https://nvidia.com', '["Visitor Visa Services","Work Permit Services","Study Abroad Consultancy","English Language Teaching"]'::jsonb, 'active');

