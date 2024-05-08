import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../../firebase-config";
import BrandAdminModifyItem from "./BrandAdminModifyItem";
import "./BrandAdminDashboardTable.css";

function BrandAdminDashboardTable({ brandsData }) {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState({});
  const [productQuantities, setProductQuantities] = useState({});
  const [showModifyItemPopup, setShowModifyItemPopup] = useState(false);
  const [currentBrand, setCurrentBrand] = useState({});

  const db = getFirestore(app);

  useEffect(() => {
    const fetchProductQuantities = async () => {
      if (!brandsData.length) return;

      const brandNames = brandsData.map((brand) => brand.BrandName);
      const quantities = {};

      for (let brandName of brandNames) {
        const productRef = collection(db, "Product");
        const q = query(productRef, where("BrandName", "==", brandName));
        const productSnapshot = await getDocs(q);
        productSnapshot.docs.forEach((doc) => {
          const product = doc.data();
          const key = `${product.BrandName}-${product.CategoryName}-${product.SeriesCode}`;
          if (Array.isArray(product.TrackingNumbers)) {
            quantities[key] =
              (quantities[key] || 0) + product.TrackingNumbers.length;
          }
        });
      }

      setProductQuantities(quantities);
    };

    fetchProductQuantities();
  }, [brandsData, db]);

  const handleCategorySelection = (index, category) => {
    setSelectedCategories((prev) => ({ ...prev, [index]: category }));
  };

  const navigateToBrandItems = (brandName, categoryName, seriesCode) => {
    const url = `/admin/branditems/${encodeURIComponent(
      brandName
    )}/${encodeURIComponent(categoryName)}/${encodeURIComponent(seriesCode)}`;

    if (window.innerWidth >= 1024) {
      window.open(url, "_blank");
    } else {
      navigate(url);
    }
  };
  // Function to open the popup with the selected brand's details
  const openModifyItemPopup = (brand) => {
    setCurrentBrand(brand); // Set the selected brand's details
    setShowModifyItemPopup(true); // Show the popup
  };

  return (
    <div className="dashboard-table">
      {brandsData.map((brand, index) => {
        const uniqueCategoryNames = brand.Categories
          ? Array.from(new Set(brand.Categories.map((cat) => cat.name)))
          : [];

        if (selectedCategories[index] === undefined) {
          setSelectedCategories((prev) => ({ ...prev, [index]: "All" }));
        }

        return (
          <div key={index} className="brand-admin-section">
            <div className="admin-brand-header">
              <h2 className="admin-brand-title-2">
                {brand.BrandName} Products
              </h2>
            </div>
            <div className="admin-brand-controls">
              <select
                className="category-dropdown"
                value={selectedCategories[index] || "All"}
                onChange={(e) => handleCategorySelection(index, e.target.value)}
              >
                <option value="All">All Categories</option>
                {uniqueCategoryNames.map((categoryName, idx) => (
                  <option key={idx} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </select>
              <button
                className="modify-product-button"
                onClick={() => openModifyItemPopup(brand)}
                style={{ float: "right" }}
              >
                Edit Product
              </button>
            </div>
            <table className={`table-common table${index % 2 === 0 ? 1 : 2}`}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Category</th>
                  <th>Series Code / Year</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {brand.Categories?.filter(
                  (cat) =>
                    selectedCategories[index] === "All" ||
                    cat.name === selectedCategories[index]
                ).map((category, catIndex) => {
                  const quantityKey = `${brand.BrandName}-${category.name}-${category.seriesCode}`;
                  const quantity = productQuantities[quantityKey] || 0;
                  return (
                    <tr
                      key={catIndex}
                      onClick={() =>
                        navigateToBrandItems(
                          brand.BrandName,
                          category.name,
                          category.seriesCode
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td>{catIndex + 1}</td>
                      <td>{category.name}</td>
                      <td>{category.seriesCode}</td>
                      <td>{quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {showModifyItemPopup && (
        <BrandAdminModifyItem
          brandDetails={currentBrand}
          onClose={() => setShowModifyItemPopup(false)}
        />
      )}
    </div>
  );
}

export default BrandAdminDashboardTable;
