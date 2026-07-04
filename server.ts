import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query 
} from "firebase/firestore";
import fs from "fs";
import { initialUniversities } from "./src/data/universitiesData";
import firebaseConfig from "./firebase-applet-config.json";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Initialize Firebase client SDK in Node.js
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || "(default)");

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please configure it in your Secrets/Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Shared Seed Data imported from ./src/data/universitiesData

const initialCourses = [
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

const initialReviews = [
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

const initialBlogs = [
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

const initialAdmissions = [
  {
    id: 'adm-1',
    name: 'Siddharth Roy',
    email: 'siddharth@example.com',
    phone: '9876543210',
    location: 'Mumbai',
    courseInterested: 'Online MBA',
    universityInterested: 'SVKM\'s NMIMS Online (NGASCE)',
    qualification: 'BBA Graduate (55%)',
    status: 'Pending',
    date: '2026-07-02'
  }
];

const initialHomepageContent = {
  announcement: "🔥 Admissions Open for Autumn 2026: Claim up to 50% tuition scholarship now!",
  tagline: "Your Gateway to Accredited Online Degrees",
  subTagline: "Compare & enroll in India's top UGC-DEB approved universities with transparent fee structures and 1-on-1 AI and expert physical counselling."
};

// ----------------------------------------------------
// FIRESTORE FALLBACK MANAGER & SEEDING
// ----------------------------------------------------

const memoryDb = {
  universities: JSON.parse(JSON.stringify(initialUniversities)),
  courses: JSON.parse(JSON.stringify(initialCourses)),
  blogs: JSON.parse(JSON.stringify(initialBlogs)),
  reviews: JSON.parse(JSON.stringify(initialReviews)),
  admissions: JSON.parse(JSON.stringify(initialAdmissions)),
  settings: {
    homepage: JSON.parse(JSON.stringify(initialHomepageContent))
  } as Record<string, any>
};

// Robust helper to get all documents from Firestore with memory fallback
async function safeGetDocs(collectionName: keyof typeof memoryDb) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const list: any[] = [];
    snapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sync to memoryDb to keep it warm if Firestore successfully returns data
    if (collectionName !== 'settings') {
      (memoryDb[collectionName] as any[]) = list;
    }
    return list;
  } catch (error: any) {
    console.warn(`[Firestore Fallback] Error fetching collection "${collectionName}", serving from in-memory cache:`, error.message);
    if (collectionName === 'settings') {
      return Object.entries(memoryDb.settings).map(([id, val]) => ({ id, ...val }));
    }
    return memoryDb[collectionName];
  }
}

// Robust helper to get a single document from Firestore with memory fallback
async function safeGetDoc(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      // Sync memory cache
      if (collectionName === 'settings') {
        memoryDb.settings[docId] = docSnap.data();
      } else {
        const arr = memoryDb[collectionName as keyof typeof memoryDb] as any[];
        if (arr) {
          const idx = arr.findIndex(item => item.id === docId);
          if (idx !== -1) {
            arr[idx] = data;
          } else {
            arr.push(data);
          }
        }
      }
      return data;
    }
    // Return null if document explicitly doesn't exist
    return null;
  } catch (error: any) {
    console.warn(`[Firestore Fallback] Error fetching doc ${collectionName}/${docId}, serving from in-memory cache:`, error.message);
    if (collectionName === 'settings') {
      return memoryDb.settings[docId] ? { id: docId, ...memoryDb.settings[docId] } : null;
    } else {
      const arr = memoryDb[collectionName as keyof typeof memoryDb] as any[];
      return arr ? arr.find(item => item.id === docId) || null : null;
    }
  }
}

// Robust helper to set/create a document
async function safeSetDoc(collectionName: string, docId: string, data: any) {
  const payload = { id: docId, ...data };
  
  // Always update memoryDb first
  if (collectionName === 'settings') {
    memoryDb.settings[docId] = data;
  } else {
    const arr = memoryDb[collectionName as keyof typeof memoryDb] as any[];
    if (arr) {
      const idx = arr.findIndex(item => item.id === docId);
      if (idx !== -1) {
        arr[idx] = payload;
      } else {
        arr.push(payload);
      }
    }
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, payload);
  } catch (error: any) {
    console.error(`[Firestore Fallback] Error setting doc ${collectionName}/${docId} in Firestore, saved in-memory only:`, error.message);
  }
  return payload;
}

// Robust helper to update a document
async function safeUpdateDoc(collectionName: string, docId: string, data: any) {
  let mergedPayload: any = null;
  if (collectionName === 'settings') {
    memoryDb.settings[docId] = { ...(memoryDb.settings[docId] || {}), ...data };
    mergedPayload = { id: docId, ...memoryDb.settings[docId] };
  } else {
    const arr = memoryDb[collectionName as keyof typeof memoryDb] as any[];
    if (arr) {
      const idx = arr.findIndex(item => item.id === docId);
      if (idx !== -1) {
        arr[idx] = { ...arr[idx], ...data };
        mergedPayload = arr[idx];
      } else {
        mergedPayload = { id: docId, ...data };
        arr.push(mergedPayload);
      }
    }
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error: any) {
    console.error(`[Firestore Fallback] Error updating doc ${collectionName}/${docId} in Firestore, updated in-memory only:`, error.message);
  }
  return mergedPayload;
}

// Robust helper to delete a document
async function safeDeleteDoc(collectionName: string, docId: string) {
  if (collectionName === 'settings') {
    delete memoryDb.settings[docId];
  } else {
    const arr = memoryDb[collectionName as keyof typeof memoryDb] as any[];
    if (arr) {
      const idx = arr.findIndex(item => item.id === docId);
      if (idx !== -1) {
        arr.splice(idx, 1);
      }
    }
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error(`[Firestore Fallback] Error deleting doc ${collectionName}/${docId} from Firestore, removed from in-memory:`, error.message);
  }
  return true;
}

// Seeding Sequence
async function seedCollection(collectionName: keyof typeof memoryDb, docIdKey: string, seedData: any[]) {
  try {
    const existing = await safeGetDocs(collectionName);
    if (existing.length === 0) {
      console.log(`[SEED] Seeding collection: ${collectionName}`);
      for (const item of seedData) {
        const docId = item[docIdKey] || `seed-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        await safeSetDoc(collectionName, docId, item);
      }
      console.log(`[SEED] Successfully seeded ${seedData.length} items into collection: ${collectionName}`);
    } else {
      console.log(`[SEED] Collection ${collectionName} already has ${existing.length} documents.`);
    }
  } catch (error: any) {
    console.error(`[SEED] Error seeding ${collectionName}:`, error.message);
  }
}

async function seedHomepage() {
  try {
    const existing = await safeGetDoc("settings", "homepage");
    if (!existing) {
      console.log("[SEED] Seeding homepageContent settings document...");
      await safeSetDoc("settings", "homepage", initialHomepageContent);
      console.log("[SEED] Successfully seeded homepage settings.");
    } else {
      console.log("[SEED] Homepage configuration document already exists.");
    }
  } catch (error: any) {
    console.error("[SEED] Error seeding homepage content settings:", error.message);
  }
}

async function runAutomaticDatabaseSeeding() {
  console.log("[SEED] Launching fault-tolerant automated database seed sequence...");
  await seedCollection("universities", "id", initialUniversities);
  await seedCollection("courses", "id", initialCourses);
  await seedCollection("blogs", "id", initialBlogs);
  await seedCollection("reviews", "id", initialReviews);
  await seedCollection("admissions", "id", initialAdmissions);
  await seedHomepage();
  console.log("[SEED] Database seed sequence finished.");
}

runAutomaticDatabaseSeeding().catch(err => {
  console.error("[SEED] Critical error in seeding database:", err);
});

// ----------------------------------------------------
// REST API PROXY TO FIRESTORE WITH RESILIENT FALLBACKS
// ----------------------------------------------------

// 1. Universities REST Endpoints
app.get("/api/universities", async (req, res) => {
  try {
    const list = await safeGetDocs("universities");
    res.json(list);
  } catch (err: any) {
    console.error("GET /api/universities error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/universities/:id", async (req, res) => {
  try {
    const uni = await safeGetDoc("universities", req.params.id);
    if (uni) {
      res.json(uni);
    } else {
      res.status(404).json({ error: "University not found" });
    }
  } catch (err: any) {
    console.error("GET /api/universities/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/universities", async (req, res) => {
  try {
    const newId = req.body.id || `uni-${Date.now()}`;
    const payload = await safeSetDoc("universities", newId, req.body);
    res.status(201).json(payload);
  } catch (err: any) {
    console.error("POST /api/universities error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/universities/:id", async (req, res) => {
  try {
    const merged = await safeUpdateDoc("universities", req.params.id, req.body);
    res.json(merged);
  } catch (err: any) {
    console.error("PUT /api/universities/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/universities/:id", async (req, res) => {
  try {
    await safeDeleteDoc("universities", req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/universities/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Courses REST Endpoints
app.get("/api/courses", async (req, res) => {
  try {
    const list = await safeGetDocs("courses");
    res.json(list);
  } catch (err: any) {
    console.error("GET /api/courses error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/courses", async (req, res) => {
  try {
    const newId = req.body.id || `course-${Date.now()}`;
    const payload = await safeSetDoc("courses", newId, req.body);
    res.status(201).json(payload);
  } catch (err: any) {
    console.error("POST /api/courses error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/courses/:id", async (req, res) => {
  try {
    const merged = await safeUpdateDoc("courses", req.params.id, req.body);
    res.json(merged);
  } catch (err: any) {
    console.error("PUT /api/courses/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/courses/:id", async (req, res) => {
  try {
    await safeDeleteDoc("courses", req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/courses/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Reviews REST Endpoints
app.get("/api/reviews", async (req, res) => {
  try {
    const list = await safeGetDocs("reviews");
    res.json(list);
  } catch (err: any) {
    console.error("GET /api/reviews error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const newId = `rev-${Date.now()}`;
    const newReview = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
      ...req.body
    };
    await safeSetDoc("reviews", newId, newReview);

    // Recalculate and update university statistics (rating and reviewsCount)
    const uniId = req.body.universityId;
    if (uniId) {
      const allReviews = await safeGetDocs("reviews");
      const uniReviews = allReviews.filter(r => r.universityId === uniId);
      if (!uniReviews.some(r => r.id === newId)) {
        uniReviews.push(newReview);
      }
      
      const sum = uniReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
      const rating = uniReviews.length > 0 ? parseFloat((sum / uniReviews.length).toFixed(1)) : 4.5;
      const reviewsCount = uniReviews.length;

      await safeUpdateDoc("universities", uniId, { rating, reviewsCount });
    }

    res.status(201).json(newReview);
  } catch (err: any) {
    console.error("POST /api/reviews error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const review = await safeGetDoc("reviews", req.params.id);
    const uniId = review ? review.universityId : "";
    
    await safeDeleteDoc("reviews", req.params.id);

    // Recalculate university stats after deletion
    if (uniId) {
      const allReviews = await safeGetDocs("reviews");
      const uniReviews = allReviews.filter(r => r.universityId === uniId);

      const sum = uniReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
      const rating = uniReviews.length > 0 ? parseFloat((sum / uniReviews.length).toFixed(1)) : 4.5;
      const reviewsCount = uniReviews.length;

      await safeUpdateDoc("universities", uniId, { rating, reviewsCount });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/reviews/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Blogs REST Endpoints
app.get("/api/blogs", async (req, res) => {
  try {
    const list = await safeGetDocs("blogs");
    res.json(list);
  } catch (err: any) {
    console.error("GET /api/blogs error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const newId = `blog-${Date.now()}`;
    const newBlog = {
      id: newId,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      ...req.body
    };
    await safeSetDoc("blogs", newId, newBlog);
    res.status(201).json(newBlog);
  } catch (err: any) {
    console.error("POST /api/blogs error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/blogs/:id", async (req, res) => {
  try {
    const merged = await safeUpdateDoc("blogs", req.params.id, req.body);
    res.json(merged);
  } catch (err: any) {
    console.error("PUT /api/blogs/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    await safeDeleteDoc("blogs", req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/blogs/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Admissions Inquiries REST Endpoints
app.get("/api/admissions", async (req, res) => {
  try {
    const list = await safeGetDocs("admissions");
    res.json(list);
  } catch (err: any) {
    console.error("GET /api/admissions error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admissions", async (req, res) => {
  try {
    const newId = `adm-${Date.now()}`;
    const newInquiry = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...req.body
    };
    await safeSetDoc("admissions", newId, newInquiry);
    res.status(201).json(newInquiry);
  } catch (err: any) {
    console.error("POST /api/admissions error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admissions/:id", async (req, res) => {
  try {
    const merged = await safeUpdateDoc("admissions", req.params.id, req.body);
    res.json(merged);
  } catch (err: any) {
    console.error("PUT /api/admissions/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admissions/:id", async (req, res) => {
  try {
    await safeDeleteDoc("admissions", req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/admissions/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Homepage Layout Settings Endpoints
app.get("/api/homepage-content", async (req, res) => {
  try {
    const homepage = await safeGetDoc("settings", "homepage");
    if (homepage) {
      const { id, ...data } = homepage;
      res.json(data);
    } else {
      res.json(initialHomepageContent);
    }
  } catch (err: any) {
    console.error("GET /api/homepage-content error:", err);
    res.json(initialHomepageContent);
  }
});

app.put("/api/homepage-content", async (req, res) => {
  try {
    await safeSetDoc("settings", "homepage", req.body);
    res.json(req.body);
  } catch (err: any) {
    console.error("PUT /api/homepage-content error:", err);
    res.status(500).json({ error: err.message });
  }
});

// AI Chat Counselor using Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemInstruction = `You are "GyaanPeeth AI", a premium, warm, highly elite, and deeply knowledgeable AI Education Counsellor for GyaanPeeth.
Your purpose is to help students, working professionals, and parents discover and compare accredited online and distance education programs in India (such as Online MBA, MCA, BCA, B.Tech, BBA, etc.).

We currently feature elite universities:
1. Amity University Online (Noida) - Private, UGC-DEB, AICTE, NAAC A+. Premium LMS, globally recognized. Approx Fees: ₹1.4L - ₹3.5L. Outstanding brand name.
2. SVKM's NMIMS Online (Mumbai) - Deemed, AACSB accredited (highly prestigious), NAAC A+. Best for Business Administration/MBA/PGDBM. Approx Fees: ₹1.6L - ₹3.2L.
3. Lovely Professional University Online (LPU) - Private, UGC-DEB, NAAC A++. Excellent budget/value choice with LPU e-Connect tech. Approx Fees: ₹80k - ₹1.8L.

If users ask for official contact info, support details, office hours, or locations, use these details:
- Official Phone: +91 8239697999 (also available for WhatsApp)
- Official Email: gyaanpeethinfo@gmail.com
- Registered Office Address: Shop No 2nd, 35 Ext Subhash Nagar, Near Ajmer Road, Bhilwara, Rajasthan 311001
- Office Hours: Monday to Saturday, 9:00 AM to 6:00 PM (Closed on Sundays)
- Google Maps Location Plus Code: 9J6H+8CC, Baba Dham Rd, Gayatri Nagar, Subhash Nagar, Bhilwara, Rajasthan 311001

Be empathetic, concise, and professional. Adopt a luxurious, encouraging, and advisory tone. Avoid heavy blocks of text; use neat bullet points and brief comparative tables where appropriate.
If a student asks which is better, provide an objective, comparative analysis of features, fees, or accreditation, highlighting that NMIMS is supreme for elite business degrees, Amity is universally accepted with elite learning tracks, and LPU offers premium tech at an extremely attractive value.
Always guide them to fill out the Admission Enquiry/Form or speak with our expert human counsellors on GyaanPeeth. Do NOT refer to system technical details.`;

    // Try utilizing the server-side Gemini Client
    const ai = getGeminiClient();
    
    // Map history elements into structured Chat Content
    const chatHistory = (history || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Generate output content
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...chatHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I apologize, I am processing your guidance query. Please fill our free advisory form on the platform to get instant expert guidance.";
    res.json({ reply });
  } catch (err: any) {
    console.error("Gemini Counsellor Chat Error:", err);
    res.status(500).json({ 
      error: "AI Counselling service is initializing. In the meantime, feel free to explore our Compare Colleges tool or submit an Admission Form for expert human counseling!", 
      details: err.message 
    });
  }
});

// Vite middleware and static delivery integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GyaanPeeth Platform server running on http://0.0.0.0:${PORT}`);
  });
}

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('server.ts') || 
  process.argv[1].endsWith('server.js') || 
  process.argv[1].endsWith('server.cjs') ||
  process.argv[1].endsWith('dist/server.cjs')
);

if (isDirectRun && !process.env.VERCEL) {
  startServer();
}

export default app;
