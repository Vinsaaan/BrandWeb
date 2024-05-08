import React from "react";
import Header from "../../assets/ClientComponents/Header";
import ClientSearchProduct from "../../assets/ClientComponents/ClientSearchProduct";
import PartnerLogo from "../../assets/ClientComponents/PartnerLogo";
import DisplayProductDescription from "../../assets/ClientComponents/DisplayProductDescription";
import ClientProductRegistrationForm from "../../assets/ClientComponents/ClientProductRegistrationForm";
import Footer from "../../assets/ClientComponents/Footer";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebase-config";
import "./HomeClientPage.css";

const HomeClientPage = () => {
  const [productInfo, setProductInfo] = React.useState(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showRegistration, setShowRegistration] = React.useState(false);
  const [currentTrackingNumber, setCurrentTrackingNumber] = React.useState("");

  const handleSearch = async (term) => {
    setHasSearched(true);
    setError(""); // Reset error state
    setIsLoading(true);
    setProductInfo(null); // Clear previous product info
    setShowRegistration(false); // Ensure registration form is not shown yet
    setCurrentTrackingNumber(term);

    const db = getFirestore(app);
    const productRef = collection(db, "Product");

    try {
      const productQuerySnapshot = await getDocs(productRef);
      let found = false;
      productQuerySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.TrackingNumbers && Array.isArray(data.TrackingNumbers)) {
          const matchingTrackingNumbers = data.TrackingNumbers.filter(
            (tn) => tn.trackingNumber === term
          );
          if (matchingTrackingNumbers.length > 0) {
            setProductInfo({
              description: data.ProductDescription || "",
              imageUrl: data.ProductImageURL || "",
              name: data.ProductName || "Product Name",
              brandName: data.BrandName || "",
              categoryName: data.CategoryName || "",
              seriesCode: data.SeriesCode || "",
            });
            found = true;

            const clientQuery = query(
              collection(db, "ClientProductRegistered"),
              where("trackingNumber", "==", term)
            );
            getDocs(clientQuery).then((clientQuerySnapshot) => {
              if (clientQuerySnapshot.empty) {
                setShowRegistration(true); // Show registration if product is not yet registered
                setHasSearched(false); // Don't show product description yet
              } else {
                // Product is already registered, display its info
                const registrationData = clientQuerySnapshot.docs[0].data();
                setProductInfo((prevInfo) => ({
                  ...prevInfo,
                  claimedByEmail: registrationData.email,
                }));
                setShowRegistration(false); // Hide registration form since product is already registered
              }
            });
          }
        }
      });

      if (!found) {
        throw new Error("Product not found."); // Throw an error if product is not found
      }
    } catch (error) {
      console.error("Error searching for product: ", error);
      setError(error.message); // Set error message in case of an error
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationComplete = (email) => {
    setShowRegistration(false); // Hide the registration form after successful registration
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      claimedByEmail: email, // Update product info with the new claim
    }));
    setHasSearched(true); // Now show the product description after registration
  };

  return (
    <div className="home-client-page">
      <Header />
      <ClientSearchProduct onSearch={handleSearch} />

      {showRegistration && productInfo && (
        <>
          <ClientProductRegistrationForm
            trackingNumber={currentTrackingNumber}
            brandName={productInfo.brandName}
            categoryName={productInfo.categoryName}
            seriesCode={productInfo.seriesCode}
            onClose={() => {
              setShowRegistration(false);
            }}
            onRegistrationComplete={handleRegistrationComplete}
          />
          <PartnerLogo />
        </>
      )}

      {!isLoading && hasSearched && !showRegistration && (
        <DisplayProductDescription
          productInfo={productInfo}
          isLoading={isLoading}
          error={error}
        />
      )}

      {!isLoading && !hasSearched && !showRegistration && <PartnerLogo />}

      <Footer />
    </div>
  );
};

export default HomeClientPage;
