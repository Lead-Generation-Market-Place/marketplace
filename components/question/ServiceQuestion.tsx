"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import TextPlaceholder from "../elements/TextPlaceholder";

// Supabase models
interface Answer {
  id: number;
  text: string;
  description?: string;
}

interface Question {
  id: number;
  text: string;
  service_id: number;
  answers: Answer[];
}

interface ServiceQuestionProps {
  exactMatch: { id: number; name?: string }[];
}

export default function ServiceQuestion({ exactMatch }: ServiceQuestionProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (exactMatch.length > 0) {
      fetchQuestions();
    } else {
      setError("No exact match found.");
      setLoading(false);
    }
  }, [exactMatch]);

  async function fetchQuestions() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("questions")
      .select(`
        id,
        text,
        service_id,
        question_answers (
          answers (
            id,
            text,
            description
          )
        )
      `)
      .in(
        "service_id",
        exactMatch.map((match) => match.id)
      );

    if (error) {
      setError(error.message);
      setQuestions([]);
    } else {
      const formatted: Question[] = (data || []).map((q) => ({
        id: q.id,
        text: q.text,
        service_id: q.service_id,
        answers: q.question_answers.flatMap((qa) => qa.answers),
      }));
      setQuestions(formatted);
    }

    setLoading(false);
    setCurrentQuestion(0);
  }

  const handleSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handlePrevious = () => setCurrentQuestion((prev) => prev - 1);
  const handleNext = () => setCurrentQuestion((prev) => prev + 1);

  const handleSubmit = () => {
    alert("Answers submitted: " + JSON.stringify(selectedAnswers, null, 2));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <TextPlaceholder />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Service Questions</h1>
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Service Questions</h1>
        <p className="text-gray-800 dark:text-gray-300">No questions found for the selected service(s).</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="flex flex-col items-center justify-center mt-4 w-full">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded shadow-md p-4 transition-colors duration-300">
        <h2 className="font-semibold mb-2 text-center text-lg dark:text-gray-100">
          {currentQuestion + 1}. {question.text}
        </h2>
        <ul>
          {question.answers.map((answer) => (
            <li
              key={answer.id}
              className="mb-1 border p-4 rounded hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={answer.id}
                  checked={selectedAnswers[question.id] === answer.id}
                  onChange={() => handleSelect(question.id, answer.id)}
                  className="accent-blue-600 dark:accent-blue-400"
                />
                <span className="text-gray-800 dark:text-gray-100">{answer.text}</span>
              </label>
              {answer.description && (
                <p className="text-gray-500 dark:text-gray-400 text-xs d-block">{answer.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          disabled={currentQuestion === 0}
          onClick={handlePrevious}
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            currentQuestion === 0
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-blue-400 dark:bg-blue-800 text-white hover:bg-blue-500 dark:hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={selectedAnswers[question.id] == null}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              selectedAnswers[question.id] == null
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswers[question.id] == null}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              selectedAnswers[question.id] == null
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600"
            }`}
          >
            Submit
          </button>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        Question {currentQuestion + 1} of {questions.length}
      </div>
    </div>
  );
}