export type UniversityType = 'Central' | 'State' | 'Private' | 'Deemed' | 'Online';

export interface Course {
  id: string;
  name: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Diploma';
  duration: string;
  category: 'MBA' | 'BCA' | 'MCA' | 'B.Tech' | 'M.Tech' | 'BBA' | 'BA' | 'MA' | 'Diploma';
  fee: string;
  description: string;
  syllabus: string[];
  careerProspects: string[];
}

export interface FacultyMember {
  name: string;
  designation: string;
  qualification: string;
  experience: string;
  image: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface University {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  type: UniversityType;
  location: string;
  rating: number;
  reviewsCount: number;
  establishedYear: number;
  rank: string;
  shortDesc: string;
  longDesc: string;
  feeRange: string;
  accreditedBy: string[]; // UGC, AICTE, DEB, NAAC A+, etc.
  ugcApproved?: boolean;
  aicteApproved?: boolean;
  naacGrade?: string;
  placementSalaryAvg: string; // e.g., "7.5 LPA"
  placementPercentage: number; // e.g., 92
  topRecruiters: string[];
  coursesOffered: {
    courseId: string;
    courseName: string;
    fee: string;
    duration: string;
    eligibility: string;
  }[];
  faculty: FacultyMember[];
  gallery: string[];
  faqs: FAQ[];
}

export interface Review {
  id: string;
  universityId: string;
  universityName: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

export interface AdmissionInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  courseInterested: string;
  universityInterested: string;
  qualification: string;
  status: 'Pending' | 'Contacted' | 'Admitted' | 'Rejected';
  date: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
