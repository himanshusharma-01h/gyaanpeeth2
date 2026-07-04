import { FirestoreUniversity, initialUniversities } from '../data/universitiesData';
import { University, UniversityType } from '../types';

const COLLECTION_NAME = 'universities';

// Helper function to dynamically construct safe and beautiful full fields for any university record
export function ensureUniversityFields(uni: any): University {
  if (!uni) return {} as University;

  const id = uni.id || 'unknown';
  const name = uni.name || "University";
  const logo = uni.logo || "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=150&h=150&q=80";
  const coverImage = uni.coverImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&h=400&q=80";
  
  // Cast type safely
  let type: UniversityType = 'Private';
  if (['Central', 'State', 'Private', 'Deemed', 'Online'].includes(uni.type)) {
    type = uni.type as UniversityType;
  }

  const location = uni.location || "India";
  const rating = Number(uni.rating) || 4.5;
  const reviewsCount = Number(uni.reviewsCount) || 120;
  const establishedYear = Number(uni.establishedYear) || 2010;
  const rank = uni.rank || "Tier 1 Accredited";
  const shortDesc = uni.shortDesc || `${name} offers accredited high-quality online degrees.`;
  const longDesc = uni.longDesc || `${name} is dedicated to bringing academic excellence to the digital sphere. Highly flexible online degrees designed specially for corporate professionals and students alike.`;
  const feeRange = uni.feeRange || "₹1.2L - ₹2.5L";
  
  // Safely parse accreditations
  let accreditedBy: string[] = [];
  if (Array.isArray(uni.accreditedBy)) {
    accreditedBy = uni.accreditedBy;
  } else if (typeof uni.accreditedBy === 'string') {
    accreditedBy = uni.accreditedBy.split(',').map((s: string) => s.trim()).filter(Boolean);
  } else {
    accreditedBy = ['UGC-DEB', 'AICTE', 'NAAC A+'];
  }

  const placementSalaryAvg = uni.placementSalaryAvg || "7.5 LPA";
  const placementPercentage = Number(uni.placementPercentage) || 90;

  const ugcApproved = uni.ugcApproved !== undefined ? !!uni.ugcApproved : true;
  const aicteApproved = uni.aicteApproved !== undefined ? !!uni.aicteApproved : true;
  const naacGrade = uni.naacGrade || "A+";

  // Safely parse top recruiters
  let topRecruiters: string[] = [];
  if (Array.isArray(uni.topRecruiters)) {
    topRecruiters = uni.topRecruiters;
  } else if (typeof uni.topRecruiters === 'string') {
    topRecruiters = uni.topRecruiters.split(',').map((s: string) => s.trim()).filter(Boolean);
  } else {
    topRecruiters = ['TCS', 'Cognizant', 'Wipro', 'Infosys'];
  }

  // Parse degrees for course generation fallback
  let degrees: string[] = [];
  if (Array.isArray(uni.degrees)) {
    degrees = uni.degrees;
  } else if (typeof uni.degrees === 'string') {
    degrees = uni.degrees.split(',').map((s: string) => s.trim()).filter(Boolean);
  } else {
    degrees = ['MBA', 'BCA', 'MCA', 'BBA'];
  }

  // Construct dynamic courses offered if missing
  const coursesOffered = (uni.coursesOffered && Array.isArray(uni.coursesOffered) && uni.coursesOffered.length > 0) 
    ? uni.coursesOffered 
    : degrees.map((deg: string) => ({
        courseId: `${id}-${deg.toLowerCase()}`,
        courseName: `Online ${deg}`,
        fee: feeRange,
        duration: deg === 'MBA' || deg === 'MCA' || deg === 'M.Tech' ? '2 Years' : '3 Years',
        eligibility: deg === 'MBA' || deg === 'MCA' || deg === 'M.Tech' ? 'Graduation with 50% marks' : '12th Pass with 50% marks'
      }));

  // Construct dynamic faculty members
  const faculty = (uni.faculty && Array.isArray(uni.faculty) && uni.faculty.length > 0) ? uni.faculty : [
    { name: 'Dr. Arvinder Singh', designation: 'Dean, Business School', qualification: 'Ph.D. in Management', experience: '18+ Years', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80' },
    { name: 'Dr. Meera Sen', designation: 'Head of Computer Applications', qualification: 'Ph.D. in CSE', experience: '15+ Years', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80' }
  ];

  // Construct dynamic gallery
  const gallery = (uni.gallery && Array.isArray(uni.gallery) && uni.gallery.length > 0) ? uni.gallery : [
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=400&q=80',
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&h=400&q=80',
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&w=600&h=400&q=80'
  ];

  // Construct dynamic FAQs
  const faqs = (uni.faqs && Array.isArray(uni.faqs) && uni.faqs.length > 0) ? uni.faqs : [
    { id: 'aq1', question: `Are ${name} degrees globally valid?`, answer: `Yes, ${name} degrees are fully approved by UGC-DEB and recognized globally by employers and public institutions.` },
    { id: 'aq2', question: 'What is the examination pattern?', answer: 'Examinations are conducted fully online through a secure proctored platform, allowing you to take them from home.' },
    { id: 'aq3', question: 'Does the university provide placement support?', answer: 'Yes, the university offers dedicated career services, resume guidance, and mock interviews alongside recruiter portal access.' }
  ];

  return {
    id,
    name,
    logo,
    coverImage,
    type,
    location,
    rating,
    reviewsCount,
    establishedYear,
    rank,
    shortDesc,
    longDesc,
    feeRange,
    accreditedBy,
    ugcApproved,
    aicteApproved,
    naacGrade,
    placementSalaryAvg,
    placementPercentage,
    topRecruiters,
    coursesOffered,
    faculty,
    gallery,
    faqs
  };
}

// Seed initial universities (noop or proxy to endpoint since Express backend handles this)
export async function seedUniversitiesIfEmpty(): Promise<FirestoreUniversity[]> {
  try {
    const res = await fetch('/api/universities');
    if (res.ok) {
      return await res.json();
    }
    return initialUniversities;
  } catch (error) {
    console.warn('Error during seeding or fetching universities:', error);
    return initialUniversities;
  }
}

// Fetch all universities from Express API
export async function getUniversities(): Promise<University[]> {
  try {
    const res = await fetch('/api/universities');
    if (res.ok) {
      const data = await res.json();
      return data.map(ensureUniversityFields);
    }
    throw new Error('Failed to fetch from /api/universities');
  } catch (error) {
    console.warn('Error getting universities, using fallback:', error);
    return initialUniversities.map(ensureUniversityFields);
  }
}

// Subscribe to real-time updates for universities using lightweight HTTP polling (every 4 seconds)
export function subscribeUniversities(callback: (unis: University[]) => void) {
  let active = true;

  const fetchUpdate = async () => {
    try {
      const res = await fetch('/api/universities');
      if (res.ok && active) {
        const data = await res.json();
        const list = data.map(ensureUniversityFields);
        if (list.length > 0) {
          callback(list);
          return;
        }
      }
    } catch (error) {
      console.warn('Real-time polling fetch failed, utilizing static fallback:', error);
    }
    if (active) {
      callback(initialUniversities.map(ensureUniversityFields));
    }
  };

  // Immediate fetch
  fetchUpdate();

  // Polling loop
  const intervalId = setInterval(fetchUpdate, 4000);

  // Return unsubscribe handler
  return () => {
    active = false;
    clearInterval(intervalId);
  };
}

// Add a new university via API
export async function addUniversity(uni: Omit<FirestoreUniversity, 'id'> & { id?: string }): Promise<string> {
  const id = uni.id || uni.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const response = await fetch('/api/universities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...uni, id })
  });
  if (!response.ok) {
    throw new Error('Failed to add university');
  }
  const saved = await response.json();
  return saved.id || id;
}

// Update an existing university via API
export async function updateUniversity(id: string, updates: Partial<FirestoreUniversity>): Promise<void> {
  const response = await fetch(`/api/universities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) {
    throw new Error('Failed to update university');
  }
}

// Delete a university via API
export async function removeUniversity(id: string): Promise<void> {
  const response = await fetch(`/api/universities/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete university');
  }
}
