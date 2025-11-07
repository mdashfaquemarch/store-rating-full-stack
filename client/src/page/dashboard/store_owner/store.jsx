import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, LogOut } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { logout } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { fetchStoreDashboard } from "../../../api/store";

const StoreOwnerDashboard = () => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  // 🔹 Fetch store dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await fetchStoreDashboard();
        setStoreInfo(data.store);
        setRatings(data.ratings);
      } catch (err) {
        setError("Failed to load store dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    console.log("Password changed:", passwordForm);
    setIsPasswordModalOpen(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-600">
        Loading store dashboard...
      </div>
    );
  }

  if (error || !storeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
        {error || "Store not found."}
      </div>
    );
  }

  const averageRating = storeInfo.averageRating || 0;
  const totalRatings = storeInfo.numberOfRating || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Store Dashboard</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
              Change Password
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? "Logging out..." : <><LogOut size={18}/> Logout</>}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-6 max-w-7xl mx-auto space-y-6">
        {/* Store Information */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-6">Store Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Store Name</p>
                <p className="text-lg font-semibold">{storeInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Owner</p>
                <p className="text-lg font-semibold">{storeInfo.owner}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="text-lg font-semibold">{storeInfo.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500 mb-4">Average Rating</p>
              <p className="text-4xl font-bold mb-3">{averageRating.toFixed(1)}/5</p>
              <div className="flex gap-1">{renderStars(averageRating)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500 mb-4">Total Ratings</p>
              <p className="text-4xl font-bold">{totalRatings}</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Ratings Table */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-6">Customer Ratings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {ratings.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500">
                        No ratings yet.
                      </td>
                    </tr>
                  ) : (
                    ratings.map((r) => (
                      <tr key={r.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{r.user.name || "Anonymous"}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{r.user.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {renderStars(r.rating)}
                            <span className="text-sm text-gray-600 ml-2">/{5}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Change Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Change Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {["currentPassword", "newPassword", "confirmPassword"].map((field, i) => (
              <div key={i}>
                <Label htmlFor={field} className="text-sm font-medium capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  id={field}
                  type="password"
                  value={passwordForm[field]}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, [field]: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsPasswordModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordChange}
                className="flex-1 bg-black hover:bg-gray-800"
              >
                Update Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreOwnerDashboard;
