const PageNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  //selecet the nearest 4 page number to display
  const nearPages: number[] = [];
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 0 && i <= totalPages) {
      nearPages.push(i);
    }
  }

  //handle previous page
  const handlePreviousPage = () => {
    onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-2 absolute bg-main bottom-0 left-0 right-0">
      <button
        onClick={handlePreviousPage}
        className="px-2 py-1 bg-theme-base text-theme-muted rounded-md font-light text-sm"
      >
        Previous
      </button>
      {nearPages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="font-light text-sm"
        >
          {page}
        </button>
      ))}
      <button
        onClick={handleNextPage}
        className="px-2 py-1 bg-theme-base text-theme-muted rounded-md font-light text-sm"
      >
        Next
      </button>
    </div>
  );
};

export default PageNavigation;
