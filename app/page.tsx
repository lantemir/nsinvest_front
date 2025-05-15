
"use client";
import Link from "next/link";

export default function Home() {




  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 text-center">
    <div className="max-w-2xl">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
        Обучение IT профессиям
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8">
        Получите знания и навыки в области программирования, кибербезопасности,
        тестирования и других востребованных IT-направлениях.
      </p>

      <Link
        href="/dashboard"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
      >
        Перейти в личный кабинет
      </Link>
    </div>    

  </main>
  );
}
