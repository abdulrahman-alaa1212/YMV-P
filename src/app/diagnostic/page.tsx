"use client";

import React, { useState, useEffect } from 'react';
import { DiagnosticForm } from '@/components/diagnostic-form';
import { RecommendationsDisplay } from '@/components/recommendations-display';
import type { RecommendationOutput } from '@/ai/flows/generate-personalized-recommendations';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DiagnosticPage() {
  const [recommendations, setRecommendations] = useState<RecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  // Effect to handle scroll restoration or scrolling to results
  useEffect(() => {
    if (recommendations || error) {
      // Wait for DOM update then scroll
      requestAnimationFrame(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }, [recommendations, error]);

  const handleFormSubmit = async (data: RecommendationOutput) => {
    setRecommendations(data);
    setError(null);
    setShowForm(false); // Hide form after successful submission
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setRecommendations(null);
  };

  const handleStartOver = () => {
    setRecommendations(null);
    setError(null);
    setIsLoading(false);
    setShowForm(true);
  };

  return (
    <div className="space-y-8 py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">AR/MR Needs Assessment</CardTitle>
          <CardDescription className="text-lg">
            Complete this short diagnostic to receive personalized AR/MR technology recommendations for your hospital.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForm && !isLoading && (
            <DiagnosticForm
              onSuccess={handleFormSubmit}
              onLoadingChange={handleLoadingChange}
              onError={handleError}
            />
          )}
        </CardContent>
      </Card>

      <div id="results-section" className="scroll-mt-20">
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-10 bg-card rounded-lg shadow-lg">
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
            <p className="text-xl font-semibold text-primary">Analyzing your needs...</p>
            <p className="text-muted-foreground">Please wait while we generate your personalized recommendations.</p>
          </div>
        )}

        {error && !isLoading && (
          <Card className="border-destructive bg-destructive/10 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="h-6 w-6 mr-2" />
                An Error Occurred
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive-foreground mb-4">{error}</p>
              <Button onClick={handleStartOver} variant="destructive">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {recommendations && !isLoading && !error && (
          <>
            <RecommendationsDisplay recommendations={recommendations} />
            <div className="mt-8 text-center">
              <Button onClick={handleStartOver} size="lg">
                Start New Assessment
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
