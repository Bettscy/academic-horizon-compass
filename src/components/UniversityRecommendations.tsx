
import { University } from "@/types/university";
import { StudentProfile } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, TrendingUp, DollarSign, GraduationCap } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-lg text-gray-600">
          Found <strong>{universities.length}</strong> universities in <strong>{country}</strong> that match your profile
        </p>
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
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Compare
                </Button>
                <Button size="sm">
                  Add to Favorites
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
    </div>
  );
};
