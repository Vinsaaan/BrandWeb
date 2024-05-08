import React, { useState, useEffect } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import BrandAdminChart from "../../assets/BrandAdminComponents/BrandAdminViewRegistration/BrandAdminChart";
import BrandAdminDropdown from "../../assets/BrandAdminComponents/BrandAdminViewRegistration/BrandAdminDropdown";
import BrandAdminSearch from "../../assets/BrandAdminComponents/BrandAdminViewRegistration/BrandAdminSearch";
import BrandAdminRegistrationFullTable from "../../assets/BrandAdminComponents/BrandAdminViewRegistration/BrandAdminRegistrationFullTable";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../firebase-config";
import "./AdminViewRegistration.css";

function AdminViewRegistration() {
  const location = useLocation();
  const { brandName } = useParams();
  const { currentUser } = useAuth();
  const [userBrand, setUserBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse URL search parameters
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get("category")
    ? decodeURIComponent(searchParams.get("category"))
    : "All";
  const initialSeriesCode = searchParams.get("seriesCode")
    ? decodeURIComponent(searchParams.get("seriesCode"))
    : "All";

  const [filteredCategory, setFilteredCategory] = useState(initialCategory);
  const [filteredSeriesCode, setFilteredSeriesCode] =
    useState(initialSeriesCode);
  const [registeredStatus, setRegisteredStatus] = useState("Both");
  const [searchTerm, setSearchTerm] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const db = getFirestore(app);

  //click brandName reset filters
  const resetFilters = () => {
    setFilteredCategory("All");
    setFilteredSeriesCode("All");
    setRegisteredStatus("Both");
  };

  useEffect(() => {
    const fetchUserBrand = async () => {
      if (!currentUser) return;

      setLoading(true);
      const usersRef = collection(db, "Users");
      const userQuery = query(
        usersRef,
        where("email", "==", currentUser.email)
      );

      try {
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data(); // Assuming one user per email
          setUserBrand(userData.brand);
        } else {
          setError("User data not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBrand();
  }, [currentUser, db]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      let productQueryConstraints = [where("BrandName", "==", brandName)];
      if (filteredCategory !== "All") {
        productQueryConstraints.push(
          where("CategoryName", "==", filteredCategory)
        );
      }
      if (filteredSeriesCode !== "All") {
        productQueryConstraints.push(
          where("SeriesCode", "==", filteredSeriesCode)
        );
      }

      const productsQuery = query(
        collection(db, "Product"),
        ...productQueryConstraints
      );
      let allProducts = [];
      const productsSnapshot = await getDocs(productsQuery);

      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        data.TrackingNumbers?.forEach((trackingInfo) => {
          allProducts.push({
            ...data,
            trackingNumber: trackingInfo.trackingNumber,
            registered: false, // Assume not registered by default
          });
        });
      });

      const registrationsSnapshot = await getDocs(
        query(
          collection(db, "ClientProductRegistered"),
          where("brandName", "==", brandName)
        )
      );
      registrationsSnapshot.forEach((regDoc) => {
        const regData = regDoc.data();
        allProducts = allProducts.map((product) => {
          if (product.trackingNumber === regData.trackingNumber) {
            return {
              ...product,
              registered: true,
            };
          }
          return product;
        });
      });

      // Apply search filtering if searchTerm is provided
      if (searchTerm.trim()) {
        allProducts = allProducts.filter((product) =>
          product.trackingNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }

      // Apply registered status filtering
      if (registeredStatus === "Registered") {
        allProducts = allProducts.filter((product) => product.registered);
      } else if (registeredStatus === "Not Registered") {
        allProducts = allProducts.filter((product) => !product.registered);
      }

      setRegistrations(allProducts);
    };

    fetchRegistrations();
  }, [
    brandName,
    filteredCategory,
    filteredSeriesCode,
    registeredStatus,
    searchTerm,
    db,
  ]);

  if (!currentUser) {
    return <Navigate to="/admin" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (userBrand !== brandName) {
    return <Navigate to="/unauthorized" />;
  }

  const registeredCount = registrations.filter((reg) => reg.registered).length;
  const notRegisteredCount = registrations.filter(
    (reg) => !reg.registered
  ).length;

  return (
    <div className="admin-view-registration-container">
      <h2
        className="viewregistered-brand-name"
        onClick={resetFilters}
        style={{ cursor: "pointer" }}
      >
        {brandName}
      </h2>

      <BrandAdminChart
        registeredCount={registeredCount}
        notRegisteredCount={notRegisteredCount}
      />

      <BrandAdminDropdown
        brandName={brandName}
        setFilteredCategory={setFilteredCategory}
        setFilteredSeriesCode={setFilteredSeriesCode}
        setRegisteredStatus={setRegisteredStatus}
        registeredStatus={registeredStatus}
        initialCategory={filteredCategory}
        initialSeriesCode={filteredSeriesCode}
      />

      <BrandAdminSearch onSearchChange={setSearchTerm} />

      <BrandAdminRegistrationFullTable
        brandName={brandName}
        filteredCategory={filteredCategory}
        filteredSeriesCode={filteredSeriesCode}
        registeredStatus={registeredStatus}
        searchTerm={searchTerm}
        registrations={registrations}
      />
    </div>
  );
}

export default AdminViewRegistration;
