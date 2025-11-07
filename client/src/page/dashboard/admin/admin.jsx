import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, LogOut, Loader2 } from "lucide-react";
import { fetchAdminDashboardData, createUser } from "../../../api/admin.js";
import { useAuth } from "../../../context/AuthContext";
import { logout } from "../../../api/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "NORMAL_USER",
    storeName: "",
    storeEmail: "",
    storeAddress: "",
  });

  const { setUser } = useAuth();
  const navigate = useNavigate();

  // Fetch dashboard data
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminDashboardData();
      setStats(data.stats);
      setUsers(data.users);
      setStores(data.stores);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      alert("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Logout handler
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

  // Create user/role handler
  const handleCreateUser = async () => {
    try {
      setSubmitting(true);
      let payload = {
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        password: newUser.password,
        role: newUser.role,
      };

      if (newUser.role === "STORE_OWNER") {
        payload.store = {
          name: newUser.storeName,
          email: newUser.storeEmail,
          address: newUser.storeAddress,
        };
      }

      await createUser(payload);
      alert("User created successfully!");
      setModalOpen(false);
      setNewUser({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "NORMAL_USER",
        storeName: "",
        storeEmail: "",
        storeAddress: "",
      });

      // Refresh dashboard after creation
      loadDashboard();
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user/store.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="ghost" onClick={handleLogout} disabled={loading}>
          {loading ? "Logging out..." : <><LogOut size={18} /> Logout</>}
        </Button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex gap-2">
        <Button variant={activeTab === "overview" ? "default" : "ghost"} onClick={() => setActiveTab("overview")}>Overview</Button>
        <Button variant={activeTab === "users" ? "default" : "ghost"} onClick={() => setActiveTab("users")}>Users</Button>
        <Button variant={activeTab === "stores" ? "default" : "ghost"} onClick={() => setActiveTab("stores")}>Stores</Button>
      </div>

      {/* Main Content */}
      <main className="px-8 py-6">
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card><CardHeader><CardTitle>Total Users</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{stats.totalUsers}</p></CardContent></Card>
              <Card><CardHeader><CardTitle>Total Stores</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{stats.totalStores}</p></CardContent></Card>
              <Card><CardHeader><CardTitle>Total Ratings</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{stats.totalRatings}</p></CardContent></Card>
            </div>
            <Button onClick={() => setModalOpen(true)} disabled={submitting}>
              {submitting ? "Loading..." : "Add New User / Role"}
            </Button>
          </div>
        )}

        {/* Users Table */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-end mb-6">
              <div className="flex-1 mr-4">
                <label className="block text-sm font-medium mb-2">Search Users</label>
                <div className="relative">
                  <Input placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Address</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.address}</td>
                      <td className="px-6 py-4"><span className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700">{user.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stores Table */}
        {activeTab === "stores" && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search Stores</label>
              <div className="relative">
                <Input placeholder="Search by name or address..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Store Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Address</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Avg Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStores.map((store, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-sm text-gray-900">{store.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{store.address}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{store.averageRating}/5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User / Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}/>
            <Input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}/>
            <Input placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}/>
            <Input placeholder="Address" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}/>
            <Select value={newUser.role} onValueChange={(val) => setNewUser({ ...newUser, role: val })}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="SYSTEM_ADMIN">System Admin</SelectItem>
                <SelectItem value="NORMAL_USER">Normal User</SelectItem>
                <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
              </SelectContent>
            </Select>

            {newUser.role === "STORE_OWNER" && (
              <>
                <Input placeholder="Store Name" value={newUser.storeName} onChange={(e) => setNewUser({ ...newUser, storeName: e.target.value })}/>
                <Input placeholder="Store Email" value={newUser.storeEmail} onChange={(e) => setNewUser({ ...newUser, storeEmail: e.target.value })}/>
                <Input placeholder="Store Address" value={newUser.storeAddress} onChange={(e) => setNewUser({ ...newUser, storeAddress: e.target.value })}/>
              </>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateUser} disabled={submitting}>
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2"/> Creating...</> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
