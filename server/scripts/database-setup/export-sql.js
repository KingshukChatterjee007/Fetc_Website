const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Load Data
const pagesData = require('./data/pages_data.json');
const mockTestsData = require('./data/mock_tests_data');
const coursesData = require('./data/courses_data');
const siteSettingsData = require('./data/site_settings_data');
const { newsArticles, studentReviews } = require('./data/news_reviews_data');
const { newsFlashes, blogPosts, interactiveGuides, samplePartners } = require('./data/extras_data');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.toString().replace(/'/g, "''")}'`;
}

async function generateFullSql() {
  console.log('Generating comprehensive full_seed.sql pure SQL dump (21 Tables)...');

  let sql = '-- =========================================================================\n';
  sql += '-- FETC Standalone Complete PostgreSQL Database Setup & Seeder Script\n';
  sql += '-- Generated for direct execution in: psql, pgAdmin, DBeaver, Supabase SQL Editor\n';
  sql += '-- Synchronized with All 21 Tables across Frontend & Backend\n';
  sql += '-- =========================================================================\n\n';

  // 1. Schema DDL
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  sql += '-- -------------------------------------------------------------------------\n';
  sql += '-- 1. TABLE DEFINITIONS & INDEXES (21 TABLES DDL)\n';
  sql += '-- -------------------------------------------------------------------------\n';
  sql += schemaSql.trim() + '\n\n';

  // 2. Users
  sql += '-- -------------------------------------------------------------------------\n';
  sql += '-- 2. DEFAULT AUTHENTICATION ACCOUNTS\n';
  sql += '-- -------------------------------------------------------------------------\n';
  const adminHashed = await bcrypt.hash('admin@12345', 10);
  const userHashed = await bcrypt.hash('user@12345..', 10);

  sql += `INSERT INTO users (name, email, password, role, phone, status)\n`;
  sql += `VALUES ('FETC Administrator', 'fetc2026@gmail.com', '${adminHashed}', 'ADMIN', '9033347209', 'ACTIVE')\n`;
  sql += `ON CONFLICT (email) DO UPDATE SET role = 'ADMIN', status = 'ACTIVE';\n\n`;

  sql += `INSERT INTO users (name, email, password, role, phone, status)\n`;
  sql += `VALUES ('Test Student', 'user2026@gmail.com', '${userHashed}', 'USER', '9876543210', 'ACTIVE')\n`;
  sql += `ON CONFLICT (email) DO UPDATE SET role = 'USER', status = 'ACTIVE';\n\n`;

  // 3. Site Settings
  sql += '-- -------------------------------------------------------------------------\n';
  sql += '-- 3. SITE SETTINGS & CONFIGURATIONS\n';
  sql += '-- -------------------------------------------------------------------------\n';
  for (const s of siteSettingsData) {
    sql += `INSERT INTO site_settings (key, value, updated_at)\n`;
    sql += `VALUES (${escapeSql(s.key)}, ${escapeSql(s.value)}, CURRENT_TIMESTAMP)\n`;
    sql += `ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP;\n`;
  }
  sql += '\n';

  // 4. Pages
  sql += '-- -------------------------------------------------------------------------\n';
  sql += `-- 4. CMS PAGES (${pagesData.length} LIVE PAGES WITH COMPLETE JSONB CONTENT)\n`;
  sql += '-- -------------------------------------------------------------------------\n';
  for (const p of pagesData) {
    const slug = escapeSql(p.slug);
    const title = escapeSql(p.title);
    const status = escapeSql(p.status || 'PUBLISHED');
    const navVis = p.nav_visibility ? escapeSql(p.nav_visibility) : "'none'";
    const showInNav = p.show_in_nav ? 'true' : 'false';
    const seoTitle = escapeSql(p.seo_title || null);
    const seoDesc = escapeSql(p.seo_description || null);
    const contentJson = typeof p.content === 'string' ? p.content : JSON.stringify(p.content || {});
    const content = escapeSql(contentJson);

    sql += `-- [Page: ${p.title} (${p.slug})]\n`;
    sql += `INSERT INTO pages (slug, title, status, nav_visibility, show_in_nav, seo_title, seo_description, content)\n`;
    sql += `VALUES (${slug}, ${title}, ${status}, ${navVis}, ${showInNav}, ${seoTitle}, ${seoDesc}, ${content}::jsonb)\n`;
    sql += `ON CONFLICT (slug) DO UPDATE SET\n`;
    sql += `  title = EXCLUDED.title,\n`;
    sql += `  status = EXCLUDED.status,\n`;
    sql += `  nav_visibility = EXCLUDED.nav_visibility,\n`;
    sql += `  show_in_nav = EXCLUDED.show_in_nav,\n`;
    sql += `  seo_title = EXCLUDED.seo_title,\n`;
    sql += `  seo_description = EXCLUDED.seo_description,\n`;
    sql += `  content = EXCLUDED.content,\n`;
    sql += `  updated_at = CURRENT_TIMESTAMP;\n\n`;
  }

  // 5. Courses Catalog
  sql += '-- -------------------------------------------------------------------------\n';
  sql += `-- 5. COURSES CATALOG (${coursesData.length} TRAINING MASTERCLASSES)\n`;
  sql += '-- -------------------------------------------------------------------------\n';
  for (const c of coursesData) {
    sql += `INSERT INTO courses (\n`;
    sql += `  course_id, slug, title, description, category, price, duration, level, status,\n`;
    sql += `  students_count, learning_outcomes, instructor_name, instructor_bio, language, subtitles, certificate_enabled\n`;
    sql += `)\n`;
    sql += `VALUES (\n`;
    sql += `  ${escapeSql(c.course_id)}, ${escapeSql(c.slug)}, ${escapeSql(c.title)}, ${escapeSql(c.description)}, ${escapeSql(c.category)},\n`;
    sql += `  ${c.price}, ${escapeSql(c.duration)}, ${escapeSql(c.level)}, ${escapeSql(c.status)}, ${c.students_count},\n`;
    sql += `  ${escapeSql(c.learning_outcomes)}, ${escapeSql(c.instructor_name)}, ${escapeSql(c.instructor_bio)},\n`;
    sql += `  ${escapeSql(c.language)}, ${escapeSql(c.subtitles)}, ${c.certificate_enabled ? 'true' : 'false'}\n`;
    sql += `)\n`;
    sql += `ON CONFLICT (course_id) DO UPDATE SET\n`;
    sql += `  slug = EXCLUDED.slug, title = EXCLUDED.title, description = EXCLUDED.description,\n`;
    sql += `  category = EXCLUDED.category, price = EXCLUDED.price, duration = EXCLUDED.duration,\n`;
    sql += `  level = EXCLUDED.level, status = EXCLUDED.status, students_count = EXCLUDED.students_count;\n\n`;
  }

  // 6. Mock Tests
  sql += '-- -------------------------------------------------------------------------\n';
  sql += '-- 6. MOCK EXAM SIMULATORS\n';
  sql += '-- -------------------------------------------------------------------------\n';
  for (const m of mockTestsData) {
    sql += `INSERT INTO mock_tests (title, status, content, image_url, price)\n`;
    sql += `VALUES (${escapeSql(m.title)}, 'Published', ${escapeSql(m.content)}, ${escapeSql(m.image_url)}, NULL);\n`;
  }
  sql += '\n';

  // 7. News Articles
  sql += '-- -------------------------------------------------------------------------\n';
  sql += '-- 7. NEWS ARTICLES & PRESS COVERAGE\n';
  sql += '-- -------------------------------------------------------------------------\n';
  for (const n of newsArticles) {
    sql += `INSERT INTO news_articles (title, summary, source, date, image_url, category, is_active)\n`;
    sql += `VALUES (${escapeSql(n.title)}, ${escapeSql(n.summary)}, ${escapeSql(n.source)}, ${escapeSql(n.date)}, ${escapeSql(n.image_url)}, ${escapeSql(n.category)}, ${n.is_active ? 'true' : 'false'});\n`;
  }
  sql += '\n';

  // 8. Student Reviews
  sql += '-- -------------------------------------------------------------------------\n';
  sql += '-- 8. STUDENT REVIEWS & VISA SUCCESS STORIES\n';
  sql += '-- -------------------------------------------------------------------------\n';
  for (const r of studentReviews) {
    sql += `INSERT INTO student_reviews (name, university, score, quote, image_url, visa_image, country, program, rating, is_active)\n`;
    sql += `VALUES (${escapeSql(r.name)}, ${escapeSql(r.university)}, ${escapeSql(r.score)}, ${escapeSql(r.quote)}, ${escapeSql(r.image_url)}, ${escapeSql(r.visa_image)}, ${escapeSql(r.country)}, ${escapeSql(r.program)}, ${r.rating || 5}, ${r.is_active ? 'true' : 'false'});\n`;
  }
  sql += '\n';

  // 9. News Flash
  sql += '-- -------------------------------------------------------------------------\n';
  sql += '-- 9. NEWS FLASH & PROMOTIONAL BANNERS\n';
  sql += '-- -------------------------------------------------------------------------\n';
  for (const nf of newsFlashes) {
    sql += `INSERT INTO news_flash (content, link, priority, is_active)\n`;
    sql += `VALUES (${escapeSql(nf.content)}, ${escapeSql(nf.link)}, ${nf.priority}, true);\n`;
  }
  sql += '\n';

  // 10. Blog Posts
  sql += '-- -------------------------------------------------------------------------\n';
  sql += '-- 10. BLOG POSTS\n';
  sql += '-- -------------------------------------------------------------------------\n';
  for (const bp of blogPosts) {
    sql += `INSERT INTO posts (title, slug, status, content)\n`;
    sql += `VALUES (${escapeSql(bp.title)}, ${escapeSql(bp.slug)}, ${escapeSql(bp.status)}, ${escapeSql(JSON.stringify(bp.content))}::jsonb)\n`;
    sql += `ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;\n`;
  }
  sql += '\n';

  // 11. Interactive Guides
  sql += '-- -------------------------------------------------------------------------\n';
  sql += '-- 11. INTERACTIVE GUIDES\n';
  sql += '-- -------------------------------------------------------------------------\n';
  for (const g of interactiveGuides) {
    sql += `INSERT INTO interactive_guides (title, slug, description, is_active)\n`;
    sql += `VALUES (${escapeSql(g.title)}, ${escapeSql(g.slug)}, ${escapeSql(g.description)}, true)\n`;
    sql += `ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;\n`;
  }
  sql += '\n';

  // 12. Sample Partner
  sql += '-- -------------------------------------------------------------------------\n';
  sql += '-- 12. SAMPLE INSTITUTIONAL PARTNER\n';
  sql += '-- -------------------------------------------------------------------------\n';
  for (const sp of samplePartners) {
    sql += `INSERT INTO partners (full_name, email, phone, organization_name, organization_website, partnership_types, status)\n`;
    sql += `VALUES (${escapeSql(sp.full_name)}, ${escapeSql(sp.email)}, ${escapeSql(sp.phone)}, ${escapeSql(sp.organization_name)}, ${escapeSql(sp.organization_website)}, ${escapeSql(JSON.stringify(sp.partnership_types))}::jsonb, ${escapeSql(sp.status)});\n`;
  }
  sql += '\n';

  const outPath = path.join(__dirname, 'full_seed.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`✅ full_seed.sql successfully created! Size: ${(fs.statSync(outPath).size / 1024).toFixed(2)} KB`);
}

generateFullSql().catch(err => {
  console.error(err);
  process.exit(1);
});
