
export interface StudentProfile {
  // Academic Information
  degreeLevel: 'undergraduate' | 'postgraduate';
  fieldOfStudy: string;
  gpa: number;
  gradeSystem: 'gpa' | 'percentage' | 'cgpa';
  
  // Test Scores
  sat?: number;
  act?: number;
  gre?: number;
  gmat?: number;
  ielts?: number;
  toefl?: number;
  
  // Financial Preferences
  annualBudget: number;
  currency: string;
  financialAidNeeded: boolean;
  
  // Location & Lifestyle Preferences
  costOfLivingPreference: 'low' | 'medium' | 'high';
  locationPreference: 'urban' | 'suburban' | 'rural' | 'coastal' | 'any';
  languageOfInstruction: string[];
  
  // Career & Future Goals
  careerGoals: string[];
  internshipImportance: 'low' | 'medium' | 'high';
  postStudyWorkImportance: 'low' | 'medium' | 'high';
  
  // Additional Preferences
  universitySize: 'small' | 'medium' | 'large' | 'any';
  researchOpportunities: boolean;
  diversityImportance: 'low' | 'medium' | 'high';
  climatePreference?: string;
}
