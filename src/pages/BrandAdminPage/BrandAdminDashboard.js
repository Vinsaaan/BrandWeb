import React, { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import "../AdminPage/AdminDashboard.css";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { app } from "../../firebase-config";
import LogoutButton from "../../assets/BrandAdminComponents/BrandAdminDashboard/BrandAdminLogOut";
import BrandAdminDashboardTable from "../../assets/BrandAdminComponents/BrandAdminDashboard/BrandAdminDashboardTable";
import BrandAdminNumbers from "../../assets/BrandAdminComponents/BrandAdminDashboard/BrandAdminNumbers";
import BrandAdminDashboardRegisterTable from "../../assets/BrandAdminComponents/BrandAdminDashboard/BrandAdminDashboardRegisterTable";

function BrandAdminDashboard() {
  const location = useLocation();
  const brandName = location.state?.brandName;
  const [brandsData, setBrandsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore(app);

  useEffect(() => {
    if (!brandName) {
      setError("Brand name is missing");
      setLoading(false);
      return;
    }

    const brandsRef = collection(db, "Brands");
    const q = query(brandsRef, where("BrandName", "==", brandName));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const brandsArray = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setBrandsData(brandsArray);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error fetching brands:", error);
        setError("Error fetching brands");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, brandName]);

  // Check if the user is authenticated
  const isAuthenticated = true; // Replace with your authentication logic

  if (!isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (brandsData.length === 0) {
    return <div>No brands available or brand data is loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="header-container">
        <div className="header-right">
          <LogoutButton />
        </div>
      </div>
      <BrandAdminNumbers brandName={brandName} />
      <div className="dashboard-content">
        <BrandAdminDashboardRegisterTable brandName={brandName} />
        <BrandAdminDashboardTable brandsData={brandsData} />
      </div>
    </div>
  );
}

export default BrandAdminDashboard;
