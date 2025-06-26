"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import {
  Filter,
  EyeOff,
  Eye,
  BookOpen,
  CheckCircle,
  MessageSquare,
  FileText,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Unit {
  id: number;
  title: string;
  description: string;
  topic: string;
  status: string;
}

interface Props {
  units: Unit[];
}

const ITEMS_PER_PAGE = 4;

export default function BookUnitsClient({ units: fallbackUnits }: Props) {
  const [units, setUnits] = useState<Unit[]>(fallbackUnits);
  const [topics, setTopics] = useState<string[]>(["Tất cả"]);
  const [filterType, setFilterType] = useState("Tất cả");
  const [hideLearned, setHideLearned] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function fetchUnits() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      const { data: unitList, error: unitError } = await supabase
        .from("units")
        .select("id, title, description, topic")
        .order("id", { ascending: true });

      if (unitError || !unitList) return setUnits(fallbackUnits);

      // 🆕 Lấy danh sách topic duy nhất
      const uniqueTopics = Array.from(
        new Set(unitList.map((unit) => unit.topic))
      ).filter(Boolean);

      setTopics(["Tất cả", ...uniqueTopics]);

      const learnedMap: Record<number, Set<string>> = {};
      const totalMap: Record<number, number> = {};

      if (user) {
        const { data: allVocabs } = await supabase
          .from("vocabulary")
          .select("id, unit_id");

        const { data: userVocabs } = await supabase
          .from("user_vocab")
          .select("word_id")
          .eq("user_id", user.id);
        if (allVocabs && userVocabs) {
          for (const vocab of allVocabs) {
            const unitId = vocab.unit_id;
            if (!unitId) continue;
            totalMap[unitId] = (totalMap[unitId] || 0) + 1;
          }

          for (const vocab of allVocabs) {
            const unitId = vocab.unit_id;
            if (!unitId) continue;
            const isLearned = userVocabs.some((uv) => uv.word_id === vocab.id);
            if (isLearned) {
              if (!learnedMap[unitId]) learnedMap[unitId] = new Set();
              learnedMap[unitId].add(vocab.id);
            }
          }
        }
      }

      const finalUnits: Unit[] = unitList.map((unit) => {
        const learnedCount = learnedMap[unit.id]?.size || 0;
        const totalCount = totalMap[unit.id] || 0;
        const status =
          totalCount > 0 && learnedCount === totalCount ? "Đã học" : "Chưa học";
        return { ...unit, status };
      });

      setUnits(finalUnits);
    }

    fetchUnits();
  }, [fallbackUnits]);

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

  const renderIcon = (unit: Unit) => {
    if (unit.status === "Đã học") {
      return <CheckCircle className="w-8 h-8" />;
    }

    switch (unit.topic) {
      case "Ngữ pháp":
        return <FileText className="w-8 h-8" />;
      case "Từ vựng":
        return <BookOpen className="w-8 h-8" />;
      case "Giao tiếp":
        return <MessageSquare className="w-8 h-8" />;
      default:
        return <FileText className="w-8 h-8" />;
    }
  };

  return (
    <div className="w-full p-4">
      <div className="mb-6 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-gray-600 flex items-center gap-1">
          <Filter className="w-4 h-4" />
          Bộ lọc:
        </span>

        {topics.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-4 py-2 rounded-full font-medium border transition-colors text-sm ${
              filterType === type
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
            }`}
          >
            {type}
          </button>
        ))}

        <button
          onClick={toggleHideLearned}
          className="flex items-center gap-1 text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded-full hover:bg-red-50 transition"
        >
          {hideLearned ? (
            <>
              <EyeOff className="w-4 h-4" />
              Đang ẩn đã học
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Hiện tất cả
            </>
          )}
        </button>
      </div>

      {paginatedUnits.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          Không có unit phù hợp với bộ lọc.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-4">
            {paginatedUnits.map((unit) => (
              <div
                key={unit.id}
                className={`p-6 rounded-2xl border transition-transform hover:scale-[1.02] ${
                  unit.status === "Đã học"
                    ? "bg-gradient-to-br from-red-400 to-red-600 text-white"
                    : "bg-gradient-to-br from-purple-600 to-indigo-500 text-white"
                }`}
              >
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-white text-purple-600 shadow mb-4">
                  {renderIcon(unit)}
                </div>

                <h2 className="text-lg font-bold text-center mb-2">
                  {unit.title}
                </h2>
                <p className="text-sm text-center">{unit.description}</p>
                <p className="text-xs text-center italic mt-1">{unit.topic}</p>

                <Link
                  href={`/learn/unit/${unit.id}`}
                  className="block mt-4 text-center bg-white text-purple-700 font-semibold rounded-xl py-2 hover:bg-purple-100"
                >
                  📖 Học ngay
                </Link>
              </div>
            ))}
          </div>

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
