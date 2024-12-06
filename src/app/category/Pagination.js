'use client';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          {/* Prev */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center text-sm ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaChevronLeft className="mr-1" />
            Prev
          </button>

          {/* Números de página */}
          <div className="flex items-center space-x-2">
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md text-sm ${
                  page === currentPage 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center text-sm ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Next
            <FaChevronRight className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
