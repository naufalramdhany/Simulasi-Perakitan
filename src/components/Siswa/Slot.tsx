import { Slot } from "../../app/simulasi/page";

// Koordinat ini dihitung untuk kontainer motherboard 700 x 698 px
// (skala dari gambar asli). Silakan sesuaikan sedikit kalau masih
// kurang pas — paling gampang buka gambar di image editor, cek
// posisi piksel tiap komponen, lalu kalikan skala = 700 / lebar_asli_gambar.
export const SLOTS: Slot[] = [
  // Socket CPU (area LGA di tengah board)
  { id: "cpu-slot", type: "cpu", x: 351, y: 193, width: 198, height: 198 },

  // 2 dari 4 slot DIMM DDR3 (baris atas & baris kedua)
  { id: "ram-slot-1", type: "ram", x: 272, y: 99, width: 374, height: 30 },
  { id: "ram-slot-2", type: "ram", x: 272, y: 145, width: 374, height: 30 },

  // Slot SSD (area M.2 dekat chipset, sesuaikan lagi kalau perlu)
  { id: "ssd-slot", type: "ssd", x: 555, y: 540, width: 90, height: 30 },

  // Cooler dipasang menutupi area CPU (lebih besar dari cpu-slot)
  { id: "cooler-slot", type: "cooler", x: 328, y: 170, width: 244, height: 244 },
];

type SlotBoxProps = {
  slot: Slot;
  isActive: boolean;
  isOccupied: boolean;
};

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
          : "border-white/60"
      }`}
    />
  );
}