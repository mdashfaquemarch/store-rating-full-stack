import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./page/auth/Login";
import SignupPage from "./page/auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./page/dashboard/admin/admin";
import StoreOwnerDashboard from "./page/dashboard/store_owner/store";
import UserDashboard from "./page/dashboard/user/user";
import { Roles } from "./constants/roles";
import HomePage from "./page/home/Home";
import StoreDetails from "./page/storeDetail/StoreDetail";



function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={ <HomePage/>} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[Roles.SYSTEM_ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store-owner"
            element={
              <ProtectedRoute allowedRoles={[Roles.STORE_OWNER]}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={[Roles.NORMAL_USER]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store/:storeId"
            element={
              <ProtectedRoute allowedRoles={[Roles.NORMAL_USER]}>
                <StoreDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
