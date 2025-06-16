"use client";

import { useState } from "react";
import Link from "next/link";
import Listening from "@/components/Listening/Listening";
import Image from "next/image";
const sampleQuestions = [
  {
    word: "happy",
    phonetic: "/ˈhæpi/",
    meaning: "vui vẻ, hạnh phúc",
    audioUrl:
      "https://www.oxfordlearnersdictionaries.com/media/english/us_pron/h/hap/happy/happy__us_1.mp3",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_960_720.jpg",
    options: ["buồn", "vui vẻ", "tức giận", "chán nản"],
    correct: "vui vẻ",
    type: "en",
  },
  {
    word: "lazy",
    phonetic: "/ˈleɪzi/",
    meaning: "lười biếng",
    audioUrl:
      "https://www.oxfordlearnersdictionaries.com/media/english/us_pron/l/laz/lazy_/lazy__us_1.mp3",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_960_720.jpg",
    options: ["chăm chỉ", "lười biếng", "vui tính", "nhanh nhẹn"],
    correct: "lười biếng",
    type: "en",
  },
];

export default function VocabularyQuiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const current = sampleQuestions[index];

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    if (answer === current.correct) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => {
      if (index + 1 >= sampleQuestions.length) {
        setFinished(true);
      } else {
        setIndex(index + 1);
        setSelected(null);
      }
    }, 1500);
  };
  if (finished) {
    return (
      <div className="w-full flex flex-col items-center justify-center text-center space-y-6 p-6 ">
        <h2 className="text-4xl font-bold text-green-600">🎉 Hoàn thành!</h2>
        <p className="text-xl">
          Bạn trả lời đúng <span className="font-semibold">{score}</span>/
          {sampleQuestions.length} câu.
        </p>
        <div className="flex gap-4 flex-wrap justify-center items-center">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              setIndex(0);
              setScore(0);
              setSelected(null);
              setFinished(false);
              setShowHint(false);
            }}
          >
            🔁 Làm lại
          </button>
          <Link href="/unit">
            <span className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
              📚 Học thêm từ mới
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8 min-h-[400px] flex flex-col gap-6 animate-fade-in">
      {/* Header with progress and counter */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
          <span>Tiến độ</span>
          <span>
            Câu {index + 1} / {sampleQuestions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${((index + 1) / sampleQuestions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Main content: responsive layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Question & Options */}
        <div className="flex-1 space-y-6">
          <div className="text-3xl font-bold text-center text-blue-700">
            {current.type === "en" ? (
              <>
                <div className="flex items-center gap-2 justify-center">
                  {current.word}{" "}
                  <span className="text-gray-500 text-xl">
                    {current.phonetic}
                  </span>
                </div>
                <Listening word={current.word} />
              </>
            ) : (
              current.meaning
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {current.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={!!selected}
                className={`p-4 border rounded-xl font-semibold transition-all duration-200 ease-in-out transform hover:scale-105
                  ${
                    selected
                      ? opt === current.correct
                        ? "bg-green-100 border-green-400 text-green-700"
                        : opt === selected
                        ? "bg-red-100 border-red-400 text-red-700"
                        : "bg-white"
                      : "hover:bg-blue-100 border-gray-300"
                  }
                `}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4 items-center">
            <label className="text-sm flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showHint}
                onChange={() => setShowHint((prev) => !prev)}
              />
              💡 Hiện hình minh hoạ
            </label>
            <button
              onClick={() => handleAnswer("Không biết")}
              className="text-sm bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              disabled={!!selected}
            >
              ❓ Không biết
            </button>
          </div>
        </div>

        {/* Right: Hint or image */}
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          {showHint ? (
            <Image
              width={300}
              height={300}
              src={current.imageUrl}
              alt={current.word}
              className="max-w-xs w-full rounded-lg shadow-lg border"
            />
          ) : (
            <div className="text-gray-400 italic text-center px-4">
              Chọn &quot;Hiện hình minh hoạ&quot; để xem hình gợi ý
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
