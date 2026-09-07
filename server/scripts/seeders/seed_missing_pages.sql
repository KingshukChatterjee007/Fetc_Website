-- ========================================================
-- SQL SEED SCRIPT FOR 8 MISSING PAGES (fetc.in Live Site)
-- ========================================================

-- [Page: Contact Us (/contact)]
INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)
VALUES ('/contact', 'Contact Us', 'PUBLISHED', 'navbar', 'Contact Us | FETC', 'Get in touch with FETC head office in Surat, Gujarat for study abroad and exam preparation inquiries.', '{"mapSection":{"title":"Visit Our Head Office","mapUrl":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.218556637389!2d72.76615557602058!3d21.1437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0532454645281%3A0xcb1b689b91e5e01c!2sRoongta%20Signature!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin","subtitle":"Located in Surat, Gujarat. Drop by for a coffee and chat about your future."},"infoSection":{"title":"Get In Touch With Us","description":"Have questions about our courses, study abroad programs, or anything else? We''d love to hear from you."},"workingHours":{"title":"Working Hours","sunday":"Sunday: Closed","timing":"Monday - Saturday: 9:00 AM - 7:00 PM","weekdays":"Mon - Sat: 9:00 AM - 7:00 PM"},"contactDetails":{"email":{"address":"info@fetc.in"},"phone":{"number":"+91 9033347200"},"address":{"lines":["2nd floor, 239, Roongta Signature","Nr. Shyam Mandir Vesu","Surat - 395007"]}}}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Refund Policy (/refund)]
INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)
VALUES ('/refund', 'Refund Policy', 'PUBLISHED', 'footer', 'Refund Policy | FETC', 'Refund Policy detailing conditions and process for requesting a refund at FETC.', '{"sections":[{"body":"We strive to provide high-quality online English learning services.\nIf you are not satisfied with your purchase, this Refund Policy explains the conditions and process for requesting a refund.","title":"1. Introduction"},{"body":"- If your refund request meets our eligibility criteria, it will be processed accordingly\n- The refund will be credited to your original payment method\n- Refunds are typically processed within 5 business days","title":"2. Refund Process"},{"body":"If you have any questions about our Refund Policy, please contact us:\n- Email: info@fetc.in","title":"3. Contact Us"}],"lastUpdated":"February 3, 2025"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Frequently Asked Questions (/faq)]
INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)
VALUES ('/faq', 'Frequently Asked Questions', 'PUBLISHED', 'footer', 'FAQ | FETC Study Abroad & Exam Prep', 'Find answers to common questions about our services, study abroad programs, and examination preparation below.', '{"faqs":[{"answer":"We provide comprehensive study abroad services including, counselling, university selection, application assistance, visa processing, pre-departure orientation, and post-arrival support.","question":"What services do you offer?"},{"answer":"Our consultancy boasts a high success rate, personalized guidance from experienced advisors, and partnerships with top universities worldwide. We also offer ongoing support throughout your study abroad journey.","question":"Why should I choose your consultancy over others?"},{"answer":"Begin by scheduling a consultation with one of our advisors. We will assess your academic background, financial background, career goals, and preferences to help you select suitable programs and universities.","question":"How do I start the application process?"},{"answer":"Typically, you will need your academic transcripts, financials, a statement of purpose, letters of recommendation, a resume, standardized test scores (if applicable), and proof of language proficiency.","question":"What documents are required for the application?"},{"answer":"Yes, we only write the SOPs. Students just need to provide craft compelling SOPs and essays that reflect your strengths and aspirations.","question":"Do you assist with writing the Statement of Purpose (SOP) and essays?"},{"answer":"Costs vary depending on the country, university, and program. They include tuition fees, accommodation, living expenses, insurance, and travel costs. We can provide detailed estimates during your consultation.","question":"How much does studying abroad cost?"}],"title":"Frequently Asked Questions","subtitle":"Find answers to common questions about our services, study abroad programs, and examination preparation below."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Behaviour and Career Analysis (/career-assessment/behaviour-and-career-analysis)]
INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)
VALUES ('/career-assessment/behaviour-and-career-analysis', 'Behaviour and Career Analysis', 'PUBLISHED', 'navbar', 'Behavioral & Career Analysis Report | FETC', 'A comprehensive data-driven evaluation mapping your intrinsic behavioral patterns, cognitive learning styles, and verified competencies to optimal industry pathways.', '{"hero":{"badge":"Verified Assessment","title":"Behavioral & Career","description":"A comprehensive data-driven evaluation mapping your intrinsic behavioral patterns, cognitive learning styles, and verified competencies to optimal industry pathways.","primaryProfile":"Consultative Leader","titleHighlight":"Analysis Report","peakIndustryMatch":"Hospitality & Healthcare"},"vakData":[{"name":"Visual","color":"#0ea5e9","score":80},{"name":"Kinesthetic","color":"#3b82f6","score":60},{"name":"Auditory","color":"#64748b","score":40}],"overview":{"title":"Assessment Overview","summary":"The ComPAS Now™ analysis indicates a strong alignment with roles requiring methodical organization, interpersonal diplomacy, and contextual consistency. High scores in democratic values suggest proficiency in collaborative environments.","strengths":["Effectively processes and utilizes feedback","Engages positively in recognition exchanges","Consistently identifies potential in peers","Demonstrates high emotional intelligence","Accurately assesses human motivations","Maintains high proactive engagement","Structures personal time efficiently","Processes information in linear, logical steps","Prefers contextual stability over disruption","Exhibits strong visual-spatial imagination"],"modalityDesc":"Primary cognitive processing occurs through spatial and observational engagement.","primaryModality":"Visual-Dominant"},"competencies":[{"score":90,"subject":"Democratic values"},{"score":85,"subject":"Helping attitude"},{"score":75,"subject":"Democratic decision"},{"score":80,"subject":"Consultative Process"},{"score":65,"subject":"Repeated Action"},{"score":70,"subject":"Organizing"},{"score":75,"subject":"Market research"},{"score":85,"subject":"Attention to detail"},{"score":80,"subject":"Conflict Management"},{"score":85,"subject":"Interpersonal Skill"}],"careerAlignments":[{"score":95,"subject":"Hospitality"},{"score":88,"subject":"Counseling"},{"score":85,"subject":"Healthcare"},{"score":82,"subject":"Production Eng"},{"score":84,"subject":"Criminology"},{"score":80,"subject":"Navigation"}]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Privacy Policy (/privacy)]
INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)
VALUES ('/privacy', 'Privacy Policy', 'PUBLISHED', 'footer', 'Privacy Policy | FETC', 'Privacy Policy explaining how we collect, use, and protect your personal data at FETC.', '{"sections":[{"body":"This Privacy Policy explains how we collect, use, and protect your personal information when you access our website and services.\nBy using our Service, you agree to the terms described in this Privacy Policy.","title":"1. Introduction"},{"body":"We collect personal information that you provide to us, such as:\n- Name\n- Email address\n- Payment details\nWe also collect usage data such as:\n- IP address\n- Browser type\nThis helps us improve our services and understand user behavior.","title":"2. Information Collection"},{"body":"We use the information we collect to:\n- Provide and improve our services\n- Communicate with you regarding your account or service-related matters\n- Personalize your experience\n- Respond to your inquiries","title":"3. How We Use Your Information"},{"body":"We implement reasonable security measures to protect your personal data from unauthorized access, alteration, or destruction.\nHowever, please note that no method of electronic storage or transmission over the internet is completely secure.","title":"4. Data Security"},{"body":"- We do not sell or rent your personal information to third parties\n- We may share your information with trusted service providers to help us deliver our services","title":"5. Sharing of Data"},{"body":"You have the right to:\n- Access your personal data\n- Update your information\n- Request deletion of your data\nTo exercise these rights, please contact us using the details below.","title":"6. Your Rights"},{"body":"We may update this Privacy Policy from time to time.\n- Any changes will be posted on this page\n- The \"Last Updated\" date will be revised accordingly\nWe recommend reviewing this page periodically.","title":"7. Changes to This Privacy Policy"},{"body":"If you have any questions or concerns about this Privacy Policy, you can contact us at:\n- Email: info@fetc.in","title":"8. Contact Us"}],"lastUpdated":"February 03, 2025"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Study Abroad Destinations (/study-abroad)]
INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)
VALUES ('/study-abroad', 'Study Abroad Destinations', 'PUBLISHED', 'navbar', 'Study Abroad Destinations | Overseas Education | FETC', 'We''ve helped thousands of students settle in over 10+ countries. Pick your dream destination and let us handle admissions, visa prep, and landing guidelines.', '{"hero":{"badge":"Explore the World","title":"Choose Your Study Destination","description":"We''ve helped thousands of students settle in over 10+ countries. Pick your dream destination and let us handle the admissions, visa preparation, and landing guidelines."}}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Master Your Standardized Exams (/exam-training)]
INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)
VALUES ('/exam-training', 'Master Your Standardized Exams', 'PUBLISHED', 'navbar', 'Master Your Standardized Exams | SELT, IELTS, TOEFL, GRE, GMAT, SAT | FETC', 'Access top-tier language training, computer-based mock modules, and expert mentors. Achieve the target score you need to study, work, or live abroad.', '{"hero":{"badge":"Accredited Prep Programs","title":"Master Your Standardized Exams","description":"Access top-tier language training, computer-based mock modules, and expert mentors. Achieve the target score you need to study, work, or live abroad."}}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- [Page: Terms and Conditions (/terms)]
INSERT INTO pages (slug, title, status, nav_visibility, seo_title, seo_description, content)
VALUES ('/terms', 'Terms and Conditions', 'PUBLISHED', 'footer', 'Terms and Conditions | FETC', 'Terms and Conditions governing your use of FETC website and services.', '{"sections":[{"body":"Country: Gujarat, India\nCompany: GINA ABROAD PRIVATE LIMITED, 238–239, Second Floor, Roongta Signature, Opp. Shyam Mandir, VIP Road, Vesu, Surat, India\nDevice: Any device that can access the Service such as a computer, mobile phone, or tablet\nService: Refers to the Website\nTerms: These Terms form the agreement between You and the Company\nSocial Media: Any third-party services or content available through the Service\nWebsite: GINA ABROAD PRIVATE LIMITED – http://www.fetc.in\nYou: The individual or legal entity using the Service","title":"1. Introduction"},{"body":"These Terms and Conditions govern your use of the Service and form a binding agreement between You and the Company.\n- Your use of the Service is conditional upon acceptance of these Terms\n- By accessing or using the Service, you agree to be bound by these Terms\n- If you do not agree, you must not use the Service\n- You must be at least 18 years old to use this Service\n- Please review our Privacy Policy before using the Service","title":"2. Acknowledgment"},{"body":"- Our Service may contain links to third-party websites\n- These websites are not operated or controlled by us\n- We are not responsible for their content, policies, or practices\n- We recommend reviewing their terms and privacy policies before use","title":"3. Links to Other Websites"},{"body":"- We reserve the right to suspend or terminate your access immediately if you violate these Terms\n- Upon termination, your right to use the Service will cease","title":"4. Termination"},{"body":"- Our total liability is limited to the amount you paid through the Service\n- We are not responsible for any indirect, incidental, or consequential damages, even if advised of the possibility","title":"5. Limitation of Liability"},{"body":"- Severability: If any provision is found invalid, it will be adjusted to achieve its intent while the remaining provisions remain in effect\n- Waiver: Failure to enforce any right does not waive the ability to enforce it later","title":"6. Severability and Waiver"},{"body":"- If these Terms are translated into other languages, the English version will prevail in case of any dispute","title":"7. Translation Interpretation"},{"body":"- We reserve the right to update or modify these Terms at any time\n- Significant changes will be notified at least 30 days in advance\n- Continued use of the Service indicates acceptance of the updated Terms","title":"8. Changes to These Terms and Conditions"},{"body":"If you have any questions regarding these Terms and Conditions, you can contact us via:\n- Website: https://fetc.in/contact-us","title":"9. Contact Us"}],"lastUpdated":"February 03, 2025"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  nav_visibility = EXCLUDED.nav_visibility,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

