const db = require('../../db');
const fs = require('fs');
const path = require('path');

async function run() {
  const slugs = [
    '/career-assessment/behaviour-and-career-analysis',
    '/study-abroad',
    '/exam-training',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
    '/refund'
  ];
  
  const res = await db.query('SELECT slug, title, status, nav_visibility, seo_title, seo_description, content FROM pages WHERE slug = ANY($1)', [slugs]);
  
  let sql = '-- ========================================================\n';
  sql += '-- SQL SEED SCRIPT FOR 8 MISSING PAGES (fetc.in Live Site)\n';
  sql += '-- ========================================================\n\n';
  
  for (const r of res.rows) {
    const slug = r.slug;
    const title = (r.title || '').split("'").join("''");
    const status = (r.status || 'PUBLISHED').split("'").join("''");
    const navVis = r.nav_visibility ? `'${r.nav_visibility}'` : 'NULL';
    const seoTitle = (r.seo_title || '').split("'").join("''");
    const seoDesc = (r.seo_description || '').split("'").join("''");
    const content = JSON.stringify(r.content).split("'").join("''");
    
    sql += `-- [Page: ${r.title} (${r.slug})]\n`;
    sql += `INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)\n`;
    sql += `VALUES ('${slug}', '${title}', '${status}', ${navVis}, '${seoTitle}', '${seoDesc}', '${content}'::jsonb)\n`;
    sql += `ON CONFLICT (slug) DO UPDATE SET \n`;
    sql += `  title = EXCLUDED.title,\n`;
    sql += `  status = EXCLUDED.status,\n`;
    sql += `  nav_visibility = EXCLUDED.nav_visibility,\n`;
    sql += `  seo_title = EXCLUDED.seo_title,\n`;
    sql += `  seo_description = EXCLUDED.seo_description,\n`;
    sql += `  content = EXCLUDED.content,\n`;
    sql += `  updated_at = CURRENT_TIMESTAMP;\n\n`;
  }
  
  const outPath = path.join(__dirname, 'seed_missing_pages.sql');
  fs.writeFileSync(outPath, sql);
  console.log('✅ SQL file written successfully to:', outPath);
  process.exit(0);
}

run().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
