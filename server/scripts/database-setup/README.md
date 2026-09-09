# FETC Database Setup & Seeder Package (21 Tables Synchronized)

Complete, standalone database initialization and seeding package for **FETC (Foreign English Tests Capital)** website, CMS, and student/admin portals.

This package allows any developer or DevOps engineer to set up, build the schema, and seed all initial data (all 27 live CMS pages, 6 course masterclasses, 8 mock exams, admin accounts, student reviews, news articles, etc.) onto any PostgreSQL instance (Local, VPS, Neon, Supabase, AWS RDS, Render, Heroku) with a single command.

---

## 📦 What's Included

```
database-setup/
├── data/
│   ├── pages_data.json       # 100% exact live content for all 27 website pages (Home, Study Abroad, Exams, Policies, Gallery)
│   ├── courses_data.js       # 6 official exam masterclasses (IELTS, TOEFL, PTE, GRE, GMAT, SAT)
│   ├── mock_tests_data.js    # 8 standardized mock exam simulators (SELT, IELTS, TOEFL, PTE, etc.) with ₹ pricing
│   ├── site_settings_data.js # Global configuration keys (career_assessment_fee, etc.)
│   ├── news_reviews_data.js  # Press coverage articles & verified student visa reviews
│   └── extras_data.js        # News flash banners, blog posts, interactive guides & partner records
├── .env.example              # Pre-configured environment template for all PostgreSQL providers
├── schema.sql                # Complete PostgreSQL DDL for all 21 tables, relations & performance indexes
├── full_seed.sql             # Pure SQL script (128 KB) for direct execution without Node.js
├── setup.js                  # Master 1-click automated setup & seed runner
├── test-connection.js        # Diagnostic tool to verify database connectivity
├── export-sql.js             # Utility to re-generate full_seed.sql if data is modified
└── package.json              # Minimal dependencies (pg, bcrypt, dotenv)
```

---

## 🚀 Quick Start (Choose Your Preferred Method)

### Method 1: Automated Node.js Setup (Recommended)

Requires Node.js (v18+) and npm.

1. **Install Dependencies:**
   ```bash
   cd database-setup
   npm install
   ```

2. **Configure Environment:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your database details:
   - For **Local PostgreSQL**: Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
   - For **Cloud PostgreSQL (Neon, Supabase, Render, AWS RDS)**: Just paste your `DATABASE_URL`.

3. **(Optional) Test Connection:**
   ```bash
   npm run test-db
   ```

4. **Run Setup & Seed:**
   ```bash
   npm run setup
   ```
   *This automatically applies `schema.sql`, builds all 21 tables, hashes passwords with bcrypt, seeds all 27 pages, courses, mock exams, articles, reviews, and prints a full verification table.*

---

### Method 2: Pure SQL Import (No Node.js Required)

If you prefer using database GUI tools like **pgAdmin**, **DBeaver**, **Supabase SQL Editor**, or the **psql** command line:

#### Using `psql` CLI:
```bash
psql -h <host> -U <user> -d <database_name> -f full_seed.sql
```

*Example for local PostgreSQL:*
```bash
psql -U postgres -d fetc_db -f full_seed.sql
```

#### Using pgAdmin / DBeaver / Supabase / Neon:
1. Open your database in pgAdmin, DBeaver, or Supabase Dashboard.
2. Open the **Query Tool** or **SQL Editor**.
3. Open or copy the contents of `full_seed.sql`.
4. Click **Run / Execute** (F5).
5. All 21 tables will be created and all records populated.

---

## 🔑 Default Credentials

The seeder creates two ready-to-use accounts:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `fetc2026@gmail.com` | `admin@12345` | Full CMS, Leads, Invoices & Admin Dashboard access |
| **Test Student** | `user2026@gmail.com` | `user@12345..` | Student portal, mock tests, doubts & profile |

*(You can customize the admin email and password in `.env` before running `npm run setup`)*.

---

## 📊 Complete Database Schema (All 21 Tables)

| # | Table | Purpose |
|---|---|---|
| 1 | `users` | Authentication, roles (`ADMIN`, `USER`), student profile details, enrolled courses |
| 2 | `pages` | Dynamic CMS content store for all 27 website pages with full JSONB payload |
| 3 | `courses` | Training courses catalog, syllabus, pricing, instructors, learning outcomes |
| 4 | `mock_tests` | Practice exam simulators (SELT, IELTS, TOEFL, PTE, SAT, GMAT, GRE, Versant) |
| 5 | `mock_test_registrations` | Student exam simulator test bookings and statuses |
| 6 | `site_settings` | Dynamic site configurations (e.g. `career_assessment_fee`) |
| 7 | `tickets` | Customer support tickets & career assessment test appointments |
| 8 | `ticket_messages` | Real-time chat messages between student and support staff |
| 9 | `doubts` | Academic, exam and visa guidance questions from students |
| 10 | `leads` | 3-stage student admission & onboarding funnel with personal & academic details |
| 11 | `lead_documents` | Uploaded student certificates, passports, transcripts with verification status |
| 12 | `student_profiles` | Deep academic records, standard test scores (GRE/GMAT/SAT/IELTS/TOEFL) |
| 13 | `news_articles` | Press releases & regional media coverage |
| 14 | `student_reviews` | Verified student testimonials, visa photos, university admissions & ratings |
| 15 | `news_flash` | Real-time announcement banners displayed across the website |
| 16 | `posts` | Editorial blog articles |
| 17 | `interactive_guides` | Step-by-step visual guides (e.g. UK / USA visa application roadmap) |
| 18 | `guide_pages` | Individual step pages within interactive guides |
| 19 | `partners` | Institutional partner onboarding inquiries and agency applications |
| 20 | `orders` | Payment transactions, merchant transaction IDs & gateway tracking |
| 21 | `invoices` | Billing, invoicing, CGST/SGST taxes, line items & client records |

---

## 📑 Seeded CMS Pages (27 Total)

The seeder populates exact word-for-word live website contents for all 27 slugs:

- `/` (Home Page)
- `/about/company-profile` (Company Profile & Director's Note)
- `/study-abroad` (Main Study Abroad Hub)
- `/study-abroad/united-kingdom`
- `/study-abroad/usa`
- `/study-abroad/canada`
- `/study-abroad/australia`
- `/study-abroad/europe`
- `/study-abroad/germany`
- `/study-abroad/ireland`
- `/study-abroad/new-zealand`
- `/study-abroad/singapore`
- `/study-abroad/dubai`
- `/exam-training` (Main Exam Prep Hub)
- `/exam-training/selt`
- `/exam-training/idp-for-ielts`
- `/exam-training/toefl`
- `/exam-training/pte`
- `/exam-training/gre-gmat`
- `/exam-training/sat`
- `/exam-training/pearson-versant`
- `/exam-training/psi`
- `/career-assessment/behaviour-and-career-analysis` (Psychometric analysis report)
- `/contact` (Surat Head Office details, Google Maps, working hours)
- `/faq` (Frequently Asked Questions)
- `/terms` (Terms & Conditions)
- `/privacy` (Privacy Policy)
- `/refund` (Refund Policy)
- `/gallery` (Infrastructure & facility showcase)

---

## 🛠️ Configuration Guide for Different Environments

### 1. Local PostgreSQL
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_local_password
DB_NAME=fetc_db
DB_SSL=false
```

### 2. Supabase
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

### 3. Neon.tech
```env
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[ENDPOINT].us-east-2.aws.neon.tech/fetc_db?sslmode=require
```

### 4. Render / Railway / AWS RDS
```env
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:5432/[DB_NAME]?sslmode=require
```

---

## 💡 Developer FAQ & Troubleshooting

### Q: Can I re-run `setup.js` multiple times?
**Yes!** All `INSERT` statements utilize `ON CONFLICT (slug) DO UPDATE`, `ON CONFLICT (email) DO UPDATE`, and `IF NOT EXISTS` for tables. Re-running the seeder will safely update records without duplicating or corrupting data.

### Q: "self-signed certificate in certificate chain" on Cloud DBs
The connection module in `db.js` is pre-configured with `rejectUnauthorized: false` to ensure connection with cloud-managed PostgreSQL instances (Supabase, Neon, Render).

---

## 📞 Support & Contacts
- Organization: **Foreign English Tests Capital (FETC)**
- Head Office: Surat, Gujarat, India
- Email: `info@fetc.in` / `fetc2026@gmail.com`
