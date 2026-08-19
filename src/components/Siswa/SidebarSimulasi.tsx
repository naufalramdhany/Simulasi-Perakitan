"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBook, FaDesktop, FaClipboardCheck, FaTimes } from "react-icons/fa";

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-[#1E3A5F] text-white z-50 md:hidden flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-[#2C4F73] flex justify-between items-center">
          <div>
            <p className="text-base font-bold">Perakitan Komputer</p>
            <p className="text-xs text-blue-200 mt-1">Kelas X TKJ SMKN 1 Prigen</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="hover:text-gray-300">
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/"
            onClick={() => setIsSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${pathname === "/" ? "bg-[#3B82F6] text-white" : "hover:bg-[#29476A] text-gray-300"}`}
          >
            <FaBook />
            Materi
          </Link>

          <Link
            href="/simulasi"
            onClick={() => setIsSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${pathname === "/simulasi" ? "bg-[#3B82F6] text-white" : "hover:bg-[#29476A] text-gray-300"}`}
          >
            <FaDesktop />
            Simulasi
          </Link>

          <Link
            href="/quiz"
            onClick={() => setIsSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${pathname === "/quiz" ? "bg-[#3B82F6] text-white" : "hover:bg-[#29476A] text-gray-300"}`}
          >
            <FaClipboardCheck />
            Quiz
          </Link>
        </nav>
      </aside>

      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-20 hover:w-64 bg-[#1E3A5F] text-white flex-col overflow-hidden transition-all duration-300 ease-in-out group z-40">
        <div className="p-6 border-b border-[#2C4F73] flex flex-col items-center group-hover:items-start transition-all duration-300">
          <p className="text-lg font-bold whitespace-nowrap flex items-center">
            <span className="opacity-100 group-hover:opacity-0 group-hover:w-0 overflow-hidden transition-all duration-300">
              X TKJ
            </span>
            <span className="w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
              Perakitan Komputer
            </span>
          </p>

          <div className="relative h-4 mt-1 w-full">
            <p className="absolute left-1/2 -translate-x-1/2 group-hover:left-0 group-hover:translate-x-0 text-xs text-blue-200 whitespace-nowrap opacity-100 transition-all duration-300 group-hover:opacity-0">
              Perakitan
            </p>
            <p className="absolute left-0 text-xs text-blue-200 whitespace-nowrap opacity-0 transition-all duration-300 group-hover:opacity-100">
              Kelas X TKJ SMKN 1 Prigen
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/"
            className={`flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 px-0 group-hover:px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${pathname === "/" ? "bg-[#3B82F6] text-white" : "hover:bg-[#29476A] text-gray-300"}`}
          >
            <FaBook className="min-w-[20px]" />
            <span className="w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:w-auto group-hover:opacity-100">
              Materi
            </span>
          </Link>

          <Link
            href="/simulasi"
            className={`flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 px-0 group-hover:px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${pathname === "/simulasi" ? "bg-[#3B82F6] text-white" : "hover:bg-[#29476A] text-gray-300"}`}
          >
            <FaDesktop className="min-w-[20px]" />
            <span className="w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:w-auto group-hover:opacity-100">
              Simulasi
            </span>
          </Link>

          <Link
            href="/quiz"
            className={`flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 px-0 group-hover:px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${pathname === "/quiz" ? "bg-[#3B82F6] text-white" : "hover:bg-[#29476A] text-gray-300"}`}
          >
            <FaClipboardCheck className="min-w-[20px]" />
            <span className="w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:w-auto group-hover:opacity-100">
              Quiz
            </span>
          </Link>
        </nav>
      </aside>
    </>
  );
}