"use client";

import { GetServiceQuestionsById } from "@/actions/services/service-question";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SubmitAnswers } from "@/actions/answers/submit-answers";
import { ProgressBar } from "@/components/ui/Progressbar";

export interface ServiceQuestion {
  form_id: number;
  service_id: number;
  step: number;
  form_type: string;
  question: string;
  options: string[];
  form_group: string;
}

const ONBOARDING_STEPS = [
  { id: 1, name: 'Services' },
  { id: 2, name: 'Contact' },
  { id: 3, name: 'Profile' },
  { id: 4, name: 'Reviews' },
  { id: 5, name: 'Preferences' },
];


export default function MultiChoiceServiceForm() {
  const [questions, setQuestions] = useState<ServiceQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep] = useState(5);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Memoize search params to prevent unnecessary recalculations
  const { businessName, location, email, phone, timezone, services } = useMemo(() => {
    const servicesParam = searchParams.get("services") || "";
    return {
      businessName: searchParams.get("businessName") ?? "",
      location: searchParams.get("location") ?? "",
      email: searchParams.get("email") ?? "",
      phone: searchParams.get("phone") ?? "",
      timezone: searchParams.get("timezone") ?? "",
      services: servicesParam
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n)),
    };
  }, [searchParams]);

  // Prefetch the next page's data when component mounts
  useEffect(() => {
    router.prefetch("/professional/preference-geo");
  }, [router]);

  // Optimized question fetching
  useEffect(() => {
    let isMounted = true;

    async function fetchQuestions() {
      if (!services.length) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        // Fetch all questions in parallel
        const allQuestionsArrays = await Promise.all(
          services.map((form_id) => GetServiceQuestionsById(form_id))
        );

        const allQuestions = allQuestionsArrays.flat().sort((a, b) => a.step - b.step);

        if (isMounted) {
          setQuestions(allQuestions);

          // Initialize answers only if empty
          setAnswers((prevAnswers) => {
            if (Object.keys(prevAnswers).length === 0) {
              const initialAnswers: Record<number, string | string[]> = {};
              allQuestions.forEach((question) => {
                initialAnswers[question.form_id] =
                  question.form_type === "checkbox" ? [...question.options] : // All options selected
                    question.options.length > 0 ? question.options[0] : "";
              });
              return initialAnswers;
            }
            return prevAnswers;
          });

          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(`Failed to load questions: ${err}`);
          setIsLoading(false);
        }
      }
    }

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [services]);

  // Memoize the handler to prevent unnecessary re-renders
  const handleAnswerChange = useCallback((questionId: number, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  // Optimized next handler with prefetching
  const handleNext = useCallback(async () => {
    setIsPending(true);
    try {
      // Prepare payload while prefetching happens
      const payload = questions.map((q) => ({
        form_id: q.form_id,
        service_id: q.service_id,
        answer: answers[q.form_id],
      }));

      // Start both operations in parallel
      const [submitResult] = await Promise.all([
        SubmitAnswers(payload),
        // Prefetch the next route while submitting
        router.prefetch("/professional/preference-geo")
      ]);

      if (!submitResult.success) {
        toast.error(`Failed to submit answers: ${submitResult.error}`);
        return;
      }

      // Navigation will be instant since we prefetched
      router.push(`/professional/preference-geo?${new URLSearchParams({
        businessName,
        location,
        email,
        phone,
        timezone,
        services: services.join(","),
      }).toString()}`);

    } catch (error) {
      toast.error(`An error occurred while proceeding: ${error}`);
    } finally {
      setIsPending(false);
    }
  }, [questions, answers, businessName, location, email, phone, timezone, services, router]);

  // Memoize the renderField function to prevent unnecessary re-renders
  const renderField = useCallback((question: ServiceQuestion) => {
    const name = `question-${question.form_id}`;
    const currentAnswer = answers[question.form_id] || "";

    switch (question.form_type) {
      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <div key={`${question.form_id}-cb-${idx}`} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${name}-${idx}`}
                  name={name}
                  checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...(currentAnswer as string[]), option]
                      : (currentAnswer as string[]).filter((v) => v !== option);
                    handleAnswerChange(question.form_id, newValue);
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`${name}-${idx}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <div key={`${question.form_id}-rd-${idx}`} className="flex items-center">
                <input
                  type="radio"
                  id={`${name}-${idx}`}
                  name={name}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={() => handleAnswerChange(question.form_id, option)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`${name}-${idx}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "select":
        return (
          <select
            id={name}
            name={name}
            value={currentAnswer as string}
            onChange={(e) => handleAnswerChange(question.form_id, e.target.value)}
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {question.options.map((option, idx) => (
              <option key={`${question.form_id}-opt-${idx}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            id={name}
            name={name}
            value={currentAnswer as string}
            onChange={(e) => handleAnswerChange(question.form_id, e.target.value)}
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your answer"
          />
        );
    }
  }, [answers, handleAnswerChange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-6 w-6 animate-spin text-[#0077B6]" />
      </div>
    );
  }

  return (

    <div>
      <ProgressBar
        currentStep={currentStep}
        totalSteps={ONBOARDING_STEPS.length}
        steps={ONBOARDING_STEPS}
        className="mb-8"
      />
      <div className="max-w-4xl mx-auto p-4 pb-20">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mt-1">Please review and confirm your selections</p>
        </div>

        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.form_id} className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                  {question.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">{question.question}</h3>
                  {renderField(question)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white text-[13px] py-2 px-5 rounded-[4px] font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Back
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleNext}
            className={`text-white text-[13px] py-2 px-6 rounded-[4px] transition duration-300 flex items-center justify-center gap-2 ${isPending ? "bg-[#0077B6]/70 cursor-not-allowed" : "bg-[#0077B6] hover:bg-[#005f8e]"
              }`}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Next</span>
          </button>
        </div>
      </div>
    </div>

  );
}