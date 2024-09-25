'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          />
        </PaginationItem>

        {currentPage > 3 && (
          <PaginationItem>
            <span className="ellipsis">...</span>
          </PaginationItem>
        )}

        {Array.from({ length: totalPages })
          .map((_, index) => index + 1)
          .filter(
            (page) =>
              page >= Math.max(currentPage - 1, 1) &&
              page <= Math.min(currentPage + 1, totalPages)
          )
          .map((page) => (
            <PaginationItem key={page}>
              {page === currentPage ? (
                <strong>{page}</strong>
              ) : (
                <PaginationLink href="#" onClick={() => onPageChange(page)}>
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

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
