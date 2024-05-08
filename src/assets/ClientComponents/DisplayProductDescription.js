import React from "react";
import "./DisplayProductDescription.css";
import NotFoundImage from "../image/ClientComponents/NotFound.png";

const DisplayProductDescription = ({ productInfo, isLoading, error }) => {
  // Function to safely set inner HTML for product descriptions
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // Check if the search is in progress and show a loading indicator
  if (isLoading) {
    return (
      <div className="client-product-description-container">
        <div className="loading-indicator">Loading...</div>
      </div>
    );
  }

  // Main content display logic
  return (
    <div className="client-product-description-container">
      <div className="client-product-content">
        {console.log("Error:", error)} {/* Log the error state */}
        {error ? (
          // Display "Product Not Found" when there is an error message
          <>
            <div className="client-product-image-container">
              <img
                src={NotFoundImage}
                alt="Not Found"
                className="client-product-image"
              />
            </div>
            <div className="client-product-details-container">
              <h3 className="client-product-not-found-title">{error}</h3>
            </div>
          </>
        ) : productInfo ? (
          // Product information available
          <>
            <div className="client-product-image-container">
              <img
                src={productInfo.imageUrl}
                alt={productInfo.name || "Product Image"}
                className="client-product-image"
              />
            </div>
            <div className="client-product-details-container">
              <div
                className="client-product-description"
                dangerouslySetInnerHTML={createMarkup(productInfo.description)}
              />
              {/* Additional product details can be added here if necessary */}
            </div>
          </>
        ) : (
          // Display when there's no product info and no error, should be rare due to outer conditionals
          <div className="client-product-details-container">
            <h3 className="client-product-not-found-title">
              Product Not Found
            </h3>
          </div>
        )}
      </div>
      {/* Display "Claimed by" text if applicable and registration completed */}
      {productInfo && productInfo.claimedByEmail && (
        <div className="claimed-by-container">
          Claimed by: {productInfo.claimedByEmail}
        </div>
      )}
    </div>
  );
};

export default DisplayProductDescription;
