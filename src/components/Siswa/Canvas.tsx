"use client";

import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import Motherboard from "./Motherboard";
import { SLOTS } from "./Slot";
import toast from "react-hot-toast";
import { ComputerComponent } from "../../app/simulasi/page";

type CanvasProps = {
  zoom: number;
  components: ComputerComponent[];
  setComponents: React.Dispatch<React.SetStateAction<ComputerComponent[]>>;
  saveHistory: () => void;
};

const SNAP_THRESHOLD = 60;

// Skala awal motherboard
const INITIAL_SCALE = 0.8;

// Jarak dari sebuah titik (px, py) ke persegi slot.
// Kalau titik berada DI DALAM slot, hasilnya 0.
function distanceToRect(
  px: number,
  py: number,
  rect: { x: number; y: number; width: number; height: number }
) {
  const dx = Math.max(rect.x - px, 0, px - (rect.x + rect.width));
  const dy = Math.max(rect.y - py, 0, py - (rect.y + rect.height));
  return Math.hypot(dx, dy);
}

function findNearestSlot(
  x: number,
  y: number,
  type: string,
  occupiedSlotIds: string[]
) {
  let best: (typeof SLOTS)[number] | null = null;
  let bestDist = Infinity;

  for (const slot of SLOTS) {
    if (occupiedSlotIds.includes(slot.id)) continue;

    const dist = distanceToRect(x, y, slot);

    if (dist > SNAP_THRESHOLD) continue;

    const score = slot.type === type ? dist : dist + 1000;

    if (score < bestDist) {
      bestDist = score;
      best = slot;
    }
  }

  return best;
}

// Untuk highlight saat drag: cari slot terdekat TANPA memedulikan
// tipe (biar semua slot kosong yang cukup dekat ikut menyala,
// sesuai jenis kotak yang lebih dekat duluan).
function findNearestSlotAnyType(
  x: number,
  y: number,
  occupiedSlotIds: string[]
) {
  let best: (typeof SLOTS)[number] | null = null;
  let bestDist = Infinity;

  for (const slot of SLOTS) {
    if (occupiedSlotIds.includes(slot.id)) continue;

    const dist = distanceToRect(x, y, slot);
    if (dist > SNAP_THRESHOLD) continue;

    if (dist < bestDist) {
      bestDist = dist;
      best = slot;
    }
  }

  return best;
}

export default function Canvas({
  zoom,
  components,
  setComponents,
  saveHistory,
}: CanvasProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  const placed = components.filter((c) => c.slotId !== null);
  const occupiedSlotIds = placed.map((c) => c.slotId as string);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const board = boardRef.current;
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const scale = INITIAL_SCALE * zoom;

    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const nearest = findNearestSlotAnyType(x, y, occupiedSlotIds);
    setActiveSlotId(nearest ? nearest.id : null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveSlotId(null);

    const idStr = e.dataTransfer.getData("componentId");
    if (!idStr) return;

    const id = Number(idStr);

    const board = boardRef.current;
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const scale = INITIAL_SCALE * zoom;

    const dropX = (e.clientX - rect.left) / scale;
    const dropY = (e.clientY - rect.top) / scale;

    const item = components.find((c) => c.id === id);
    if (!item) return;

    const slot = findNearestSlot(
      dropX,
      dropY,
      item.type,
      occupiedSlotIds
    );

    if (!slot) return;

    const isCorrect = slot.type === item.type;

    saveHistory();

setComponents((prev) =>
  prev.map((c) =>
    c.id === id
      ? {
          ...c,
          slotId: slot.id,
          // 🔽 ukuran & posisi mengikuti slot persis, bukan ukuran asli komponen
          x: slot.x,
          y: slot.y,
          width: slot.width,
          height: slot.height,
          isCorrect,
        }
      : c
  )
);

    toast.dismiss();

    if (isCorrect) {
      toast.success(`${item.name} berhasil dipasang`);
    } else {
      toast.error(`${item.name} dipasang pada tempat yang salah`);
    }
  };

  const handleReposition = (
    item: ComputerComponent,
    d: { x: number; y: number }
  ) => {
    const currentOccupied = components
      .filter((c) => c.id !== item.id && c.slotId !== null)
      .map((c) => c.slotId as string);

    const nearest = findNearestSlotAnyType(
      d.x + item.width / 2,
      d.y + item.height / 2,
      currentOccupied
    );

    setActiveSlotId(nearest ? nearest.id : null);
  };

const handleRepositionStop = (
  item: ComputerComponent,
  d: { x: number; y: number }
) => {
  setActiveSlotId(null);

  const outOfBounds =
    d.x < -50 ||
    d.y < -50 ||
    d.x > 900 ||
    d.y > 650;

  if (outOfBounds) {
    setComponents((prev) =>
      prev.map((c) =>
        c.id === item.id
          ? {
              ...c,
              slotId: null,
              isCorrect: undefined,
              x: 0,
              y: 0,
              width: c.originalWidth,
              height: c.originalHeight,
            }
          : c
      )
    );

    return;
  }

  // Slot yang sudah ditempati komponen LAIN (bukan diri sendiri)
  const currentOccupied = components
    .filter((c) => c.id !== item.id && c.slotId !== null)
    .map((c) => c.slotId as string);

  const slot = findNearestSlot(
    d.x + item.width / 2,
    d.y + item.height / 2,
    item.type,
    currentOccupied
  );

  if (!slot) {
    // 🔽 Tidak ada slot kosong di dekat titik drop -> batalkan
    // pemindahan, kembalikan ke posisi & ukuran SEMULA.
    setComponents((prev) =>
      prev.map((c) =>
        c.id === item.id
          ? {
              ...c,
              x: item.x,
              y: item.y,
              width: item.width,
              height: item.height,
              slotId: item.slotId,
              isCorrect: item.isCorrect,
            }
          : c
      )
    );

    return;
  }

  const isCorrect = slot.type === item.type;

  setComponents((prev) =>
    prev.map((c) =>
      c.id === item.id
        ? {
            ...c,
            slotId: slot.id,
            x: slot.x,
            y: slot.y,
            width: slot.width,
            height: slot.height,
            isCorrect,
          }
        : c
    )
  );

  toast.dismiss();

  if (isCorrect) {
    toast.success(`${item.name} berhasil dipasang`);
  } else {
    toast.error(`${item.name} dipasang pada tempat yang salah`);
  }
};

  return (
    <div className="flex-1 bg-gray-300 overflow-auto">
      <div
        ref={boardRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={() => setActiveSlotId(null)}
className="relative mx-auto mt-8 mb-0"
style={{
  width: 900,
  height: 450,
  transform: `translateX(140px) scale(${INITIAL_SCALE * zoom})`,
  transformOrigin: "top center",
}}
      >
        <Motherboard
          activeSlotId={activeSlotId}
          occupiedSlotIds={occupiedSlotIds}
        />

        {placed.map((item) => (
          <Rnd
            key={item.id}
            size={{
              width: item.width,
              height: item.height,
            }}
            position={{
              x: item.x,
              y: item.y,
            }}
            enableResizing={false}
            bounds="window"
            onDragStart={() => {
              saveHistory();
            }}
            onDrag={(e, d) => handleReposition(item, d)}
            onDragStop={(e, d) => handleRepositionStop(item, d)}
          >
            <div
              className="w-full h-full rounded cursor-grab active:cursor-grabbing transition"
              title={
                item.isCorrect === false
                  ? "Slot salah — coba pindahkan ke slot yang sesuai"
                  : item.name
              }
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain select-none pointer-events-none"
              />
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}