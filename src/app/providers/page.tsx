"use client"; // For potential future client-side filtering

import React, { useState, useMemo } from 'react';
import { ProviderCard } from '@/components/provider-card';
import type { Provider } from '@/types';
import { providersData } from '@/lib/constants'; // Static data for providers
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ListFilter } from 'lucide-react';

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedTechnology, setSelectedTechnology] = useState<string>('all');

  const allSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    providersData.forEach(p => p.specialties.forEach(s => specialties.add(s)));
    return ['all', ...Array.from(specialties).sort()];
  }, []);

  const allTechnologies = useMemo(() => {
    const technologies = new Set<string>();
    providersData.forEach(p => p.technologies.forEach(t => technologies.add(t)));
    return ['all', ...Array.from(technologies).sort()];
  }, []);

  const filteredProviders = useMemo(() => {
    return providersData.filter(provider => {
      const matchesSearchTerm = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                provider.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'all' || provider.specialties.includes(selectedSpecialty);
      const matchesTechnology = selectedTechnology === 'all' || provider.technologies.includes(selectedTechnology);
      return matchesSearchTerm && matchesSpecialty && matchesTechnology;
    });
  }, [searchTerm, selectedSpecialty, selectedTechnology]);


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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1 space-y-2">
              <label htmlFor="search-provider" className="text-sm font-medium text-foreground flex items-center">
                <Search className="h-4 w-4 mr-2 text-primary" /> Search Providers
              </label>
              <Input
                id="search-provider"
                type="text"
                placeholder="Search by name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="filter-specialty" className="text-sm font-medium text-foreground flex items-center">
                 <ListFilter className="h-4 w-4 mr-2 text-primary" /> Filter by Specialty
              </label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger id="filter-specialty" className="text-base">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  {allSpecialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty} className="capitalize">
                      {specialty === 'all' ? 'All Specialties' : specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="filter-technology" className="text-sm font-medium text-foreground flex items-center">
                <ListFilter className="h-4 w-4 mr-2 text-primary" /> Filter by Technology
              </label>
              <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                <SelectTrigger id="filter-technology" className="text-base">
                  <SelectValue placeholder="All Technologies" />
                </SelectTrigger>
                <SelectContent>
                  {allTechnologies.map(tech => (
                    <SelectItem key={tech} value={tech} className="capitalize">
                       {tech === 'all' ? 'All Technologies' : tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
