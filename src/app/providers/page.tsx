
"use client"; 

import React, { useState, useMemo } from 'react';
import { ProviderCard } from '@/components/provider-card';
import type { Provider } from '@/types';
import { providersData } from '@/lib/constants'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Tags, Cpu } from 'lucide-react'; 

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  const allSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    providersData.forEach(p => p.specialties.forEach(s => specialties.add(s)));
    return Array.from(specialties).sort();
  }, []);

  const allTechnologies = useMemo(() => {
    const technologies = new Set<string>();
    providersData.forEach(p => p.technologies.forEach(t => technologies.add(t)));
    return Array.from(technologies).sort();
  }, []);

  const handleSpecialtyChange = (specialty: string, checked: boolean | string) => {
    setSelectedSpecialties(prev => 
      checked ? [...prev, specialty] : prev.filter(s => s !== specialty)
    );
  };

  const handleTechnologyChange = (technology: string, checked: boolean | string) => {
    setSelectedTechnologies(prev => 
      checked ? [...prev, technology] : prev.filter(t => t !== technology)
    );
  };

  const filteredProviders = useMemo(() => {
    return providersData.filter(provider => {
      const matchesSearchTerm = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                provider.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialty = selectedSpecialties.length === 0 || 
                               provider.specialties.some(s => selectedSpecialties.includes(s));
      
      const matchesTechnology = selectedTechnologies.length === 0 || 
                                provider.technologies.some(t => selectedTechnologies.includes(t));
                                
      return matchesSearchTerm && matchesSpecialty && matchesTechnology;
    });
  }, [searchTerm, selectedSpecialties, selectedTechnologies]);


  return (
    <div className="space-y-8 py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">AR/MR Solution Providers</CardTitle>
          <CardDescription className="text-lg">
            Explore our curated directory of leading AR/MR technology providers for the healthcare industry.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="p-6 shadow-lg">
        <CardContent className="space-y-6 p-0">
          <div className="space-y-2">
            <Label htmlFor="search-provider" className="text-lg font-medium text-foreground flex items-center">
              <Search className="h-5 w-5 mr-2 text-primary" /> Search Providers
            </Label>
            <Input
              id="search-provider"
              type="text"
              placeholder="Search by name or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <Tags className="h-5 w-5 mr-2 text-primary" /> Filter by Specialty
                {selectedSpecialties.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({selectedSpecialties.length} selected)
                  </span>
                )}
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 rounded-lg border p-4 bg-muted/40 shadow-inner">
                {allSpecialties.map(specialty => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialty-${specialty}`}
                      checked={selectedSpecialties.includes(specialty)}
                      onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked)}
                    />
                    <Label htmlFor={`specialty-${specialty}`} className="text-sm font-normal capitalize cursor-pointer">
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <Cpu className="h-5 w-5 mr-2 text-primary" /> Filter by Technology
                {selectedTechnologies.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({selectedTechnologies.length} selected)
                  </span>
                )}
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 rounded-lg border p-4 bg-muted/40 shadow-inner">
                {allTechnologies.map(tech => (
                  <div key={tech} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${tech}`}
                      checked={selectedTechnologies.includes(tech)}
                      onCheckedChange={(checked) => handleTechnologyChange(tech, checked)}
                    />
                    <Label htmlFor={`tech-${tech}`} className="text-sm font-normal capitalize cursor-pointer">
                       {tech}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredProviders.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-lg">
          <CardContent>
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-foreground">No providers match your current filters.</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria, or clear some filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

