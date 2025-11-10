import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signup } from "../../api/auth.js";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // 🌀 loading state
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await signup(signupForm);
      if (res.success) {
        alert("Signup successful! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                />
              </div>

              <div>
                <Label>Address</Label>
                <Input
                  type="text"
                  placeholder="Enter your address"
                  value={signupForm.address}
                  onChange={(e) => setSignupForm({ ...signupForm, address: e.target.value })}
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                />
              </div>

              {/* ✅ Button with loading state */}
              <Button
                onClick={handleSignup}
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing up...
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="text-center text-sm pt-2">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
