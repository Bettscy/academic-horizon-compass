
export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  state?: string;
  
  // Rankings & Reputation
  globalRank?: number;
  nationalRank?: number;
  subjectRankings?: Record<string, number>;
  
  // Academic Requirements
  minGPA: number;
  avgGPA: number;
  acceptanceRate: number;
  satRange?: { min: number; max: number; avg: number };
  actRange?: { min: number; max: number; avg: number };
  greRange?: { min: number; max: number; avg: number };
  ieltsMin?: number;
  toeflMin?: number;
  
  // Financial Information
  tuitionFee: {
    domestic: number;
    international: number;
    currency: string;
  };
  livingCost: {
    low: number;
    medium: number;
    high: number;
    currency: string;
  };
  financialAidAvailable: boolean;
  scholarshipOpportunities: string[];
  
  // Academic Programs
  programs: string[];
  strongDepartments: string[];
  researchOpportunities: boolean;
  
  // Student Life & Demographics
  totalStudents: number;
  internationalStudents: number;
  internationalPercentage: number;
  studentFacultyRatio: number;
  campusSize: 'small' | 'medium' | 'large';
  location: 'urban' | 'suburban' | 'rural' | 'coastal';
  
  // Outcomes
  graduationRate: number;
  employmentRate: number;
  averageSalary?: number;
  
  // Additional Features
  languagesOfInstruction: string[];
  internshipPrograms: boolean;
  coopPrograms: boolean;
  studyAbroadOptions: boolean;
  
  // Calculated Match Score (for recommendations)
  matchScore?: number;
  matchReasons?: string[];
}
