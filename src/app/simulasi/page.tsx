"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "../../components/Siswa/SidebarSimulasi";
import Header from "../../components/Siswa/Header";
import Toolbar from "../../components/Siswa/Toolbar";
import Canvas from "../../components/Siswa/Canvas";
import ComponentPanel from "../../components/Siswa/ComponentPanel";
import { ComputerComponent } from "../../components/Siswa/Types";

const INITIAL_COMPONENTS: ComputerComponent[] = [
  { id: 1, name: "Processor", image: "/images/processor.png", type: "cpu", x: 0, y: 0, width: 90, height: 90, slotId: null },
  { id: 2, name: "RAM 1", image: "/images/ram.png", type: "ram", x: 0, y: 0, width: 24, height: 160, slotId: null },
  { id: 3, name: "RAM 2", image: "/images/ram.png", type: "ram", x: 0, y: 0, width: 24, height: 160, slotId: null },
  { id: 4, name: "Cooler", image: "/images/cooler.png", type: "cooler", x: 0, y: 0, width: 100, height: 100, slotId: null },
  { id: 5, name: "VGA", image: "/images/VGA.png", type: "vga", x: 0, y: 0, width: 170, height: 60, slotId: null },
  { id: 6, name: "Baterai CMOS", image: "/images/cmos.png", type: "cmos_battery", x: 0, y: 0, width: 40, height: 40, slotId: null },
  { id: 7, name: "Kabel ATX 24-Pin", image: "/images/kabel-atx.png", type: "cable_atx-24", x: 0, y: 0, width: 80, height: 80, slotId: null },
  { id: 8, name: "Kabel ATX 4-Pin", image: "/images/kabel-atx-4pin.png", type: "cable_atx-4", x: 0, y: 0, width: 80, height: 80, slotId: null },
  { id: 9, name: "Kabel VGA", image: "/images/kabel-vga.png", type: "cable_vga", x: 0, y: 0, width: 80, height: 80, slotId: null },
];

export default function SimulasiPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [components, setComponents] = useState<ComputerComponent[]>(INITIAL_COMPONENTS);
  const [history, setHistory] = useState<ComputerComponent[][]>([]);
  const [redoHistory, setRedoHistory] = useState<ComputerComponent[][]>([]);

  const saveHistory = () => {
    if (isSimulationStarted) return;
    setHistory((prev) => [...prev, [...components]].slice(-50));
    setRedoHistory([]);
  };

  const undo = () => {
    if (isSimulationStarted) return;
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoHistory((prev) => [...prev, [...components]]);
    setComponents(previous);
    setHistory((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    if (isSimulationStarted) return;
    if (redoHistory.length === 0) return;
    const next = redoHistory[redoHistory.length - 1];
    setHistory((prev) => [...prev, [...components]]);
    setComponents(next);
    setRedoHistory((prev) => prev.slice(0, -1));
  };

  const reset = () => {
    if (isSimulationStarted) return;
    saveHistory();
    setComponents([...INITIAL_COMPONENTS]);
  };

  const placedCount = components.filter((c) => c.slotId !== null).length;

  const isAssemblyComplete = placedCount > 0 && components.every((c) => c.slotId !== null && c.isCorrect === true);

  useEffect(() => {
    if (isAssemblyComplete) {
      toast.dismiss();
      toast.success("Semua komponen terpasang dengan benar! Mulai Simulasi.", {
        duration: 5000,
      });
    }
  }, [isAssemblyComplete]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="md:ml-20 flex flex-col min-h-screen">
        <div className="lg:hidden">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
        </div>
        <Toolbar
          undo={undo}
          redo={redo}
          reset={reset}
          zoom={zoom}
          setZoom={setZoom}
          canUndo={history.length > 0 && !isSimulationStarted}
          canRedo={redoHistory.length > 0 && !isSimulationStarted}
          isAssemblyComplete={isAssemblyComplete}
          isSimulationStarted={isSimulationStarted}
          setIsSimulationStarted={setIsSimulationStarted}
        />
        <div className="flex flex-1 overflow-hidden">
          <Canvas
            zoom={zoom}
            components={components}
            setComponents={setComponents}
            saveHistory={saveHistory}
            isSimulationStarted={isSimulationStarted}
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