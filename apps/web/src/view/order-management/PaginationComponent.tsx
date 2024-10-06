'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

type PaginationComponentProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationComponent: React.FC<PaginationComponentProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <Pagination className="mt-5 flex justify-center">
      <PaginationPrevious
        href={currentPage === 1 ? undefined : "#"} 
        onClick={currentPage === 1 ? undefined : () => handlePageChange(currentPage - 1)} 
        className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
      >
        Previous
      </PaginationPrevious>

      <PaginationContent>
        {currentPage > 3 && (
          <PaginationItem>
            <span className="ellipsis">...</span>
          </PaginationItem>
        )}
        {Array.from({ length: totalPages })
          .map((_, i) => i + 1)
          .filter(
            (page) =>
              page >= Math.max(currentPage - 1, 1) &&
              page <= Math.min(currentPage + 1, totalPages)
          )
          .map((page) => (
            <PaginationItem key={page}>
              {currentPage === page ? (
                <strong>{page}</strong> 
              ) : (
                <PaginationLink href="#" onClick={() => handlePageChange(page)}>
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <span className="ellipsis">...</span>
          </PaginationItem>
        )}
      </PaginationContent>

      <PaginationNext
        href={currentPage === totalPages ? undefined : "#"} 
        onClick={currentPage === totalPages ? undefined : () => handlePageChange(currentPage + 1)}
        className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
      >
        Next
      </PaginationNext>
    </Pagination>
  );
};

export default PaginationComponent;
