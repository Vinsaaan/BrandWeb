import React, { useState, useEffect } from "react";
import Brand from "../../assets/AdminComponents/AdminBrandsItems/Brand";
import SearchTrackingNumber from "../../assets/AdminComponents/AdminBrandsItems/SearchTrackingNumber";
import TrackNumberList from "../../assets/AdminComponents/AdminBrandsItems/TrackNumberList";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../firebase-config";

function AdminBrandsItems() {
  const [brandData, setBrandData] = useState(null);
  const [originalTrackingNumbers, setOriginalTrackingNumbers] = useState([]);
  const [displayedTrackingNumbers, setDisplayedTrackingNumbers] = useState([]);
  const { brandName, categoryName, seriesCode } = useParams();

  useEffect(() => {
    const db = getFirestore(app);

    async function fetchAndSetData() {
      // Fetch brand data
      const brandsRef = collection(db, "Brands");
      const brandQuery = query(brandsRef, where("BrandName", "==", brandName));
      const brandSnapshot = await getDocs(brandQuery);
      if (!brandSnapshot.empty) {
        setBrandData(brandSnapshot.docs[0].data());
      }

      // Fetch products with tracking numbers
      const productRef = collection(db, "Product");
      const productQuery = query(
        productRef,
        where("SeriesCode", "==", seriesCode),
        where("BrandName", "==", brandName),
        where("CategoryName", "==", categoryName)
      );
      const productSnapshot = await getDocs(productQuery);
      const products = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOriginalTrackingNumbers(products);
      setDisplayedTrackingNumbers(products); // Initially, display all products
    }

    fetchAndSetData();
  }, [brandName, categoryName, seriesCode]);

  const handleSearchChange = (searchTerm) => {
    const searchTermLower = searchTerm.toLowerCase();
    // Adjusted filter to work with the object structure of tracking numbers
    const filteredTrackingNumbers = originalTrackingNumbers
      .map((product) => ({
        ...product,
        TrackingNumbers: product.TrackingNumbers.filter((tnObj) =>
          tnObj.trackingNumber.toLowerCase().includes(searchTermLower)
        ),
      }))
      .filter((product) => product.TrackingNumbers.length > 0); // Keep only products with matching tracking numbers

    setDisplayedTrackingNumbers(filteredTrackingNumbers);
  };

  return (
    <div className="admin-brands-items">
      {brandData && (
        <Brand
          name={brandData.BrandName}
          category={categoryName}
          seriesCode={seriesCode}
          categoryName={brandData.CategoryName}
          onSave={(newTrackingNumbers) => {
            // Update tracking numbers logic as needed
          }}
        />
      )}
      <SearchTrackingNumber onSearchChange={handleSearchChange} />
      <TrackNumberList
        trackingData={displayedTrackingNumbers}
        setTrackingData={setDisplayedTrackingNumbers}
      />
    </div>
  );
}

export default AdminBrandsItems;
