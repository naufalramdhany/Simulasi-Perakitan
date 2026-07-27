"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulasi loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Dummy Login
    if (email === "admin@gmail.com" && password === "123456") {
      window.location.href = "/admin";
    } else {
      setError("Email atau password salah.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 py-5 px-6 text-center">
          <div className="flex justify-center mb-3">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=ffffff&color=2563eb&size=128"
              alt="Admin"
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
            />
          </div>

<h2 className="text-lg font-bold text-white">
  E Learning Perakitan Komputer
</h2>

<h2 className="text-sm font-medium text-white mt-1">
  Admin Panel
</h2>
        </div>

        {/* Form */}
        <div className="p-6">
          <h2 className="text-base font-bold text-center text-gray-800 mb-6">
            Masuk Ke Dashboard
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 text-sm rounded-lg p-3 mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="123456"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-400 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-70"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Dummy Account */}


          <p className="text-center text-xs text-gray-400 mt-5">
            Hanya untuk administrator.
          </p>
        </div>
      </div>
    </div>
  );
}