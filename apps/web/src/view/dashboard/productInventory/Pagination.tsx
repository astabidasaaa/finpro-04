import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Dispatch, SetStateAction } from 'react';

export default function PaginationInventory({
  page,
  setPage,
  total,
  pageSize,
}: {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  total: number;
  pageSize: number;
}) {
  const totalPages = Math.ceil(total / pageSize);
  const maxVisiblePages = 4;

  const getVisiblePages = (page: number, totalPages: number) => {
    let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, page + Math.floor(maxVisiblePages / 2));

    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
    }

    return { start, end };
  };

  const { start, end } = getVisiblePages(page, totalPages);
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <Pagination>
      <PaginationContent>
        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
            </PaginationItem>
            {start > 2 && <PaginationItem>..</PaginationItem>}
          </>
        )}

        {pages.map((pageNumber, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => setPage(pageNumber)}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <PaginationItem>..</PaginationItem>}
            <PaginationItem>
              <PaginationLink onClick={() => setPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
