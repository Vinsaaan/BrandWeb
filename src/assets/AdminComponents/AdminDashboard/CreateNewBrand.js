import React, { useState } from "react";
import "./CreateNewBrand.css";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../../firebase-config";

function CreateNewBrand() {
  const [showPopup, setShowPopup] = useState(false);
  const [brandName, setBrandName] = useState("");

  const db = getFirestore(app);

  const handleCreateClick = () => {
    setShowPopup(true);
  };

  const handleCreateBrand = async () => {
    if (brandName) {
      try {
        const now = new Date();
        await addDoc(collection(db, "Brands"), {
          BrandName: brandName,
          CreateAt: now, // Store the entire Date object or format as desired
        });
        alert(`${brandName} created successfully!`);
        setBrandName("");
        setShowPopup(false);
        window.location.reload(); // Refresh the page
      } catch (error) {
        console.error("Error creating brand: ", error);
        alert(`Failed to create brand. Error: ${error.message}`);
      }
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <button className="create-new-brand-btn" onClick={handleCreateClick}>
        + Create
        <br />
        New Brand
      </button>

      {showPopup && (
        <div className="create-brand-popup">
          <div className="create-brand-content">
            <h2>Create New Brand</h2>
            <input
              type="text"
              placeholder="Enter brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="brand-input"
            />
            <button className="create-btn" onClick={handleCreateBrand}>
              Create
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateNewBrand;
