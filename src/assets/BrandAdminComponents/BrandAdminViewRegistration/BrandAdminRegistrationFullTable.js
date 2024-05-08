import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../../firebase-config";
import "./BrandAdminRegistrationFullTable.css";

function BrandAdminRegistrationFullTable({
  brandName,
  filteredCategory,
  filteredSeriesCode,
  registeredStatus,
  searchTerm,
}) {
  const [registrations, setRegistrations] = useState([]);
  const db = getFirestore(app);

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
            registeredDate: " - ",
            name: " - ",
            email: " - ",
            phoneNumber: " - ",
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
              registeredDate: regData.registeredDate
                ? new Date(
                    regData.registeredDate.seconds * 1000
                  ).toLocaleDateString("en-GB")
                : " - ",
              name: regData.name || " - ",
              email: regData.email || " - ",
              phoneNumber: regData.phoneNumber || " - ",
            };
          }
          return product;
        });
      });

      // Apply search filtering if searchTerm is provided
      if (searchTerm.trim()) {
        allProducts = allProducts.filter(
          (product) =>
            product.trackingNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.phoneNumber.includes(searchTerm)
        );
      }

      // Sorting and registered status filtering
      if (registeredStatus === "Registered") {
        allProducts = allProducts.filter((product) => product.registered);
      } else if (registeredStatus === "Not Registered") {
        allProducts = allProducts.filter((product) => !product.registered);
      }
      if (registeredStatus === "Both") {
        allProducts.sort((a, b) => b.registered - a.registered);
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

  return (
    <div className="registration-full-table-container">
      <table className="registration-full-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Tracking Number</th>
            <th>Category</th>
            <th>Series Code</th>
            <th>Registered Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone No.</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{registration.trackingNumber}</td>
              <td>{registration.CategoryName || "N/A"}</td>
              <td>{registration.SeriesCode || "N/A"}</td>
              <td>{registration.registeredDate}</td>
              <td>{registration.name}</td>
              <td>{registration.email}</td>
              <td>{registration.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BrandAdminRegistrationFullTable;
