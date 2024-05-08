import React, { useState, useEffect } from "react";
import "./DisplayAllBrand.css";
import BrandCategoryPopup from "../BrandCategoryPopup";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../../firebase-config";

function DisplayAllBrand() {
  const [showPopup, setShowPopup] = useState(false);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const db = getFirestore(app);
      const brandsCollection = await getDocs(collection(db, "Brands"));
      const brandsList = brandsCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBrands(brandsList);
    };

    fetchBrands();
  }, []);

  const handleDisplayAll = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <button className="display-all-brand-btn" onClick={handleDisplayAll}>
        Display
        <br />
        All Brand
      </button>
      {showPopup && (
        <BrandCategoryPopup brands={brands} onClose={handleClosePopup} />
      )}
    </>
  );
}

export default DisplayAllBrand;
