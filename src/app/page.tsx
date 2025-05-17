
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Target, Users, FileText, PlayCircle, Search, Clock3 } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: <Target className="h-10 w-10 text-primary mb-4" />,
    title: 'Interactive Diagnostic',
    description: 'Assess your hospital\'s specific needs for AR/MR technologies through our intuitive tool.',
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-primary mb-4" />,
    title: 'Personalized Recommendations',
    description: 'Receive AI-powered, tailored suggestions for AR/MR solutions that fit your profile and goals.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: 'Provider Directory',
    description: 'Explore a curated list of leading AR/MR solution providers to find the perfect match.',
  },
  {
    icon: <FileText className="h-10 w-10 text-primary mb-4" />,
    title: 'Strategic Roadmap',
    description: 'Generate an executive summary and a clear roadmap for successful AR/MR implementation.',
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Unlock the Future of Healthcare with AR/MR
        </h1>
        <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
          AR/MR Advisor helps hospitals like yours navigate the complex landscape of Augmented and Mixed Reality.
          Discover tailored solutions to enhance patient care, surgical precision, and medical training.
        </p>
        {/* Unified CTA container */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 pt-4">
          {/* Primary CTA group */}
          <div className="flex flex-col items-center gap-y-2">
            <Link href="/diagnostic" passHref>
              <Button size="lg" className="text-lg px-8 py-6">
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Diagnostic
              </Button>
            </Link>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock3 className="mr-1 h-4 w-4" />
              <span>Quick Assessment (approx. 3 min)</span>
            </div>
          </div>
          {/* Secondary CTA group */}
          <div className="flex flex-col items-center"> {/* Ensured this group also aligns its content, useful if helper text were added here */}
           <Link href="/providers" passHref>
              <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
                <Search className="mr-2 h-5 w-5" />
                Explore Providers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-xl">
          <Image
            src="https://placehold.co/1200x400.png"
            alt="Doctor using AR headset in a modern medical setting"
            layout="fill"
            objectFit="cover"
            data-ai-hint="medical technology AR"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>
           <div className="absolute bottom-0 left-0 p-6 md:p-10">
            <h2 className="text-2xl md:text-4xl font-semibold text-primary-foreground drop-shadow-md">
              Revolutionize Your Medical Practice
            </h2>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-primary">How AR/MR Advisor Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-center">{feature.icon}</div>
                <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground/80">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card p-8 md:p-12 rounded-xl shadow-xl md:grid md:grid-cols-5 md:gap-8 md:items-center">
        <div className="space-y-4 md:col-span-3 text-center md:text-left">
          <h2 className="text-3xl font-bold text-primary">
            Ready to Transform Your Hospital?
          </h2>
          <p className="text-lg text-foreground max-w-2xl mx-auto md:mx-0 md:max-w-none">
            Take the first step towards integrating cutting-edge AR/MR solutions. Our tools are designed to provide clarity and direction.
          </p>
        </div>
        <div className="mt-6 md:mt-0 md:col-span-2 flex md:justify-end justify-center">
          <Link href="/diagnostic" passHref>
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
