"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBook,
  FaDesktop,
  FaClipboardCheck,
  FaTimes,
} from "react-icons/fa";

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#1E3A5F] text-white z-50 md:hidden flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#2C4F73] flex justify-between items-center">
          <div>
            <Link href="/" className="text-2xl font-bold">
              E Learning
            </Link>

            <p className="text-xs text-blue-200 mt-1">
              Perakitan Komputer
            </p>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="hover:text-gray-300"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {/* Materi */}
          <Link
            href="/"
            onClick={() => setIsSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${
              pathname === "/"
                ? "bg-[#3B82F6] text-white"
                : "hover:bg-[#29476A] text-gray-300"
            }`}
          >
            <FaBook />
            Materi
          </Link>

          {/* Simulasi */}
          <Link
            href="/simulasi"
            onClick={() => setIsSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${
              pathname === "/simulasi"
                ? "bg-[#3B82F6] text-white"
                : "hover:bg-[#29476A] text-gray-300"
            }`}
          >
            <FaDesktop />
            Simulasi
          </Link>

          {/* Quiz */}
          <Link
            href="/quiz"
            onClick={() => setIsSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${
              pathname === "/quiz"
                ? "bg-[#3B82F6] text-white"
                : "hover:bg-[#29476A] text-gray-300"
            }`}
          >
            <FaClipboardCheck />
            Quiz
          </Link>
        </nav>
      </aside>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-[#1E3A5F] text-white flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-[#2C4F73]">
          <Link href="/" className="text-2xl font-bold">
            E Learning
          </Link>

          <p className="text-xs text-blue-200 mt-1">
            Perakitan Komputer
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {/* Materi */}
          <Link
            href="/"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition ${
              pathname === "/"
                ? "bg-[#3B82F6] text-white"
                : "hover:bg-[#29476A] text-gray-300"
            }`}
          >
            <FaBook />
            Materi
          </Link>

          {/* Simulasi */}
          <Link
            href="/simulasi"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition ${
              pathname === "/simulasi"
                ? "bg-[#3B82F6] text-white"
                : "hover:bg-[#29476A] text-gray-300"
            }`}
          >
            <FaDesktop />
            Simulasi
          </Link>

          {/* Quiz */}
          <Link
            href="/quiz"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition ${
              pathname === "/quiz"
                ? "bg-[#3B82F6] text-white"
                : "hover:bg-[#29476A] text-gray-300"
            }`}
          >
            <FaClipboardCheck />
            Quiz
          </Link>
        </nav>
      </aside>
    </>
  );
}