export interface PortalCourse {
  id: string;
  name: string;
  category: 'pg' | 'ug' | 'engineering';
  badge: 'Trending' | 'New' | 'Popular';
  iconName: string;
  subtitle: string;
  duration: string;
  avgSalary: string;
  topCareers: string[];
}

export const portalCategories = [
  { id: 'pg', label: 'PG Courses', count: 17, desc: 'Postgraduate level master degrees & executive diplomas' },
  { id: 'ug', label: 'UG Courses', count: 9, desc: 'Undergraduate level bachelor programs for base foundations' },
  { id: 'engineering', label: 'Engineering', count: 4, desc: 'Professional B.Tech & M.Tech tracks for engineering specialists' }
];

export const portalCourses: PortalCourse[] = [
  // PG Courses
  {
    id: 'mba',
    name: 'MBA',
    category: 'pg',
    badge: 'Popular',
    iconName: 'Briefcase',
    subtitle: 'Core management degree focusing on general corporate leadership and business scaling.',
    duration: '2 Years',
    avgSalary: '8.5 LPA',
    topCareers: ['Business Consultant', 'Operations Head', 'Strategy Lead']
  },
  {
    id: 'online-mba',
    name: 'Online MBA',
    category: 'pg',
    badge: 'Trending',
    iconName: 'Laptop',
    subtitle: 'Flexible postgraduate business administration for working professionals, UGC-DEB approved.',
    duration: '2 Years',
    avgSalary: '9.2 LPA',
    topCareers: ['Brand Manager', 'Financial Analyst', 'Management Trainee']
  },
  {
    id: 'online-global-mba',
    name: 'Online Global MBA',
    category: 'pg',
    badge: 'Popular',
    iconName: 'Globe',
    subtitle: 'International corporate business curriculum with global networking opportunities and foreign university accents.',
    duration: '2 Years',
    avgSalary: '14.5 LPA',
    topCareers: ['International Business Manager', 'Export Consultant', 'Global Operations Lead']
  },
  {
    id: '1-year-mba',
    name: '1 Year MBA',
    category: 'pg',
    badge: 'New',
    iconName: 'Sparkles',
    subtitle: 'Accelerated intensive management program tailored for seasoned professionals seeking quick executive transitions.',
    duration: '1 Year',
    avgSalary: '11.0 LPA',
    topCareers: ['Executive Director', 'Project Manager', 'VP of Operations']
  },
  {
    id: 'online-mca',
    name: 'Online MCA',
    category: 'pg',
    badge: 'Trending',
    iconName: 'Code',
    subtitle: 'Advanced software engineering, modern development frameworks, and database architecture.',
    duration: '2 Years',
    avgSalary: '7.8 LPA',
    topCareers: ['Full Stack Developer', 'Systems Analyst', 'Software Architect']
  },
  {
    id: 'online-msc',
    name: 'Online MSc',
    category: 'pg',
    badge: 'Popular',
    iconName: 'FlaskConical',
    subtitle: 'Specialized scientific and quantitative research program in IT, Data Science, or Applied Mathematics.',
    duration: '2 Years',
    avgSalary: '8.0 LPA',
    topCareers: ['Data Scientist', 'Statistical Researcher', 'Lab Lead']
  },
  {
    id: 'ms-degree-online',
    name: 'MS Degree Online',
    category: 'pg',
    badge: 'New',
    iconName: 'Cpu',
    subtitle: 'Prestigious global master of science programs focusing on computer engineering, AI, and cybersecurity.',
    duration: '2 Years',
    avgSalary: '12.4 LPA',
    topCareers: ['AI Scientist', 'Security Engineer', 'Robotics Specialist']
  },
  {
    id: 'online-ma',
    name: 'Online MA',
    category: 'pg',
    badge: 'Popular',
    iconName: 'BookOpen',
    subtitle: 'In-depth humanities, English literature, economics, or political science online programs.',
    duration: '2 Years',
    avgSalary: '5.5 LPA',
    topCareers: ['Content Director', 'Public Relations Specialist', 'Policy Analyst']
  },
  {
    id: 'online-mcom',
    name: 'Online MCom',
    category: 'pg',
    badge: 'Popular',
    iconName: 'LineChart',
    subtitle: 'Advanced commerce, corporate auditing, financial research, and taxation methodologies.',
    duration: '2 Years',
    avgSalary: '6.4 LPA',
    topCareers: ['Senior Accountant', 'Auditor', 'Tax Consultant']
  },
  {
    id: 'dual-mba',
    name: 'Dual MBA',
    category: 'pg',
    badge: 'Trending',
    iconName: 'Layers',
    subtitle: 'Simultaneous focus on two major business domains like Marketing + Finance or HR + Analytics.',
    duration: '2 Years',
    avgSalary: '10.5 LPA',
    topCareers: ['Strategic Planner', 'Corporate Consultant', 'Dual-domain Specialist']
  },
  {
    id: 'mba-after-diploma',
    name: 'MBA After Diploma',
    category: 'pg',
    badge: 'New',
    iconName: 'Award',
    subtitle: 'Special direct lateral-access MBA pathway designed specifically for professional diploma holders.',
    duration: '2 Years',
    avgSalary: '7.5 LPA',
    topCareers: ['Industrial Manager', 'Operations Executive', 'Unit Supervisor']
  },
  {
    id: 'online-med',
    name: 'Online M.Ed',
    category: 'pg',
    badge: 'Popular',
    iconName: 'GraduationCap',
    subtitle: 'Advanced Master of Education concentrating on curriculum architecture, e-learning, and pedagogy.',
    duration: '2 Years',
    avgSalary: '6.0 LPA',
    topCareers: ['Academic Administrator', 'Curriculum Designer', 'Educational Consultant']
  },
  {
    id: 'global-mca',
    name: 'Global MCA',
    category: 'pg',
    badge: 'New',
    iconName: 'Globe',
    subtitle: 'Tech degree with global certifications mapped from Microsoft, AWS, and Oracle systems.',
    duration: '2 Years',
    avgSalary: '10.0 LPA',
    topCareers: ['Global Dev Architect', 'Enterprise Analyst', 'Cloud Architect']
  },
  {
    id: 'pgdm',
    name: 'PGDM',
    category: 'pg',
    badge: 'Popular',
    iconName: 'ShieldCheck',
    subtitle: 'Post Graduate Diploma in Management offering industry-synced practical corporate curriculum.',
    duration: '2 Years',
    avgSalary: '8.8 LPA',
    topCareers: ['Product Manager', 'Management Consultant', 'Equity Researcher']
  },
  {
    id: 'master-of-social-work',
    name: 'Master of Social Work',
    category: 'pg',
    badge: 'Popular',
    iconName: 'Users',
    subtitle: 'Empathetic social science program specializing in NGO operations, corporate social responsibility, and welfare management.',
    duration: '2 Years',
    avgSalary: '5.2 LPA',
    topCareers: ['CSR Specialist', 'NGO Program Director', 'Welfare Consultant']
  },
  {
    id: 'mba-doctorate',
    name: 'MBA + Doctorate',
    category: 'pg',
    badge: 'New',
    iconName: 'Award',
    subtitle: 'Integrated elite dual track leading to executive business mastery alongside an applied doctoral credentials (DBA).',
    duration: '4 Years',
    avgSalary: '16.0 LPA',
    topCareers: ['C-Suite Executive', 'Research Dean', 'Strategic Advisory Partner']
  },
  {
    id: 'med-edd',
    name: 'M.Ed & Ed.D',
    category: 'pg',
    badge: 'New',
    iconName: 'GraduationCap',
    subtitle: 'Advanced pedagogical integration combining Master of Education and applied Doctorate of Education.',
    duration: '4 Years',
    avgSalary: '9.5 LPA',
    topCareers: ['Chief Learning Officer', 'University Dean', 'Policy Advisor']
  },

  // UG Courses
  {
    id: 'online-bca',
    name: 'Online BCA',
    category: 'ug',
    badge: 'Trending',
    iconName: 'Code',
    subtitle: 'Flexible Computer Applications foundation program covering key languages (Java, Python, C++), DBMS, and Web Dev.',
    duration: '3 Years',
    avgSalary: '4.8 LPA',
    topCareers: ['Software Engineer', 'Web Designer', 'IT Analyst']
  },
  {
    id: 'online-bba',
    name: 'Online BBA',
    category: 'ug',
    badge: 'Popular',
    iconName: 'Briefcase',
    subtitle: 'UGC-DEB approved Bachelor of Business Administration covering marketing, human resource management, and sales.',
    duration: '3 Years',
    avgSalary: '4.5 LPA',
    topCareers: ['Marketing Executive', 'Sales Specialist', 'HR Recruiter']
  },
  {
    id: 'online-ba',
    name: 'Online BA',
    category: 'ug',
    badge: 'Popular',
    iconName: 'BookOpen',
    subtitle: 'Broad-based study in English, Sociology, Economics, or History designed to fit work-life balance.',
    duration: '3 Years',
    avgSalary: '3.6 LPA',
    topCareers: ['Content Writer', 'Customer Success', 'Civil Service Aspirant']
  },
  {
    id: 'online-bcom',
    name: 'Online B.Com',
    category: 'ug',
    badge: 'Popular',
    iconName: 'LineChart',
    subtitle: 'Comprehensive financial accounting, corporate law, taxation studies, and economic trends.',
    duration: '3 Years',
    avgSalary: '4.2 LPA',
    topCareers: ['Accounts Analyst', 'Financial Auditor', 'Commercial Advisor']
  },
  {
    id: 'online-bsc',
    name: 'Online B.Sc',
    category: 'ug',
    badge: 'Trending',
    iconName: 'FlaskConical',
    subtitle: 'Bachelor of Science in Information Technology or statistics with focus on analytics and data computing.',
    duration: '3 Years',
    avgSalary: '4.6 LPA',
    topCareers: ['Technical Consultant', 'System Controller', 'Database Junior']
  },
  {
    id: 'bca-mca',
    name: 'BCA + MCA',
    category: 'ug',
    badge: 'Trending',
    iconName: 'Laptop',
    subtitle: 'Integrated 5-year seamless software and computer applications development track, bypass separate admission hassles.',
    duration: '5 Years',
    avgSalary: '8.0 LPA',
    topCareers: ['Senior Software Developer', 'Database Architect', 'Lead QA Engineer']
  },
  {
    id: 'bba-mba',
    name: 'BBA + MBA',
    category: 'ug',
    badge: 'Popular',
    iconName: 'Layers',
    subtitle: 'Integrated dual business degree delivering foundation-to-advanced leadership coaching in management.',
    duration: '5 Years',
    avgSalary: '9.5 LPA',
    topCareers: ['Management Consultant', 'Business Unit Manager', 'Strategic Specialist']
  },
  {
    id: 'bcom-mba',
    name: 'B.Com + MBA',
    category: 'ug',
    badge: 'Popular',
    iconName: 'LineChart',
    subtitle: 'Highly specialized financial-accounting to advanced executive business management integrated dual path.',
    duration: '5 Years',
    avgSalary: '9.0 LPA',
    topCareers: ['Corporate Treasury Head', 'Senior Finance Planner', 'Audit Partner']
  },
  {
    id: 'online-bba-dual',
    name: 'Online BBA Dual',
    category: 'ug',
    badge: 'New',
    iconName: 'Briefcase',
    subtitle: 'Bachelor of Business Administration dual specializations offering dual knowledge cores like Sales + Digital Tech.',
    duration: '3 Years',
    avgSalary: '5.2 LPA',
    topCareers: ['Corporate Operations Partner', 'Growth Marketer', 'Retail Specialist']
  },

  // Engineering Courses
  {
    id: 'btech-for-working-professionals',
    name: 'B.Tech for Working Professionals',
    category: 'engineering',
    badge: 'Trending',
    iconName: 'Settings',
    subtitle: 'Highly requested modular engineering degree with weekend classes, specifically crafted for working diploma executives.',
    duration: '3.5 - 4 Years',
    avgSalary: '9.8 LPA',
    topCareers: ['Manufacturing Manager', 'Operations Engineer', 'Production Specialist']
  },
  {
    id: 'part-time-btech',
    name: 'Part-Time B.Tech',
    category: 'engineering',
    badge: 'Popular',
    iconName: 'Cpu',
    subtitle: 'Flexible evening/weekend engineering schedule designed to balance practical lab work and active industry shifts.',
    duration: '4 Years',
    avgSalary: '8.4 LPA',
    topCareers: ['Quality Assurance Lead', 'Plant Engineer', 'Technical Analyst']
  },
  {
    id: 'btech-lateral-entry',
    name: 'B.Tech Lateral Entry',
    category: 'engineering',
    badge: 'Trending',
    iconName: 'Award',
    subtitle: 'Direct entry into 2nd year (3rd semester) of B.Tech for diploma holders to fast-track technical graduation.',
    duration: '3 Years',
    avgSalary: '8.2 LPA',
    topCareers: ['Maintenance Engineer', 'Design Architect', 'Site Controller']
  },
  {
    id: 'mtech',
    name: 'M.Tech',
    category: 'engineering',
    badge: 'Popular',
    iconName: 'Cpu',
    subtitle: 'Advanced Postgraduate engineering specializing in AI, Machine Learning, VLSI, or Structural Systems.',
    duration: '2 Years',
    avgSalary: '10.5 LPA',
    topCareers: ['Research & Development Lead', 'AI Engineer', 'Senior Systems Designer']
  }
];
