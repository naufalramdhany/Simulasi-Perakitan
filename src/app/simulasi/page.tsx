"use client";

import { useState } from "react";
import Sidebar from "../../components/Siswa/SidebarSimulasi";
import Header from "../../components/Siswa/Header";
import Toolbar from "../../components/Siswa/Toolbar";
import Canvas from "../../components/Siswa/Canvas";
import ComponentPanel from "../../components/Siswa/ComponentPanel";

export interface Slot {
  id: string;
  type: "cpu" | "ram" | "ssd" | "cooler" | "hdd" | "vga" | "psu" | "cmos_battery" | "sata_cable" | "sata_power_cable" | "optical_drive" | "cooling_fan" | "casing" | "monitor" | "speaker" | "mouse" | "keyboard";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComputerComponent {
  id: number;
  name: string;
  image: string;
  type: Slot["type"];
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;   // 🆕 ukuran asli (dipakai lagi saat dilepas ke panel)
  originalHeight: number;  // 🆕
  slotId: string | null;
  isCorrect?: boolean;
}

const INITIAL_COMPONENTS: ComputerComponent[] = [
  // --- Sudah ada sebelumnya ---
  { id: 1, name: "Processor", image: "/images/processor.jpeg", type: "cpu", x: 0, y: 0, width: 90, height: 90, originalWidth: 90, originalHeight: 90, slotId: null },
  { id: 2, name: "RAM 1", image: "/images/RAM.jpg", type: "ram", x: 0, y: 0, width: 24, height: 160, originalWidth: 24, originalHeight: 160, slotId: null },
  { id: 3, name: "RAM 2", image: "/images/RAM.jpg", type: "ram", x: 0, y: 0, width: 24, height: 160, originalWidth: 24, originalHeight: 160, slotId: null },
  { id: 4, name: "SSD", image: "/images/ssd.jpeg", type: "ssd", x: 0, y: 0, width: 90, height: 50, originalWidth: 90, originalHeight: 50, slotId: null },
  { id: 5, name: "Cooler", image: "/images/cooler.jpeg", type: "cooler", x: 0, y: 0, width: 100, height: 100, originalWidth: 100, originalHeight: 100, slotId: null },
  { id: 6, name: "HDD", image: "/images/hdd.jpeg", type: "hdd", x: 0, y: 0, width: 100, height: 100, originalWidth: 100, originalHeight: 100, slotId: null },
  { id: 7, name: "VGA", image: "/images/vga.jpeg", type: "vga", x: 0, y: 0, width: 170, height: 60, originalWidth: 170, originalHeight: 60, slotId: null },
  { id: 8, name: "Power Supply", image: "/images/psu.jpeg", type: "psu", x: 0, y: 0, width: 90, height: 90, originalWidth: 90, originalHeight: 90, slotId: null },

  { id: 9, name: "Baterai CMOS", image: "/images/cmos_battery.jpeg", type: "cmos_battery", x: 0, y: 0, width: 40, height: 40, originalWidth: 40, originalHeight: 40, slotId: null },
  { id: 10, name: "Kabel SATA", image: "/images/sata_cable.jpeg", type: "sata_cable", x: 0, y: 0, width: 120, height: 30, originalWidth: 120, originalHeight: 30, slotId: null },
  { id: 11, name: "Kabel Power SATA", image: "/images/sata_power_cable.jpeg", type: "sata_power_cable", x: 0, y: 0, width: 120, height: 30, originalWidth: 120, originalHeight: 30, slotId: null },
  { id: 12, name: "Optical Drive (DVD)", image: "/images/optical_drive.jpeg", type: "optical_drive", x: 0, y: 0, width: 150, height: 40, originalWidth: 150, originalHeight: 40, slotId: null },
  { id: 13, name: "Cooling Fan (Casing)", image: "/images/cooling_fan.jpeg", type: "cooling_fan", x: 0, y: 0, width: 90, height: 90, originalWidth: 90, originalHeight: 90, slotId: null },
];

export default function SimulasiPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [components, setComponents] = useState<ComputerComponent[]>(INITIAL_COMPONENTS);
  const [history, setHistory] = useState<ComputerComponent[][]>([]);
  const [redoHistory, setRedoHistory] = useState<ComputerComponent[][]>([]);

  const saveHistory = () => {
    setHistory((prev) => [...prev, components]);
    setRedoHistory([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoHistory((prev) => [...prev, components]);
    setComponents(previous);
    setHistory(history.slice(0, history.length - 1));
  };

  const redo = () => {
    if (redoHistory.length === 0) return;
    const next = redoHistory[redoHistory.length - 1];
    setHistory((prev) => [...prev, components]);
    setComponents(next);
    setRedoHistory(redoHistory.slice(0, redoHistory.length - 1));
  };

  const reset = () => {
    saveHistory();
    setComponents(INITIAL_COMPONENTS);
  };

  const placedCount = components.filter((c) => c.slotId !== null).length;
  const isAssemblyComplete =
    placedCount > 0 && components.every((c) => c.slotId !== null && c.isCorrect === true);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          
      <main className="md:ml-20 flex flex-col min-h-screen">
<div className="lg:hidden">
  <Header setIsSidebarOpen={setIsSidebarOpen} />
</div>
        <Toolbar undo={undo} redo={redo} reset={reset} zoom={zoom} setZoom={setZoom} canUndo={history.length > 0} canRedo={redoHistory.length > 0}
/>

        {isAssemblyComplete && (
          <div className="bg-green-500 text-white text-center py-2 font-bold">
            🎉 Perakitan selesai! Semua komponen terpasang dengan benar.
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          <Canvas
            zoom={zoom}
            components={components}
            setComponents={setComponents}
            saveHistory={saveHistory}
          />

          <ComponentPanel
            components={components}
            setComponents={setComponents}
            saveHistory={saveHistory}
          />
        </div>
      </main>
    </div>
  );
}
