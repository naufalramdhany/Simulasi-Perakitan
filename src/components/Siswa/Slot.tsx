import { Slot } from "../../app/simulasi/page";

// Koordinat slot dalam koordinat lokal motherboard (900 x 650).
// Sesuaikan x/y/width/height ini agar pas dengan gambar/marker motherboard kamu.
export const SLOTS: Slot[] = [
  { id: "cpu-slot", type: "cpu", x: 330, y: 180, width: 120, height: 120 },
  { id: "ram-slot-1", type: "ram", x: 726, y: 100, width: 24, height: 208 },
  { id: "ram-slot-2", type: "ram", x: 761, y: 100, width: 24, height: 208 },
  { id: "gpu-slot", type: "gpu", x: 120, y: 496, width: 420, height: 24 },
  { id: "ssd-slot", type: "ssd", x: 540, y: 450, width: 170, height: 20 },
  { id: "psu-slot", type: "psu", x: 760, y: 60, width: 90, height: 90 },
];

type SlotBoxProps = {
  slot: Slot;
  isActive: boolean;
  isOccupied: boolean;
};

// Kotak putus-putus yang menandai area slot di motherboard.
// isActive -> nyala kuning saat komponen sedang di-drag mendekati slot ini.
// isOccupied -> redup karena sudah ada komponen terpasang.
export function SlotBox({ slot, isActive, isOccupied }: SlotBoxProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: slot.x,
        top: slot.y,
        width: slot.width,
        height: slot.height,
      }}
      className={`rounded border-2 border-dashed pointer-events-none transition-colors ${
        isActive
          ? "border-yellow-300 bg-yellow-300/25"
          : isOccupied
          ? "border-white/20"
          : "border-white/50"
      }`}
    />
  );
}
