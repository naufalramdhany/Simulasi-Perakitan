"use client";

import React, { useEffect, useRef, useState } from "react";
import { SLOTS, SlotBox } from "./Slot";

type MotherboardProps = {
  activeSlotId?: string | null;
  occupiedSlotIds?: string[];
  motherboardRef?: React.RefObject<HTMLDivElement | null>;
  zoom?: number;
  isSimulationStarted?: boolean;
};

type Point = {
  x: number;
  y: number;
};

export default function Motherboard({
  activeSlotId = null,
  occupiedSlotIds = [],
  motherboardRef,
  zoom = 1,
  isSimulationStarted = false,
}: MotherboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const monitorPortRef = useRef<HTMLDivElement>(null);
  const psuPortRef = useRef<HTMLDivElement>(null);

  const [monitorPort, setMonitorPort] = useState<Point | null>(null);
  const [motherboardVgaPort, setMotherboardVgaPort] = useState<Point | null>(null);
  const [motherboardAtx24Port, setMotherboardAtx24Port] = useState<Point | null>(null);
  const [motherboardAtx4Port, setMotherboardAtx4Port] = useState<Point | null>(null);
  const [psuPort, setPsuPort] = useState<Point | null>(null);

  const [bootStage, setBootStage] = useState<"off" | "booting" | "on">("off");

  useEffect(() => {
    if (isSimulationStarted) {
      setBootStage("booting");

      const t = setTimeout(() => {
        setBootStage("on");
      }, 2000);

      return () => clearTimeout(t);
    } else {
      setBootStage("off");
    }
  }, [isSimulationStarted]);

  const updatePorts = () => {
    const container = containerRef.current;
    const monitorPortElement = monitorPortRef.current;
    const psuPortElement = psuPortRef.current;
    const motherboard = motherboardRef?.current;

    if (!container || !monitorPortElement || !psuPortElement || !motherboard) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const motherboardRect = motherboard.getBoundingClientRect();
    const monitorRect = monitorPortElement.getBoundingClientRect();
    const psuRect = psuPortElement.getBoundingClientRect();

    const scale = 0.8 * zoom;

    const monitorX = (monitorRect.left + monitorRect.width / 2 - containerRect.left) / scale;
    const monitorY = (monitorRect.top + monitorRect.height / 2 - containerRect.top) / scale;

    setMonitorPort({
      x: monitorX,
      y: monitorY,
    });

    const motherboardX = (motherboardRect.left - containerRect.left) / scale;
    const motherboardY = (motherboardRect.top - containerRect.top) / scale;

    const vgaSlot = SLOTS.find((slot) => slot.id === "vga-cable-slot");

    if (vgaSlot) {
      const vgaX = motherboardX + vgaSlot.x + vgaSlot.width / 2;
      const vgaY = motherboardY + vgaSlot.y + vgaSlot.height / 2 + 5;

      setMotherboardVgaPort({
        x: vgaX,
        y: vgaY,
      });
    }

    const atx24Slot = SLOTS.find((slot) => slot.id === "atx-slot-24");

    if (atx24Slot) {
      const atx24X = motherboardX + atx24Slot.x + atx24Slot.width / 2 + 10;
      const atx24Y = motherboardY + atx24Slot.y + atx24Slot.height / 2 + 7;

      setMotherboardAtx24Port({
        x: atx24X,
        y: atx24Y,
      });
    }

    const atx4Slot = SLOTS.find((slot) => slot.id === "atx-slot-4");

    if (atx4Slot) {
      const atx4X = motherboardX + atx4Slot.x + atx4Slot.width / 2 + 8;
      const atx4Y = motherboardY + atx4Slot.y + atx4Slot.height / 2 + 8;

      setMotherboardAtx4Port({
        x: atx4X,
        y: atx4Y,
      });
    }

    const psuX = (psuRect.left + psuRect.width / 2 - containerRect.left) / scale;
    const psuY = (psuRect.top + psuRect.height / 2 - containerRect.top) / scale;

    setPsuPort({
      x: psuX,
      y: psuY,
    });
  };

  useEffect(() => {
    updatePorts();

    const timer = setTimeout(() => {
      updatePorts();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [zoom]);

  useEffect(() => {
    const handleResize = () => {
      updatePorts();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [zoom]);

  const isVgaConnected = occupiedSlotIds.includes("vga-cable-slot");
  const isAtx24Connected = occupiedSlotIds.includes("atx-slot-24");
  const isAtx4Connected = occupiedSlotIds.includes("atx-slot-4");

  let vgaCablePath = "";

  if (isVgaConnected && monitorPort && motherboardVgaPort) {
    const bendX = motherboardVgaPort.x - 90;
    vgaCablePath = `M ${monitorPort.x} ${monitorPort.y} L ${bendX} ${monitorPort.y} L ${bendX} ${motherboardVgaPort.y} L ${motherboardVgaPort.x} ${motherboardVgaPort.y}`;
  }

  let atx24CablePaths: string[] = [];

  if (isAtx24Connected && motherboardAtx24Port && psuPort) {
    const spacing = 2.7;
    const firstX = psuPort.x + 80;
    const upY = psuPort.y - 70;
    const secondX = motherboardAtx24Port.x;

    atx24CablePaths = Array.from({ length: 12 }).map((_, i) => {
      const offset = (i - 5.5) * spacing;
      return `M ${psuPort.x} ${psuPort.y + offset} L ${firstX + offset} ${psuPort.y + offset} L ${firstX + offset} ${upY + offset} L ${secondX + offset} ${upY + offset} L ${secondX + offset} ${motherboardAtx24Port.y}`;
    });
  }

  let atx4CablePath = "";

  if (isAtx4Connected && motherboardAtx4Port && psuPort) {
    atx4CablePath = `M ${psuPort.x} ${psuPort.y} L ${motherboardAtx4Port.x} ${motherboardAtx4Port.y}`;
  }

  return (
    <div ref={containerRef} className="relative flex items-start">
      {isVgaConnected && vgaCablePath && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
          <path d={vgaCablePath} fill="none" stroke="black" strokeWidth="7" strokeLinejoin="round" />
        </svg>
      )}

      {isAtx24Connected && atx24CablePaths.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
          {["#F97316", "#F97316", "#111111", "#DC2626", "#111111", "#DC2626", "#111111", "#9CA3AF", "#A855F7", "#FACC15", "#FACC15", "#F97316"].map((color, i) => (
            <path key={i} d={atx24CablePaths[i]} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
          ))}
        </svg>
      )}

      {isAtx4Connected && atx4CablePath && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
          <path d={atx4CablePath} fill="none" stroke="#FACC15" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" transform="translate(0 -4)" />
          <path d={atx4CablePath} fill="none" stroke="#FACC15" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" transform="translate(0 -1.3)" />
          <path d={atx4CablePath} fill="none" stroke="#111111" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" transform="translate(0 1.3)" />
          <path d={atx4CablePath} fill="none" stroke="#111111" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" transform="translate(0 4)" />
        </svg>
      )}

      <div className="z-[100] mr-33 flex flex-col items-center justify-start -translate-y-5">
        <div className="relative">
          <img src="/images/psu.png" alt="Power Supply" className="w-[250px] h-auto object-contain select-none pointer-events-none" draggable={false} />
          <div ref={psuPortRef} className="absolute right-[-2px] top-[60px] -translate-y-1/2 w-[25px] h-[25px] bg-transparent pointer-events-none z-[110]" />
        </div>

        <span className="mt-0 text-sm font-semibold text-gray-700">Power Supply</span>

        <div className="relative mt-6 z-[60]">
          <div className={`relative`}>
            <img src="/images/monitor.png" alt="Monitor" className="w-[250px] h-auto object-contain select-none pointer-events-none" draggable={false} />

            {isSimulationStarted && (
              <div className="absolute left-[50%] top-[37.5%] -translate-x-1/2 -translate-y-1/2 w-[240px] h-[150px] rounded bg-black overflow-hidden flex items-center justify-center pointer-events-none">
                {bootStage === "booting" && (
                  <span className="text-green-400 text-[10px] font-mono animate-pulse">Starting System...</span>
                )}
                {bootStage === "on" && (
                  <div className="w-full h-full bg-blue-500/80 flex items-center justify-center">
                    <span className="text-white text-[10px] font-mono">Desktop</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div ref={monitorPortRef} id="monitor-vga-port" className="absolute left-1/2 -translate-x-1/2 bottom-8 w-10 h-5 border-none bg-transparent pointer-events-none z-40" />
        </div>

        <span className="mt-2 text-sm font-semibold text-gray-700">Monitor</span>
      </div>

      <div ref={motherboardRef} className="relative w-[500px] aspect-square rounded-xl border-8 border-gray-700 shadow-2xl overflow-hidden bg-white z-10">
        <img src="/images/motherboard.jpeg" alt="Motherboard" className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" draggable={false} />
        {SLOTS.map((slot) => (
          <SlotBox key={slot.id} slot={slot} isActive={activeSlotId === slot.id} isOccupied={occupiedSlotIds.includes(slot.id)} isSimulationStarted={isSimulationStarted} />
        ))}
        <div className="absolute bottom-3 left-3 text-white text-lg font-bold drop-shadow bg-black/40 px-2 py-1 rounded">
          GIGABYTE GA-H61M-S2P
        </div>
      </div>
    </div>
  );
}