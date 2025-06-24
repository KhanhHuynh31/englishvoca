import { useEffect } from "react";

interface PaginationProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

export default function Pagination({
  totalPages,
  page,
  setPage,
}: PaginationProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-4 py-2 rounded-full font-medium border transition ${
            page === i + 1
              ? "bg-purple-600 text-white border-purple-700"
              : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
