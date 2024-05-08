import React, { useState } from "react";
import searchIcon from "../../image/AdminComponents/Search.png";
import "./SearchBrand.css";

function SearchBrand({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); // Notify parent component about the search term
  };

  return (
    <div className="search-brand">
      <div className="input-container">
        <img src={searchIcon} alt="Search" className="icon search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search Brand"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default SearchBrand;
