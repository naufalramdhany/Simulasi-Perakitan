"use client";
import { useEffect, useState } from "react";
import Header from "../../../components/Admin/Header";
import Sidebar from "../../../components/Admin/Sidebar";
import { supabase } from "../../../lib/supabase";
export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalKomponen, setTotalKomponen] = useState(0);
  const [totalSoal, setTotalSoal] = useState(0);
  useEffect(() => {
    loadDashboard();
  }, []);
  async function loadDashboard() {
    const { count: komponenCount } = await supabase
      .from("komponen")
      .select("*", {
        count: "exact",
        head: true,
      });
    const { count: soalCount } = await supabase
      .from("soal")
      .select("*", {
        count: "exact",
        head: true,
      });
    setTotalKomponen(komponenCount || 0);
    setTotalSoal(soalCount || 0);
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="md:ml-64 flex flex-col min-h-screen">
        <Header
  
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Total Komponen */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm text-gray-500">
                Total Komponen
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {totalKomponen}
              </p>
            </div>
            {/* Total Soal */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm text-gray-500">
                Total Soal
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {totalSoal}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}