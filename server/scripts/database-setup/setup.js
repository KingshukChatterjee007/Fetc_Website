const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { pool, query, close } = require('./db');

// Load Data Modules
const pagesData = require('./data/pages_data.json');
const mockTestsData = require('./data/mock_tests_data');
const coursesData = require('./data/courses_data');
const siteSettingsData = require('./data/site_settings_data');
const { newsArticles, studentReviews } = require('./data/news_reviews_data');
const { newsFlashes, blogPosts, interactiveGuides, samplePartners } = require('./data/extras_data');

async function runSetup() {
  console.log('\n===============================================================');
  console.log('🚀 FETC Master Database Setup & Seeder (21 Tables Synchronized)');
  console.log('===============================================================\n');

  try {
    // -------------------------------------------------------------------------
    // Step 1: Verify Connection & UTF-8 Encoding
    // -------------------------------------------------------------------------
    console.log('📡 Step 1/8: Verifying database connection...');
    await query("SET client_encoding = 'UTF8'");
    const connCheck = await query('SELECT current_database() as db, current_user as user, version() as ver');
    console.log(`   Connected to database: [${connCheck.rows[0].db}]`);
    console.log(`   User                 : [${connCheck.rows[0].user}]`);
    console.log(`   PostgreSQL Version   : [${connCheck.rows[0].ver.split(' on ')[0]}] ✅\n`);

    // -------------------------------------------------------------------------
    // Step 2: Apply Schema DDL (All 21 Tables & Indexes)
    // -------------------------------------------------------------------------
    console.log('🏗️  Step 2/8: Applying complete database schema (21 tables)...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await query(schemaSql);

    // Run safe column upgrades if target DB had older partial schema
    const safeUpgrades = [
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_id VARCHAR(100);",
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_course_id_unique ON courses(course_id);",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS slug VARCHAR(255);",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT 'Intermediate';",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS students_count INT DEFAULT 0;",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail VARCHAR(500);",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS learning_outcomes TEXT;",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_name VARCHAR(255);",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_bio TEXT;",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS featured_image TEXT;",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS intro_video TEXT;",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS meta_description TEXT;",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS language VARCHAR(100) DEFAULT 'English';",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS subtitles VARCHAR(100) DEFAULT 'English';",
      "ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_enabled BOOLEAN DEFAULT false;",
      "ALTER TABLE tickets ADD COLUMN IF NOT EXISTS admin_reply TEXT;",
      "ALTER TABLE tickets ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP;",
      "ALTER TABLE tickets ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'SUPPORT';",
      "ALTER TABLE tickets ADD COLUMN IF NOT EXISTS assessment_date VARCHAR(100);",
      "ALTER TABLE orders ADD COLUMN IF NOT EXISTS return_url VARCHAR(1000);",
      "ALTER TABLE orders ADD COLUMN IF NOT EXISTS assessment_date VARCHAR(100);",
      "ALTER TABLE pages ADD COLUMN IF NOT EXISTS nav_visibility VARCHAR(50) DEFAULT 'none';",
      "ALTER TABLE pages ADD COLUMN IF NOT EXISTS show_in_nav BOOLEAN DEFAULT false;",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT;",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS enrolled_course VARCHAR(255);",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_details JSONB DEFAULT '{}'::jsonb;"
    ];

    for (const sql of safeUpgrades) {
      try {
        await query(sql);
      } catch (e) {
        // Silently continue if already exists
      }
    }
    console.log('   All 21 tables & structural migrations applied successfully ✅\n');

    // -------------------------------------------------------------------------
    // Step 3: Seed Default Users (Admin & Test Student)
    // -------------------------------------------------------------------------
    console.log('👤 Step 3/8: Seeding default authentication accounts...');
    const adminEmail = process.env.ADMIN_EMAIL || 'fetc2026@gmail.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin@12345';
    const adminHashed = await bcrypt.hash(adminPass, 10);

    await query(`
      INSERT INTO users (name, email, password, role, phone, status)
      VALUES ($1, $2, $3, 'ADMIN', '9033347209', 'ACTIVE')
      ON CONFLICT (email) DO UPDATE 
      SET role = 'ADMIN', status = 'ACTIVE'
    `, ['FETC Administrator', adminEmail, adminHashed]);
    console.log(`   Admin User  : ${adminEmail} (Password: ${adminPass})`);

    const userEmail = 'user2026@gmail.com';
    const userPass = 'user@12345..';
    const userHashed = await bcrypt.hash(userPass, 10);

    await query(`
      INSERT INTO users (name, email, password, role, phone, status)
      VALUES ($1, $2, $3, 'USER', '9876543210', 'ACTIVE')
      ON CONFLICT (email) DO UPDATE 
      SET role = 'USER', status = 'ACTIVE'
    `, ['Test Student', userEmail, userHashed]);
    console.log(`   Test Student: ${userEmail} (Password: ${userPass}) ✅\n`);

    // -------------------------------------------------------------------------
    // Step 4: Seed Site Settings & Configurations
    // -------------------------------------------------------------------------
    console.log('⚙️  Step 4/8: Seeding site settings...');
    for (const s of siteSettingsData) {
      await query(`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
      `, [s.key, s.value]);
    }
    console.log(`   Seeded ${siteSettingsData.length} Site Settings (career_assessment_fee, etc.) ✅\n`);

    // -------------------------------------------------------------------------
    // Step 5: Seed CMS Pages (All 27 Live Pages)
    // -------------------------------------------------------------------------
    console.log(`📄 Step 5/8: Seeding ${pagesData.length} CMS Pages with full JSONB content...`);
    let pageCount = 0;
    for (const page of pagesData) {
      await query(`
        INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          status = EXCLUDED.status,
          nav_visibility = EXCLUDED.nav_visibility,
          show_in_nav = EXCLUDED.show_in_nav,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          content = EXCLUDED.content,
          updated_at = CURRENT_TIMESTAMP
      `, [
        page.slug,
        page.title,
        page.status || 'PUBLISHED',
        page.nav_visibility || 'navbar',
        page.show_in_nav || false,
        page.seo_title || null,
        page.seo_description || null,
        typeof page.content === 'string' ? page.content : JSON.stringify(page.content || {})
      ]);
      pageCount++;
    }
    console.log(`   Seeded ${pageCount} CMS Pages (Home, Study Abroad, Exams, Policies, Gallery) ✅\n`);

    // -------------------------------------------------------------------------
    // Step 6: Seed Standardized Courses (6 Exam Prep Masterclasses)
    // -------------------------------------------------------------------------
    console.log('🎓 Step 6/8: Seeding Training Courses Catalog...');
    for (const c of coursesData) {
      await query(`
        INSERT INTO courses (
          course_id, slug, title, description, category, price, duration, level, status,
          students_count, learning_outcomes, instructor_name, instructor_bio, language, subtitles, certificate_enabled
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (course_id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          price = EXCLUDED.price,
          duration = EXCLUDED.duration,
          level = EXCLUDED.level,
          status = EXCLUDED.status,
          students_count = EXCLUDED.students_count,
          learning_outcomes = EXCLUDED.learning_outcomes,
          instructor_name = EXCLUDED.instructor_name,
          instructor_bio = EXCLUDED.instructor_bio
      `, [
        c.course_id,
        c.slug,
        c.title,
        c.description,
        c.category,
        c.price,
        c.duration,
        c.level,
        c.status,
        c.students_count,
        c.learning_outcomes,
        c.instructor_name,
        c.instructor_bio,
        c.language,
        c.subtitles,
        c.certificate_enabled
      ]);
    }
    console.log(`   Seeded ${coursesData.length} Official Exam Training Courses (IELTS, TOEFL, PTE, GRE, GMAT, SAT) ✅\n`);

    // -------------------------------------------------------------------------
    // Step 7: Seed Mock Tests, Press Coverage & Student Reviews
    // -------------------------------------------------------------------------
    console.log('📝 Step 7/8: Seeding Mock Tests, Press Coverage & Student Reviews...');

    // Mock Tests
    for (const test of mockTestsData) {
      const existing = await query('SELECT id FROM mock_tests WHERE title = $1', [test.title]);
      if (existing.rows.length === 0) {
        await query(`
          INSERT INTO mock_tests (title, status, content, image_url, price)
          VALUES ($1, 'Published', $2, $3, NULL)
        `, [test.title, test.content, test.image_url]);
      } else {
        await query(`
          UPDATE mock_tests SET content = $1, image_url = $2, price = NULL WHERE title = $3
        `, [test.content, test.image_url, test.title]);
      }
    }
    console.log(`   Seeded ${mockTestsData.length} Standardized Mock Exam Simulators (Form-Fill / Inquiries)`);

    // News Articles
    for (const article of newsArticles) {
      const existing = await query('SELECT id FROM news_articles WHERE title = $1', [article.title]);
      if (existing.rows.length === 0) {
        await query(`
          INSERT INTO news_articles (title, summary, source, date, image_url, category, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [article.title, article.summary, article.source, article.date, article.image_url, article.category, article.is_active]);
      }
    }
    console.log(`   Seeded ${newsArticles.length} Regional Press & News Articles`);

    // Student Reviews
    for (const rev of studentReviews) {
      const existing = await query('SELECT id FROM student_reviews WHERE name = $1 AND university = $2', [rev.name, rev.university]);
      if (existing.rows.length === 0) {
        await query(`
          INSERT INTO student_reviews (name, university, score, quote, image_url, visa_image, country, program, rating, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [rev.name, rev.university, rev.score, rev.quote, rev.image_url, rev.visa_image, rev.country, rev.program, rev.rating, rev.is_active]);
      }
    }
    console.log(`   Seeded ${studentReviews.length} Student Visa Testimonials ✅\n`);

    // -------------------------------------------------------------------------
    // Step 8: Seed Extras (News Flash, Blog Posts, Guides, Partners)
    // -------------------------------------------------------------------------
    console.log('🌐 Step 8/8: Seeding News Flash, Guides, Blog Posts & Sample Partner...');

    // News Flash
    for (const nf of newsFlashes) {
      const existing = await query('SELECT id FROM news_flash WHERE content = $1', [nf.content]);
      if (existing.rows.length === 0) {
        await query(`
          INSERT INTO news_flash (content, link, priority, is_active)
          VALUES ($1, $2, $3, true)
        `, [nf.content, nf.link, nf.priority]);
      }
    }

    // Blog Posts
    for (const post of blogPosts) {
      await query(`
        INSERT INTO posts (title, slug, status, content)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content
      `, [post.title, post.slug, post.status, JSON.stringify(post.content)]);
    }

    // Interactive Guides
    for (const guide of interactiveGuides) {
      const guideRes = await query(`
        INSERT INTO interactive_guides (title, slug, description, is_active)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description
        RETURNING id
      `, [guide.title, guide.slug, guide.description]);

      const guideId = guideRes.rows[0].id;
      for (const page of guide.pages) {
        const pageCheck = await query('SELECT id FROM guide_pages WHERE guide_id = $1 AND page_number = $2', [guideId, page.page_number]);
        if (pageCheck.rows.length === 0) {
          await query(`
            INSERT INTO guide_pages (guide_id, image_url, page_number)
            VALUES ($1, $2, $3)
          `, [guideId, page.image_url, page.page_number]);
        }
      }
    }

    // Sample Partners
    for (const partner of samplePartners) {
      const partnerCheck = await query('SELECT id FROM partners WHERE email = $1', [partner.email]);
      if (partnerCheck.rows.length === 0) {
        await query(`
          INSERT INTO partners (full_name, email, phone, organization_name, organization_website, partnership_types, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          partner.full_name,
          partner.email,
          partner.phone,
          partner.organization_name,
          partner.organization_website,
          JSON.stringify(partner.partnership_types),
          partner.status
        ]);
      }
    }
    console.log('   Seeded News Flash, Blog Posts, Interactive Guides & Partner Record ✅\n');

    // -------------------------------------------------------------------------
    // Verification & Summary Report
    // -------------------------------------------------------------------------
    console.log('========================================================================');
    console.log('📊 DATABASE VERIFICATION SUMMARY REPORT (ALL 21 TABLES)');
    console.log('========================================================================');

    const allTables = [
      'users',
      'pages',
      'courses',
      'mock_tests',
      'mock_test_registrations',
      'site_settings',
      'tickets',
      'ticket_messages',
      'doubts',
      'leads',
      'lead_documents',
      'student_profiles',
      'news_articles',
      'student_reviews',
      'news_flash',
      'posts',
      'interactive_guides',
      'guide_pages',
      'partners',
      'orders',
      'invoices'
    ];

    console.log('| Table Name                  | Records Count | Frontend Status |');
    console.log('|-----------------------------|---------------|-----------------|');
    for (const t of allTables) {
      try {
        const res = await query(`SELECT COUNT(*) FROM ${t}`);
        const count = res.rows[0].count;
        const paddedName = t.padEnd(27, ' ');
        const paddedCount = count.toString().padEnd(13, ' ');
        console.log(`| ${paddedName} | ${paddedCount} | Synchronized ✅ |`);
      } catch (err) {
        console.log(`| ${t.padEnd(27, ' ')} | Error         | Skipped ⚠️      |`);
      }
    }
    console.log('========================================================================');
    console.log('🎉 FETC Database setup and seeding completed successfully!');
    console.log('Default Admin Account:');
    console.log(`  - Email   : ${adminEmail}`);
    console.log(`  - Password: ${adminPass}`);
    console.log('========================================================================\n');

    await close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database setup encountered an error:');
    console.error(error);
    await close();
    process.exit(1);
  }
}

runSetup();
