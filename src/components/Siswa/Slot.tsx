import { Slot } from "./Types";

export const SLOTS: Slot[] = [
  { id: "cpu-slot", type: "cpu", x: 157, y: 114, width: 54, height: 63 },
  { id: "ram-slot-1", type: "ram", x: 260.5, y: 49, width: 4.5, height: 178 },
  { id: "ram-slot-2", type: "ram", x: 290.5, y: 49, width: 4.5, height: 178 },
  { id: "cooler-slot", type: "cooler", x: 117, y: 78, width: 133, height: 131 },
  { id: "cmos-slot", type: "cmos_battery", x: 153, y: 272, width: 41, height: 41 },
  { id: "vga-slot", type: "vga", x: 77, y: 241, width: 120, height:7 },
  { id: "atx-slot-24", type: "cable_atx-24", x: 333, y: 118, width: 15, height: 73 },
  { id: "atx-slot-4", type: "cable_atx-4", x: 73, y: 53, width: 21, height: 21 },
  { id: "vga-cable-slot", type: "cable_vga", x: -10, y: 106, width: 16, height: 45.5 },
  { id: "sata-cable-slot", type: "cable_sata", x: 296, y: 260, width: 26.5, height: 12 },
];

type SlotBoxProps = {
  slot: Slot;
  isActive: boolean;
  isOccupied: boolean;
  isSimulationStarted?: boolean;
};

export function SlotBox({ slot, isActive, isOccupied, isSimulationStarted = false }: SlotBoxProps) {
  const isRamSlot = slot.id === "ram-slot-1" || slot.id === "ram-slot-2";
  const isCpuSlot = slot.id === "cpu-slot";
  const isCoolerSlot = slot.id === "cooler-slot";
  const isCmosSlot = slot.id === "cmos-slot";
  const isVgaSlot = slot.id === "vga-slot";
  const isVgaCableSlot = slot.id === "vga-cable-slot";
  const isAtxSlot = slot.id === "atx-slot-24" || slot.id === "atx-slot-4";
  const isSataCableSlot = slot.id === "sata-cable-slot";

  return (
    <div
      style={{
        position: "absolute",
        left: slot.x,
        top: slot.y,
        width: slot.width,
        height: slot.height,
      }}
      className={`pointer-events-none transition-colors ${
        isOccupied
          ? isRamSlot
            ? "bg-[#228B22] border-none"
            : isVgaSlot
            ? "bg-black border-none"
            : isVgaCableSlot
            ? "bg-[#2A48B8] border-none"
            : isAtxSlot
            ? "bg-black border-none"
            : isSataCableSlot
            ? "bg-black border-none"
            : "border-none bg-transparent"
          : isActive
          ? "border-2 border-dashed border-yellow-300 bg-yellow-300/25"
          : "border-2 border-dashed border-white/60 bg-transparent"
      }`}
    >
      {isCpuSlot && isOccupied && (
        <img src="/images/processor.png" alt="Processor" className="w-full h-full object-fill" />
      )}

      {isCoolerSlot && isOccupied && (
        <div className="relative w-full h-full">
          <img src="/images/cooler-frame.png" alt="Cooler Frame" className="absolute inset-0 w-full h-full object-fill pointer-events-none" />
          <img
            src="/images/cooler-fan.png"
            alt="Cooler Fan"
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] object-fill origin-center pointer-events-none ${isSimulationStarted ? "animate-[spin_0.6s_linear_infinite]" : ""}`}
          />
        </div>
      )}

      {isCmosSlot && isOccupied && (
        <img src="/images/cmos.png" alt="Baterai CMOS" className="w-full h-full object-fill scale-125" />
      )}
    </div>
  );
}