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
  let countryUniversities = mockUniversityData.filter(
    uni => uni.country === country
  );

  // Apply strict filtering based on user profile
  countryUniversities = countryUniversities.filter(university => {
    // Filter by budget - exclude universities that are too expensive
    const totalCost = university.tuitionFee.international + university.livingCost.medium;
    if (profile.annualBudget && totalCost > profile.annualBudget * 1.3) {
      return false;
    }

    // Filter by academic requirements - exclude if user doesn't meet minimum requirements
    const normalizedGPA = normalizeGPA(profile.gpa || 0, profile.gradeSystem);
    if (normalizedGPA < university.minGPA * 0.85) {
      return false;
    }

    // Filter by language requirements
    if (profile.ielts && university.ieltsMin && profile.ielts < university.ieltsMin - 0.5) {
      return false;
    }

    if (profile.toefl && university.toeflMin && profile.toefl < university.toeflMin - 10) {
      return false;
    }

    // Filter by field of study - prioritize universities strong in user's field
    if (profile.fieldOfStudy) {
      const hasRelevantProgram = university.strongDepartments.some(dept => 
        dept.toLowerCase().includes(profile.fieldOfStudy.toLowerCase()) ||
        profile.fieldOfStudy.toLowerCase().includes(dept.toLowerCase())
      );
      // Don't exclude completely, but will affect scoring
    }

    return true;
  });
  
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
  
  // Sort by match score and return varied results based on profile
  const sortedUniversities = scoredUniversities
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  // Return different numbers based on match quality
  const highQualityMatches = sortedUniversities.filter(uni => (uni.matchScore || 0) >= 80);
  if (highQualityMatches.length >= 5) {
    return highQualityMatches.slice(0, 8);
  } else {
    return sortedUniversities.slice(0, 10);
  }
};

const calculateMatchScore = (university: University, profile: StudentProfile): number => {
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  // Academic compatibility (35% weight)
  const academicWeight = 35;
  const gpaScore = calculateGPAScore(university, profile);
  totalScore += gpaScore * academicWeight / 100;
  maxPossibleScore += academicWeight;
  
  // Financial compatibility (30% weight) - more important now
  const financialWeight = 30;
  const financialScore = calculateFinancialScore(university, profile);
  totalScore += financialScore * financialWeight / 100;
  maxPossibleScore += financialWeight;
  
  // Field of study match (15% weight)
  const fieldWeight = 15;
  const fieldScore = calculateFieldMatch(university, profile);
  totalScore += fieldScore * fieldWeight / 100;
  maxPossibleScore += fieldWeight;
  
  // Test scores compatibility (10% weight)
  const testScoreWeight = 10;
  const testScore = calculateTestScoreCompatibility(university, profile);
  totalScore += testScore * testScoreWeight / 100;
  maxPossibleScore += testScoreWeight;
  
  // Preferences compatibility (10% weight)
  const preferencesWeight = 10;
  const preferencesScore = calculatePreferencesScore(university, profile);
  totalScore += preferencesScore * preferencesWeight / 100;
  maxPossibleScore += preferencesWeight;
  
  return Math.round((totalScore / maxPossibleScore) * 100);
};

const calculateFieldMatch = (university: University, profile: StudentProfile): number => {
  if (!profile.fieldOfStudy) return 70; // neutral score
  
  const fieldLower = profile.fieldOfStudy.toLowerCase();
  const strongMatch = university.strongDepartments.some(dept => 
    dept.toLowerCase().includes(fieldLower) || fieldLower.includes(dept.toLowerCase())
  );
  
  const programMatch = university.programs.some(program => 
    program.toLowerCase().includes(fieldLower) || fieldLower.includes(program.toLowerCase())
  );
  
  if (strongMatch) return 100;
  if (programMatch) return 80;
  return 40; // weak match
};

const calculateGPAScore = (university: University, profile: StudentProfile): number => {
  const studentGPA = normalizeGPA(profile.gpa || 0, profile.gradeSystem);
  
  if (studentGPA >= university.avgGPA + 0.2) return 100;
  if (studentGPA >= university.avgGPA) return 90;
  if (studentGPA >= university.minGPA + 0.2) return 80;
  if (studentGPA >= university.minGPA) return 70;
  if (studentGPA >= university.minGPA * 0.9) return 50;
  return 25;
};

const calculateFinancialScore = (university: University, profile: StudentProfile): number => {
  if (!profile.annualBudget) return 50;
  
  const totalCost = university.tuitionFee.international + university.livingCost.medium;
  const budgetRatio = profile.annualBudget / totalCost;
  
  if (budgetRatio >= 1.5) return 100;
  if (budgetRatio >= 1.2) return 90;
  if (budgetRatio >= 1.0) return 80;
  if (budgetRatio >= 0.8) return 60;
  if (budgetRatio >= 0.6) return 40;
  return 20;
};

const calculateTestScoreCompatibility = (university: University, profile: StudentProfile): number => {
  let scores = [];
  
  if (profile.ielts && university.ieltsMin) {
    if (profile.ielts >= university.ieltsMin + 0.5) scores.push(100);
    else if (profile.ielts >= university.ieltsMin) scores.push(85);
    else if (profile.ielts >= university.ieltsMin - 0.5) scores.push(60);
    else scores.push(30);
  }
  
  if (profile.toefl && university.toeflMin) {
    if (profile.toefl >= university.toeflMin + 10) scores.push(100);
    else if (profile.toefl >= university.toeflMin) scores.push(85);
    else if (profile.toefl >= university.toeflMin - 10) scores.push(60);
    else scores.push(30);
  }
  
  if (profile.sat && university.satRange) {
    if (profile.sat >= university.satRange.avg + 50) scores.push(100);
    else if (profile.sat >= university.satRange.avg) scores.push(85);
    else if (profile.sat >= university.satRange.min) scores.push(70);
    else scores.push(35);
  }
  
  if (profile.gre && university.greRange) {
    if (profile.gre >= university.greRange.avg + 20) scores.push(100);
    else if (profile.gre >= university.greRange.avg) scores.push(85);
    else if (profile.gre >= university.greRange.min) scores.push(70);
    else scores.push(35);
  }
  
  return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 75;
};

const calculatePreferencesScore = (university: University, profile: StudentProfile): number => {
  let score = 0;
  let checks = 0;
  
  // Location preference
  if (profile.locationPreference && profile.locationPreference !== 'any') {
    score += university.location === profile.locationPreference ? 100 : 40;
    checks++;
  }
  
  // University size preference
  if (profile.universitySize && profile.universitySize !== 'any') {
    score += university.campusSize === profile.universitySize ? 100 : 60;
    checks++;
  }
  
  // Research opportunities
  if (profile.researchOpportunities) {
    score += university.researchOpportunities ? 100 : 20;
    checks++;
  }
  
  // Financial aid need
  if (profile.financialAidNeeded) {
    score += university.financialAidAvailable ? 100 : 30;
    checks++;
  }
  
  return checks > 0 ? score / checks : 75;
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
  
  const studentGPA = normalizeGPA(profile.gpa || 0, profile.gradeSystem);
  if (studentGPA >= university.avgGPA) {
    reasons.push("Excellent academic match");
  } else if (studentGPA >= university.minGPA) {
    reasons.push("Good academic fit");
  }
  
  if (profile.annualBudget) {
    const totalCost = university.tuitionFee.international + university.livingCost.medium;
    if (profile.annualBudget >= totalCost * 1.2) {
      reasons.push("Well within budget");
    } else if (profile.annualBudget >= totalCost) {
      reasons.push("Fits your budget");
    }
  }
  
  if (university.financialAidAvailable && profile.financialAidNeeded) {
    reasons.push("Financial aid available");
  }
  
  if (profile.fieldOfStudy && university.strongDepartments.some(dept => 
    dept.toLowerCase().includes(profile.fieldOfStudy.toLowerCase()) ||
    profile.fieldOfStudy.toLowerCase().includes(dept.toLowerCase())
  )) {
    reasons.push("Strong in your field of study");
  }
  
  if (university.internationalPercentage > 20) {
    reasons.push("Diverse international community");
  }
  
  if (university.employmentRate > 90) {
    reasons.push("Excellent employment outcomes");
  }
  
  if (profile.researchOpportunities && university.researchOpportunities) {
    reasons.push("Research opportunities available");
  }
  
  if (profile.internshipImportance === 'high' && university.internshipPrograms) {
    reasons.push("Strong internship programs");
  }
  
  return reasons.slice(0, 4); // Limit to most relevant reasons
};
