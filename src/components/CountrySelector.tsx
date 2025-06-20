
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CountrySelectorProps {
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
}

const countries = [
  { 
    code: 'GB', 
    name: 'United Kingdom', 
    flag: '🇬🇧',
    highlights: ['World-class universities', 'Short degree duration', 'Rich history']
  },
  { 
    code: 'US', 
    name: 'United States', 
    flag: '🇺🇸',
    highlights: ['Ivy League schools', 'Research opportunities', 'Diverse programs']
  },
  { 
    code: 'CA', 
    name: 'Canada', 
    flag: '🇨🇦',
    highlights: ['Affordable education', 'Work opportunities', 'Multicultural society']
  },
  { 
    code: 'AU', 
    name: 'Australia', 
    flag: '🇦🇺',
    highlights: ['High quality of life', 'Beautiful campuses', 'Strong job market']
  },
  { 
    code: 'DE', 
    name: 'Germany', 
    flag: '🇩🇪',
    highlights: ['Low tuition fees', 'Engineering excellence', 'Strong economy']
  },
  { 
    code: 'FR', 
    name: 'France', 
    flag: '🇫🇷',
    highlights: ['Cultural richness', 'Business schools', 'EU advantages']
  },
  { 
    code: 'NL', 
    name: 'Netherlands', 
    flag: '🇳🇱',
    highlights: ['English-taught programs', 'Innovation hub', 'High English fluency']
  },
  { 
    code: 'SG', 
    name: 'Singapore', 
    flag: '🇸🇬',
    highlights: ['Asian gateway', 'Top universities', 'Career opportunities']
  }
];

export const CountrySelector = ({ selectedCountry, onCountrySelect }: CountrySelectorProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string>("");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {countries.map((country) => (
        <Card
          key={country.code}
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
            selectedCountry === country.name 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:shadow-md'
          }`}
          onClick={() => onCountrySelect(country.name)}
          onMouseEnter={() => setHoveredCountry(country.code)}
          onMouseLeave={() => setHoveredCountry("")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-4xl mb-2">{country.flag}</div>
            <h3 className="font-semibold text-lg mb-2">{country.name}</h3>
            <div className="space-y-1">
              {country.highlights.map((highlight, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs px-2 py-1 block"
                >
                  {highlight}
                </Badge>
              ))}
            </div>
            {selectedCountry === country.name && (
              <div className="mt-3 text-blue-600 font-medium">
                ✓ Selected
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
