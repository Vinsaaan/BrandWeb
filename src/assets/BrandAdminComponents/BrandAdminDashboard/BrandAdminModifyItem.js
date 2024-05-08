import React, { useState, useEffect } from "react";
import {
  getFirestore,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../../../firebase-config";
import deleteIcon from "../../../assets/image/AdminComponents/Delete.png";
import AreYouSureDelete from "../../AdminComponents/AreYouSureDelete";
import "./BrandAdminModifyItem.css";

const BrandAdminModifyItem = ({ brandDetails, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [seriesCode, setSeriesCode] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const db = getFirestore(app);

  useEffect(() => {
    if (!brandDetails || !brandDetails.BrandName) {
      console.log("Brand details are missing.");
      return;
    }

    const fetchCategories = async () => {
      const brandsRef = query(
        collection(db, "Brands"),
        where("BrandName", "==", brandDetails.BrandName)
      );
      try {
        const querySnapshot = await getDocs(brandsRef);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setCategories(data.Categories || []);
        });
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, [db, brandDetails]);

  const handleAddCategory = async () => {
    if (!newCategory || !seriesCode) {
      alert("Please fill in both category name and series code.");
      return;
    }

    if (!brandDetails || !brandDetails.BrandName) {
      console.log("Brand details are missing.");
      return;
    }

    try {
      const brandsRef = query(
        collection(db, "Brands"),
        where("BrandName", "==", brandDetails.BrandName)
      );
      const querySnapshot = await getDocs(brandsRef);
      if (!querySnapshot.empty) {
        const brandRef = querySnapshot.docs[0].ref; // Assume only one document matches

        // Update the Brands collection with the new category
        await updateDoc(brandRef, {
          Categories: arrayUnion({ name: newCategory, seriesCode }),
        });

        // Add a new document to the Product collection
        await addDoc(collection(db, "Product"), {
          BrandName: brandDetails.BrandName,
          CategoryName: newCategory,
          SeriesCode: seriesCode,
        });

        // Update the local state
        setCategories((prev) => [...prev, { name: newCategory, seriesCode }]);
        setNewCategory("");
        setSeriesCode("");
      } else {
        console.log("No matching brand found.");
      }
    } catch (error) {
      console.error("Error updating brand and adding new product: ", error);
      alert("Failed to update brand and add new product");
    }
  };

  const handleDeleteClick = (category) => {
    setShowDeleteConfirmation(true);
    setCategoryToDelete(category);
  };

  const handleDeleteConfirm = async () => {
    if (!brandDetails || !brandDetails.BrandName || !categoryToDelete) {
      console.log("Brand or category data is missing.");
      return;
    }

    const brandsRef = query(
      collection(db, "Brands"),
      where("BrandName", "==", brandDetails.BrandName)
    );
    const productRef = collection(db, "Product");

    try {
      const querySnapshot = await getDocs(brandsRef);
      if (!querySnapshot.empty) {
        const brandRef = querySnapshot.docs[0].ref;

        // Remove category from Brands collection
        await updateDoc(brandRef, {
          Categories: arrayRemove(categoryToDelete),
        });

        // Remove matching documents from Product collection
        const productQuerySnapshot = await getDocs(
          query(
            productRef,
            where("BrandName", "==", brandDetails.BrandName),
            where("CategoryName", "==", categoryToDelete.name),
            where("SeriesCode", "==", categoryToDelete.seriesCode)
          )
        );

        const deletePromises = productQuerySnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );

        await Promise.all(deletePromises);

        // Update local state
        setCategories((prev) =>
          prev.filter(
            (c) =>
              c.name !== categoryToDelete.name ||
              c.seriesCode !== categoryToDelete.seriesCode
          )
        );
        setShowDeleteConfirmation(false);
      } else {
        console.log("No matching brand found.");
      }
    } catch (error) {
      console.error("Error deleting category: ", error);
      alert("Failed to delete category");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-container" onClick={(e) => e.stopPropagation()}>
          <div className="list-container categories-list">
            <h2>Categories for {brandDetails?.BrandName}</h2>
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
                    onClick={() => handleDeleteClick(category)}
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
                className="series-code-input"
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

export default BrandAdminModifyItem;
