import type { Provider } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, Briefcase, Cpu } from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
          <Image
            src={provider.logoUrl || `https://placehold.co/600x300.png?text=${encodeURIComponent(provider.name)}`}
            alt={`${provider.name} logo`}
            layout="fill"
            objectFit="cover"
            data-ai-hint="company logo abstract"
          />
        </div>
        <CardTitle className="text-2xl text-primary">{provider.name}</CardTitle>
        <CardDescription className="text-foreground/80 min-h-[60px] line-clamp-3">{provider.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center text-foreground">
            <Briefcase className="h-4 w-4 mr-2 text-secondary" />
            Specialties
          </h4>
          <div className="flex flex-wrap gap-2">
            {provider.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="capitalize">{specialty}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center text-foreground">
            <Cpu className="h-4 w-4 mr-2 text-secondary" />
            Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {provider.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="capitalize">{tech}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
        <Button asChild variant="default" className="flex-1 w-full sm:w-auto">
          <a href={provider.website} target="_blank" rel="noopener noreferrer">
            <Globe className="mr-2 h-4 w-4" /> Visit Website
          </a>
        </Button>
        {provider.contactEmail && (
          <Button asChild variant="outline" className="flex-1 w-full sm:w-auto">
            <a href={`mailto:${provider.contactEmail}`}>
              <Mail className="mr-2 h-4 w-4" /> Contact
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
