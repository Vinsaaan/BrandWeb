import React, { useState, useEffect } from "react";
import "./AddTrackingNumberPopup.css";
import addIcon from "../../image/AdminComponents/addIcon.png";
import delIcon from "../../image/AdminComponents/delIcon.png";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { app } from "../../../firebase-config";

const AddTrackingNumberPopup = ({
  onSave,
  onCancel,
  name,
  category,
  seriesCode,
}) => {
  const [trackingNumbers, setTrackingNumbers] = useState([]);
  const [numberOfInputs, setNumberOfInputs] = useState(1);
  const [error, setError] = useState("");
  const db = getFirestore(app);

  useEffect(() => {
    if (trackingNumbers.length > numberOfInputs) {
      setTrackingNumbers(trackingNumbers.slice(0, numberOfInputs));
    }
  }, [numberOfInputs, trackingNumbers]);

  const handleInputChange = (index, value) => {
    const newTrackingNumbers = [...trackingNumbers];
    newTrackingNumbers[index] = value;
    setTrackingNumbers(newTrackingNumbers);
    if (error) setError("");
  };

  const handleNumberInputChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue > 0) {
      setNumberOfInputs(newValue);
    } else {
      setNumberOfInputs(1);
    }
  };

  const handleSave = async () => {
    const validTrackingNumbers = trackingNumbers
      .filter(Boolean)
      .map((trackingNumber) => ({
        trackingNumber,
        createdAt: new Date().toLocaleDateString("en-GB"), // Format: DD/MM/YYYY
      }));

    if (validTrackingNumbers.length === 0) {
      setError("Tracking Number cannot be empty.");
      return;
    }

    try {
      const productRef = collection(db, "Product");
      const q = query(
        productRef,
        where("BrandName", "==", name),
        where("CategoryName", "==", category),
        where("SeriesCode", "==", seriesCode)
      );

      const productQuerySnapshot = await getDocs(q);

      if (!productQuerySnapshot.empty) {
        const updatePromises = productQuerySnapshot.docs.map((productDoc) => {
          const productId = productDoc.id;
          const existingTrackingNumbers =
            productDoc.data().TrackingNumbers || [];
          const updatedTrackingNumbers = [
            ...existingTrackingNumbers,
            ...validTrackingNumbers,
          ];

          return updateDoc(doc(db, "Product", productId), {
            TrackingNumbers: updatedTrackingNumbers,
          });
        });

        await Promise.all(updatePromises);
        window.location.reload(); // Refresh the page
      } else {
        setError("Product not found. Please check the details and try again.");
      }
    } catch (error) {
      console.error("Error saving tracking numbers: ", error);
      setError("Failed to save tracking numbers. Please try again.");
    }
  };

  const incrementNumber = () => {
    setNumberOfInputs((prev) => prev + 1);
  };

  const decrementNumber = () => {
    setNumberOfInputs((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="add-tracking-popup-overlay">
      <div className="add-tracking-popup">
        <h2>Add Tracking Number</h2>
        <div className="header-row">
          <button onClick={decrementNumber}>
            <img src={delIcon} alt="Decrease" />
          </button>
          <input
            className="number-input"
            type="text"
            value={numberOfInputs}
            onChange={handleNumberInputChange}
          />
          <button onClick={incrementNumber}>
            <img src={addIcon} alt="Increase" />
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="tracking-inputs">
          {Array.from({ length: numberOfInputs }, (_, index) => (
            <div key={index} className="tracking-input-row">
              <label>{index + 1}.</label>
              <input
                type="text"
                placeholder="Tracking number"
                value={trackingNumbers[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="add-tracking-buttons">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTrackingNumberPopup;
