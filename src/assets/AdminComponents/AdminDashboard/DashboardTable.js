import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../../../firebase-config";
import "./DashboardTable.css";
import editIcon from "../../image/AdminComponents/Edit.png";
import deleteIcon from "../../image/AdminComponents/Delete.png";
import AreYouSureDelete from "../AreYouSureDelete";
import EditBrandName from "../AdminDashboard/EditBrandName";

function DashboardTable({ brandsData = [] }) {
  const navigate = useNavigate();
  const [currentEditingBrand, setCurrentEditingBrand] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteBrandIndex, setDeleteBrandIndex] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [sortedBrandsData, setSortedBrandsData] = useState([]);
  const [productQuantities, setProductQuantities] = useState({}); // New state for storing product quantities

  const db = getFirestore(app);

  useEffect(() => {
    const initialCategories = {};
    const quantities = {}; // Temporary object to hold the quantities

    const fetchProductQuantities = async () => {
      const productRef = collection(db, "Product");
      const productSnapshot = await getDocs(productRef);
      productSnapshot.docs.forEach((doc) => {
        const product = doc.data();
        const key = `${product.BrandName}-${product.CategoryName}-${product.SeriesCode}`;
        // Check if TrackingNumbers exists and is an array before accessing its length
        if (Array.isArray(product.TrackingNumbers)) {
          quantities[key] =
            (quantities[key] || 0) + product.TrackingNumbers.length;
        }
      });
      setProductQuantities(quantities);
    };

    fetchProductQuantities();

    brandsData.forEach((brand, index) => {
      initialCategories[index] = "All"; // Default to "All"
    });
    setSelectedCategories(initialCategories);

    // Sort brandsData by the latest created brands
    const sortedData = brandsData
      .slice()
      .sort((a, b) => b.CreateAt - a.CreateAt);
    setSortedBrandsData(sortedData);
  }, [brandsData, db]);

  const handleEdit = (brand, index) => {
    setCurrentEditingBrand({ ...brand, index });
    setShowEditPopup(true);
  };

  const handleSave = async (newName) => {
    if (!currentEditingBrand) return;
    const brandRef = doc(db, "Brands", currentEditingBrand.id);
    try {
      await updateDoc(brandRef, { BrandName: newName });
      alert("Brand name updated successfully");
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating brand name: ", error);
      alert("Failed to update brand name");
    }
  };

  const handleDelete = async (index) => {
    const brandId = sortedBrandsData[index].id;
    const brandNameToDelete = sortedBrandsData[index].BrandName;

    try {
      // Delete the brand document from the Brands collection
      await deleteDoc(doc(db, "Brands", brandId));

      // Query the Product collection for documents that match the BrandName
      const productRef = collection(db, "Product");
      const productQuery = query(
        productRef,
        where("BrandName", "==", brandNameToDelete)
      );
      const productSnapshot = await getDocs(productQuery);

      // Delete each matching Product document
      const deletePromises = productSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      alert("Brand and associated products deleted successfully");
    } catch (error) {
      console.error("Error deleting brand and associated products: ", error);
      alert("Failed to delete brand and associated products");
    }
  };

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

  return (
    <div className="dashboard-table">
      {sortedBrandsData.map((brand, index) => {
        const uniqueCategoryNames = Array.from(
          new Set(brand.Categories?.map((cat) => cat.name))
        );

        return (
          <div key={index} className="brand-section">
            <div className="brand-header">
              <div
                className={`brand-title-container ${
                  index % 3 !== 1 ? "table1-3-title" : "table2-title"
                }`}
              >
                <img
                  src={editIcon}
                  alt="Edit"
                  className="edit-icon"
                  onClick={() => handleEdit(brand, index)}
                />
                <h2 className="brand-title">{brand.BrandName}</h2>
              </div>
              <img
                src={deleteIcon}
                alt="Delete"
                className="delete-icon"
                onClick={() => {
                  setShowDeletePopup(true);
                  setDeleteBrandIndex(index);
                }}
              />
            </div>
            <select
              className="category-dropdown"
              value={selectedCategories[index]}
              onChange={(e) => handleCategorySelection(index, e.target.value)}
            >
              <option value="All">All</option>
              {uniqueCategoryNames.map((categoryName, idx) => (
                <option key={idx} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
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
                )
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((category, catIndex) => {
                    const quantityKey = `${brand.BrandName}-${category.name}-${category.seriesCode}`;
                    const quantity = productQuantities[quantityKey] || 0; // Default to 0 if no matching products
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
                        <td>{quantity}</td> {/* Display the quantity here */}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        );
      })}
      {showDeletePopup && (
        <AreYouSureDelete
          item={sortedBrandsData[deleteBrandIndex]?.BrandName}
          onDelete={() => {
            handleDelete(deleteBrandIndex);
            setShowDeletePopup(false);
          }}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}
      {showEditPopup && (
        <EditBrandName
          brandName={currentEditingBrand?.BrandName}
          onSave={handleSave}
          onCancel={() => setShowEditPopup(false)}
        />
      )}
    </div>
  );
}

export default DashboardTable;
