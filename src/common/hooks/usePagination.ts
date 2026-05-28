import { useState, useMemo } from "react";

interface UsePaginationProps<T> {
  items: T[] | undefined;
  itemsPerPage: number;
}

export const usePagination = <T>({
  items,
  itemsPerPage,
}: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = items ? Math.ceil(items.length / itemsPerPage) : 0;

  const currentItems = useMemo(() => {
    if (!items) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
  };
};
