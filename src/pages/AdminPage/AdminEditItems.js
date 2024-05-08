import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "../../firebase-config";
import ItemDetails from "../../assets/AdminComponents/AdminEditItems/ItemDetails";
import EditDescription from "../../assets/AdminComponents/AdminEditItems/EditDescription";
import ProductImage from "../../assets/AdminComponents/AdminEditItems/ProductImage";
import SaveEdit from "../../assets/AdminComponents/AdminEditItems/SaveEdit";
import "./AdminEditItems.css";

function AdminEditItems() {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const [productImageURL, setProductImageURL] = useState("");
  const db = getFirestore(app);

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, "Product", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setItemData(data);
        setProductDescription(data.ProductDescription || "");
        setProductImageURL(data.ProductImageURL || "");
      } else {
        console.log("No such document!");
      }
    };

    fetchItem();
  }, [db, id]);

  const handleCancel = () => {
    window.history.back(); // Navigate to the previous page
  };

  const handleSave = async () => {
    const productRef = doc(db, "Product", id);
    try {
      await updateDoc(productRef, {
        ProductDescription: productDescription,
        ProductImageURL: productImageURL,
      });
      alert("Product details saved successfully");
      window.history.back(); // Navigate to the previous page
    } catch (error) {
      console.error("Error updating product details:", error);
      alert("Failed to save product details");
    }
  };

  // If itemData is null, show a loading message or spinner
  if (!itemData) {
    return <p>Loading item data...</p>;
  }

  // Once itemData is loaded, render the components with the fetched data
  return (
    <div className="admin-edit-items">
      <ItemDetails
        item={{
          name: itemData.BrandName,
          category: itemData.CategoryName,
          seriesCode: itemData.SeriesCode,
        }}
      />
      <EditDescription
        initialDescription={productDescription}
        onTextChange={setProductDescription}
      />
      <ProductImage
        productId={id}
        imageUrl={productImageURL}
        setImageUrl={setProductImageURL}
      />
      <SaveEdit onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}

export default AdminEditItems;
