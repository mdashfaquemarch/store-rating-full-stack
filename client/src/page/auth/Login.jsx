import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { login } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../constants/roles";

const LoginPage = () => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // 🌀 new loading state
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); // start loader
    try {
      const res = await login(loginForm);

      if (res.success) {
        setUser(res.data);

        const role = res.data.role;
        if (role === Roles.SYSTEM_ADMIN) navigate("/admin");
        else if (role === Roles.STORE_OWNER) navigate("/store-owner");
        else navigate("/user");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check credentials.");
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>

              {/* ✅ Button with loading state */}
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center text-sm pt-2">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
