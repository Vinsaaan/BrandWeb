import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../../firebase-config";
import "./BrandAdminDashboardRegisterTable.css";

function BrandAdminDashboardRegisterTable({ brandName }) {
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    if (!brandName) return;

    const fetchCategories = async () => {
      const categoriesSet = new Set();
      const productRef = collection(db, "Product");
      const productQuery = query(
        productRef,
        where("BrandName", "==", brandName)
      );
      const productSnapshot = await getDocs(productQuery);
      productSnapshot.forEach((doc) => {
        const product = doc.data();
        categoriesSet.add(product.CategoryName);
      });
      setCategories([...categoriesSet]);
    };

    fetchCategories();
  }, [brandName, db]);

  useEffect(() => {
    if (!brandName) return;

    const fetchData = async () => {
      const data = [];
      const productRef = collection(db, "Product");
      const queryConstraints = [where("BrandName", "==", brandName)];
      if (selectedCategory !== "All") {
        queryConstraints.push(where("CategoryName", "==", selectedCategory));
      }
      const productQuery = query(productRef, ...queryConstraints);
      const productSnapshot = await getDocs(productQuery);

      productSnapshot.docs.forEach((doc) => {
        const product = doc.data();
        const registeredRef = collection(db, "ClientProductRegistered");
        const registeredQuery = query(
          registeredRef,
          where("brandName", "==", brandName),
          where("seriesCode", "==", product.SeriesCode),
          where("categoryName", "==", product.CategoryName)
        );
        getDocs(registeredQuery).then((registeredSnapshot) => {
          let registeredCount = registeredSnapshot.docs.length;
          let unregisteredCount =
            (product.TrackingNumbers ? product.TrackingNumbers.length : 0) -
            registeredCount;

          let existingEntry = data.find(
            (entry) =>
              entry.SeriesCode === product.SeriesCode &&
              entry.Category === product.CategoryName
          );
          if (existingEntry) {
            existingEntry.Registered += registeredCount;
            existingEntry.Unregistered += unregisteredCount;
          } else {
            data.push({
              Category: product.CategoryName,
              SeriesCode: product.SeriesCode,
              Registered: registeredCount,
              Unregistered: unregisteredCount,
            });
          }
          setCategoryData([...data]);
        });
      });
    };

    fetchData();
  }, [brandName, db, selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Corrected handleRowClick to navigate with category and seriesCode
  const handleRowClick = (category, seriesCode) => {
    const queryParams = new URLSearchParams({
      category: encodeURIComponent(category),
      seriesCode: encodeURIComponent(seriesCode),
    }).toString();

    window.open(
      `/admin/viewregistration/${encodeURIComponent(brandName)}?${queryParams}`,
      "_blank"
    );
  };

  return (
    <div className="brand-admin-register-table-container">
      <div className="brand-admin-register-controls">
        <div className="brand-admin-register-stats">
          <h2>Registered Stats</h2>
        </div>
        <div className="brand-admin-register-dropdown-section">
          <select
            className="brand-admin-register-dropdown"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="All">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              window.open(
                `/admin/viewregistration/${encodeURIComponent(brandName)}`,
                "_blank"
              )
            }
            className="view-registration-button"
            style={{ float: "right" }}
          >
            View Registration
          </button>{" "}
          {/* Button to view registration in a new tab */}
        </div>
      </div>
      <table className="brand-admin-register-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Category</th>
            <th>Series Code</th>
            <th>Registered</th>
            <th>Unregistered</th>
          </tr>
        </thead>
        <tbody>
          {categoryData.map((item, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(item.Category, item.SeriesCode)}
              style={{ cursor: "pointer" }}
            >
              <td>{index + 1}</td>
              <td>{item.Category}</td>
              <td>{item.SeriesCode}</td>
              <td>{item.Registered}</td>
              <td>{item.Unregistered}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BrandAdminDashboardRegisterTable;
