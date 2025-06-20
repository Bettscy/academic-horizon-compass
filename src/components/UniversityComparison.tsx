
import { University } from "@/types/university";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";

interface UniversityComparisonProps {
  universities: University[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveFromComparison: (universityId: string) => void;
}

export const UniversityComparison = ({ 
  universities, 
  isOpen, 
  onClose, 
  onRemoveFromComparison 
}: UniversityComparisonProps) => {
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

  if (universities.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>University Comparison</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-500">No universities selected for comparison yet.</p>
            <p className="text-sm text-gray-400 mt-2">Add universities to compare by clicking "Add to Compare" on university cards.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>University Comparison ({universities.length} universities)</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Criteria</TableHead>
                {universities.map((uni) => (
                  <TableHead key={uni.id} className="text-center min-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{uni.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveFromComparison(uni.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getMatchColor(uni.matchScore || 0)}`}>
                        {uni.matchScore}% Match
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Location</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {uni.city}, {uni.country}
                  </TableCell>
                ))}
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Global Rank</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {uni.globalRank ? `#${uni.globalRank}` : 'N/A'}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Acceptance Rate</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {uni.acceptanceRate}%
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Min GPA</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {uni.minGPA}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">IELTS Minimum</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {uni.ieltsMin || 'N/A'}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Annual Tuition</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {formatCurrency(uni.tuitionFee.international, uni.tuitionFee.currency)}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Living Cost</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {formatCurrency(uni.livingCost.medium, uni.livingCost.currency)}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Total Annual Cost</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center font-semibold text-blue-600">
                    {formatCurrency(uni.tuitionFee.international + uni.livingCost.medium, uni.tuitionFee.currency)}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Total Students</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {uni.totalStudents.toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">International %</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {uni.internationalPercentage}%
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Employment Rate</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {uni.employmentRate}%
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Financial Aid</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    {uni.financialAidAvailable ? (
                      <Badge variant="secondary" className="text-xs">Available</Badge>
                    ) : (
                      <span className="text-gray-400">Not Available</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Strong Departments</TableCell>
                {universities.map((uni) => (
                  <TableCell key={uni.id} className="text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {uni.strongDepartments.slice(0, 3).map((dept, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                      {uni.strongDepartments.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{uni.strongDepartments.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close Comparison</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
