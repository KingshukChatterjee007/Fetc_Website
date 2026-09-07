-- FETC Database Comprehensive Schema
-- Contains all tables required for local and deployed environments (Vercel, Supabase, Neon, Render, AWS, etc.)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    phone VARCHAR(20),
    bio TEXT,
    profile_image TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doubts Table (Student Support)
CREATE TABLE IF NOT EXISTS doubts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    admin_response TEXT,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Leads Table (Student Inquiries & Applications)
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(20) DEFAULT 'NEW',
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
    payment VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Lead Documents Table (Onboarding Files)
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

-- 5. Tickets Table (Support & Enquiries)
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Pages Table (CMS Content)
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    nav_visibility VARCHAR(50) DEFAULT 'navbar',
    seo_title VARCHAR(255),
    seo_description TEXT,
    content JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. News Flash Table (Announcements Banner)
CREATE TABLE IF NOT EXISTS news_flash (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    link VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content JSONB DEFAULT '{}',
    status TEXT DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Interactive Guides Table
CREATE TABLE IF NOT EXISTS interactive_guides (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Guide Pages Table
CREATE TABLE IF NOT EXISTS guide_pages (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER REFERENCES interactive_guides(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    page_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Mock Tests Table
CREATE TABLE IF NOT EXISTS mock_tests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price VARCHAR(50) DEFAULT '₹49',
    status VARCHAR(50) DEFAULT 'Published',
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11b. Student Profiles Table (General Details, Test Scores & Academics)
CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    
    -- General Details
    candidate_name VARCHAR(255),
    candidate_age VARCHAR(50),
    dob DATE,
    student_phone VARCHAR(50),
    student_email VARCHAR(255),
    study_budget VARCHAR(255),
    subject_interest VARCHAR(255),
    target_country VARCHAR(255),
    state_preference VARCHAR(255),
    city_preference VARCHAR(255),
    current_status VARCHAR(255),

    -- Test Scores
    toefl_score VARCHAR(50),
    toefl_mock_score VARCHAR(50),
    toefl_test_date DATE,
    ielts_score VARCHAR(50),
    ielts_mock_score VARCHAR(50),
    ielts_test_date DATE,
    gre_score VARCHAR(50),
    gre_mock_score VARCHAR(50),
    gre_test_date DATE,
    gmat_score VARCHAR(50),
    gmat_mock_score VARCHAR(50),
    gmat_test_date DATE,
    sat_score VARCHAR(50),
    sat_mock_score VARCHAR(50),
    sat_test_date DATE,

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

-- 12. Partners Table (Partner Inquiries)
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

-- 13. Orders Table (Payment Transactions)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Invoices Table (Billing System)
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_no VARCHAR(100) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(100) DEFAULT 'Cash',
    upi_ref VARCHAR(255),
    bill_to JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    sgst DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    cgst DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Courses Table (Available Courses & Pricing)
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Exam Prep',
    price DECIMAL(10, 2) DEFAULT 0.00,
    duration VARCHAR(100) DEFAULT '4 Weeks',
    level VARCHAR(50) DEFAULT 'Intermediate',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    students_count INT DEFAULT 0,
    thumbnail VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. News Articles Table
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

-- 17. Student Reviews Table
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
