"use client";

import { GetServiceQuestionsById } from "@/actions/services/service-question";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { SubmitAnswers } from "@/actions/answers/submit-answers";

export interface ServiceQuestion {
    form_id: number;
    service_id: number;
    step: number;
    form_type: string;
    question: string;
    options: string[];
    form_group: string;
}

export default function MultiChoiceServiceForm() {
    const [questions, setQuestions] = useState<ServiceQuestion[]>([]);
    const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
    const [isPending, setIsPending] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const businessName = searchParams.get("businessName");
    const location = searchParams.get("location");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const timezone = searchParams.get("timezone");
    const servicesParam = searchParams.get("services") || "";
    const services = servicesParam
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n));

    useEffect(() => {
        let isMounted = true;

        async function fetchQuestions() {
            try {
                if (!services.length) return;

                const allQuestions: ServiceQuestion[] = [];
                for (const form_id of services) {
                    const q = await GetServiceQuestionsById(form_id);
                    allQuestions.push(...q);
                }

                allQuestions.sort((a, b) => a.step - b.step);

                // Only set initial answers if answers is empty (first load)
                if (Object.keys(answers).length === 0) {
                    const initialAnswers: Record<number, string | string[]> = {};
                    allQuestions.forEach(question => {
                        if (question.form_type === "checkbox") {
                            initialAnswers[question.form_id] = [...question.options];
                        } else if (question.options.length > 0) {
                            initialAnswers[question.form_id] = question.options[0];
                        } else {
                            initialAnswers[question.form_id] = "";
                        }
                    });

                    if (isMounted) {
                        setQuestions(allQuestions);
                        setAnswers(initialAnswers);
                    }
                } else {
                    if (isMounted) {
                        setQuestions(allQuestions);
                    }
                }
            } catch (err) {
                toast.error(`Failed to load questions ${err}`);
            }
        }

        fetchQuestions();

        return () => {
            isMounted = false;
        };
    }, [services]);

    const handleAnswerChange = (questionId: number, value: string | string[]) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

const handleNext = async () => {
    setIsPending(true);
    try {
        // ✅ Prepare answer payload
        const payload = questions.map((q) => ({
            form_id: q.form_id,
            service_id: q.service_id,
            answer: answers[q.form_id],
        }));

        const result = await SubmitAnswers(payload);
        console.log(payload)

        if (!result.success) {
            
            toast.error(`Failed to submit answers: ${result.error}`);

            return;
        }

        // ✅ After successful submission, move to next step
        const params = new URLSearchParams({
            businessName: businessName ?? "",
            location: location ?? "",
            email: email ?? "",
            phone: phone ?? "",
            timezone: timezone ?? "",
            services: services.join(","),
        });

        router.push(`/professional/preference-geo?${params.toString()}`);
    } catch (error) {
        toast.error(`An error occurred while proceeding ${error}`);
    } finally {
        setIsPending(false);
    }
};

    const renderField = (question: ServiceQuestion) => {
        const name = `question-${question.form_id}`;
        const keyBase = `${question.step}-${question.form_id}`;
        const currentAnswer = answers[question.form_id] || "";

        switch (question.form_type) {
            case "checkbox":
                return (
                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.05 }}
                    >
                        {question.options.map((option, idx) => (
                            <motion.div
                                key={`${keyBase}-cb-${idx}`}
                                className="flex items-center"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <input
                                    type="checkbox"
                                    id={`${name}-${idx}`}
                                    name={name}
                                    checked={(currentAnswer as string[]).includes(option)}
                                    onChange={(e) => {
                                        const newValue = e.target.checked
                                            ? [...(currentAnswer as string[]), option]
                                            : (currentAnswer as string[]).filter(v => v !== option);
                                        handleAnswerChange(question.form_id, newValue);
                                    }}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`${name}-${idx}`}
                                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                                >
                                    {option}
                                </label>
                            </motion.div>
                        ))}
                    </motion.div>
                );

            case "radio":
                return (
                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.05 }}
                    >
                        {question.options.map((option, idx) => (
                            <motion.div
                                key={`${keyBase}-rd-${idx}`}
                                className="flex items-center"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <input
                                    type="radio"
                                    id={`${name}-${idx}`}
                                    name={name}
                                    value={option}
                                    checked={currentAnswer === option}
                                    onChange={() => handleAnswerChange(question.form_id, option)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`${name}-${idx}`}
                                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                                >
                                    {option}
                                </label>
                            </motion.div>
                        ))}
                    </motion.div>
                );

            case "select":
                return (
                    <motion.select
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        id={name}
                        name={name}
                        value={currentAnswer as string}
                        onChange={(e) => handleAnswerChange(question.form_id, e.target.value)}
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        {question.options.map((option, idx) => (
                            <option key={`${keyBase}-opt-${idx}`} value={option}>
                                {option}
                            </option>
                        ))}
                    </motion.select>
                );

            default:
                return (
                    <motion.input
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
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
    };

    return (
        <div className="max-w-4xl mx-auto p-4 pb-20">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
            >
                <p className="text-sm text-gray-600 mt-1">Please review and confirm your selections</p>
            </motion.div>

            <div className="space-y-4">
                <AnimatePresence>
                    {questions.map((question, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            exit={{ opacity: 0 }}
                            className="p-4"
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mr-3 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                                    {question.step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                                        {question.question}
                                    </h3>
                                    {renderField(question)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
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
                    className={`
            text-white text-[13px] py-2 px-6 rounded-[4px]
            transition duration-300 flex items-center justify-center gap-2
            ${isPending ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}
          `}
                >
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Next</span>
                </button>
            </div>
        </div>
    );
}