import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/image/Logo/Logo.png";
import "./AdminLogin.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../firebase-config";
import Footer from "../../assets/ClientComponents/Footer";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userEmail = userCredential.user.email;
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("email", "==", userEmail));

        getDocs(q).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const userType = userData.userType;

            if (userType === "SuperAdmin") {
              navigate("/admin/senja-dashboard");
            } else if (userType === "BrandAdmin") {
              const brandName = userData.brand;
              navigate("/admin/dashboard", { state: { brandName } });
            } else {
              alert("Unauthorized access");
            }
          } else {
            alert("User does not exist in Firestore");
          }
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <div className="login-page-container">
      {" "}
      {/* New wrapper for entire page */}
      <div className="login-container">
        <div className="logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <div className="login-form">
          <h1>ADMIN LOGIN</h1>
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Log In</button>
          </form>
        </div>
      </div>
      <div className="login-footer">
        {" "}
        {/* New class for login page specific footer */}
        <Footer />
      </div>
    </div>
  );
}

export default AdminLogin;
