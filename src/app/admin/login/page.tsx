"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";
export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  setIsLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("LOGIN DATA:", data);
  console.log("LOGIN ERROR:", error);

  if (error) {
    if (error.message === "Invalid login credentials") {
      toast.error("Email atau password salah.");
    } else if (error.message === "Email not confirmed") {
      toast.error("Email belum dikonfirmasi.");
    } else {
      toast.error(error.message);
    }

    setIsLoading(false);
    return;
  }

  toast.success("Login berhasil!");

  router.push("/admin/dashboard");
  router.refresh();
};
  return (
    <div className="min-h-screen bg-[#3B82F6] flex items-center justify-center px-4">


      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A5F] py-5 px-6 text-center">
          <div className="flex justify-center mb-3">
            <img
              src="/images/logo.webp"
              alt="Admin"
              className="w-16 h-16 "
            />
          </div>
          <h2 className="text-lg font-bold text-white">
            Simulasi Perakitan Komputer
          </h2>
          <h2 className="text-sm font-medium text-white mt-1">
            Untuk Kelas X TKJ SMKN 1 Prigen
          </h2>
        </div>
        {/* Form */}
        <div className="p-6">
          <h2 className="text-base font-bold text-center text-gray-800 mb-6">
            Masuk Ke Dashboard
          </h2>

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
                  className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
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
                  className="w-full pl-10 pr-12 py-3 border border-gray-400 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3B82F6]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1E3A5F] hover:bg-[#3B82F6] text-white py-3 rounded-lg font-semibold transition disabled:opacity-70"
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
