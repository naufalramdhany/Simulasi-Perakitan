"use client";

import { useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ComputerComponent } from "../../app/simulasi/page";
import { FiSearch } from "react-icons/fi";

type Props = {
  components: ComputerComponent[];
  setComponents: React.Dispatch<React.SetStateAction<ComputerComponent[]>>;
  saveHistory: () => void;
};

export default function ComponentPanel({ components }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState("");

  const tray = useMemo(() => {
  return components.filter((c) => {
    return (
      c.slotId === null &&
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  });
}, [components, search]);
  const placed = components.filter((c) => c.slotId !== null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    id: number
  ) => {
    e.dataTransfer.setData("componentId", String(id));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`relative bg-white border-l transition-all duration-300 h-full ${
        isOpen ? "w-70" : "w-5"
      }`}
    >
      {/* Tombol buka/tutup */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-4 top-50 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center z-50"
      >
        {isOpen ? (
          <FaChevronRight size={12} />
        ) : (
          <FaChevronLeft size={12} />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col h-full">

          {/* Header */}
<div className="p-3 border-b">
  <h2 className="font-bold text-base text-black mb-3">
    Komponen
  </h2>

  <div className="relative">
<input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search..."
  className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
/>
    <FiSearch
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={18}
    />
  </div>
</div>

          {/* Daftar Komponen */}
          <div className="flex-1 overflow-y-auto p-3">

{tray.length === 0 && (
  <p className="text-xs text-center text-gray-400 mt-4 text-slate-700">
    Komponen tidak ditemukan.
  </p>
)}

            <div className="grid grid-cols-3 gap-3">

              {tray.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className="bg-gray-50 border rounded-xl p-2 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition duration-200"
                >
                  <div className="flex flex-col items-center">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-contain pointer-events-none"
                    />

                    <span className="mt-2 text-xs font-medium text-black text-center leading-tight">
                      {item.name}
                    </span>

                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
      )}
    </div>
  );
}