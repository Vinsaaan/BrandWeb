import React from "react";
import "./ItemDetails.css";

const ItemDetails = ({ item }) => {
  return (
    <div className="item-details-container">
      <h1 className="item-details-title">{item.name}</h1>
      <p className="item-details-category">
        <span className="item-label">Category:</span> {item.category}
      </p>
      <div className="item-details-series">
        <span className="item-label">Series Code / Year:</span>
        <span>{item.seriesCode}</span>
      </div>
    </div>
  );
};

export default ItemDetails;
