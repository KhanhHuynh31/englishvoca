"use client";
import Loading from "@/components/Loading/Loading";
import Pagination from "@/components/Pagination/Pagination";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Unit {
  id: number;
  title: string;
  description: string;
  image: string;
  type: string;
  topic: string;
  status: string;
}

export default function BookUnits() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("Tất cả");
  const [hideLearned, setHideLearned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 4;
  // Fetch data from API
  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/units");
        const data = await res.json();
        if (res.ok) {
          setUnits(data);
        } else {
          setError(data.error || "Có lỗi xảy ra khi tải dữ liệu.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const filteredUnits = units.filter((unit) => {
    const matchType = filterType === "Tất cả" || unit.topic === filterType;
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
              : "bg-white text-purple-700 border-purple-300"
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
          "type",
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

      {/* Loading & Error */}
      {loading && <Loading />}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Units Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {paginatedUnits.map((unit) => (
              <div
                key={unit.id}
                className="relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="relative w-full h-[320px] ">
                  <div
                    className={`
                    w-full h-full rounded-2xl border p-6
                    flex flex-col items-center justify-center text-white transition 
                    ${
                      unit.status === "Đã học"
                        ? "bg-gradient-to-br from-red-400 to-red-600 border-red-200"
                        : "bg-gradient-to-br from-purple-600 to-indigo-500 border-purple-200"
                    }
                  `}
                  >
                    <div className="absolute top-0 left-0 h-full w-2 bg-purple-900 shadow-inner z-10 rounded-l-2xl" />

                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-inner mb-3">
                      <Image
                        width={96}
                        height={96}
                        src={`https://placehold.co/300x300.png?text=${unit.type}`}
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

                    <Link
                      href={`/learn/unit/${encodeURIComponent(unit.id)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-center mt-4 w-full py-2 rounded-xl font-semibold transition
                     bg-gray-200 text-purple-700 border border-purple-300 hover:bg-purple-50"
                    >
                      📖 Học ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            totalPages={totalPages}
            page={currentPage}
            setPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
