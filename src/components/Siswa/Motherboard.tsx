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
      <div className="relative w-[550px] aspect-square rounded-xl border-8 border-gray-700 shadow-2xl overflow-hidden bg-white">
        <img
          src="/images/motherboard.jpeg"
          alt="Motherboard"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />

        {SLOTS.map((slot) => (
          <SlotBox
            key={slot.id}
            slot={slot}
            isActive={activeSlotId === slot.id}
            isOccupied={occupiedSlotIds.includes(slot.id)}
          />
        ))}

        <div className="absolute bottom-3 left-3 text-white text-lg font-bold drop-shadow bg-black/40 px-2 py-1 rounded">
          GIGABYTE GA-H61M-S2P
        </div>
      </div>
    </div>
  );
}