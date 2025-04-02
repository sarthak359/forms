"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export default function AttemptQuiz() {
  const params = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<{
    score: number;
    totalQuestions: number;
    percentage: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Quiz not found");
        }
        const data = await response.json();
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(-1));
      } catch (error) {
        setError("Failed to load quiz. Please check the URL and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id]);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const result = await response.json();
      setScore(result);
    } catch (error) {
      setError("Failed to submit quiz. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Quiz not found</div>
      </div>
    );
  }

  if (score) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Quiz Results
          </h2>
          <div className="text-center space-y-4">
            <p className="text-lg">
              Score: {score.score} out of {score.totalQuestions}
            </p>
            <p className="text-xl font-semibold text-blue-600">
              Percentage: {score.percentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {quiz.title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {quiz.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="bg-white shadow rounded-lg p-6 space-y-4"
            >
              <h3 className="text-lg font-medium">
                Question {questionIndex + 1}
              </h3>
              <p className="text-gray-700">{question.question}</p>

              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={optionIndex}
                      checked={answers[questionIndex] === optionIndex}
                      onChange={() =>
                        handleAnswerSelect(questionIndex, optionIndex)
                      }
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      required
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
