import React, { useState } from "react";
import searchIcon from "../../image/AdminComponents/Search.png";
import "./BrandAdminSearch.css";

function BrandAdminSearch({ onSearchChange }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <div className="search-tracking-container">
      <div className="tracking-input-container">
        <img
          src={searchIcon}
          alt="Search"
          className="tracking-icon search-icon"
        />
        <input
          type="text"
          className="tracking-search-input"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default BrandAdminSearch;
