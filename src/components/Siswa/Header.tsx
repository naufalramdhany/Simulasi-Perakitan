"use client";

import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa";

type HeaderProps = {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Header({
  setIsSidebarOpen,
}: HeaderProps) {
  const pathname = usePathname();

  let title = "Materi";

  if (pathname === "/simulasi") {
    title = "Simulasi";
  } else if (pathname === "/quiz") {
    title = "Quiz";
  } else if (pathname === "/") {
    title = "Materi";
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
    </header>
  );
}