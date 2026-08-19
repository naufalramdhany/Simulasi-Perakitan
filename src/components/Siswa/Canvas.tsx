"use client";

import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import Motherboard from "./Motherboard";
import { SLOTS } from "./Slot";
import toast from "react-hot-toast";
import { ComputerComponent } from "./Types";

type CanvasProps = {
  zoom: number;

  components: ComputerComponent[];

  setComponents: React.Dispatch<
    React.SetStateAction<ComputerComponent[]>
  >;

  saveHistory: () => void;
};

const SNAP_THRESHOLD = 10;

const INITIAL_SCALE = 0.8;

/* =========================================
   JARAK TITIK KE RECTANGLE
========================================= */

function distanceToRect(
  px: number,
  py: number,
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
) {
  const dx = Math.max(
    rect.x - px,
    0,
    px - (rect.x + rect.width)
  );

  const dy = Math.max(
    rect.y - py,
    0,
    py - (rect.y + rect.height)
  );

  return Math.hypot(dx, dy);
}

/* =========================================
   CARI SLOT SESUAI TIPE
========================================= */

function findNearestSlot(
  x: number,
  y: number,
  type: string,
  occupiedSlotIds: string[]
) {
  let best:
    | (typeof SLOTS)[number]
    | null = null;

  let bestDist = Infinity;

  for (const slot of SLOTS) {
    if (
      occupiedSlotIds.includes(
        slot.id
      )
    ) {
      continue;
    }

    if (slot.type !== type) {
      continue;
    }

    const dist =
      distanceToRect(
        x,
        y,
        slot
      );

    if (
      dist >
      SNAP_THRESHOLD
    ) {
      continue;
    }

    if (dist < bestDist) {
      bestDist = dist;
      best = slot;
    }
  }

  return best;
}

/* =========================================
   CARI SLOT UNTUK HIGHLIGHT
========================================= */

function findNearestSlotAnyType(
  x: number,
  y: number,
  occupiedSlotIds: string[]
) {
  let best:
    | (typeof SLOTS)[number]
    | null = null;

  let bestDist = Infinity;

  for (const slot of SLOTS) {
    if (
      occupiedSlotIds.includes(
        slot.id
      )
    ) {
      continue;
    }

    const dist =
      distanceToRect(
        x,
        y,
        slot
      );

    if (
      dist >
      SNAP_THRESHOLD
    ) {
      continue;
    }

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
  const boardRef =
    useRef<HTMLDivElement>(null);

  const motherboardRef =
    useRef<HTMLDivElement>(null);

  const [
    activeSlotId,
    setActiveSlotId,
  ] = useState<string | null>(
    null
  );

  /* =========================================
     KOMPONEN TERPASANG
  ========================================= */

  const placed =
    components.filter(
      (c) => c.slotId !== null
    );

  const occupiedSlotIds =
    placed
      .map((c) => c.slotId)
      .filter(
        (
          id
        ): id is string =>
          id !== null
      );

  /* =========================================
     OFFSET MOTHERBOARD
  ========================================= */

  const getMotherboardOffset =
    () => {
      const board =
        boardRef.current;

      const motherboard =
        motherboardRef.current;

      if (
        !board ||
        !motherboard
      ) {
        return {
          x: 0,
          y: 0,
        };
      }

      const boardRect =
        board.getBoundingClientRect();

      const motherboardRect =
        motherboard.getBoundingClientRect();

      const scale =
        INITIAL_SCALE *
        zoom;

      return {
        x:
          (
            motherboardRect.left -
            boardRect.left
          ) / scale,

        y:
          (
            motherboardRect.top -
            boardRect.top
          ) / scale,
      };
    };

  /* =========================================
     DRAG OVER
  ========================================= */

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    const motherboard =
      motherboardRef.current;

    if (!motherboard) {
      return;
    }

    const rect =
      motherboard.getBoundingClientRect();

    const scale =
      INITIAL_SCALE *
      zoom;

    const x =
      (
        e.clientX -
        rect.left
      ) / scale;

    const y =
      (
        e.clientY -
        rect.top
      ) / scale;

    const nearest =
      findNearestSlotAnyType(
        x,
        y,
        occupiedSlotIds
      );

    setActiveSlotId(
      nearest
        ? nearest.id
        : null
    );
  };

  /* =========================================
     DROP
  ========================================= */

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    setActiveSlotId(null);

    const idStr =
      e.dataTransfer.getData(
        "componentId"
      );

    if (!idStr) {
      return;
    }

    const id =
      Number(idStr);

    const motherboard =
      motherboardRef.current;

    if (!motherboard) {
      return;
    }

    const rect =
      motherboard.getBoundingClientRect();

    const scale =
      INITIAL_SCALE *
      zoom;

    const dropX =
      (
        e.clientX -
        rect.left
      ) / scale;

    const dropY =
      (
        e.clientY -
        rect.top
      ) / scale;

    const item =
      components.find(
        (c) => c.id === id
      );

    if (!item) {
      return;
    }

    const slot =
      findNearestSlot(
        dropX,
        dropY,
        item.type,
        occupiedSlotIds
      );

    if (!slot) {
      toast.dismiss();

      toast.error(
        `Slot tidak sesuai untuk ${item.name}`
      );

      return;
    }

    saveHistory();

    setComponents(
      (prev) =>
        prev.map((c) => {
          if (c.id !== id) {
            return c;
          }

          /*
           * KABEL:
           *
           * VGA
           * ATX 24
           * ATX 4
           *
           * Tidak perlu dirender sebagai Rnd.
           * Motherboard.tsx yang menggambar
           * kabel SVG-nya.
           */

          if (
            item.type ===
              "cable_vga" ||
            item.type ===
              "cable_atx-24" ||
            item.type ===
              "cable_atx-4"
          ) {
            return {
              ...c,

              slotId:
                slot.id,

              x: 0,
              y: 0,

              width: 0,
              height: 0,

              isCorrect:
                true,
            };
          }

          return {
            ...c,

            slotId:
              slot.id,

            x: slot.x,
            y: slot.y,

            width:
              slot.width,

            height:
              slot.height,

            isCorrect:
              true,
          };
        })
    );

    toast.dismiss();

    toast.success(
      `${item.name} berhasil dipasang`
    );
  };

  const motherboardOffset =
    getMotherboardOffset();

  return (
    <div
      className="
        flex-1
        bg-gray-300
        overflow-auto
      "
    >
      <div
        ref={boardRef}
        onDragOver={
          handleDragOver
        }
        onDrop={
          handleDrop
        }
        onDragLeave={() =>
          setActiveSlotId(
            null
          )
        }
        className="
          relative
          mx-auto
          mt-8
          mb-0
        "
        style={{
          width: 900,
          height: 400,

          transform: `
            translateX(0px)
            translateY(20px)
            scale(
              ${INITIAL_SCALE * zoom}
            )
          `,

          transformOrigin:
            "top center",
        }}
      >
        <Motherboard
          motherboardRef={
            motherboardRef
          }
          activeSlotId={
            activeSlotId
          }
          occupiedSlotIds={
            occupiedSlotIds
          }
          zoom={zoom}
        />

        {placed.map(
          (item) => {

            if (
              item.type ===
                "cable_vga" ||
              item.type ===
                "cable_atx-24" ||
              item.type ===
                "cable_atx-4"
            ) {
              return null;
            }

            return (
              <Rnd
                key={item.id}
                size={{
                  width:
                    item.width,

                  height:
                    item.height,
                }}
                position={{
                  x:
                    motherboardOffset.x +
                    item.x,

                  y:
                    motherboardOffset.y +
                    item.y,
                }}
                enableResizing={
                  false
                }
                disableDragging={
                  true
                }
              >
                <div
                  className="
                    w-full
                    h-full
                    rounded
                  "
                  title={
                    item.name
                  }
                >
                  {item.type !==
                    "ram" &&
                    item.type !==
                      "cpu" &&
                    item.type !==
                      "cooler" &&
                    item.type !==
                      "cmos_battery" &&
                    item.type !==
                      "vga" && (
                      <img
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        className="
                          w-full
                          h-full
                          object-fill
                          select-none
                          pointer-events-none
                        "
                      />
                    )}
                </div>
              </Rnd>
            );
          }
        )}
      </div>
    </div>
  );
}