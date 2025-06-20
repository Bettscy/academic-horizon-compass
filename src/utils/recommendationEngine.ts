
import { StudentProfile } from "@/types/student";
import { University } from "@/types/university";
import { mockUniversityData } from "@/data/mockUniversities";

export const getUniversityRecommendations = async (
  country: string, 
  profile: StudentProfile
): Promise<University[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get universities for the selected country
  const countryUniversities = mockUniversityData.filter(
    uni => uni.country === country
  );
  
  // Calculate match scores for each university
  const scoredUniversities = countryUniversities.map(university => {
    const matchScore = calculateMatchScore(university, profile);
    const matchReasons = getMatchReasons(university, profile);
    
    return {
      ...university,
      matchScore,
      matchReasons
    };
  });
  
  // Sort by match score and return top matches
  return scoredUniversities
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 10);
};

const calculateMatchScore = (university: University, profile: StudentProfile): number => {
  let score = 0;
  let maxScore = 0;
  
  // Academic compatibility (40% weight)
  const academicWeight = 40;
  if (profile.gpa) {
    const gpaScore = calculateGPAScore(university, profile);
    score += gpaScore * academicWeight / 100;
    maxScore += academicWeight;
  }
  
  // Financial compatibility (25% weight)
  const financialWeight = 25;
  if (profile.annualBudget) {
    const financialScore = calculateFinancialScore(university, profile);
    score += financialScore * financialWeight / 100;
    maxScore += financialWeight;
  }
  
  // Test scores compatibility (15% weight)
  const testScoreWeight = 15;
  const testScore = calculateTestScoreCompatibility(university, profile);
  score += testScore * testScoreWeight / 100;
  maxScore += testScoreWeight;
  
  // Preferences compatibility (10% weight)
  const preferencesWeight = 10;
  const preferencesScore = calculatePreferencesScore(university, profile);
  score += preferencesScore * preferencesWeight / 100;
  maxScore += preferencesWeight;
  
  // Career opportunities (10% weight)
  const careerWeight = 10;
  const careerScore = calculateCareerScore(university, profile);
  score += careerScore * careerWeight / 100;
  maxScore += careerWeight;
  
  return Math.round((score / maxScore) * 100);
};

const calculateGPAScore = (university: University, profile: StudentProfile): number => {
  const studentGPA = normalizeGPA(profile.gpa, profile.gradeSystem);
  
  if (studentGPA >= university.avgGPA) return 100;
  if (studentGPA >= university.minGPA) {
    const range = university.avgGPA - university.minGPA;
    const position = studentGPA - university.minGPA;
    return 70 + (position / range) * 30;
  }
  if (studentGPA >= university.minGPA * 0.9) return 50;
  return 20;
};

const calculateFinancialScore = (university: University, profile: StudentProfile): number => {
  const totalCost = university.tuitionFee.international + university.livingCost.medium;
  const budget = profile.annualBudget;
  
  if (budget >= totalCost * 1.2) return 100;
  if (budget >= totalCost) return 80;
  if (budget >= totalCost * 0.8) return 60;
  if (budget >= totalCost * 0.6) return 40;
  return 20;
};

const calculateTestScoreCompatibility = (university: University, profile: StudentProfile): number => {
  let scores = [];
  
  if (profile.ielts && university.ieltsMin) {
    scores.push(profile.ielts >= university.ieltsMin ? 100 : 50);
  }
  
  if (profile.toefl && university.toeflMin) {
    scores.push(profile.toefl >= university.toeflMin ? 100 : 50);
  }
  
  if (profile.sat && university.satRange) {
    if (profile.sat >= university.satRange.avg) scores.push(100);
    else if (profile.sat >= university.satRange.min) scores.push(70);
    else scores.push(30);
  }
  
  return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 80;
};

const calculatePreferencesScore = (university: University, profile: StudentProfile): number => {
  let score = 0;
  let checks = 0;
  
  // Location preference
  if (profile.locationPreference !== 'any') {
    score += university.location === profile.locationPreference ? 100 : 50;
    checks++;
  }
  
  // University size preference
  if (profile.universitySize !== 'any') {
    score += university.campusSize === profile.universitySize ? 100 : 70;
    checks++;
  }
  
  // Research opportunities
  if (profile.researchOpportunities) {
    score += university.researchOpportunities ? 100 : 30;
    checks++;
  }
  
  return checks > 0 ? score / checks : 80;
};

const calculateCareerScore = (university: University, profile: StudentProfile): number => {
  let score = 0;
  
  // Employment rate
  score += university.employmentRate;
  
  // Internship programs
  if (profile.internshipImportance === 'high' && university.internshipPrograms) {
    score += 20;
  }
  
  return Math.min(score, 100);
};

const normalizeGPA = (gpa: number, system: string): number => {
  switch (system) {
    case 'percentage':
      return (gpa / 100) * 4.0;
    case 'cgpa':
      return (gpa / 10) * 4.0;
    default:
      return gpa;
  }
};

const getMatchReasons = (university: University, profile: StudentProfile): string[] => {
  const reasons = [];
  
  const studentGPA = normalizeGPA(profile.gpa, profile.gradeSystem);
  if (studentGPA >= university.avgGPA) {
    reasons.push("Strong academic match");
  }
  
  if (profile.annualBudget >= university.tuitionFee.international + university.livingCost.medium) {
    reasons.push("Within budget");
  }
  
  if (university.financialAidAvailable && profile.financialAidNeeded) {
    reasons.push("Financial aid available");
  }
  
  if (profile.fieldOfStudy && university.strongDepartments.some(dept => 
    dept.toLowerCase().includes(profile.fieldOfStudy.toLowerCase())
  )) {
    reasons.push("Strong in your field");
  }
  
  if (university.internationalPercentage > 15) {
    reasons.push("Diverse international community");
  }
  
  if (university.employmentRate > 85) {
    reasons.push("Excellent employment outcomes");
  }
  
  if (profile.researchOpportunities && university.researchOpportunities) {
    reasons.push("Research opportunities available");
  }
  
  return reasons;
};
