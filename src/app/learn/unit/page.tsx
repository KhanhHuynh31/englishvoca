"use client";

import Loading from "@/components/Loading/Loading";
import Pagination from "@/components/Pagination/Pagination";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";

// Types
interface Unit {
  id: number;
  title: string;
  description: string;
  image: string;
  type: string;
  topic: string;
  status: string;
}

interface ApiError {
  error: string;
  status?: number;
}

interface FilterState {
  type: string;
  hideLearned: boolean;
}

// Constants
const UNIT_TYPES = ["Tất cả", "Ngữ pháp", "Từ vựng", "Giao tiếp"] as const;
const ITEMS_PER_PAGE = 4;
const DEFAULT_FILTER_STATE: FilterState = {
  type: "Tất cả",
  hideLearned: false,
};

// Custom hooks
const useUnits = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/units");

      if (!response.ok) {
        let errorMessage = "Có lỗi xảy ra khi tải dữ liệu.";

        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.warn("Failed to parse error response:", parseError);
        }

        throw new Error(`${errorMessage} (${response.status})`);
      }

      const data: Unit[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu trả về không đúng định dạng.");
      }

      setUnits(data);
      console.log(`Successfully loaded ${data.length} units`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi không xác định";
      console.error("Error fetching units:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchUnits();
  }, [fetchUnits]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return { units, loading, error, refetch };
};

const useFilters = (units: Unit[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterState, setFilterState] =
    useState<FilterState>(DEFAULT_FILTER_STATE);

  // Memoized filtered units to prevent unnecessary recalculations
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchType =
        filterState.type === "Tất cả" || unit.topic === filterState.type;
      const matchStatus = !filterState.hideLearned || unit.status !== "Đã học";
      return matchType && matchStatus;
    });
  }, [units, filterState]);

  // Memoized pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredUnits.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUnits = filteredUnits.slice(startIndex, endIndex);

    return { totalPages, paginatedUnits };
  }, [filteredUnits, currentPage]);

  // Filter handlers
  const handleFilterTypeChange = useCallback(
    (type: string): void => {
      if (type !== filterState.type) {
        setFilterState((prev) => ({ ...prev, type }));
        setCurrentPage(1);
        console.log(`Filter changed to: ${type}`);
      }
    },
    [filterState.type]
  );

  const handleHideLearnedToggle = useCallback((): void => {
    setFilterState((prev) => {
      const newState = { ...prev, hideLearned: !prev.hideLearned };
      setCurrentPage(1);
      console.log(`Hide learned toggled: ${newState.hideLearned}`);
      return newState;
    });
  }, []);

  const handlePageChange = useCallback(
    (page: number): void => {
      if (
        page !== currentPage &&
        page >= 1 &&
        page <= paginationData.totalPages
      ) {
        setCurrentPage(page);
        console.log(`Page changed to: ${page}`);
      }
    },
    [currentPage, paginationData.totalPages]
  );

  return {
    currentPage,
    filterState,
    filteredUnits,
    paginationData,
    handleFilterTypeChange,
    handleHideLearnedToggle,
    handlePageChange,
  };
};

// Sub-components
const FilterButtons = ({
  options,
  selected,
  onChange,
}: {
  options: readonly string[];
  selected: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-wrap gap-2 justify-center">
    {options.map((option) => (
      <button
        key={option}
        onClick={() => onChange(option)}
        className={`px-4 py-2 rounded-full font-medium border transition-colors duration-200 ${
          selected === option
            ? "bg-purple-600 text-white border-purple-600"
            : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
        }`}
        aria-pressed={selected === option}
      >
        {option}
      </button>
    ))}
  </div>
);

const UnitCard = ({ unit }: { unit: Unit }) => {
  const isLearned = unit.status === "Đã học";

  return (
    <div className="relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
      <div className="relative w-full h-[320px]">
        <div
          className={`w-full h-full rounded-r-2xl rounded-l-md border p-6 flex flex-col items-center justify-center text-white transition-colors duration-200 ${
            isLearned
              ? "bg-gradient-to-br from-red-400 to-red-600 border-red-200"
              : "bg-gradient-to-br from-purple-600 to-indigo-500 border-purple-200"
          }`}
        >
          <div className="absolute top-0 left-0 h-full w-2 bg-purple-900 shadow-inner z-10 rounded-l-2xl" />

          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-inner mb-3">
            <Image
              width={96}
              height={96}
              src={`https://placehold.co/300x300.png?text=${encodeURIComponent(
                unit.type
              )}`}
              alt={`${unit.title} - ${unit.type}`}
              className="w-full h-full object-cover"
              priority={false}
            />
          </div>

          <h2 className="text-base sm:text-lg font-bold text-center mb-2">
            {unit.title}
          </h2>

          <p className="text-sm text-center mb-1">{unit.description}</p>

          <p className="text-xs text-center italic text-purple-100 mb-4">
            {unit.type} • {unit.topic}
          </p>

          <Link
            href={`/learn/unit/${encodeURIComponent(unit.id)}`}
            className="text-center w-full py-2 rounded-xl font-semibold transition-colors duration-200 bg-gray-200 text-purple-700 border border-purple-300 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            📖 Học ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

const ErrorMessage = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => Promise<void>;
}) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async (): Promise<void> => {
    try {
      setRetrying(true);
      await onRetry();
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">{error}</p>
      <button
        onClick={handleRetry}
        disabled={retrying}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {retrying ? "Đang thử lại..." : "Thử lại"}
      </button>
    </div>
  );
};

// Main component
export default function BookUnits() {
  const { units, loading, error, refetch } = useUnits();
  const {
    currentPage,
    filterState,
    paginationData,
    handleFilterTypeChange,
    handleHideLearnedToggle,
    handlePageChange,
  } = useFilters(units);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6">
      {/* Filters Section */}
      <div className="mb-6 flex items-center justify-center flex-wrap gap-3">
        <FilterButtons
          options={UNIT_TYPES}
          selected={filterState.type}
          onChange={handleFilterTypeChange}
        />

        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filterState.hideLearned}
            onChange={handleHideLearnedToggle}
            className="form-checkbox h-5 w-5 text-red-500 border-red-300 focus:ring-red-500 rounded"
          />
          <span className="text-sm font-medium text-red-600">
            Ẩn các unit đã học
          </span>
        </label>
      </div>

      {/* Content Section */}
      {loading && <Loading />}

      {error && <ErrorMessage error={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          {paginationData.paginatedUnits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không tìm thấy unit nào phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          ) : (
            <>
              {/* Units Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
                {paginationData.paginatedUnits.map((unit) => (
                  <UnitCard key={unit.id} unit={unit} />
                ))}
              </div>

              {/* Pagination */}
              {paginationData.totalPages > 1 && (
                <Pagination
                  totalPages={paginationData.totalPages}
                  page={currentPage}
                  setPage={handlePageChange}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
