import { Slot } from "./Types";

export const SLOTS: Slot[] = [
  { id: "cpu-slot", type: "cpu", x: 265, y: 177, width: 80, height: 63 },

  { id: "ram-slot-1", type: "ram", x: 195, y: 104, width: 229, height: 14 },
  { id: "ram-slot-2", type: "ram", x: 195, y: 71, width: 229, height: 14 },

  { id: "cooler-slot", type: "cooler", x: 220, y: 123, width: 167, height: 174 },

  { id: "cmos-slot", type: "cmos_battery", x: 264, y: 300, width: 45, height: 48 },

  { id: "vga-slot", type: "vga", x: 115, y: 350, width: 152, height: 8 },

  /* ATX 24 PIN */
  {
    id: "atx-slot-24",
    type: "cable_atx-24",
    x: 341,
    y: 24,
    width: 97,
    height: 23,
  },

  /* ATX 4 PIN */
  {
    id: "atx-slot-4",
    type: "cable_atx-4",
    x: 108,
    y: 21,
    width: 31,
    height: 23,
  },

  /* VGA CABLE */
  {
    id: "vga-cable-slot",
    type: "cable_vga",
    x: 0,
    y: 28,
    width: 17,
    height: 72,
  },
];

type SlotBoxProps = {
  slot: Slot;
  isActive: boolean;
  isOccupied: boolean;
  isSimulationStarted?: boolean;
};

export function SlotBox({
  slot,
  isActive,
  isOccupied,
  isSimulationStarted = false,
}: SlotBoxProps) {
  const isRamSlot =
    slot.id === "ram-slot-1" ||
    slot.id === "ram-slot-2";

  const isCpuSlot =
    slot.id === "cpu-slot";

  const isCoolerSlot =
    slot.id === "cooler-slot";

  const isCmosSlot =
    slot.id === "cmos-slot";

  const isVgaSlot =
    slot.id === "vga-slot";

  const isVgaCableSlot =
    slot.id === "vga-cable-slot";

  const isAtxSlot =
    slot.id === "atx-slot-24" ||
    slot.id === "atx-slot-4";

  return (
    <div
      style={{
        position: "absolute",
        left: slot.x,
        top: slot.y,
        width: slot.width,
        height: slot.height,
      }}
      className={`
        pointer-events-none
        transition-colors

${ 
  isOccupied 
    ? isRamSlot 
      ? "bg-[#228B22] border-none" 
      : isVgaSlot 
      ? "bg-black border-none" 
      : isVgaCableSlot 
      ? "bg-[#2A48B8] border-none" 
      : isAtxSlot 
      ? "bg-black border-none"
      : "border-none bg-transparent" 
    : isActive 
    ? "border-2 border-dashed border-yellow-300 bg-yellow-300/25" 
    : "border-2 border-dashed border-white/60 bg-transparent" 
}
      `}
    >
      {/* PROCESSOR */}
      {isCpuSlot && isOccupied && (
        <img
          src="/images/processor.png"
          alt="Processor"
          className="w-full h-full object-fill"
        />
      )}

      {/* COOLER */}
{/* COOLER */}
{isCoolerSlot && isOccupied && (
  <div className="relative w-full h-full ">
    
    {/* FRAME + BAUT */}
    <img
      src="/images/cooler-frame.png"
      alt="Cooler Frame"
      className="
        absolute
        inset-0
        w-full
        h-full
        object-fill
        pointer-events-none

      "
    />

    {/* KIPAS */}
    <img
      src="/images/cooler-fan.png"
      alt="Cooler Fan"
      className={`
        absolute
        left-1/2
        top-1/2
        -translate-x-1/2
        -translate-y-1/2

        w-[90%]
        h-[90%]

        object-fill
        origin-center
        pointer-events-none

        ${
          isSimulationStarted
            ? "animate-[spin_0.6s_linear_infinite]"
            : ""
        }
      `}
    />

  </div>
)}

      {/* CMOS */}
      {isCmosSlot && isOccupied && (
        <img
          src="/images/cmos.png"
          alt="Baterai CMOS"
          className="w-full h-full object-fill scale-125"
        />
      )}
    </div>
  );
}