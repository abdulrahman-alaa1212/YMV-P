
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hospital, Scaling, Stethoscope, Sparkles, FileText, Send } from "lucide-react";
import type { HospitalProfileInput, RecommendationOutput } from '@/ai/flows/generate-personalized-recommendations';
import { getPersonalizedRecommendationsAction } from "@/app/diagnostic/actions";


// Schema for form validation, based on HospitalProfileInput from the AI flow
const formSchema = z.object({
  hospitalName: z.string().min(1, { message: "Hospital name is required." }).min(2, "Hospital name must be at least 2 characters."),
  hospitalSize: z.enum(["small", "medium", "large"], { required_error: "Please select hospital size. This field is required." }),
  specialties: z.string().min(1, { message: "Medical specialties are required." }).min(5, "Please list at least one specialty or area of focus (min 5 characters)."),
  arMrExperience: z.enum(["none", "some", "extensive"], { required_error: "Please select AR/MR experience level. This field is required." }),
  needsAssessment: z.string()
    .min(1, { message: "Needs assessment is required."})
    .min(20, { message: "Needs assessment must be at least 20 characters long." })
    .max(2000, { message: "Needs assessment cannot exceed 2000 characters." }),
});

type DiagnosticFormValues = z.infer<typeof formSchema>;

interface DiagnosticFormProps {
  onSuccess: (data: RecommendationOutput) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (error: string) => void;
}

export function DiagnosticForm({ onSuccess, onLoadingChange, onError }: DiagnosticFormProps) {
  const form = useForm<DiagnosticFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalName: "",
      hospitalSize: undefined,
      specialties: "",
      arMrExperience: undefined,
      needsAssessment: "",
    },
  });

  async function onSubmit(values: DiagnosticFormValues) {
    onLoadingChange(true);
    onError(""); // Clear previous errors

    const result = await getPersonalizedRecommendationsAction(values as HospitalProfileInput);
    
    if (result.success) {
      onSuccess(result.data);
    } else {
      onError(result.error);
    }
    onLoadingChange(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="hospitalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-lg"><Hospital className="mr-2 h-5 w-5 text-primary" />Hospital Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., City General Hospital" {...field} className="text-base py-2 px-3"/>
              </FormControl>
              <FormDescription>
                The official name of your hospital or healthcare institution.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hospitalSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-lg"><Scaling className="mr-2 h-5 w-5 text-primary" />Hospital Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-base py-2 px-3 h-auto">
                    <SelectValue placeholder="Select hospital size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="small">Small (e.g., &lt;100 beds)</SelectItem>
                  <SelectItem value="medium">Medium (e.g., 100-500 beds)</SelectItem>
                  <SelectItem value="large">Large (e.g., &gt;500 beds)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Approximate size of your hospital.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialties"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-lg"><Stethoscope className="mr-2 h-5 w-5 text-primary" />Medical Specialties</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Cardiology, Orthopedics, Oncology, General Surgery..."
                  className="resize-y min-h-[100px] text-base"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                List the main medical specialties or areas of focus for your hospital. (Comma-separated)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="arMrExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-lg"><Sparkles className="mr-2 h-5 w-5 text-primary" />AR/MR Experience</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-base py-2 px-3 h-auto">
                    <SelectValue placeholder="Select AR/MR experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None (No prior experience)</SelectItem>
                  <SelectItem value="some">Some (Limited exposure or pilot projects)</SelectItem>
                  <SelectItem value="extensive">Extensive (Actively using AR/MR technologies)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your hospital's current level of experience with AR/MR technologies.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="needsAssessment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-lg"><FileText className="mr-2 h-5 w-5 text-primary" />Needs Assessment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe specific challenges, goals, or areas where AR/MR could help. For example: 'Improve surgical navigation for orthopedics,' or 'Enhance training for cardiac surgery,' or 'Provide AR tools for patient education.'"
                  className="resize-y min-h-[150px] text-base"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detail your hospital's needs and challenges that AR/MR technologies could address. Be specific. (Min 20 characters, Max 2000 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full md:w-auto text-lg px-8 py-6">
          <Send className="mr-2 h-5 w-5" />
          Get Personalized Recommendations
        </Button>
      </form>
    </Form>
  );
}
