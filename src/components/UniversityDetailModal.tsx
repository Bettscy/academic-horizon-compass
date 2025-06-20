
import { University } from "@/types/university";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, TrendingUp, DollarSign, GraduationCap, Globe, BookOpen } from "lucide-react";

interface UniversityDetailModalProps {
  university: University | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToFavorites: (university: University) => void;
  onCompare: (university: University) => void;
}

export const UniversityDetailModal = ({ 
  university, 
  isOpen, 
  onClose, 
  onAddToFavorites, 
  onCompare 
}: UniversityDetailModalProps) => {
  if (!university) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(university.matchScore || 0)}`}>
              {university.matchScore}% Match
            </div>
            {university.name}
          </DialogTitle>
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
        </DialogHeader>

        <div className="space-y-6">
          {/* Match Progress */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Match Score Breakdown</h3>
            <Progress value={university.matchScore} className="mb-2" />
            {university.matchReasons && university.matchReasons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {university.matchReasons.map((reason, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Information */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5" />
                  Academic Requirements
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Minimum GPA:</span>
                    <span className="font-medium">{university.minGPA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average GPA:</span>
                    <span className="font-medium">{university.avgGPA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acceptance Rate:</span>
                    <span className="font-medium">{university.acceptanceRate}%</span>
                  </div>
                  {university.ieltsMin && (
                    <div className="flex justify-between">
                      <span>IELTS Minimum:</span>
                      <span className="font-medium">{university.ieltsMin}</span>
                    </div>
                  )}
                  {university.toeflMin && (
                    <div className="flex justify-between">
                      <span>TOEFL Minimum:</span>
                      <span className="font-medium">{university.toeflMin}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5" />
                  Student Body
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Students:</span>
                    <span className="font-medium">{university.totalStudents.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>International Students:</span>
                    <span className="font-medium">{university.internationalStudents.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>International %:</span>
                    <span className="font-medium">{university.internationalPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Student-Faculty Ratio:</span>
                    <span className="font-medium">1:{university.studentFacultyRatio}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial & Practical */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5" />
                  Financial Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>International Tuition:</span>
                    <span className="font-medium">{formatCurrency(university.tuitionFee.international, university.tuitionFee.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Living Cost (Medium):</span>
                    <span className="font-medium">{formatCurrency(university.livingCost.medium, university.livingCost.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Annual Cost:</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(university.tuitionFee.international + university.livingCost.medium, university.tuitionFee.currency)}
                    </span>
                  </div>
                  {university.financialAidAvailable && (
                    <Badge variant="secondary" className="text-xs mt-2">Financial Aid Available</Badge>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5" />
                  Outcomes
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Graduation Rate:</span>
                    <span className="font-medium">{university.graduationRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employment Rate:</span>
                    <span className="font-medium">{university.employmentRate}%</span>
                  </div>
                  {university.averageSalary && (
                    <div className="flex justify-between">
                      <span>Average Salary:</span>
                      <span className="font-medium">{formatCurrency(university.averageSalary, university.tuitionFee.currency)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Programs and Departments */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5" />
              Strong Programs & Departments
            </h3>
            <div className="flex flex-wrap gap-2">
              {university.strongDepartments.map((dept, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>

          {/* Scholarships */}
          {university.scholarshipOpportunities && university.scholarshipOpportunities.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5" />
                Scholarship Opportunities
              </h3>
              <div className="flex flex-wrap gap-2">
                {university.scholarshipOpportunities.map((scholarship, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {scholarship}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={() => onAddToFavorites(university)}
              variant="outline"
            >
              Add to Favorites
            </Button>
            <Button 
              onClick={() => onCompare(university)}
              variant="outline"
            >
              Add to Compare
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
