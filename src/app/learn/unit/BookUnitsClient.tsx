"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";

interface Unit {
  id: number;
  title: string;
  description: string;
  image: string;
  type: string;
  topic: string;
  status: string;
}

interface Props {
  units: Unit[];
}

const UNIT_TYPES = ["Tất cả", "Ngữ pháp", "Từ vựng", "Giao tiếp"] as const;
const ITEMS_PER_PAGE = 4;

export default function BookUnitsClient({ units }: Props) {
  const [filterType, setFilterType] = useState("Tất cả");
  const [hideLearned, setHideLearned] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchType = filterType === "Tất cả" || unit.topic === filterType;
      const matchStatus = !hideLearned || unit.status !== "Đã học";
      return matchType && matchStatus;
    });
  }, [units, filterType, hideLearned]);

  const totalPages = Math.ceil(filteredUnits.length / ITEMS_PER_PAGE);
  const paginatedUnits = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUnits.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUnits, currentPage]);

  const handleTypeChange = useCallback((type: string) => {
    setFilterType(type);
    setCurrentPage(1);
  }, []);

  const toggleHideLearned = useCallback(() => {
    setHideLearned((prev) => !prev);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages]
  );

  return (
    <div className="w-full min-h-screen p-4 sm:p-6">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        {UNIT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-4 py-2 rounded-full font-medium border transition-colors ${
              filterType === type
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
            }`}
          >
            {type}
          </button>
        ))}
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hideLearned}
            onChange={toggleHideLearned}
            className="form-checkbox h-5 w-5 text-red-500 border-red-300 rounded"
          />
          <span className="text-sm font-medium text-red-600">
            Ẩn unit đã học
          </span>
        </label>
      </div>

      {/* Content */}
      {paginatedUnits.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          Không có unit phù hợp với bộ lọc.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
            {paginatedUnits.map((unit) => (
              <div
                key={unit.id}
                className={`p-6 rounded-2xl border transition-transform hover:scale-[1.02] ${
                  unit.status === "Đã học"
                    ? "bg-gradient-to-br from-red-400 to-red-600 text-white"
                    : "bg-gradient-to-br from-purple-600 to-indigo-500 text-white"
                }`}
              >
                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 shadow mb-4">
                  <Image
                    width={96}
                    height={96}
                    src={`https://placehold.co/300x300.png?text=${encodeURIComponent(
                      unit.type
                    )}`}
                    alt={unit.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-bold text-center mb-2">
                  {unit.title}
                </h2>
                <p className="text-sm text-center">{unit.description}</p>
                <p className="text-xs text-center italic mt-1">
                  {unit.type} • {unit.topic}
                </p>
                <Link
                  href={`/learn/unit/${unit.id}`}
                  className="block mt-4 text-center bg-white text-purple-700 font-semibold rounded-xl py-2 hover:bg-purple-100"
                >
                  📖 Học ngay
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              page={currentPage}
              setPage={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
