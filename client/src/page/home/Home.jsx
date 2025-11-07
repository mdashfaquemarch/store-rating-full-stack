import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../constants/roles";
import { logout } from "../../api/auth";

const HomePage = () => {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => navigate("/login");

  const handleGoToDashboard = () => {
    if (user?.role === Roles.SYSTEM_ADMIN) navigate("/admin");
    else if (user?.role === Roles.STORE_OWNER) navigate("/store-owner");
    else navigate("/user");
  };

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  // 🌀 Show loading state while fetching user info
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-lg font-medium">
          Loading user data...
        </div>
      </div>
    );
  }

  // 🏠 Regular content after loading
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-foreground">
        Welcome to Our Platform 🚀
      </h1>
      <p className="text-muted-foreground mb-8 max-w-lg">
        The best place to manage your stores, users, and admin data all in one dashboard.
      </p>

      {!user ? (
        <>
          <Button
            onClick={handleGetStarted}
            className="px-6 py-3 rounded-2xl"
          >
            Get Started
          </Button>
          <p className="mt-4 text-muted-foreground text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline font-medium"
            >
              Login
            </button>{" "}
            or{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </>
      ) : (
        <div className="flex gap-4">
          <Button
            onClick={handleGoToDashboard}
            className="px-6 py-3 rounded-2xl"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="px-6 py-3 rounded-2xl"
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;