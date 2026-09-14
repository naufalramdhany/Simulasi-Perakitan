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

type Point = { x: number; y: number };

export default function Motherboard({ activeSlotId = null, occupiedSlotIds = [], motherboardRef, zoom = 1, isSimulationStarted = false }: MotherboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const monitorPortRef = useRef<HTMLDivElement>(null);
  const psuPortRef = useRef<HTMLDivElement>(null);
  const sataPowerPsuPortRef = useRef<HTMLDivElement>(null);
  const hddPortRef = useRef<HTMLDivElement>(null);
  const hddSataDataPortRef = useRef<HTMLDivElement>(null);

  const [monitorPort, setMonitorPort] = useState<Point | null>(null);
  const [motherboardVgaPort, setMotherboardVgaPort] = useState<Point | null>(null);
  const [motherboardAtx24Port, setMotherboardAtx24Port] = useState<Point | null>(null);
  const [motherboardAtx4Port, setMotherboardAtx4Port] = useState<Point | null>(null);
  const [psuPort, setPsuPort] = useState<Point | null>(null);
  const [sataPowerPsuPort, setSataPowerPsuPort] = useState<Point | null>(null);
  const [hddPort, setHddPort] = useState<Point | null>(null);
  const [motherboardSataDataPort, setMotherboardSataDataPort] = useState<Point | null>(null);
  const [hddSataDataPort, setHddSataDataPort] = useState<Point | null>(null);

  const [bootStage, setBootStage] = useState<"off" | "booting" | "on">("off");

  useEffect(() => {
    if (isSimulationStarted) {
      setBootStage("booting");
      const t = setTimeout(() => { setBootStage("on"); }, 2000);
      return () => clearTimeout(t);
    } else {
      setBootStage("off");
    }
  }, [isSimulationStarted]);

  const updatePorts = () => {
    const container = containerRef.current;
    const monitorPortElement = monitorPortRef.current;
    const psuPortElement = psuPortRef.current;
    const sataPsuPortElement = sataPowerPsuPortRef.current;
    const hddPortElement = hddPortRef.current;
    const hddSataDataPortElement = hddSataDataPortRef.current;
    const motherboard = motherboardRef?.current;

    if (!container || !monitorPortElement || !psuPortElement || !motherboard) return;

    const containerRect = container.getBoundingClientRect();
    const motherboardRect = motherboard.getBoundingClientRect();
    const monitorRect = monitorPortElement.getBoundingClientRect();
    const psuRect = psuPortElement.getBoundingClientRect();
    const scale = 0.8 * zoom;

    const monitorX = (monitorRect.left + monitorRect.width / 2 - containerRect.left) / scale;
    const monitorY = (monitorRect.top + monitorRect.height / 2 - containerRect.top) / scale - 35;
    setMonitorPort({ x: monitorX, y: monitorY });

    const motherboardX = (motherboardRect.left - containerRect.left) / scale;
    const motherboardY = (motherboardRect.top - containerRect.top) / scale;

    const vgaSlot = SLOTS.find((slot) => slot.id === "vga-cable-slot");
    if (vgaSlot) {
      const vgaX = motherboardX + vgaSlot.x + vgaSlot.width / 2 - 33;
      const vgaY = motherboardY + vgaSlot.y + vgaSlot.height / 2 + 5;
      setMotherboardVgaPort({ x: vgaX, y: vgaY });
    }

    const atx24Slot = SLOTS.find((slot) => slot.id === "atx-slot-24");
    if (atx24Slot) {
      const atx24X = motherboardX + atx24Slot.x + atx24Slot.width / 2 - 25;
      const atx24Y = motherboardY + atx24Slot.y + atx24Slot.height / 2 + 7;
      setMotherboardAtx24Port({ x: atx24X, y: atx24Y });
    }

    const atx4Slot = SLOTS.find((slot) => slot.id === "atx-slot-4");
    if (atx4Slot) {
      const atx4X = motherboardX + atx4Slot.x + atx4Slot.width / 2 - 25;
      const atx4Y = motherboardY + atx4Slot.y + atx4Slot.height / 2 + 4;
      setMotherboardAtx4Port({ x: atx4X, y: atx4Y });
    }

    const sataDataSlot = SLOTS.find((slot) => slot.id === "sata-cable-slot");
    if (sataDataSlot) {
      const sataDataX = motherboardX + sataDataSlot.x + sataDataSlot.width / 2;
      const sataDataY = motherboardY + sataDataSlot.y + sataDataSlot.height / 2;
      setMotherboardSataDataPort({ x: sataDataX, y: sataDataY });
    }

    const psuX = (psuRect.left + psuRect.width / 2 - containerRect.left) / scale;
    const psuY = (psuRect.top + psuRect.height / 2 - containerRect.top) / scale;
    setPsuPort({ x: psuX, y: psuY });

    if (sataPsuPortElement) {
      const sataPsuRect = sataPsuPortElement.getBoundingClientRect();
      const sataPsuX = (sataPsuRect.left + sataPsuRect.width / 2 - containerRect.left) / scale;
      const sataPsuY = (sataPsuRect.top + sataPsuRect.height / 2 - containerRect.top) / scale;
      setSataPowerPsuPort({ x: sataPsuX, y: sataPsuY });
    }

    if (hddPortElement) {
      const hddRect = hddPortElement.getBoundingClientRect();
      const hddX = (hddRect.right - containerRect.left) / scale;
      const hddY = (hddRect.top + hddRect.height / 2 - containerRect.top) / scale;
      setHddPort({ x: hddX, y: hddY });
    }

    if (hddSataDataPortElement) {
      const hddSataDataRect = hddSataDataPortElement.getBoundingClientRect();
      const hddSataDataX = (hddSataDataRect.left + hddSataDataRect.width / 2 - containerRect.left) / scale;
      const hddSataDataY = (hddSataDataRect.top + hddSataDataRect.height / 2 - containerRect.top) / scale;
      setHddSataDataPort({ x: hddSataDataX, y: hddSataDataY });
    }
  };

  useEffect(() => {
    updatePorts();
    const timer = setTimeout(() => { updatePorts(); }, 100);
    return () => { clearTimeout(timer); };
  }, [zoom]);

  useEffect(() => {
    const handleResize = () => { updatePorts(); };
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); };
  }, [zoom]);

  const isVgaConnected = occupiedSlotIds.includes("vga-cable-slot");
  const isAtx24Connected = occupiedSlotIds.includes("atx-slot-24");
  const isAtx4Connected = occupiedSlotIds.includes("atx-slot-4");
  const isSataDataConnected = occupiedSlotIds.includes("sata-cable-slot");

  let vgaCablePath = "";
  if (isVgaConnected && monitorPort && motherboardVgaPort) {
    const bendX = motherboardVgaPort.x - 60;
    vgaCablePath = `M ${monitorPort.x} ${monitorPort.y} L ${bendX} ${monitorPort.y} L ${bendX} ${motherboardVgaPort.y} L ${motherboardVgaPort.x} ${motherboardVgaPort.y}`;
  }

  let atx24CablePaths: string[] = [];
  if (isAtx24Connected && motherboardAtx24Port && psuPort) {
    const spacing = 2.8;
    const rightX = psuPort.x + 460;
    const downY = psuPort.y + 110;
    atx24CablePaths = Array.from({ length: 12 }).map((_, i) => {
      const offset = (i - 5.5) * spacing;
      return `M ${psuPort.x - 15} ${psuPort.y + offset - 23} L ${rightX + offset} ${psuPort.y + offset - 23} L ${rightX + offset} ${downY + offset} L ${motherboardAtx24Port.x} ${downY + offset}`;
    });
  }

  let atx4CablePaths: string[] = [];
  if (isAtx4Connected && motherboardAtx4Port && psuPort) {
    const spacing = 3;
    atx4CablePaths = Array.from({ length: 4 }).map((_, i) => {
      const offset = (i - 1.5) * spacing;
      return `M ${psuPort.x - 15} ${psuPort.y + offset - 23} L ${motherboardAtx4Port.x + offset} ${psuPort.y + offset - 23} L ${motherboardAtx4Port.x + offset} ${motherboardAtx4Port.y}`;
    });
  }

  let sataPowerCablePaths: string[] = [];
  if (sataPowerPsuPort && hddPort) {
    const spacing = 3;
    const startX = sataPowerPsuPort.x;
    const startY = sataPowerPsuPort.y;
    const rightX1 = startX + 50;
    const downY = hddPort.y + 150;
    const rightX2 = hddPort.x - 123;
    const upY = hddPort.y - 29;
    const verticalSpacing = 3;

    sataPowerCablePaths = Array.from({ length: 4 }).map((_, i) => {
      const offset = (i - 1.5) * spacing;
      const verticalX1 = rightX1 + (i - 1.5) * verticalSpacing;
      const verticalX2 = rightX2 + (i - 1.5) * verticalSpacing;
      const cableStartY = startY + offset;
      const cableDownY = downY + offset;
      const cableUpY = upY + offset;
      return `M ${startX} ${cableStartY} L ${verticalX1} ${cableStartY} L ${verticalX1} ${cableDownY} L ${verticalX2} ${cableDownY} L ${verticalX2} ${cableUpY}`;
    });
  }

  let sataDataCablePaths: string[] = [];
  if (isSataDataConnected && motherboardSataDataPort && hddSataDataPort) {
    const startX = motherboardSataDataPort.x-25;
    const startY = motherboardSataDataPort.y+4;
    const rightX1 = startX;
    const downY = hddSataDataPort.y + 120;
    const rightX2 = hddSataDataPort.x -96;
    const upY = hddSataDataPort.y-30;
    sataDataCablePaths = [`M ${startX} ${startY} L ${rightX1} ${startY} L ${rightX1} ${downY} L ${rightX2} ${downY} L ${rightX2} ${upY}`];
  }

  return (
    <div ref={containerRef} className="relative flex items-start pt-8">
      {isVgaConnected && vgaCablePath && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
          <path d={vgaCablePath} fill="none" stroke="black" strokeWidth="5" strokeLinejoin="round" />
        </svg>
      )}

      {isAtx24Connected && atx24CablePaths.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
          {["#F97316", "#F97316", "#111111", "#DC2626", "#111111", "#DC2626", "#111111", "#9CA3AF", "#A855F7", "#FACC15", "#FACC15", "#F97316"].map((color, i) => (
            <path key={i} d={atx24CablePaths[i]} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          ))}
        </svg>
      )}

      {isAtx4Connected && atx4CablePaths.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
          {["#FACC15", "#FACC15", "#111111", "#111111"].map((color, i) => (
            <path key={i} d={atx4CablePaths[i]} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          ))}
        </svg>
      )}

      {sataPowerCablePaths.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
          {["#DC2626", "#111111", "#111111", "#FACC15"].map((color, i) => (
            <path key={i} d={sataPowerCablePaths[i]} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          ))}
        </svg>
      )}

      {isSataDataConnected && sataDataCablePaths.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
          {sataDataCablePaths.map((path, i) => (
            <path key={i} d={path} fill="none" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
          ))}
        </svg>
      )}

      <div className="z-[100] mr-20 flex flex-col items-center justify-start -translate-y-5">
        <div className="relative">
          <img src="/images/psu.png" alt="Power Supply" className="w-[300px] h-auto object-contain select-none pointer-events-none" draggable={false} />
          <div ref={psuPortRef} className="absolute right-[-2px] top-[60px] -translate-y-1/2 w-[25px] h-[25px] bg-transparent pointer-events-none z-[110]" />
          <div ref={sataPowerPsuPortRef} className="absolute right-[15px] top-[27px] w-[25px] h-[25px] bg-transparent pointer-events-none z-[110]" />
        </div>

        <span className="mt-0 text-sm font-semibold text-gray-700">Power Supply</span>

        <div className="relative mt-6 z-[60]">
          <div className="relative">
            <img src="/images/monitor.png" alt="Monitor" className="w-[300px] h-auto object-contain select-none pointer-events-none" draggable={false} />
            {isSimulationStarted && (
              <div className="absolute right-[3.5px] top-[7px] w-[179px] h-[112px] rounded bg-black overflow-hidden flex items-center justify-center pointer-events-none">
                {bootStage === "booting" && <span className="text-green-400 text-[10px] font-mono animate-pulse">Starting System...</span>}
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

      <div ref={motherboardRef} className="relative w-[600px] aspect-square rounded-xl border-8 border-gray-700 shadow-2xl overflow-visible bg-white z-10">
        <img src="/images/mobo.jpeg" alt="Motherboard" className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" draggable={false} />
        {SLOTS.map((slot) => (
          <SlotBox key={slot.id} slot={slot} isActive={activeSlotId === slot.id} isOccupied={slot.id === "sata-cable-slot" ? isSataDataConnected : occupiedSlotIds.includes(slot.id)} isSimulationStarted={isSimulationStarted} />
        ))}
      </div>

      <div className="ml-8 flex flex-col items-center justify-start">
        <span className="text-sm font-semibold text-gray-700">Hard Disk</span>
        <div className="relative">
          <img src="/images/hdd.png" alt="Hard Disk" className="w-[350px] h-auto object-contain select-none pointer-events-none -mt-1" draggable={false} />
          <div ref={hddPortRef} className="absolute left-[111px] top-[190px] w-[40.5px] h-[9px] bg-black pointer-events-none z-[110]" />
          <div ref={hddSataDataPortRef} className={`absolute left-[81px] top-[190px] w-[21.5px] h-[9px] pointer-events-none z-[110] ${isSataDataConnected ? "bg-black" : "bg-transparent"}`} />
        </div>
      </div>
    </div>
  );
}