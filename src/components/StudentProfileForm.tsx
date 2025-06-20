
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { StudentProfile } from "@/types/student";
import { toast } from "@/hooks/use-toast";

interface StudentProfileFormProps {
  country: string;
  onSubmit: (profile: StudentProfile) => void;
  isLoading: boolean;
}

export const StudentProfileForm = ({ country, onSubmit, isLoading }: StudentProfileFormProps) => {
  const [formData, setFormData] = useState<Partial<StudentProfile>>({
    degreeLevel: 'undergraduate',
    gradeSystem: 'gpa',
    currency: 'USD',
    financialAidNeeded: false,
    costOfLivingPreference: 'medium',
    locationPreference: 'any',
    languageOfInstruction: ['English'],
    careerGoals: [],
    internshipImportance: 'medium',
    postStudyWorkImportance: 'medium',
    universitySize: 'any',
    researchOpportunities: false,
    diversityImportance: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fieldOfStudy || !formData.gpa || !formData.annualBudget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields marked with *",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData as StudentProfile);
  };

  const updateFormData = (field: keyof StudentProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="degreeLevel">Degree Level *</Label>
              <Select value={formData.degreeLevel} onValueChange={(value) => updateFormData('degreeLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fieldOfStudy">Field of Study *</Label>
              <Input
                id="fieldOfStudy"
                value={formData.fieldOfStudy || ''}
                onChange={(e) => updateFormData('fieldOfStudy', e.target.value)}
                placeholder="e.g., Computer Science, Business, Medicine"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="gradeSystem">Grade System</Label>
                <Select value={formData.gradeSystem} onValueChange={(value) => updateFormData('gradeSystem', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpa">GPA (4.0)</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="cgpa">CGPA (10.0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gpa">Your Grade *</Label>
                <Input
                  id="gpa"
                  type="number"
                  step="0.01"
                  value={formData.gpa || ''}
                  onChange={(e) => updateFormData('gpa', parseFloat(e.target.value))}
                  placeholder={formData.gradeSystem === 'percentage' ? '85' : '3.5'}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Test Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.degreeLevel === 'undergraduate' ? (
              <>
                <div>
                  <Label htmlFor="sat">SAT Score</Label>
                  <Input
                    id="sat"
                    type="number"
                    value={formData.sat || ''}
                    onChange={(e) => updateFormData('sat', parseInt(e.target.value))}
                    placeholder="1400"
                  />
                </div>
                <div>
                  <Label htmlFor="act">ACT Score</Label>
                  <Input
                    id="act"
                    type="number"
                    value={formData.act || ''}
                    onChange={(e) => updateFormData('act', parseInt(e.target.value))}
                    placeholder="32"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="gre">GRE Score</Label>
                  <Input
                    id="gre"
                    type="number"
                    value={formData.gre || ''}
                    onChange={(e) => updateFormData('gre', parseInt(e.target.value))}
                    placeholder="320"
                  />
                </div>
                <div>
                  <Label htmlFor="gmat">GMAT Score</Label>
                  <Input
                    id="gmat"
                    type="number"
                    value={formData.gmat || ''}
                    onChange={(e) => updateFormData('gmat', parseInt(e.target.value))}
                    placeholder="700"
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="ielts">IELTS Score</Label>
              <Input
                id="ielts"
                type="number"
                step="0.5"
                value={formData.ielts || ''}
                onChange={(e) => updateFormData('ielts', parseFloat(e.target.value))}
                placeholder="7.5"
              />
            </div>
            <div>
              <Label htmlFor="toefl">TOEFL Score</Label>
              <Input
                id="toefl"
                type="number"
                value={formData.toefl || ''}
                onChange={(e) => updateFormData('toefl', parseInt(e.target.value))}
                placeholder="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>Budget & Financial Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="annualBudget">Annual Budget * (in {formData.currency})</Label>
              <Input
                id="annualBudget"
                type="number"
                value={formData.annualBudget || ''}
                onChange={(e) => updateFormData('annualBudget', parseInt(e.target.value))}
                placeholder="50000"
              />
            </div>

            <div>
              <Label>Cost of Living Preference</Label>
              <Select value={formData.costOfLivingPreference} onValueChange={(value) => updateFormData('costOfLivingPreference', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Budget-friendly</SelectItem>
                  <SelectItem value="medium">Medium - Moderate</SelectItem>
                  <SelectItem value="high">High - Premium lifestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="financialAid"
                checked={formData.financialAidNeeded}
                onCheckedChange={(checked) => updateFormData('financialAidNeeded', checked)}
              />
              <Label htmlFor="financialAid">I need financial aid/scholarships</Label>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Lifestyle Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Location Type</Label>
              <Select value={formData.locationPreference} onValueChange={(value) => updateFormData('locationPreference', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban - City life</SelectItem>
                  <SelectItem value="suburban">Suburban - Town setting</SelectItem>
                  <SelectItem value="rural">Rural - Countryside</SelectItem>
                  <SelectItem value="coastal">Coastal - Near the ocean</SelectItem>
                  <SelectItem value="any">Any - No preference</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>University Size</Label>
              <Select value={formData.universitySize} onValueChange={(value) => updateFormData('universitySize', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (&lt;5,000 students)</SelectItem>
                  <SelectItem value="medium">Medium (5,000-20,000 students)</SelectItem>
                  <SelectItem value="large">Large (&gt;20,000 students)</SelectItem>
                  <SelectItem value="any">Any size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Internship Importance</Label>
              <Select value={formData.internshipImportance} onValueChange={(value) => updateFormData('internshipImportance', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="research"
                checked={formData.researchOpportunities}
                onCheckedChange={(checked) => updateFormData('researchOpportunities', checked)}
              />
              <Label htmlFor="research">Research opportunities are important</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          type="submit" 
          size="lg" 
          className="px-8"
          disabled={isLoading}
        >
          {isLoading ? 'Finding Your Perfect Match...' : 'Get My Recommendations'}
        </Button>
      </div>
    </form>
  );
};
