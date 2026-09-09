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
