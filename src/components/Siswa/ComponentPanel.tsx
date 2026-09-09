"use client";

import { useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { ComputerComponent } from "./Types";
import { useDrag } from "./DragContext";

type Props = {
  components: ComputerComponent[];
  setComponents: React.Dispatch<React.SetStateAction<ComputerComponent[]>>;
  saveHistory: () => void;
};

export default function ComponentPanel({ components }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const { startDrag } = useDrag();

  const tray = useMemo(() => {
    return components.filter((c) => c.slotId === null);
  }, [components]);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    item: ComputerComponent
  ) => {
    e.preventDefault();
    startDrag(item, e.clientX, e.clientY);
  };

  return (
    <div
      className={`relative bg-white border-t lg:border-l lg:border-t-0 transition-all duration-300 w-full lg:h-full ${
        isOpen ? "h-36 lg:h-full lg:w-70" : "h-6 lg:h-full lg:w-5"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden lg:flex absolute -left-4 top-50 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg items-center justify-center z-5"
      >
        {isOpen ? (
          <FaChevronRight size={12} />
        ) : (
          <FaChevronLeft size={12} />
        )}
      </button>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex lg:hidden absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg items-center justify-center z-50"
      >
        {isOpen ? (
          <FaChevronDown size={12} />
        ) : (
          <FaChevronUp size={12} />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col h-full">
          <div className="p-2 border-b">
            <h2 className="font-bold text-sm text-black">
              Komponen
            </h2>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden lg:overflow-y-auto p-3">
            {tray.length === 0 && (
              <p className="text-xs text-center text-gray-400 mt-4 whitespace-nowrap">
                Komponen tidak ditemukan.
              </p>
            )}

            <div className="flex lg:grid lg:grid-cols-3 ">
              {tray.map((item) => (
                <div
                  key={item.id}
                  onPointerDown={(e) =>
                    handlePointerDown(e, item)
                  }
                  style={{
                    touchAction: "none",
                  }}
                  className="flex-shrink-0 w-20 lg:w-auto bg-gray-50 border rounded-xl p-2 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition duration-200 select-none"
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-contain pointer-events-none"
                      draggable={false}
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