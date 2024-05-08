import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore"; // Import Firestore functions
import { app } from "../../../firebase-config"; // Make sure this path is correct for your firebase-config
import AddTrackingNumberPopup from "./AddTrackingNumberPopup";
import "./Brand.css";

const Brand = ({ name, category, seriesCode, onSave }) => {
  const [showTrackingPopup, setShowTrackingPopup] = useState(false);
  const [trackingNumbers, setTrackingNumbers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAddTracking = () => {
    setShowTrackingPopup(true);
  };

  const handleSaveTrackingNumbers = (newTrackingNumbers) => {
    onSave(newTrackingNumbers);
    setShowTrackingPopup(false);
    setTrackingNumbers([...trackingNumbers, ...newTrackingNumbers]);
  };

  const handleCancelTracking = () => {
    setShowTrackingPopup(false);
  };

  const navigateToEditProductDescription = async () => {
    const db = getFirestore(app);
    const productRef = collection(db, "Product");
    const q = query(
      productRef,
      where("BrandName", "==", name),
      where("CategoryName", "==", category),
      where("SeriesCode", "==", seriesCode)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming the first document is the correct one
      const productId = querySnapshot.docs[0].id;
      navigate(`/admin/edititems/${productId}`);
    } else {
      alert("No matching product found for editing.");
    }
  };

  return (
    <div className="admin-brand-container">
      <div className="admin-brand-header">
        <h1 className="admin-brand-title">{name}</h1>
        <div className="admin-brand-buttons">
          <button
            className="admin-brand-button admin-add"
            onClick={handleAddTracking}
          >
            + Add Tracking
            <br />
            Number
          </button>
          <button
            className="admin-brand-button admin-edit"
            onClick={navigateToEditProductDescription}
          >
            Edit Product
            <br />
            Description
          </button>
        </div>
      </div>
      <p className="admin-brand-category">Category: {category}</p>
      <p className="admin-brand-series">Series Code / Year: {seriesCode}</p>
      {showTrackingPopup && (
        <AddTrackingNumberPopup
          onSave={handleSaveTrackingNumbers}
          onCancel={handleCancelTracking}
          name={name}
          category={category}
          seriesCode={seriesCode}
        />
      )}
    </div>
  );
};

export default Brand;
