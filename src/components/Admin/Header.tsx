"use client";

import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa";

type HeaderProps = {
  userEmail: string;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Header({
  userEmail,
  setIsSidebarOpen,
}: HeaderProps) {
  const pathname = usePathname();

  let title = "Dashboard";

  if (pathname === "/simulasi") {
    title = "Simulasi";
  } else if (pathname === "/admin/quiz") {
    title = "Kelola Quiz";
  } else if (pathname === "/admin/materi") {
    title = "Kelola Materi";
  }

  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-8 justify-between shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden transition-colors"
          aria-label="Open Sidebar"
        >
          <FaBars size={20} />
        </button>

        <h2 className="text-lg md:text-xl font-bold text-gray-800">
          {title}
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm md:text-base">
          {userEmail ? userEmail[0].toUpperCase() : "A"}
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-xs md:text-sm font-bold text-gray-800">
            Admin
          </p>

          <p className="text-[10px] md:text-xs text-gray-500 truncate max-w-[120px] md:max-w-[160px]">
            {userEmail || "Superadmin"}
          </p>
        </div>
      </div>
    </header>
  );
}