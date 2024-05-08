import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../../firebase-config";
import "./BrandAdminDropdown.css";

function BrandAdminDropdown({
  brandName,
  setFilteredCategory,
  setFilteredSeriesCode,
  setRegisteredStatus,
  registeredStatus,
}) {
  const [categories, setCategories] = useState(["All"]);
  const [seriesCodes, setSeriesCodes] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeriesCode, setSelectedSeriesCode] = useState("All");
  const db = getFirestore(app);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesSet = new Set(["All"]);
      const querySnapshot = await getDocs(
        query(collection(db, "Product"), where("BrandName", "==", brandName))
      );
      querySnapshot.forEach((doc) => {
        categoriesSet.add(doc.data().CategoryName);
      });
      setCategories([...categoriesSet]);
    };

    fetchCategories();
  }, [brandName, db]);

  useEffect(() => {
    const fetchSeriesCodes = async () => {
      const seriesCodesSet = new Set(["All"]);
      let seriesQuery = collection(db, "Product");

      if (selectedCategory !== "All") {
        seriesQuery = query(
          seriesQuery,
          where("BrandName", "==", brandName),
          where("CategoryName", "==", selectedCategory)
        );
      } else {
        seriesQuery = query(seriesQuery, where("BrandName", "==", brandName));
      }

      const querySnapshot = await getDocs(seriesQuery);
      querySnapshot.forEach((doc) => {
        seriesCodesSet.add(doc.data().SeriesCode);
      });
      setSeriesCodes([...seriesCodesSet]);
    };

    fetchSeriesCodes();
  }, [brandName, selectedCategory, db]);

  useEffect(() => {
    setFilteredCategory(selectedCategory);
    // Automatically reset series code dropdown when category changes
    if (selectedCategory === "All") {
      setSelectedSeriesCode("All");
    }
  }, [selectedCategory, setFilteredCategory]);

  useEffect(() => {
    setFilteredSeriesCode(selectedSeriesCode);
  }, [selectedSeriesCode, setFilteredSeriesCode]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSeriesCodeChange = (event) => {
    setSelectedSeriesCode(event.target.value);
  };

  const handleRegisteredStatusChange = (event) => {
    setRegisteredStatus(event.target.value);
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown-row">
        <label htmlFor="category" className="dropdown-label">
          Category:
        </label>
        <select
          id="category"
          className="dropdown-select"
          onChange={handleCategoryChange}
          value={selectedCategory}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="dropdown-row">
        <label htmlFor="seriesCode" className="dropdown-label">
          Series Code:
        </label>
        <select
          id="seriesCode"
          className="dropdown-select"
          onChange={handleSeriesCodeChange}
          value={selectedSeriesCode}
        >
          {seriesCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>
      <div className="dropdown-row">
        <label htmlFor="registeredStatus" className="dropdown-label">
          Registered Status:
        </label>
        <select
          id="registeredStatus"
          className="dropdown-select"
          onChange={handleRegisteredStatusChange}
          value={registeredStatus}
        >
          <option value="Both">Both</option>
          <option value="Registered">Registered</option>
          <option value="Not Registered">Not Registered</option>
        </select>
      </div>
    </div>
  );
}

export default BrandAdminDropdown;
