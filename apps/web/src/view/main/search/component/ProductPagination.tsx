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
        {pages.map((page) => (
          <PaginationItem>
            <PaginationLink onClick={() => setPage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
