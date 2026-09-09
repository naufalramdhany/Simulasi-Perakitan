"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ComputerComponent } from "./Types";

type Pointer = { x: number; y: number };

type DragContextValue = {
  dragItem: ComputerComponent | null;
  pointer: Pointer | null;
  startDrag: (item: ComputerComponent, x: number, y: number) => void;
  endDrag: () => void;
};

const DragContext = createContext<DragContextValue | null>(null);

export function DragProvider({ children }: { children: React.ReactNode }) {
  const [dragItem, setDragItem] = useState<ComputerComponent | null>(null);
  const [pointer, setPointer] = useState<Pointer | null>(null);

  const startDrag = useCallback((item: ComputerComponent, x: number, y: number) => {
    setDragItem(item);
    setPointer({ x, y });
  }, []);

  const endDrag = useCallback(() => {
    setDragItem(null);
    setPointer(null);
  }, []);

  useEffect(() => {
    if (!dragItem) return;

    const handleMove = (e: PointerEvent) => {
      setPointer({ x: e.clientX, y: e.clientY });
    };

    const handleUp = () => {
      endDrag();
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [dragItem, endDrag]);

  return (
    <DragContext.Provider value={{ dragItem, pointer, startDrag, endDrag }}>
      {children}

      {dragItem && pointer && (
        <div
          className="fixed z-[9999] pointer-events-none flex flex-col items-center"
          style={{
            left: pointer.x,
            top: pointer.y,
            transform: "translate(-50%, -50%)",
            opacity: 0.85,
          }}
        >
          <img
            src={dragItem.image}
            alt={dragItem.name}
            className="w-14 h-14 object-contain drop-shadow-lg"
            draggable={false}
          />
        </div>
      )}
    </DragContext.Provider>
  );
}

export function useDrag() {
  const ctx = useContext(DragContext);
  if (!ctx) {
    throw new Error("useDrag harus dipakai di dalam <DragProvider>");
  }
  return ctx;
}