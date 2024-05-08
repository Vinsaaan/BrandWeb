import React from "react";
import previousIcon from "../../image/AdminComponents/Previous.png"; // Replace with the actual path
import nextIcon from "../../image/AdminComponents/Next.png"; // Replace with the actual path
import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  const delta = 2; // delta is the number of page numbers to show around the current page

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    pageNumbers.push(i);
  }

  if (currentPage - delta > 2) {
    pageNumbers.unshift("...");
  }

  if (currentPage + delta < totalPages - 1) {
    pageNumbers.push("...");
  }

  pageNumbers.unshift(1);
  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="page-button"
      >
        <img src={previousIcon} alt="Previous" className="previous-icon" />
        Previous Page
      </button>
      {pageNumbers.map((number, index) =>
        number === "..." ? (
          <span key={index} className="page-item-ellipsis">
            &hellip;
          </span>
        ) : (
          <button
            key={index}
            className={`page-button number-button ${
              currentPage === number ? "active" : ""
            }`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="page-button"
      >
        Next Page
        <img src={nextIcon} alt="Next" className="next-icon" />
      </button>
    </div>
  );
}

export default Pagination;
