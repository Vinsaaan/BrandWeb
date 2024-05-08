import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../../firebase-config";
import "./BrandAdminNumbers.css"; // Ensure this is the correct path

function BrandAdminNumbers({ brandName }) {
  const [registeredCount, setRegisteredCount] = useState(0);
  const [unregisteredCount, setUnregisteredCount] = useState(0);
  const [totalTrackingNumbers, setTotalTrackingNumbers] = useState(0); // Add this line
  const db = getFirestore(app);

  useEffect(() => {
    if (!brandName) return;

    const fetchCounts = async () => {
      let localTotalTrackingNumbers = 0; // Change to a local variable
      let totalRegistered = 0;

      // Fetch all products for the given brand
      const productRef = collection(db, "Product");
      const productQuery = query(
        productRef,
        where("BrandName", "==", brandName)
      );
      const productSnapshot = await getDocs(productQuery);

      // Initialize an object to accumulate tracking numbers by unique identifiers
      const trackingNumbersMap = {};

      productSnapshot.forEach((doc) => {
        const product = doc.data();
        const productKey = `${product.SeriesCode}-${product.CategoryName}`;
        trackingNumbersMap[productKey] =
          (trackingNumbersMap[productKey] || 0) +
          (product.TrackingNumbers ? product.TrackingNumbers.length : 0);
      });

      // Fetch registered count for each unique product based on brand, seriesCode, and categoryName
      for (const [productKey, count] of Object.entries(trackingNumbersMap)) {
        const [seriesCode, categoryName] = productKey.split("-");
        const registeredRef = collection(db, "ClientProductRegistered");
        const registeredQuery = query(
          registeredRef,
          where("brandName", "==", brandName),
          where("seriesCode", "==", seriesCode),
          where("categoryName", "==", categoryName)
        );
        const registeredSnapshot = await getDocs(registeredQuery);
        totalRegistered += registeredSnapshot.docs.length;

        localTotalTrackingNumbers += count;
      }

      // Update state with the new counts
      setRegisteredCount(totalRegistered);
      setUnregisteredCount(localTotalTrackingNumbers - totalRegistered);
      setTotalTrackingNumbers(localTotalTrackingNumbers); // Update this line
    };

    fetchCounts();
  }, [db, brandName]);

  return (
    <div className="brand-admin-numbers">
      <div className="number-box">
        <h2>Tracking Number:</h2>
        <p>{totalTrackingNumbers}</p> {/* Now this uses the state variable */}
      </div>
      <div className="number-box">
        <h2>Registered:</h2>
        <p>{registeredCount}</p>
      </div>
      <div className="number-box">
        <h2>Unregistered:</h2>
        <p>{unregisteredCount}</p>
      </div>
    </div>
  );
}

export default BrandAdminNumbers;
