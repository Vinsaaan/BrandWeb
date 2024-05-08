import React, { useState, useEffect } from "react";
import SearchBrand from "../../assets/AdminComponents/AdminDashboard/SearchBrand";
import CreateNewBrand from "../../assets/AdminComponents/AdminDashboard/CreateNewBrand";
import DisplayAllBrand from "../../assets/AdminComponents/AdminDashboard/DisplayAllBrand";
import DashboardTable from "../../assets/AdminComponents/AdminDashboard/DashboardTable";
import Pagination from "../../assets/AdminComponents/AdminDashboard/Pagination";
import "../AdminPage/AdminDashboard.css";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../../firebase-config";
//import EditPartnerLogo from "../../assets/AdminComponents/AdminDashboard/EditPartnerLogo";
import LogoutButton from "../../assets/AdminComponents/AdminDashboard/LogOutButton";

function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [brandsData, setBrandsData] = useState([]);
  const [filteredBrandsData, setFilteredBrandsData] = useState([]); // State to hold filtered brands
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Brands"), (snapshot) => {
      const brandsArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setBrandsData(brandsArray);
      setFilteredBrandsData(brandsArray); // Initialize filtered brands with all brands
    });

    return () => unsubscribe();
  }, [db]);

  const handleCreateNewBrand = (brandName) => {
    // This function might be redundant now since CreateNewBrand component handles brand creation
  };

  const handleDeleteBrand = (index) => {
    // This function should now handle Firestore document deletion
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredBrandsData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrandsData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Function to handle real-time search
  const handleSearch = (searchTerm) => {
    const filteredData = brandsData.filter((brand) =>
      brand.BrandName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrandsData(filteredData);
  };

  return (
    <div className="admin-dashboard">
      <div className="header-container">
        <LogoutButton></LogoutButton>

        {/* <EditPartnerLogo /> */}

        <SearchBrand onSearch={handleSearch} />
        <div className="button-container">
          <CreateNewBrand onBrandCreate={handleCreateNewBrand} />
          <DisplayAllBrand />
        </div>
      </div>
      <DashboardTable
        brandsData={currentBrands}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        onDeleteBrand={handleDeleteBrand}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AdminDashboard;
