"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Quiz Creator Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create and share quizzes with anyone, anywhere.
        </p>
        <button
          onClick={() => router.push("/create")}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold
                     hover:bg-blue-700 transition-colors duration-200 shadow-lg"
        >
          Create a Quiz
        </button>
      </main>
    </div>
  );
}
