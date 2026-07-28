"use client";

import { useState } from "react";
import Sidebar from "../../components/Siswa/SidebarSimulasi";
import Header from "../../components/Siswa/Header";
import Toolbar from "../../components/Siswa/Toolbar";
import Canvas from "../../components/Siswa/Canvas";
import ComponentPanel from "../../components/Siswa/ComponentPanel";

// Tipe slot yang tersedia di motherboard
export interface Slot {
  id: string;
  type: "cpu" | "ram" | "gpu" | "ssd" | "psu";
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
  slotId: string | null; // null = masih berada di panel/tray, belum dipasang
  isCorrect?: boolean; // true/false setelah dipasang, undefined kalau belum dipasang
}

const INITIAL_COMPONENTS: ComputerComponent[] = [
  { id: 1, name: "Processor", image: "/images/processor.jpg", type: "cpu", x: 0, y: 0, width: 90, height: 90, slotId: null },
  { id: 2, name: "RAM 1", image: "/images/RAM.jpg", type: "ram", x: 0, y: 0, width: 24, height: 160, slotId: null },
  { id: 3, name: "RAM 2", image: "/images/RAM.jpg", type: "ram", x: 0, y: 0, width: 24, height: 160, slotId: null },
  { id: 4, name: "GPU", image: "/images/gpu.png", type: "gpu", x: 0, y: 0, width: 170, height: 60, slotId: null },
  { id: 5, name: "SSD", image: "/images/ssd.png", type: "ssd", x: 0, y: 0, width: 90, height: 50, slotId: null },
  { id: 6, name: "Power Supply", image: "/images/psu.png", type: "psu", x: 0, y: 0, width: 90, height: 90, slotId: null },
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
