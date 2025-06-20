import { useState } from "react";
import { University } from "@/types/university";
import { StudentProfile } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, TrendingUp, DollarSign, GraduationCap, Heart } from "lucide-react";
import { UniversityDetailModal } from "./UniversityDetailModal";
import { UniversityComparison } from "./UniversityComparison";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "@/hooks/use-toast";

interface UniversityRecommendationsProps {
  universities: University[];
  studentProfile: StudentProfile;
  country: string;
}

export const UniversityRecommendations = ({ 
  universities, 
  studentProfile, 
  country 
}: UniversityRecommendationsProps) => {
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [comparisonUniversities, setComparisonUniversities] = useState<University[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  
  const { favorites, addToFavorites, isFavorite, toggleFavorite } = useFavorites();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  const handleViewDetails = (university: University) => {
    setSelectedUniversity(university);
    setIsDetailModalOpen(true);
  };

  const handleAddToFavorites = (university: University) => {
    addToFavorites(university);
    toast({
      title: "Added to Favorites",
      description: `${university.name} has been added to your favorites.`,
    });
  };

  const handleAddToComparison = (university: University) => {
    setComparisonUniversities(prev => {
      const isAlreadyInComparison = prev.some(uni => uni.id === university.id);
      if (isAlreadyInComparison) {
        toast({
          title: "Already in Comparison",
          description: `${university.name} is already in your comparison list.`,
          variant: "destructive"
        });
        return prev;
      }
      
      if (prev.length >= 4) {
        toast({
          title: "Comparison Limit Reached",
          description: "You can compare up to 4 universities at once.",
          variant: "destructive"
        });
        return prev;
      }
      
      toast({
        title: "Added to Comparison",
        description: `${university.name} has been added to comparison.`,
      });
      return [...prev, university];
    });
  };

  const handleRemoveFromComparison = (universityId: string) => {
    setComparisonUniversities(prev => prev.filter(uni => uni.id !== universityId));
  };

  const handleOpenComparison = () => {
    if (comparisonUniversities.length === 0) {
      toast({
        title: "No Universities to Compare",
        description: "Add universities to comparison first.",
        variant: "destructive"
      });
      return;
    }
    setIsComparisonOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg text-gray-600">
            Found <strong>{universities.length}</strong> universities in <strong>{country}</strong> that match your profile
          </p>
          {favorites.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              You have {favorites.length} favorite{favorites.length === 1 ? '' : 's'}
            </p>
          )}
        </div>
        
        {comparisonUniversities.length > 0 && (
          <Button 
            variant="outline" 
            onClick={handleOpenComparison}
            className="flex items-center gap-2"
          >
            Compare ({comparisonUniversities.length})
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {universities.map((university, index) => (
          <Card key={university.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2 flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    {university.name}
                    {isFavorite(university.id) && (
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {university.city}, {university.country}
                    </span>
                    {university.globalRank && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Global Rank: #{university.globalRank}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(university.matchScore || 0)}`}>
                    {university.matchScore}% Match
                  </div>
                  <Progress value={university.matchScore} className="w-24 mt-2" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Academic Requirements */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Academic Requirements
                  </h4>
                  <div className="text-sm space-y-1">
                    <div>Min GPA: {university.minGPA}</div>
                    <div>Acceptance Rate: {university.acceptanceRate}%</div>
                    {university.ieltsMin && <div>IELTS: {university.ieltsMin}+</div>}
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Costs
                  </h4>
                  <div className="text-sm space-y-1">
                    <div>Tuition: {formatCurrency(university.tuitionFee.international, university.tuitionFee.currency)}</div>
                    <div>Living: {formatCurrency(university.livingCost.medium, university.livingCost.currency)}</div>
                    {university.financialAidAvailable && (
                      <Badge variant="secondary" className="text-xs">Financial Aid Available</Badge>
                    )}
                  </div>
                </div>

                {/* Student Life */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Student Life
                  </h4>
                  <div className="text-sm space-y-1">
                    <div>{university.totalStudents.toLocaleString()} students</div>
                    <div>{university.internationalPercentage}% international</div>
                    <div>Ratio: 1:{university.studentFacultyRatio}</div>
                  </div>
                </div>

                {/* Outcomes */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Outcomes
                  </h4>
                  <div className="text-sm space-y-1">
                    <div>Graduation: {university.graduationRate}%</div>
                    <div>Employment: {university.employmentRate}%</div>
                    {university.averageSalary && (
                      <div>Avg Salary: {formatCurrency(university.averageSalary, university.tuitionFee.currency)}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              {university.matchReasons && university.matchReasons.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Why this is a good match:</h4>
                  <div className="flex flex-wrap gap-2">
                    {university.matchReasons.map((reason, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Programs */}
              {university.strongDepartments && university.strongDepartments.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Strong Programs: </h4>
                  <div className="flex flex-wrap gap-2">
                    {university.strongDepartments.slice(0, 5).map((dept, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(university)}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddToComparison(university)}
                >
                  Compare
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleAddToFavorites(university)}
                  variant={isFavorite(university.id) ? "default" : "outline"}
                >
                  {isFavorite(university.id) ? "Favorited" : "Add to Favorites"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button variant="outline" size="lg">
          View More Universities
        </Button>
      </div>

      {/* Modals */}
      <UniversityDetailModal
        university={selectedUniversity}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAddToFavorites={handleAddToFavorites}
        onCompare={handleAddToComparison}
      />

      <UniversityComparison
        universities={comparisonUniversities}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onRemoveFromComparison={handleRemoveFromComparison}
      />
    </div>
  );
};
