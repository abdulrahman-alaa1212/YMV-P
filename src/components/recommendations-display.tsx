"use client";
import type { RecommendationOutput } from '@/ai/flows/generate-personalized-recommendations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Route, BookOpenText, Printer, CheckCircle } from 'lucide-react';

interface RecommendationsDisplayProps {
  recommendations: RecommendationOutput;
}

export function RecommendationsDisplay({ recommendations }: RecommendationsDisplayProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:space-y-4">
      <Card className="shadow-xl print:shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <BookOpenText className="h-8 w-8 mr-3 text-primary" />
            Your Personalized AR/MR Report
          </CardTitle>
          <CardDescription className="text-lg">
            Based on your input, here are tailored recommendations and a strategic roadmap for integrating AR/MR technologies.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-lg print:shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
             <Lightbulb className="h-6 w-6 mr-2 text-secondary" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">{recommendations.summary}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg print:shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <CheckCircle className="h-6 w-6 mr-2 text-secondary" />
            Specific Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-none space-y-3">
            {recommendations.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start p-3 bg-muted/50 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 shrink-0" />
                <span className="text-base">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg print:shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Route className="h-6 w-6 mr-2 text-secondary" />
            Implementation Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed whitespace-pre-line">{recommendations.roadmap}</p>
        </CardContent>
        <CardFooter className="print:hidden">
           <Button onClick={handlePrint} variant="outline" className="mt-4">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </CardFooter>
      </Card>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          header, footer, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
      <div className="printable-area fixed top-0 left-0 w-full h-full -z-50 overflow-hidden opacity-0 pointer-events-none">
        {/* This div is used to ensure tailwind print styles are generated */}
      </div>
    </div>
  );
}
