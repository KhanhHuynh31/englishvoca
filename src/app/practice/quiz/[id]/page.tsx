"use client";
import { useState } from "react";
import Link from "next/link";
import Listening from "@/components/Listening/Listening";
import Image from "next/image";
import { useVocabularyQuiz } from "@/components/hooks/useVocabularyQuiz";

export default function VocabularyQuiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showOnlyWrong, setShowOnlyWrong] = useState(false);
  const {
    questions,
    setQuestions,
    updateWrongAnswers,
    getWrongQuestionObjects,
  } = useVocabularyQuiz();
  const current = questions[index];

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    const isCorrect = answer === current.correct;
    setScore((prev) => prev + (isCorrect ? 1 : 0));
    updateWrongAnswers(current.word, isCorrect);

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setFinished(true);
      } else {
        setIndex(index + 1);
        setSelected(null);
        setShowHint(false);
      }
    }, 1200);
  };

  if (questions.length < 4 && !showOnlyWrong) {
    return (
      <div className="p-6 text-center text-lg text-gray-600">
        ⚠️ Bạn cần học thêm ít nhất 4 từ để bắt đầu luyện tập.
        <br />
        <Link
          href="/unit"
          className="text-blue-600 underline mt-2 inline-block"
        >
          📘 Học từ vựng ngay
        </Link>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="text-center space-y-4 p-6">
        {showOnlyWrong && (
          <p className="text-sm text-yellow-600">
            🔁 Bạn đã hoàn thành luyện lại các câu đã trả lời sai
          </p>
        )}
        <h2 className="text-3xl font-bold text-green-600">🎉 Hoàn thành!</h2>
        <p>
          Bạn trả lời đúng <strong>{score}</strong>/{questions.length} câu.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setIndex(0);
              setScore(0);
              setSelected(null);
              setFinished(false);
              setShowHint(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🔁 Làm lại
          </button>
          {getWrongQuestionObjects().length > 1 && (
            <button
              onClick={() => {
                const wrongQuestions = getWrongQuestionObjects();
                setQuestions(wrongQuestions);
                setIndex(0);
                setScore(0);
                setSelected(null);
                setFinished(false);
                setShowHint(false);
                setShowOnlyWrong(true);
              }}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              🔁 Làm lại câu sai
            </button>
          )}

          <Link href="/unit">
            <span className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
              📚 Học thêm từ mới
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6">
      <div>
        <div className="text-sm text-gray-600 mb-1 flex justify-between">
          <span>Tiến độ</span>
          <span>
            Câu {index + 1} / {questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="text-3xl font-bold text-blue-700 text-center">
            <div className="flex items-center justify-center gap-2">
              {current.word}
              {current.phonetic && (
                <span className="text-xl text-gray-500">
                  {current.phonetic}
                </span>
              )}
            </div>
            <Listening word={current.word} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {current.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={!!selected}
                className={`p-4 rounded-xl font-semibold transition
                  ${
                    selected
                      ? opt === current.correct
                        ? "bg-green-100 border border-green-500 text-green-700"
                        : opt === selected
                        ? "bg-red-100 border border-red-500 text-red-700"
                        : "bg-white border border-gray-300"
                      : "hover:bg-blue-100 border border-gray-300"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={showHint}
                onChange={() => setShowHint((prev) => !prev)}
              />
              💡 Hiện hình minh hoạ
            </label>
            <button
              onClick={() => handleAnswer("Không biết")}
              disabled={!!selected}
              className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              ❓ Không biết
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-[250px]">
          {showHint ? (
            <Image
              src={current.imageUrl}
              width={300}
              height={300}
              alt={current.word}
              className="rounded shadow-lg"
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
