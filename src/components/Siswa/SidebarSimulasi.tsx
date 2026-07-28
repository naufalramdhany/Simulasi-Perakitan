"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBook,
  FaDesktop,
  FaTimesCircle,
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
        className={`fixed top-0 left-0 bottom-0 w-64 bg-blue-900 text-white z-50 md:hidden flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-700 flex justify-between items-center">
          <div>
            <Link href="/" className="text-2xl font-bold">
              E Learning
            </Link>

            <p className="text-xs text-blue-300 mt-1">
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
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-800 text-gray-300"
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
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-800 text-gray-300"
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
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-800 text-gray-300"
            }`}
          >
            <FaTimesCircle />
            Quiz
          </Link>
        </nav>
      </aside>

      {/* ================= DESKTOP SIDEBAR ================= */}
{/* ================= DESKTOP SIDEBAR ================= */}
<aside className="hidden md:flex fixed top-0 left-0 h-screen w-20 hover:w-64 bg-blue-900 text-white flex-col overflow-hidden transition-all duration-300 ease-in-out group z-40">

  {/* Logo */}
<div
  className="
    p-6
    border-b
    border-blue-700
    flex
    flex-col
    items-center
    group-hover:items-start
    transition-all
    duration-300
  "
>
  <Link
    href="/"
    className="text-2xl font-bold whitespace-nowrap flex items-center"
  >
    {/* Sebelum Hover */}
    <span
      className="
        opacity-100
        group-hover:opacity-0
        group-hover:w-0
        overflow-hidden
        transition-all
        duration-300
      "
    >
      E
    </span>

    {/* Setelah Hover */}
    <span
      className="
        w-0
        opacity-0
        overflow-hidden
        group-hover:w-auto
        group-hover:opacity-100
        transition-all
        duration-300
        whitespace-nowrap
      "
    >
      E Learning
    </span>
  </Link>

  <div className="relative h-4 mt-1 w-full">
    {/* Sebelum Hover */}
    <p
      className="
        absolute
        left-1/2
        -translate-x-1/2
        group-hover:left-0
        group-hover:translate-x-0
        text-xs
        text-blue-300
        whitespace-nowrap
        opacity-100
        transition-all
        duration-300
        group-hover:opacity-0
      "
    >
      Perakitan
    </p>

    {/* Setelah Hover */}
    <p
      className="
        absolute
        left-0
        text-xs
        text-blue-300
        whitespace-nowrap
        opacity-0
        transition-all
        duration-300
        group-hover:opacity-100
      "
    >
      Perakitan Komputer
    </p>
  </div>
</div>

  {/* Menu */}
  <nav className="flex-1 p-4 space-y-2">

    {/* Materi */}
    <Link
      href="/"
      className={`flex items-center
      justify-center group-hover:justify-start
      gap-0 group-hover:gap-3
      px-0 group-hover:px-4
      py-3 rounded-lg text-sm font-bold
      transition-all duration-300 ${
        pathname === "/"
          ? "bg-blue-600 text-white"
          : "hover:bg-blue-800 text-gray-300"
      }`}
    >
      <FaBook className="min-w-[20px]" />

      <span
        className="
          w-0
          opacity-0
          overflow-hidden
          whitespace-nowrap
          transition-all
          duration-300
          group-hover:w-auto
          group-hover:opacity-100
        "
      >
        Materi
      </span>
    </Link>

    {/* Simulasi */}
    <Link
      href="/simulasi"
      className={`flex items-center
      justify-center group-hover:justify-start
      gap-0 group-hover:gap-3
      px-0 group-hover:px-4
      py-3 rounded-lg text-sm font-bold
      transition-all duration-300 ${
        pathname === "/simulasi"
          ? "bg-blue-600 text-white"
          : "hover:bg-blue-800 text-gray-300"
      }`}
    >
      <FaDesktop className="min-w-[20px]" />

      <span
        className="
          w-0
          opacity-0
          overflow-hidden
          whitespace-nowrap
          transition-all
          duration-300
          group-hover:w-auto
          group-hover:opacity-100
        "
      >
        Simulasi
      </span>
    </Link>

    {/* Quiz */}
    <Link
      href="/quiz"
      className={`flex items-center
      justify-center group-hover:justify-start
      gap-0 group-hover:gap-3
      px-0 group-hover:px-4
      py-3 rounded-lg text-sm font-bold
      transition-all duration-300 ${
        pathname === "/quiz"
          ? "bg-blue-600 text-white"
          : "hover:bg-blue-800 text-gray-300"
      }`}
    >
      <FaTimesCircle className="min-w-[20px]" />

      <span
        className="
          w-0
          opacity-0
          overflow-hidden
          whitespace-nowrap
          transition-all
          duration-300
          group-hover:w-auto
          group-hover:opacity-100
        "
      >
        Quiz
      </span>
    </Link>

  </nav>

</aside>
    </>
  );
}