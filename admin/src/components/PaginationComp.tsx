import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationCompProps {
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
}

export function PaginationComp({ totalPages, currentPage, setPage }: PaginationCompProps) {
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setPage(page);
    }
  };

  // Helper function to generate page numbers
  const generatePageNumbers = () => {
    const pages: number[] = [];
    const range = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    };

    if (totalPages <= 5) {
      // If there are 5 or fewer pages, show all pages
      range(1, totalPages);
    } else if (currentPage <= 3) {
      // If the current page is near the beginning
      range(1, 4);
      pages.push(NaN); // Ellipsis
      range(totalPages - 1, totalPages);
    } else if (currentPage >= totalPages - 2) {
      // If the current page is near the end
      range(1, 2);
      pages.push(NaN); // Ellipsis
      range(totalPages - 3, totalPages);
    } else {
      // If the current page is in the middle
      range(1, 2);
      pages.push(NaN); // Ellipsis
      range(currentPage - 1, currentPage + 1);
      pages.push(NaN); // Ellipsis
      range(totalPages - 1, totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        {currentPage !== 1 && 
        (<PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>)
        }

        {/* Page Links */}
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {isNaN(page) ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        {currentPage !== totalPages &&
        (<PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationItem>)
        }
      </PaginationContent>
    </Pagination>
  );
}
