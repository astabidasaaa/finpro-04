import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Dispatch, SetStateAction } from 'react';

export default function ProductPagination({
  pages,
  setPage,
}: {
  pages: number[];
  setPage: Dispatch<SetStateAction<number>>;
}) {
  return (
    <Pagination>
      <PaginationContent>
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            <PaginationLink onClick={() => setPage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
