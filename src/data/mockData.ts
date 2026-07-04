import { University, Course, Review, Blog } from '../types';

export const mockCourses: Course[] = [
  {
    id: 'mba',
    name: 'Online Master of Business Administration (MBA)',
    level: 'Postgraduate',
    duration: '2 Years',
    category: 'MBA',
    fee: '₹1,50,000 - ₹3,50,000',
    description: 'A premium 2-year post-graduate degree designed to equip you with advanced business management, strategy, and analytical leadership expertise.',
    syllabus: [
      'Semester 1: Management Process, Organizational Behavior, Business Economics, Financial Accounting',
      'Semester 2: Human Resource Management, Marketing Management, Operations Strategy, Financial Management',
      'Semester 3: Strategic Management, Specialization Electives (Finance/Marketing/HRM), Entrepreneurship',
      'Semester 4: Project Work, International Business, Corporate Governance, Final Electives'
    ],
    careerProspects: ['Marketing Manager', 'Investment Banker', 'Management Consultant', 'HR Director', 'Operations Head']
  },
  {
    id: 'bca',
    name: 'Online Bachelor of Computer Applications (BCA)',
    level: 'Undergraduate',
    duration: '3 Years',
    category: 'BCA',
    fee: '₹1,20,000 - ₹2,20,000',
    description: 'A comprehensive 3-year undergraduate course preparing students for a high-flying career in IT, software development, cloud systems, and database management.',
    syllabus: [
      'Semester 1: Computer Fundamentals, Programming in C, Mathematical Foundation, Communication Skills',
      'Semester 2: Data Structures using C, Object-Oriented Programming (C++), Operating Systems',
      'Semester 3: Database Management Systems (DBMS), Web Technologies, Java Programming',
      'Semester 4: Software Engineering, Computer Networks, Python Programming, Electives',
      'Semester 5: Cloud Computing, Mobile Application Development, Information Security',
      'Semester 6: Final Industry Project, AI & Machine Learning Basics, E-commerce Platforms'
    ],
    careerProspects: ['Software Developer', 'Web Specialist', 'System Administrator', 'Database Administrator', 'Cloud Engineer']
  },
  {
    id: 'mca',
    name: 'Online Master of Computer Applications (MCA)',
    level: 'Postgraduate',
    duration: '2 Years',
    category: 'MCA',
    fee: '₹1,60,000 - ₹2,80,000',
    description: 'A premium 2-year postgraduate program focused on advanced application development, big data analytics, AI, and enterprise networking.',
    syllabus: [
      'Semester 1: Advanced Java Programming, Computer Architecture, Data Structures & Algorithms, Network Security',
      'Semester 2: Web Frameworks (Node/React), Big Data Analytics, Database Administration, Cloud Security',
      'Semester 3: Artificial Intelligence, Deep Learning, DevOps Engineering, Elective Specializations',
      'Semester 4: Major Capstone Project, Blockchain Fundamentals, Mobile Computing Architecture'
    ],
    careerProspects: ['Full Stack Developer', 'Data Scientist', 'DevOps Specialist', 'AI Engineer', 'Technical Architect']
  },
  {
    id: 'btech',
    name: 'Bachelor of Technology (B.Tech - Work Integrated)',
    level: 'Undergraduate',
    duration: '4 Years',
    category: 'B.Tech',
    fee: '₹2,50,000 - ₹4,50,000',
    description: 'Work-integrated learning program designed for working professionals to earn a regular engineering degree alongside their current job commitments.',
    syllabus: [
      'Year 1: Applied Mathematics, Engineering Physics, Programming Basics, Basic Electrical & Electronics',
      'Year 2: Data Structures, Digital Logic Design, Object-Oriented Software Design, Discrete Mathematics',
      'Year 3: Design & Analysis of Algorithms, Database Systems, Computer Architecture, Industry Core Lab',
      'Year 4: Microprocessors, Software Engineering Methodologies, Industrial Project, Electives'
    ],
    careerProspects: ['Systems Engineer', 'Network Architect', 'Embedded Systems Engineer', 'R&D Analyst']
  },
  {
    id: 'bba',
    name: 'Online Bachelor of Business Administration (BBA)',
    level: 'Undergraduate',
    duration: '3 Years',
    category: 'BBA',
    fee: '₹90,000 - ₹1,80,000',
    description: 'A 3-year foundational program that builds an all-round business acumen, commercial knowledge, and strong organizational communication abilities.',
    syllabus: [
      'Semester 1: Principles of Management, Business Economics, Accounting Fundamentals, Business English',
      'Semester 2: Organizational Behavior, Business Law, Quantitative Methods, Marketing Basics',
      'Semester 3: Financial Management, Human Resource Basics, Business Statistics, Marketing Analytics',
      'Semester 4: Production & Operations Management, Consumer Behavior, Research Methodology',
      'Semester 5: Entrepreneurship Development, International Business Basics, Elective I',
      'Semester 6: Strategic Management, Corporate Ethics, Final Internship Project Report'
    ],
    careerProspects: ['Business Analyst', 'Relationship Manager', 'Marketing Executive', 'Corporate Recruiter', 'Sales Supervisor']
  }
];

export const mockUniversities: University[] = [
  {
    id: 'amity-online',
    name: 'Amity University Online',
    logo: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&w=150&h=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&h=400&q=80',
    type: 'Private',
    location: 'Noida, Delhi NCR',
    rating: 4.8,
    reviewsCount: 1420,
    establishedYear: 2005,
    rank: 'NIRF Rank 35 (Overall)',
    shortDesc: 'Amity Online is India\'s first university to receive UGC and DEB approval for fully online educational degrees, globally recognized and top-rated.',
    longDesc: 'Amity University Online is devoted to bringing academic excellence to the digital sphere. It offers fully accredited undergraduate, postgraduate, and diploma courses tailored to provide students worldwide with high-quality education, supported by an advanced LMS platform, top corporate placement networks, and an elite faculty panel.',
    feeRange: '₹1,40,000 - ₹3,50,000',
    accreditedBy: ['UGC-DEB', 'AICTE', 'WASC (USA)', 'NAAC A+'],
    placementSalaryAvg: '8.2 LPA',
    placementPercentage: 94,
    topRecruiters: ['TATA Consultancy Services', 'Capgemini', 'Cognizant', 'HDFC Bank', 'Adobe', 'Amazon'],
    coursesOffered: [
      { courseId: 'mba', courseName: 'Online MBA', fee: '₹3,50,000', duration: '2 Years', eligibility: 'Graduation with 50% marks' },
      { courseId: 'bca', courseName: 'Online BCA', fee: '₹2,20,000', duration: '3 Years', eligibility: '12th Class Pass' },
      { courseId: 'mca', courseName: 'Online MCA', fee: '₹2,50,000', duration: '2 Years', eligibility: 'Graduation with Maths at 12th/Grad level' },
      { courseId: 'bba', courseName: 'Online BBA', fee: '₹1,80,000', duration: '3 Years', eligibility: '12th Class Pass' }
    ],
    faculty: [
      { name: 'Dr. Priya Sharma', designation: 'Professor & Dean', qualification: 'Ph.D. in Management, IIM Ahmedabad', experience: '18 Years', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80' },
      { name: 'Dr. Amit Varma', designation: 'Associate Professor', qualification: 'Ph.D. in Computer Science, IIT Delhi', experience: '12 Years', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&w=600&h=400&q=80'
    ],
    faqs: [
      { id: 'aq1', question: 'Are Amity Online degrees globally valid?', answer: 'Yes, Amity University Online degrees are fully approved by UGC-DEB and recognized globally by WES (USA/Canada) and top-tier companies.' },
      { id: 'aq2', question: 'What is the examination pattern?', answer: 'Examinations are conducted fully online through a proctored mode, allowing students to securely take exams from home.' }
    ]
  },
  {
    id: 'nmims-online',
    name: 'SVKM\'s NMIMS Online (NGASCE)',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=150&h=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&h=400&q=80',
    type: 'Deemed',
    location: 'Mumbai, Maharashtra',
    rating: 4.7,
    reviewsCount: 980,
    establishedYear: 1981,
    rank: 'Category I Autonomy status by UGC',
    shortDesc: 'NMIMS School of Distance & Online Education is the absolute benchmark for executive MBA and technical business management programs in India.',
    longDesc: 'SVKM\'s NMIMS is one of the top business schools in the country. Its online arm brings the same rigorous corporate curriculum, case studies, live industry sessions, and premium dual-specialization degree modules right to the devices of working executives and students.',
    feeRange: '₹1,60,000 - ₹3,20,000',
    accreditedBy: ['UGC-DEB', 'AACSB (Elite)', 'NAAC A+'],
    placementSalaryAvg: '9.0 LPA',
    placementPercentage: 91,
    topRecruiters: ['ICICI Bank', 'Dell', 'Reliance Industries', 'Tata Motors', 'Microsoft', 'Goldman Sachs'],
    coursesOffered: [
      { courseId: 'mba', courseName: 'Post Graduate Diploma (Online MBA Equivalent)', fee: '₹2,00,000', duration: '2 Years', eligibility: 'Graduation with 50% or work exp' },
      { courseId: 'bba', courseName: 'Online BBA', fee: '₹1,50,000', duration: '3 Years', eligibility: '12th with 50% marks' }
    ],
    faculty: [
      { name: 'Prof. Rajesh Kher', designation: 'HOD - Financial Markets', qualification: 'MBA - Finance, London Business School', experience: '22 Years', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1501290791795-140a4ab2570b?auto=format&fit=crop&w=600&h=400&q=80'
    ],
    faqs: [
      { id: 'nq1', question: 'Does NMIMS offer placement assistance?', answer: 'Yes, NMIMS Online provides a premium Career Services portal offering mock interviews, CV building sessions, and access to a massive corporate recruiter base.' }
    ]
  },
  {
    id: 'lpu-online',
    name: 'Lovely Professional University Online',
    logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=150&h=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&h=400&q=80',
    type: 'Private',
    location: 'Jalandhar, Punjab',
    rating: 4.6,
    reviewsCount: 840,
    establishedYear: 2005,
    rank: 'NIRF Rank 47 (Overall)',
    shortDesc: 'LPU Online brings award-winning infrastructure and incredibly affordable high-tech distance learning options to millions of aspirants nationwide.',
    longDesc: 'Lovely Professional University is renowned for its vast campus and tech-enabled ecosystems. Its Online Education division delivers structured, affordable, and flexible learning options utilizing its award-winning LPU e-Connect app with continuous academic mentorship and robust placements.',
    feeRange: '₹80,000 - ₹1,80,000',
    accreditedBy: ['UGC-DEB', 'AICTE', 'WES Accredited', 'NAAC A++'],
    placementSalaryAvg: '6.2 LPA',
    placementPercentage: 88,
    topRecruiters: ['Cognizant', 'Amazon', 'Wipro', 'HCL', 'Capgemini', 'IBM'],
    coursesOffered: [
      { courseId: 'mba', courseName: 'Online MBA', fee: '₹1,50,000', duration: '2 Years', eligibility: 'Graduation pass' },
      { courseId: 'bca', courseName: 'Online BCA', fee: '₹1,10,000', duration: '3 Years', eligibility: '12th Pass' },
      { courseId: 'mca', courseName: 'Online MCA', fee: '₹1,40,000', duration: '2 Years', eligibility: 'BCA or relevant grad' },
      { courseId: 'bba', courseName: 'Online BBA', fee: '₹98,000', duration: '3 Years', eligibility: '12th Pass' }
    ],
    faculty: [
      { name: 'Dr. Gurbir Singh', designation: 'Sr. Professor', qualification: 'Ph.D. in IT, IISc Bangalore', experience: '15 Years', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&h=400&q=80',
      'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=600&h=400&q=80'
    ],
    faqs: [
      { id: 'lq1', question: 'What is the LPU Online LMS like?', answer: 'It uses LPU e-Connect, which has highly responsive dashboards, scheduled live lectures, recorded clips, and downloadable course guides.' }
    ]
  }
];

export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    universityId: 'amity-online',
    universityName: 'Amity University Online',
    userName: 'Rohan Deshmukh',
    rating: 5,
    date: '2026-05-12',
    comment: 'Exceptional curriculum! Being a full-time software developer, this Online MCA program was perfectly paced for my career growth. Highly recommended!',
    isVerified: true
  },
  {
    id: 'rev-2',
    universityId: 'nmims-online',
    universityName: 'SVKM\'s NMIMS Online',
    userName: 'Sneha Paul',
    rating: 5,
    date: '2026-06-01',
    comment: 'The corporate network, the mock interviews, and the study materials are of absolute world-class standard. Fully worth the premium fees.',
    isVerified: true
  },
  {
    id: 'rev-3',
    universityId: 'lpu-online',
    universityName: 'LPU Online',
    userName: 'Anil Kumar',
    rating: 4,
    date: '2026-06-15',
    comment: 'Very cost-effective online platform. The e-Connect app is smooth and the recorded lectures are extremely clear.',
    isVerified: true
  }
];

export const mockBlogs: Blog[] = [
  {
    id: 'blog-1',
    title: 'Top Online MBA Specializations to Accelerate Your Career in 2026',
    excerpt: 'Analyze the highly demanded specializations in Online MBA programs, from Business Analytics to Fintech, and choose the perfect fit.',
    content: 'The digital revolution has transformed traditional education systems. Today, an Online MBA is no longer considered a lesser alternative to a full-time classroom MBA, but rather a strategic corporate launching pad for professionals... In this article we outline Finance, Digital Marketing, Operations Management, and Big Data Analytics specializations to help you chart a highly rewarding trajectory.',
    category: 'Career Guide',
    author: 'Counselling Advisory Board',
    date: 'June 20, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&h=500&q=80',
    tags: ['MBA', 'Career Guidance', 'Online Degree']
  },
  {
    id: 'blog-2',
    title: 'UGC-DEB Accredited Online Degrees vs Regular Degrees: The Ultimate Truth',
    excerpt: 'Uncover the facts around UGC validation, hiring manager perspectives, and whether online courses carry equal weight in corporate placements.',
    content: 'One of the most persistent queries amongst students is: "Will my online degree be accepted by MNCs?" The answer is a resounding YES. According to the latest notifications from the Ministry of Education, degrees earned via online and distance learning formats from recognized UGC-DEB universities carry equal weight and validation for public sector exams, higher education admissions, and private recruitment...',
    category: 'Accreditation',
    author: 'Prof. S. R. Varma',
    date: 'June 28, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&h=500&q=80',
    tags: ['UGC-DEB', 'Accreditation', 'Education Policy']
  }
];
