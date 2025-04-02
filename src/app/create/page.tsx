"use client";

import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizForm {
  title: string;
  questions: Question[];
}

export default function CreateQuiz() {
  const [quizForm, setQuizForm] = useState<QuizForm>({
    title: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ],
  });

  const addQuestion = () => {
    setQuizForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === index) {
          return { ...q, [field]: value };
        }
        return q;
      }),
    }));
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === questionIndex) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    }));
  };

  const [quizLink, setQuizLink] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quizForm),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      const data = await response.json();
      const quizUrl = `${window.location.origin}/attempt/${data.quizId}`;
      setQuizLink(quizUrl);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8  text-sm font-medium text-gray-700"
      style={{
        backgroundImage: "url(/quiz-bg.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Create a New Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Title
              <input
                type="text"
                value={quizForm.title}
                onChange={(e) =>
                  setQuizForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="p-1.5 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
          </div>

          {quizForm.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="bg-white shadow rounded-lg p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                {" "}
                {/* this is the question number code */}
                <h3 className="text-sm font-medium text-gray-700 ">
                  Question {questionIndex + 1}
                </h3>
                {quizForm.questions.length > 1 && ( // this is the remove button code
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                type="text"
                value={question.question}
                onChange={(e) =>
                  updateQuestion(questionIndex, "question", e.target.value)
                }
                placeholder="Enter your question"
                className="p-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />

              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name={`correct-${questionIndex}`}
                      checked={question.correctAnswer === optionIndex}
                      onChange={() =>
                        updateQuestion(
                          questionIndex,
                          "correctAnswer",
                          optionIndex
                        )
                      }
                      className="text-sm font-medium text-gray-700 focus:ring-blue-500 h-4 w-4  border-gray-300"
                      required
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        updateOption(questionIndex, optionIndex, e.target.value)
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      className="text-sm font-medium text-gray-700 p-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm  font-medium text-gray-700 rounded-md  bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Question
            </button>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Quiz
            </button>
          </div>

          {quizLink && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Quiz Created Successfully!
              </h3>
              <p className="text-sm text-green-600 mb-2">
                Share this link with your students:
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={quizLink}
                  readOnly
                  className="block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(quizLink);
                    alert("Link copied to clipboard!");
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
