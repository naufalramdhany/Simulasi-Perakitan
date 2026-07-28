"use client";

import { SLOTS, SlotBox } from "./Slot";

type MotherboardProps = {
  activeSlotId?: string | null;
  occupiedSlotIds?: string[];
};

export default function Motherboard({
  activeSlotId = null,
  occupiedSlotIds = [],
}: MotherboardProps) {
  return (
    <div className="relative">
      <div className="w-[900px] h-[650px] rounded-xl border-8 border-gray-700 bg-green-700 shadow-2xl relative overflow-hidden">

        {/* Slot dirender dari data SLOTS (Slot.tsx) */}
        {SLOTS.map((slot) => (
          <SlotBox
            key={slot.id}
            slot={slot}
            isActive={activeSlotId === slot.id}
            isOccupied={occupiedSlotIds.includes(slot.id)}
          />
        ))}

        {/* Chipset (dekorasi, bukan slot yang bisa diisi) */}
        <div className="absolute left-[520px] top-[350px] w-[90px] h-[90px] bg-gray-500 rounded-lg" />

        {/* SATA (dekorasi) */}
        <div className="absolute right-[90px] bottom-[80px] flex gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded" />
          <div className="w-6 h-6 bg-orange-500 rounded" />
          <div className="w-6 h-6 bg-orange-500 rounded" />
          <div className="w-6 h-6 bg-orange-500 rounded" />
        </div>

        {/* Label */}
        <div className="absolute bottom-5 left-5 text-white text-xl font-bold">
          ATX Motherboard
        </div>
      </div>
    </div>
  );
}
