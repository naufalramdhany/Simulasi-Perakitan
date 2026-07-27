"use client";

import { useState } from "react";
import Header from "../../../components/Admin/Header";
import Sidebar from "../../../components/Admin/Sidebar";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userEmail = "admin@gmail.com";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main */}
      <main className="md:ml-64 flex flex-col min-h-screen">
        <Header
          userEmail={userEmail}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm text-gray-500">
                Total Materi
              </h3>

              <p className="text-3xl font-bold text-blue-600 mt-2">
                12
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm text-gray-500">
                Total Quiz
              </h3>

              <p className="text-3xl font-bold text-green-600 mt-2">
                8
              </p>
            </div>

 

          </div>

        </div>
      </main>
    </div>
  );
}