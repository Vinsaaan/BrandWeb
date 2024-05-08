import React, { useEffect, useRef, useState } from "react";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../../firebase-config";
import "./ClientProductRegistrationForm.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ClientProductRegistrationForm = ({
  onClose,
  onRegistrationComplete,
  trackingNumber,
  brandName,
  seriesCode,
  categoryName,
}) => {
  const db = getFirestore(app);
  const formRef = useRef();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState(""); // New state for phone number error

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email } = event.target.elements;

    if (!phoneNumber) {
      setPhoneError("Phone number is required.");
      return;
    } else {
      setPhoneError("");
    }

    try {
      await addDoc(collection(db, "ClientProductRegistered"), {
        name: name.value,
        phoneNumber: phoneNumber,
        email: email.value,
        trackingNumber: trackingNumber,
        brandName: brandName,
        seriesCode: seriesCode,
        categoryName: categoryName,
        registeredDate: serverTimestamp(),
      });
      // Pass user's email to the registration complete handler
      onRegistrationComplete(email.value);
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    if (value) {
      setPhoneError(""); // Clear error when user starts typing
    }
  };

  return (
    <div className="client-product-registration-popup-overlay">
      <div
        className="client-product-registration-popup-container"
        ref={formRef}
      >
        <div className="client-product-registration-popup-header">
          <h2 style={{ textAlign: "center" }}>Product Registration</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="client-product-registration-popup-body">
            <div className="form-group" id="name-input-container">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group phone-input">
              <label htmlFor="phoneNumber">Phone:</label>
              <PhoneInput
                id="phoneNumber"
                name="phoneNumber"
                country={"my"}
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="+60 123 456 789"
                required
              />
              {phoneError && <div className="error">{phoneError}</div>}{" "}
              {/* Display phone error if it exists */}
            </div>
            <div className="form-group" id="email-input-container">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>
          <div className="client-product-registration-popup-footer">
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientProductRegistrationForm;
