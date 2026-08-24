/**
 * Centralized API Client Module for Decoupled Laravel 11 Backend & CMS
 */

export interface PracticeArea {
  id: number;
  title: string;
  slug: string;
  icon?: string;
  short_summary: string;
  description: string;
  is_featured: boolean;
  parent_id?: number | null;
  parent?: PracticeArea;
  children?: PracticeArea[];
  attorneys?: Attorney[];
  case_results?: CaseResult[];
  leads_count?: number;
  attorneys_count?: number;
  created_at?: string;
}

export interface Attorney {
  id: number;
  name: string;
  slug: string;
  designation: string;
  email: string;
  phone?: string;
  photo_url?: string;
  bio: string;
  bar_admissions: string[];
  education: string[];
  social_links?: Record<string, string>;
  is_active: boolean;
  practice_areas?: PracticeArea[];
  practice_area_ids?: number[];
  case_results?: CaseResult[];
  created_at?: string;
}

export interface CaseResult {
  id: number;
  title: string;
  slug: string;
  settlement_verdict: string;
  practice_area_id: number;
  practice_area?: PracticeArea;
  lead_attorney_id: number;
  lead_attorney?: Attorney;
  summary: string;
  case_year: number;
  created_at?: string;
}

export interface ConsultationLead {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  practice_area_id?: number | null;
  practice_area?: PracticeArea;
  case_details: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'closed';
  source: string;
  created_at: string;
}

export interface FirmStats {
  recovered_amount: string;
  success_rate: string;
  years_experience: string;
  cases_resolved: string;
  active_attorneys: number;
  practice_areas: number;
  landmark_verdicts: number;
}

export interface AdminAnalyticsData {
  leads_total: number;
  leads_pending: number;
  leads_contacted: number;
  leads_scheduled: number;
  leads_closed: number;
  conversion_rate: string;
  practice_areas_total: number;
  attorneys_total: number;
  attorneys_active: number;
  case_results_total: number;
  practice_distribution: {
    id: number;
    title: string;
    slug: string;
    leads_count: number;
    attorneys_count: number;
  }[];
  recent_activity: ConsultationLead[];
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: Record<string, unknown>;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Resilient fetch wrapper with cache revalidation
async function fetchApi<T>(endpoint: string, options?: RequestInit & { revalidate?: number }): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const revalidate = options?.revalidate ?? 60;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: { revalidate },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || `API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`[API Fetch Failed] ${endpoint}:`, error);
    throw error;
  }
}

// Fallback Mock Data for SSR / SSG resilience
const FALLBACK_STATS: FirmStats = {
  recovered_amount: "$250M+",
  success_rate: "98.6%",
  years_experience: "35+",
  cases_resolved: "5,200+",
  active_attorneys: 4,
  practice_areas: 8,
  landmark_verdicts: 7,
};

const FALLBACK_PRACTICE_AREAS: PracticeArea[] = [
  {
    id: 1,
    title: "Corporate Law & M&A",
    slug: "corporate-law-mergers",
    icon: "Briefcase",
    short_summary: "Comprehensive counsel on complex mergers, cross-border acquisitions, joint ventures, and regulatory corporate governance.",
    description: "Our Corporate and Mergers & Acquisitions practice delivers sophisticated legal strategies for Fortune 500 corporations, private equity funds, and emerging market leaders.",
    is_featured: true,
  },
  {
    id: 3,
    title: "Personal Injury & Catastrophic Harm",
    slug: "personal-injury-catastrophic",
    icon: "ShieldAlert",
    short_summary: "Tenacious trial advocacy for victims of severe truck collisions, traumatic brain injuries, and industrial workplace disasters.",
    description: "When catastrophic injury alters lives, our premier trial litigators step in to level the playing field against billion-dollar insurance conglomerates.",
    is_featured: true,
  },
  {
    id: 5,
    title: "Intellectual Property & Patents",
    slug: "intellectual-property-patents",
    icon: "Award",
    short_summary: "Protecting high-tech patent portfolios, proprietary trade secrets, trademarks, and federal PTAB litigation.",
    description: "In an era of relentless digital disruption, your intellectual capital is your most valuable asset.",
    is_featured: true,
  },
  {
    id: 6,
    title: "White Collar & Investigations",
    slug: "white-collar-criminal-defense",
    icon: "Gavel",
    short_summary: "Discreet, formidable defense against SEC, FINRA, FBI, and congressional investigations for executives and institutions.",
    description: "Led by former federal prosecutors and seasoned trial litigators, our White Collar Defense group provides elite counsel.",
    is_featured: true,
  },
  {
    id: 7,
    title: "Commercial Real Estate & Land Use",
    slug: "commercial-real-estate-development",
    icon: "Building2",
    short_summary: "End-to-end legal structuring for commercial zoning, institutional acquisitions, syndications, and construction disputes.",
    description: "We guide real estate developers, REITs, and institutional lenders through multi-parcel site acquisitions.",
    is_featured: true,
  },
  {
    id: 8,
    title: "Executive Employment & Labor",
    slug: "employment-labor-arbitration",
    icon: "Users",
    short_summary: "Resolving C-suite severance, non-compete disputes, workplace discrimination, and FLSA collective defense.",
    description: "Our employment attorneys counsel boards and executives in structuring golden parachute packages.",
    is_featured: true,
  },
];

const FALLBACK_ATTORNEYS: Attorney[] = [
  {
    id: 1,
    name: "Jonathan Sterling, Esq.",
    slug: "jonathan-sterling",
    designation: "Senior Managing Partner",
    email: "j.sterling@apexlegal.com",
    phone: "+1 (212) 890-4401",
    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    bio: "Jonathan Sterling has spent over 28 years commanding the boardrooms and federal courts of New York and Washington D.C.",
    bar_admissions: ["New York State Bar (1996)", "U.S. District Court, Southern District of New York", "District of Columbia Bar"],
    education: ["J.D., Columbia Law School (Harlan Fiske Stone Scholar)", "B.A. in Economics, Dartmouth College"],
    is_active: true,
  },
  {
    id: 2,
    name: "Eleanor Vance, J.D.",
    slug: "eleanor-vance",
    designation: "Partner & Chair of Trial Litigation",
    email: "e.vance@apexlegal.com",
    phone: "+1 (212) 890-4402",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    bio: "Eleanor Vance is one of the nation's most formidable personal injury and catastrophic trial lawyers.",
    bar_admissions: ["New York State Bar (2004)", "U.S. District Court, Eastern District of New York"],
    education: ["J.D., Harvard Law School (Editor, Harvard Law Review)", "B.S. in Biology, Yale University"],
    is_active: true,
  },
  {
    id: 3,
    name: "Marcus A. Croft",
    slug: "marcus-croft",
    designation: "Partner, IP & Tech Innovation",
    email: "m.croft@apexlegal.com",
    phone: "+1 (212) 890-4403",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    bio: "Marcus Croft bridges cutting-edge Silicon Valley computer science with aggressive intellectual property defense.",
    bar_admissions: ["California State Bar (2009)", "USPTO Registered Patent Attorney"],
    education: ["J.D., Stanford Law School", "M.S. in Computer Science, MIT"],
    is_active: true,
  },
  {
    id: 4,
    name: "Hon. Victoria Hayes",
    slug: "victoria-hayes",
    designation: "Partner, White-Collar Defense",
    email: "v.hayes@apexlegal.com",
    phone: "+1 (212) 890-4404",
    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    bio: "A former Assistant United States Attorney (AUSA) for SDNY, Victoria Hayes provides unmatched strategic counsel.",
    bar_admissions: ["New York State Bar (2001)", "U.S. Supreme Court Bar"],
    education: ["J.D., NYU School of Law (Vanderbilt Scholar)", "B.A., Georgetown University"],
    is_active: true,
  },
];

const FALLBACK_CASE_RESULTS: CaseResult[] = [
  {
    id: 1,
    title: "Cross-Border Semiconductor Acquisition Clearance & Antitrust Immunity",
    slug: "semiconductor-acquisition-clearance",
    settlement_verdict: "$1.2B Transaction Clearance",
    practice_area_id: 1,
    lead_attorney_id: 1,
    summary: "Secured unconditional FTC and international regulatory clearance for a major tech merger.",
    case_year: 2024,
  },
  {
    id: 2,
    title: "Commercial Trucking Multi-Vehicle Highway Collision Verdict",
    slug: "commercial-trucking-collision-verdict",
    settlement_verdict: "$14,250,000 Jury Verdict",
    practice_area_id: 3,
    lead_attorney_id: 2,
    summary: "Won landmark jury verdict against an interstate freight carrier for traumatic brain injury.",
    case_year: 2023,
  },
  {
    id: 3,
    title: "Global SaaS Trade Secret Misappropriation & Injunction Recovery",
    slug: "saas-trade-secret-injunction-recovery",
    settlement_verdict: "$22,400,000 Recovery & Injunction",
    practice_area_id: 5,
    lead_attorney_id: 3,
    summary: "Obtained emergency federal TRO and permanent injunction along with $22.4M settlement.",
    case_year: 2024,
  },
];

// Public Services
export async function getFirmStats(): Promise<FirmStats> {
  try {
    const res = await fetchApi<{ success: boolean; data: FirmStats }>('/stats', { revalidate: 300 });
    return res.data;
  } catch {
    return FALLBACK_STATS;
  }
}

export async function getPracticeAreas(params?: { featured?: boolean; rootOnly?: boolean }): Promise<PracticeArea[]> {
  try {
    const query = new URLSearchParams();
    if (params?.featured) query.set('featured', '1');
    if (params?.rootOnly) query.set('root_only', '1');
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await fetchApi<{ data: PracticeArea[] }>(`/practice-areas${queryString}`, { revalidate: 60 });
    return res.data || [];
  } catch {
    return params?.featured ? FALLBACK_PRACTICE_AREAS.filter(p => p.is_featured) : FALLBACK_PRACTICE_AREAS;
  }
}

export async function getPracticeAreaBySlug(slug: string): Promise<PracticeArea | null> {
  try {
    const res = await fetchApi<{ success: boolean; data: PracticeArea }>(`/practice-areas/${slug}`, { revalidate: 60 });
    return res.data;
  } catch {
    return FALLBACK_PRACTICE_AREAS.find(p => p.slug === slug) || null;
  }
}

export async function getAttorneys(params?: { practiceAreaSlug?: string }): Promise<Attorney[]> {
  try {
    const query = new URLSearchParams();
    if (params?.practiceAreaSlug) query.set('practice_area_slug', params.practiceAreaSlug);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await fetchApi<{ data: Attorney[] }>(`/attorneys${queryString}`, { revalidate: 60 });
    return res.data || [];
  } catch {
    return FALLBACK_ATTORNEYS;
  }
}

export async function getAttorneyBySlug(slug: string): Promise<Attorney | null> {
  try {
    const res = await fetchApi<{ success: boolean; data: Attorney }>(`/attorneys/${slug}`, { revalidate: 60 });
    return res.data;
  } catch {
    return FALLBACK_ATTORNEYS.find(a => a.slug === slug) || null;
  }
}

export async function getCaseResults(params?: { practiceAreaId?: number; leadAttorneyId?: number }): Promise<CaseResult[]> {
  try {
    const query = new URLSearchParams();
    if (params?.practiceAreaId) query.set('practice_area_id', params.practiceAreaId.toString());
    if (params?.leadAttorneyId) query.set('lead_attorney_id', params.leadAttorneyId.toString());
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await fetchApi<{ data: CaseResult[] }>(`/case-results${queryString}`, { revalidate: 60 });
    return res.data || [];
  } catch {
    return FALLBACK_CASE_RESULTS;
  }
}

export interface ConsultationPayload {
  full_name: string;
  email: string;
  phone: string;
  practice_area_id?: number | null;
  case_details: string;
  source?: string;
}

export async function submitConsultation(payload: ConsultationPayload): Promise<{
  success: boolean;
  message: string;
  lead_id?: number;
  errors?: Record<string, string[]>;
}> {
  const url = `${API_BASE_URL}/consultations`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: data.message || 'Submission failed. Please check form fields or call us directly.',
      errors: data.errors,
    };
  }

  return data;
}

// ==========================================
// CMS & ADMIN API FUNCTIONS
// ==========================================

export async function adminLogin(credentials: { email: string; password: string }) {
  const url = `${API_BASE_URL}/admin/login`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  return await res.json();
}

export async function adminLogout(token: string) {
  const url = `${API_BASE_URL}/admin/logout`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await res.json();
}

export async function getAdminAnalytics(token: string): Promise<{ success: boolean; data: AdminAnalyticsData }> {
  const url = `${API_BASE_URL}/admin/analytics`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  return await res.json();
}

export async function getAdminLeads(
  token: string,
  params?: { status?: string; q?: string; date_from?: string; date_to?: string; page?: number }
): Promise<PaginatedResponse<ConsultationLead>> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.q) query.set('q', params.q);
  if (params?.date_from) query.set('date_from', params.date_from);
  if (params?.date_to) query.set('date_to', params.date_to);
  if (params?.page) query.set('page', params.page.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const url = `${API_BASE_URL}/admin/leads${queryString}`;

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  return await res.json();
}

export async function updateLeadStatus(token: string, leadId: number, status: string) {
  const url = `${API_BASE_URL}/admin/leads/${leadId}/status`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return await res.json();
}

export async function deleteLead(token: string, leadId: number) {
  const url = `${API_BASE_URL}/admin/leads/${leadId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await res.json();
}

// Attorneys CMS
export async function getAdminAttorneys(token: string): Promise<{ data: Attorney[] }> {
  const url = `${API_BASE_URL}/admin/attorneys`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  return await res.json();
}

export async function createAttorney(token: string, payload: Partial<Attorney> & { practice_area_ids?: number[] }) {
  const url = `${API_BASE_URL}/admin/attorneys`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function updateAttorney(token: string, id: number, payload: Partial<Attorney> & { practice_area_ids?: number[] }) {
  const url = `${API_BASE_URL}/admin/attorneys/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function deleteAttorney(token: string, id: number) {
  const url = `${API_BASE_URL}/admin/attorneys/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await res.json();
}

// Practice Areas CMS
export async function getAdminPracticeAreas(token: string): Promise<{ data: PracticeArea[] }> {
  const url = `${API_BASE_URL}/admin/practice-areas`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  return await res.json();
}

export async function createPracticeArea(token: string, payload: Partial<PracticeArea>) {
  const url = `${API_BASE_URL}/admin/practice-areas`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function updatePracticeArea(token: string, id: number, payload: Partial<PracticeArea>) {
  const url = `${API_BASE_URL}/admin/practice-areas/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function deletePracticeArea(token: string, id: number) {
  const url = `${API_BASE_URL}/admin/practice-areas/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await res.json();
}

// Case Results CMS
export async function getAdminCaseResults(token: string): Promise<{ data: CaseResult[] }> {
  const url = `${API_BASE_URL}/admin/case-results`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  return await res.json();
}

export async function createCaseResult(token: string, payload: Partial<CaseResult>) {
  const url = `${API_BASE_URL}/admin/case-results`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function updateCaseResult(token: string, id: number, payload: Partial<CaseResult>) {
  const url = `${API_BASE_URL}/admin/case-results/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function deleteCaseResult(token: string, id: number) {
  const url = `${API_BASE_URL}/admin/case-results/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await res.json();
}

// Upload File Pipeline
export async function uploadFile(token: string, file: File): Promise<{
  success: boolean;
  url: string;
  path: string;
  original_name: string;
  message?: string;
}> {
  const url = `${API_BASE_URL}/admin/upload`;
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'File upload failed');
  }

  return data;
}
