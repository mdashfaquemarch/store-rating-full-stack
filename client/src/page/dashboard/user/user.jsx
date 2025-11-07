import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { logout } from "../../../api/auth";
import { fetchAllStoresWithAverageRating } from "../../../api/store"; // ✅ import API call
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // ✅ Fetch stores from API
  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoading(true);
        const res = await fetchAllStoresWithAverageRating();
        setStores(res || []);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
        alert("Failed to load stores.");
      } finally {
        setLoading(false);
      }
    };
    loadStores();
  }, []);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    console.log("Password change submitted", passwordForm);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordModalOpen(false);
  };

  const renderStars = (rating) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? "Logging out..." : (<><LogOut size={18}/> Logout</>)}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-6">
        {/* User Details */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-semibold text-gray-900">{user?.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-gray-900">{user?.email || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-semibold text-gray-900">{user?.address || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Search Stores</label>
          <div className="relative">
            <Input
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Store List */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading stores...</p>
        ) : filteredStores.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No stores found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <Card
                key={store.id}
                onClick={() => navigate(`/store/${store.id}`)}
                className="cursor-pointer transition hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {store.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{store.email}</p>
                  <p className="text-sm text-gray-500">{store.address}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {renderStars(store.averageRating)}
                    <span className="text-sm font-medium text-gray-700">
                      {store.averageRating}/5
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Change Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Change Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                className="mt-1"
              />
            </div>

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

export default UserDashboard;
