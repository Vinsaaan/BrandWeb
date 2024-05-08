import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import HomePage from "./pages/ClientPage/HomeClientPage";
import AdminEditHomepage from "./pages/AdminPage/AdminEditHomepage";
import AdminLogin from "./pages/AdminPage/AdminLogin";
import AdminDashboard from "./pages/AdminPage/AdminDashboard";
import BrandAdminDashboard from "./pages/BrandAdminPage/BrandAdminDashboard";
import AdminBrandItems from "./pages/AdminPage/AdminBrandsItems";
import AdminEditItems from "./pages/AdminPage/AdminEditItems";
import Support from "./pages/ClientPage/Support";
import AboutUs from "./pages/ClientPage/AboutUs";
import Brand from "./pages/ClientPage/Brand";
import ViewRegistration from "./pages/BrandAdminPage/AdminViewRegistration";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/admin" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin/edithomepage"
            element={
              <ProtectedRoute>
                <AdminEditHomepage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/senja-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <BrandAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/branditems/:brandName/:categoryName/:seriesCode"
            element={
              <ProtectedRoute>
                <AdminBrandItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edititems/:id"
            element={
              <ProtectedRoute>
                <AdminEditItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/viewregistration/:brandName"
            element={
              <ProtectedRoute>
                <ViewRegistration />
              </ProtectedRoute>
            }
          />
          <Route path="/support" element={<Support />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/brand" element={<Brand />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
