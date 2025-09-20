const PageNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  //handle previous page
  const handlePreviousPage = () => {
    onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={handlePreviousPage}
        className="px-2 py-1 bg-theme-base text-theme-primary rounded-md"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button onClick={() => onPageChange(i + 1)}>{i + 1}</button>
      ))}
      <button
        onClick={handleNextPage}
        className="px-2 py-1 bg-theme-base text-theme-primary rounded-md"
      >
        Next
      </button>
    </div>
  );
};

export default PageNavigation;
