import React, { useState } from "react";
import searchIcon from "../../image/AdminComponents/Search.png";
import "./SearchTrackingNumber.css"; // Ensure this path is correct

function SearchTrackingNumber({ onSearchChange }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value); // Notify the parent component of the change
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
          placeholder="Search Tracking Number"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default SearchTrackingNumber;
