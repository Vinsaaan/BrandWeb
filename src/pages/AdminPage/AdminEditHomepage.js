import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../assets/ClientComponents/Header";
import ClientSearchProduct from "../../assets/ClientComponents/ClientSearchProduct";
import AdminEditPartnerLogo from "../../assets/AdminComponents/AdminEditHomepage/AdminEditPartnerLogo"; // Make sure this path is correct
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase-config";
import "./AdminEditHomepage.css";

const AdminEditHomepage = () => {
  const [productInfo, setProductInfo] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [currentTrackingNumber, setCurrentTrackingNumber] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("email", "==", user.email));
        getDocs(q).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            if (userData.userType !== "SuperAdmin") {
              navigate("/unauthorized");
            }
          } else {
            navigate("/admin");
          }
        });
      } else {
        // If not logged in, navigate to the admin login page
        navigate("/admin");
      }
    });
  }, [auth, db, navigate]);

  const handleSearch = async (term) => {
    setHasSearched(true);
    setError("");
    setIsLoading(true);
    setProductInfo(null);
    setShowRegistration(false);
    setCurrentTrackingNumber(term);

    const productRef = collection(db, "Product");
    try {
      const productQuerySnapshot = await getDocs(productRef);
      let found = false;
      productQuerySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.TrackingNumbers && data.TrackingNumbers.includes(term)) {
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
              setShowRegistration(true);
              setHasSearched(false);
            } else {
              const registrationData = clientQuerySnapshot.docs[0].data();
              setProductInfo((prevInfo) => ({
                ...prevInfo,
                claimedByEmail: registrationData.email,
              }));
              setShowRegistration(false);
            }
          });
        }
      });
      if (!found) {
        setError("Product not found.");
      }
    } catch (error) {
      console.error("Error searching for product: ", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationComplete = (email) => {
    setShowRegistration(false);
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      claimedByEmail: email,
    }));
    setHasSearched(true);
  };

  // Main component rendering
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
            onClose={() => setShowRegistration(false)}
            onRegistrationComplete={handleRegistrationComplete}
          />
          <AdminEditPartnerLogo />
        </>
      )}
      {!isLoading && hasSearched && !showRegistration && (
        <DisplayProductDescription
          productInfo={productInfo}
          isLoading={isLoading}
          error={error}
        />
      )}
      {!isLoading && !hasSearched && !showRegistration && (
        <AdminEditPartnerLogo />
      )}
      <Footer />
    </div>
  );
};

export default AdminEditHomepage;
