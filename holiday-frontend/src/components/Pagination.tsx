import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  prevPageUrl: string | null;
  nextPageUrl: string | null;
}

export const pageSize = 10;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  handlePrevPage,
  handleNextPage,
  prevPageUrl,
  nextPageUrl,
}) => {
  return (
    <div className="flex justify-between items-center mt-8">
      <button
        onClick={handlePrevPage}
        disabled={!prevPageUrl}
        className={`flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium
        ${
          !prevPageUrl
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </button>

      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
      </div>

      <button
        onClick={handleNextPage}
        disabled={!nextPageUrl}
        className={`flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium
        ${
          !nextPageUrl
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </button>
    </div>
  );
};

export default Pagination;
