
import { useState } from "react";
import { CountrySelector } from "@/components/CountrySelector";
import { StudentProfileForm } from "@/components/StudentProfileForm";
import { UniversityRecommendations } from "@/components/UniversityRecommendations";
import { StudentProfile } from "@/types/student";
import { University } from "@/types/university";
import { getUniversityRecommendations } from "@/utils/recommendationEngine";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [recommendations, setRecommendations] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setStudentProfile(null);
    setRecommendations([]);
  };

  const handleProfileSubmit = async (profile: StudentProfile) => {
    setIsLoading(true);
    setStudentProfile(profile);
    
    try {
      const recommendedUniversities = await getUniversityRecommendations(selectedCountry, profile);
      setRecommendations(recommendedUniversities);
    } catch (error) {
      console.error("Error getting recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Academic Horizon Compass
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find your perfect university match worldwide. Get personalized recommendations 
            based on your academic profile, budget, and life preferences.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Step 1: Country Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
              Select Your Target Country
            </h2>
            <CountrySelector 
              selectedCountry={selectedCountry} 
              onCountrySelect={handleCountrySelect} 
            />
          </div>

          {/* Step 2: Student Profile */}
          {selectedCountry && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                Tell Us About Yourself
              </h2>
              <StudentProfileForm 
                country={selectedCountry}
                onSubmit={handleProfileSubmit}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Step 3: Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                Your University Recommendations
              </h2>
              <UniversityRecommendations 
                universities={recommendations}
                studentProfile={studentProfile!}
                country={selectedCountry}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
