import React, { useState } from "react";
import searchIcon from "../../assets/image/ClientComponents/Search.png";
import closeIcon from "../../assets/image/ClientComponents/Close.png";
import "./ClientSearchProduct.css";

function ClientSearchProduct({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setErrorMessage("");
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setErrorMessage("Search term cannot be empty");
      return;
    }
    onSearch(searchTerm);
  };

  // Function to handle key press events in the search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Check if the pressed key is Enter
      handleSearch(); // Call the handleSearch function
    }
  };

  return (
    <div className="client-search-id">
      <div className="client-input-container">
        <img src={searchIcon} alt="Search" className="icon search-icon" />
        <input
          type="text"
          className="client-search-input"
          placeholder="Search ID"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress} // Add the onKeyPress event handler here
        />
        {searchTerm && (
          <img
            src={closeIcon}
            alt="Clear"
            className="icon close-icon"
            onClick={clearSearch}
          />
        )}
        <button className="client-search-button" onClick={handleSearch}>
          Search
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
}

export default ClientSearchProduct;
