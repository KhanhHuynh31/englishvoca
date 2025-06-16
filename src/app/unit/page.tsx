"use client";
import Pagination from "@/components/Pagination/Pagination";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function BookUnits() {
  const [openedIds, setOpenedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("Tất cả");
  const [hideLearned, setHideLearned] = useState(false);
  const itemsPerPage = 4;

  const toggleOpen = (id: number) => {
    setOpenedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allUnits = [
    {
      id: 1,
      title: "Unit 1: Sentence Overview",
      description: "Tổng quan về câu trong tiếng Anh.",
      image: "https://source.unsplash.com/400x400/?english,sentence",
      progress: { Dễ: 90, Vừa: 60, Khó: 30 },
      type: "Ngữ pháp",
      topic: "Câu",
      status: "Đã học",
    },
    {
      id: 2,
      title: "Unit 2: Verb Tenses",
      description: "Các thì trong tiếng Anh.",
      image: "https://source.unsplash.com/400x400/?english,tense",
      progress: { Dễ: 70, Vừa: 50, Khó: 20 },
      type: "Ngữ pháp",
      topic: "Thì",
      status: "Chưa học",
    },
    {
      id: 3,
      title: "Unit 3: Modal Verbs",
      description: "Động từ khiếm khuyết và cách dùng.",
      image: "https://source.unsplash.com/400x400/?english,modal",
      progress: { Dễ: 80, Vừa: 60, Khó: 40 },
      type: "Ngữ pháp",
      topic: "Động từ",
      status: "Đã học",
    },
    {
      id: 4,
      title: "Unit 4: Passive Voice",
      description: "Câu bị động và ứng dụng.",
      image: "https://source.unsplash.com/400x400/?english,passive",
      progress: { Dễ: 85, Vừa: 70, Khó: 50 },
      type: "Ngữ pháp",
      topic: "Bị động",
      status: "Đã học",
    },
    {
      id: 5,
      title: "Unit 5: Conditional Sentences",
      description: "Câu điều kiện loại 0 đến 3.",
      image: "https://source.unsplash.com/400x400/?english,conditionals",
      progress: { Dễ: 60, Vừa: 45, Khó: 25 },
      type: "Ngữ pháp",
      topic: "Điều kiện",
      status: "Chưa học",
    },
    {
      id: 6,
      title: "Unit 6: Reported Speech",
      description: "Câu tường thuật trong tiếng Anh.",
      image: "https://source.unsplash.com/400x400/?english,reported",
      progress: { Dễ: 75, Vừa: 55, Khó: 35 },
      type: "Ngữ pháp",
      topic: "Câu",
      status: "Chưa học",
    },
    {
      id: 7,
      title: "Unit 7: Gerunds and Infinitives",
      description: "Danh động từ và động từ nguyên mẫu.",
      image: "https://source.unsplash.com/400x400/?english,gerund",
      progress: { Dễ: 65, Vừa: 50, Khó: 20 },
      type: "Ngữ pháp",
      topic: "Động từ",
      status: "Chưa học",
    },
    {
      id: 8,
      title: "Unit 8: Relative Clauses",
      description: "Mệnh đề quan hệ trong tiếng Anh.",
      image: "https://source.unsplash.com/400x400/?english,relative",
      progress: { Dễ: 68, Vừa: 55, Khó: 28 },
      type: "Ngữ pháp",
      topic: "Câu",
      status: "Đã học",
    },
  ];

  const filteredUnits = allUnits.filter((unit) => {
    const matchType = filterType === "Tất cả" || unit.type === filterType;
    const matchStatus = hideLearned ? unit.status !== "Đã học" : true;
    return matchType && matchStatus;
  });

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderFilterGroup = (
    title: string,
    options: string[],
    selected: string,
    setSelected: (val: string) => void
  ) => (
    <div className="flex flex-wrap gap-2 justify-center">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => {
            setSelected(opt);
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-full font-medium border transition ${
            selected === opt
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen p-4 sm:p-6">
      {/* Filters */}
      <div className="mb-6 flex items-center justify-center flex-wrap gap-3">
        {renderFilterGroup(
          "Type",
          ["Tất cả", "Ngữ pháp", "Từ vựng", "Giao tiếp"],
          filterType,
          setFilterType
        )}
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hideLearned}
            onChange={() => {
              setHideLearned(!hideLearned);
              setCurrentPage(1);
            }}
            className="form-checkbox h-5 w-5 text-red-500 border-red-300 focus:ring-red-500"
          />
          <span className="text-sm font-medium text-red-600">
            Ẩn các unit đã học
          </span>
        </label>
      </div>
      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {paginatedUnits.map((unit) => {
          const isOpen = openedIds.includes(unit.id);
          const avgProgress =
            (unit.progress.Dễ + unit.progress.Vừa + unit.progress.Khó) / 3;
          const learnedColor =
            avgProgress >= 70
              ? "from-green-500 to-green-600"
              : avgProgress >= 40
              ? "from-yellow-500 to-yellow-600"
              : "from-red-500 to-red-600";

          return (
            <div
              key={unit.id}
              onClick={() => toggleOpen(unit.id)}
              className="relative perspective cursor-pointer"
            >
              <div
                className={`relative w-full h-[320px] transition-transform duration-700 transform-style preserve-3d ${
                  isOpen ? "rotate-y-180" : ""
                }`}
              >
                {/* Front */}
                <div
                  className={`absolute w-full h-full backface-hidden ${
                    unit.status === "Đã học"
                      ? `bg-gradient-to-br ${learnedColor}`
                      : "bg-gradient-to-br from-purple-600 to-indigo-500"
                  } rounded-2xl shadow-xl border border-purple-200 p-6 flex flex-col items-center justify-center text-white z-20`}
                >
                  <div className="absolute top-0 left-0 h-full w-2 bg-purple-900 shadow-inner z-10 rounded-l-2xl" />
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-inner mb-3">
                    <Image
                      width={96}
                      height={96}
                      src={unit.image}
                      alt={unit.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-center">
                    {unit.title}
                  </h2>
                  <p className="text-sm text-center">{unit.description}</p>
                  <p className="text-xs text-center mt-1 italic text-purple-100">
                    {unit.type} • {unit.topic}
                  </p>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-2xl shadow-xl border border-purple-200 p-5 z-10 overflow-hidden flex flex-col justify-between">
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-purple-800 mb-3 text-center">
                      {unit.title}
                    </h4>
                    <div className="space-y-2">
                      {(["Dễ", "Vừa", "Khó"] as const).map((level) => {
                        const percent = unit.progress[level];
                        let barColor = "bg-red-500";
                        if (percent >= 70) barColor = "bg-green-500";
                        else if (percent >= 40) barColor = "bg-orange-400";

                        return (
                          <div
                            key={level}
                            className="px-3 py-2 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-700 font-medium">
                                {level}
                              </span>
                              <span className="font-bold text-gray-800">
                                {percent}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`${barColor} h-2 rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <Link
                    href="/learn"
                    onClick={(e) => e.stopPropagation()}
                    className="text-center mt-4 w-full bg-purple-600 text-white py-2 rounded-xl font-semibold hover:bg-purple-700 transition"
                  >
                    📖 Học ngay
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        totalPages={totalPages}
        page={currentPage}
        setPage={setCurrentPage}
      />

      {/* Flip styles */}
      <style jsx>{`
        .perspective {
          perspective: 1500px;
        }
        .transform-style {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
