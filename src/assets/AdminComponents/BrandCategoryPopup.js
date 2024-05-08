import React, { useState, useEffect, useRef } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  collection, // Import necessary Firestore functions
  query,
  where,
  getDocs,
  deleteDoc, // Add deleteDoc function
} from "firebase/firestore";
import { app } from "../../firebase-config";
import deleteIcon from "../../assets/image/AdminComponents/Delete.png";
import AreYouSureDelete from "../AdminComponents/AreYouSureDelete";
import "./BrandCategoryPopup.css";

const BrandCategoryPopup = ({ brands, onClose }) => {
  const [selectedBrand, setSelectedBrand] = useState(
    brands.length > 0 ? brands[0] : null
  );
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [seriesCode, setSeriesCode] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const popupRef = useRef(null); // Ref for the popup

  const db = getFirestore(app);

  // Function to fetch categories for the selected brand
  useEffect(() => {
    const fetchCategories = async (brandId) => {
      if (!brandId) return;

      const brandRef = doc(db, "Brands", brandId);
      try {
        const brandDoc = await getDoc(brandRef);
        if (brandDoc.exists()) {
          let brandData = brandDoc.data();
          let sortedCategories = (brandData.Categories || []).sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          setCategories(sortedCategories);
        } else {
          console.log("No such document!");
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories(selectedBrand?.id);
  }, [selectedBrand, db]);

  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
  };

  const handleAddCategory = async () => {
    if (newCategory && seriesCode && selectedBrand) {
      const brandRef = doc(db, "Brands", selectedBrand.id);
      const productRef = collection(db, "Product"); // Reference to "Product" collection

      const newCategoryObject = { name: newCategory, seriesCode };
      try {
        // Update the "Brands" collection
        await updateDoc(brandRef, {
          Categories: arrayUnion(newCategoryObject),
        });

        // Create a new document in the "Product" collection
        await setDoc(doc(productRef), {
          BrandName: selectedBrand.BrandName,
          CategoryName: newCategory,
          SeriesCode: seriesCode,
        });

        setCategories([...categories, newCategoryObject]); // Update local categories state

        setNewCategory(""); // Reset inputs
        setSeriesCode("");
      } catch (error) {
        console.error("Error adding category: ", error);
        alert("Failed to add category and series code");
      }
    }
  };

  const handleDeleteClick = (category, event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up
    setShowDeleteConfirmation(true);
    setCategoryToDelete(category);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBrand && categoryToDelete) {
      const brandRef = doc(db, "Brands", selectedBrand.id);
      const productRef = collection(db, "Product"); // Reference to "Product" collection

      try {
        // Fetch the current categories to ensure you have the latest state
        const docSnap = await getDoc(brandRef);
        if (docSnap.exists()) {
          // Update the Brands collection
          const updatedCategories = docSnap
            .data()
            .Categories.filter(
              (category) =>
                !(
                  category.name === categoryToDelete.name &&
                  category.seriesCode === categoryToDelete.seriesCode
                )
            );

          await updateDoc(brandRef, {
            Categories: updatedCategories,
          });

          // Update local state
          setCategories(updatedCategories);
          setShowDeleteConfirmation(false);

          // Delete matching documents from Product collection
          const productQuerySnapshot = await getDocs(
            query(
              productRef,
              where("BrandName", "==", selectedBrand.BrandName),
              where("CategoryName", "==", categoryToDelete.name),
              where("SeriesCode", "==", categoryToDelete.seriesCode)
            )
          );

          productQuerySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error deleting category: ", error);
        alert("Failed to delete category");
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-container" ref={popupRef}>
          <div className="list-container brands-list">
            <h2>Brand List</h2>
            <ul>
              {brands.map((brand, index) => (
                <li
                  key={brand.id}
                  className={selectedBrand?.id === brand.id ? "selected" : ""}
                  onClick={() => handleSelectBrand(brand)}
                >
                  {brand.BrandName}
                </li>
              ))}
            </ul>
          </div>
          <div className="list-container categories-list">
            <h2>Categories for {selectedBrand?.BrandName}</h2>
            <ul>
              {categories.map((category, index) => (
                <li
                  key={index}
                  className={`category-item ${
                    index % 2 === 0 ? "category-even" : "category-odd"
                  }`}
                >
                  <span>
                    {category.name} - {category.seriesCode}
                  </span>
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className="delete-icon"
                    onClick={(event) => handleDeleteClick(category, event)}
                  />
                </li>
              ))}
            </ul>
            <div className="category-actions">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New Category Name"
                className="new-category-input"
              />
              <input
                type="text"
                value={seriesCode}
                onChange={(e) => setSeriesCode(e.target.value)}
                placeholder="Series Code / Year"
                className="series-code-input" // Add corresponding CSS for this class
              />
              <div className="action-buttons">
                <button
                  onClick={handleAddCategory}
                  className="add-category-button"
                >
                  + Add Category
                </button>
                <button onClick={onClose} className="close-button">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteConfirmation && (
        <AreYouSureDelete
          item={`${categoryToDelete?.name} - ${categoryToDelete?.seriesCode}`}
          onDelete={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
};

export default BrandCategoryPopup;
