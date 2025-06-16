"use client";

import Listening from "@/components/Listening/Listening";
import Pagination from "@/components/Pagination/Pagination";
import { useState } from "react";

type WordStatus = "new" | "mastered" | "hard";

interface Word {
  id: number;
  term: string;
  definition: string;
  status: WordStatus;
  pronunciation: string;
  lastReviewed: string;
}

const initialWords: Word[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  term: `Word ${i + 1}`,
  definition: `Definition of word ${i + 1}`,
  status: ["new", "mastered", "hard"][i % 3] as WordStatus,
  pronunciation: `Word ${i + 1}`,
  lastReviewed: new Date(Date.now() - i * 86400000).toISOString(),
}));

const bgColorMap: Record<WordStatus, string> = {
  new: "bg-yellow-100",
  mastered: "bg-green-100",
  hard: "bg-red-100",
};

const WordBook = () => {
  const [allWords, setAllWords] = useState<Word[]>(initialWords);
  const [filter, setFilter] = useState<WordStatus>("new");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"date" | "alpha">("date");
  const [hideDefinition, setHideDefinition] = useState(false);
  const [revealedIds, setRevealedIds] = useState<number[]>([]);

  const words = allWords.filter((w) => w.status === filter);
  const sortedWords = [...words].sort((a, b) =>
    sort === "alpha"
      ? a.term.localeCompare(b.term)
      : new Date(b.lastReviewed).getTime() - new Date(a.lastReviewed).getTime()
  );

  const pageSize = 10;
  const paginatedWords = sortedWords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(sortedWords.length / pageSize);

  const changeStatus = (id: number, newStatus: WordStatus) => {
    setAllWords((prev) =>
      prev.map((word) =>
        word.id === id ? { ...word, status: newStatus } : word
      )
    );
  };
  return (
    <div className="w-full min-h-screen px-4 py-8 bg-[#fdf6e3] text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="sticky top-0 z-10 bg-[#fdf6e3]/90 backdrop-blur-md rounded-b-xl p-4 shadow-md">
          {/* Hàng 1: Tiêu đề + tổng số từ + nút ôn tập */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold">📘 Sổ từ</h1>
              <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 text-white text-xs font-medium shadow-md animate-[popUp_0.6s_ease-out]">
                {allWords.length} từ
              </div>
            </div>
            <button
              onClick={() => alert("Bắt đầu ôn tập")}
              className="text-m px-4 py-1.5 text-white font-semibold rounded-full bg-gradient-to-r from-orange-400 to-pink-400 hover:scale-105 transition-transform duration-300"
            >
              🧠 Ôn tập
            </button>
          </div>

          {/* Hàng 2: Bộ lọc trạng thái */}
          <div className="mt-4 flex flex-wrap gap-2 md:justify-start justify-between items-center">
            <div>
              {/* Mobile: chỉ hiển thị button tương ứng với filter */}
              <div className="md:hidden">
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as WordStatus);
                    setPage(1);
                  }}
                  className="px-2 py-2 rounded-xl border font-semibold"
                >
                  <option value="new">Chưa thuộc</option>
                  <option value="mastered">Đã thuộc</option>
                  <option value="hard">Từ khó</option>
                </select>
              </div>

              {/* Desktop: hiện đầy đủ 3 button */}
              <div className="hidden md:flex gap-2">
                {(["new", "mastered", "hard"] as WordStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilter(status);
                      setPage(1);
                    }}
                    className={`text-l px-3 py-1 rounded-full font-semibold transition-all duration-300 border ${
                      filter === status
                        ? `${bgColorMap[status]} text-black border-black shadow-md scale-105`
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {
                      {
                        new: "Chưa thuộc",
                        mastered: "Đã thuộc",
                        hard: "Từ khó",
                      }[status]
                    }{" "}
                    ({allWords.filter((w) => w.status === status).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Trên mobile: sắp xếp + ẩn nghĩa cũng nằm chung hàng */}
            <div className="flex items-center gap-2 md:hidden ml-auto">
              <button
                onClick={() =>
                  setSort((prev) => (prev === "date" ? "alpha" : "date"))
                }
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-200"
                title="Thay đổi sắp xếp"
              >
                <span className="text-sm font-medium">
                  {sort === "date" ? "Mới nhất" : "A-Z"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {sort === "date" ? (
                    // icon đồng hồ (date)
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ) : (
                    // icon chữ cái (alpha)
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 18v-6m0 0V6m0 6h4m-8 6V6m-4 12V6"
                    />
                  )}
                </svg>
              </button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hideDefinition}
                  onChange={(e) => {
                    setHideDefinition(e.target.checked);
                    setRevealedIds([]);
                  }}
                  className="accent-pink-500"
                />
                <span className="text-sm">Ẩn nghĩa</span>
              </label>
            </div>
          </div>

          {/* Hàng 3: Ẩn nghĩa + sắp xếp (chỉ hiển thị trên desktop) */}
          <div className="mt-3 hidden md:flex items-center gap-4 flex-wrap">
            <span className="font-medium">Sắp xếp:</span>
            <button
              onClick={() => setSort("date")}
              className={`px-3 py-1 rounded text-black ${
                sort === "date" ? "bg-black text-white" : "bg-white"
              }`}
            >
              Ngày ôn
            </button>
            <button
              onClick={() => setSort("alpha")}
              className={`px-3 py-1 rounded text-black ${
                sort === "alpha" ? "bg-black text-white" : "bg-white"
              }`}
            >
              A-Z
            </button>

            <label className="flex items-center gap-2 ml-4">
              <input
                type="checkbox"
                checked={hideDefinition}
                onChange={(e) => {
                  setHideDefinition(e.target.checked);
                  setRevealedIds([]);
                }}
                className="accent-pink-500"
              />
              <span className="text-sm">Ẩn toàn bộ nghĩa</span>
            </label>
          </div>
        </div>
        {paginatedWords.length === 0 ? (
          <div className="w-full py-16 text-center">
            <div
              className="text-6xl mb-4 animate-[bookFloat_3s_ease-in-out_infinite]"
              style={{
                display: "inline-block",
                animationName: "bookFloat",
                animationTimingFunction: "ease-in-out",
                animationDuration: "3s",
                animationIterationCount: "infinite",
              }}
            >
              📖
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Chưa có từ nào ở mục này
            </h2>
            <p className="text-gray-600 mb-4">
              Bắt đầu học ngay để bổ sung thêm từ vào sổ của bạn!
            </p>
            <button
              onClick={() => alert("Chuyển đến học từ mới")}
              className="px-6 py-2 text-white font-semibold rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 hover:scale-105 transition-transform duration-300"
            >
              🚀 Bắt đầu học
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedWords.map((word) => {
              const isRevealed = revealedIds.includes(word.id);
              return (
                <div
                  key={word.id}
                  className={`w-full p-3 rounded-xl border border-gray-200 shadow hover:shadow-lg transition-all duration-300 ${
                    bgColorMap[word.status]
                  } animate-slide-up`}
                  onClick={() => {
                    if (hideDefinition && !isRevealed) {
                      setRevealedIds([...revealedIds, word.id]);
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">{word.term}</h2>
                    <Listening word={word.term} />
                  </div>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      !hideDefinition || isRevealed
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 h-0 overflow-hidden"
                    }`}
                  >
                    <p className="text-sm text-gray-700 italic leading-snug">
                      {word.definition}
                    </p>
                  </div>

                  {hideDefinition && !isRevealed && (
                    <p className="text-sm italic text-gray-400 cursor-pointer">
                      ‣ Nhấn để hiện nghĩa
                    </p>
                  )}

                  <p className="text-xs text-gray-600 mt-1">
                    Lần ôn: {new Date(word.lastReviewed).toLocaleDateString()}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {word.status !== "mastered" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          changeStatus(word.id, "mastered");
                        }}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Đã thuộc
                      </button>
                    )}
                    {word.status !== "new" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          changeStatus(word.id, "new");
                        }}
                        className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        Chưa thuộc
                      </button>
                    )}
                    {word.status !== "hard" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          changeStatus(word.id, "hard");
                        }}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Từ khó
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Pagination totalPages={totalPages} page={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default WordBook;
