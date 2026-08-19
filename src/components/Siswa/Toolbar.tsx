"use client";

import { FaUndo, FaRedo, FaSearchPlus, FaSearchMinus, FaSyncAlt } from "react-icons/fa";

type ToolbarProps = {
  undo: () => void;
  redo: () => void;
  reset: () => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  canUndo: boolean;
  canRedo: boolean;
  isAssemblyComplete: boolean;
  isSimulationStarted: boolean;
  setIsSimulationStarted: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Toolbar({
  undo,
  redo,
  reset,
  zoom,
  setZoom,
  canUndo,
  canRedo,
  isAssemblyComplete,
  isSimulationStarted,
  setIsSimulationStarted,
}: ToolbarProps) {
  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const toggleSimulation = () => {
    setIsSimulationStarted((prev) => !prev);
  };

  return (
    <div className="bg-white border-b shadow-sm px-2 sm:px-3 py-2 w-full">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto flex-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={undo}
          disabled={!canUndo || isSimulationStarted}
          title={isSimulationStarted ? "Undo tidak tersedia saat simulasi berjalan" : "Undo"}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition shadow-sm text-sm font-medium shrink-0 ${canUndo && !isSimulationStarted ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        >
          <FaUndo className="text-xs" />
          <span className="hidden sm:inline">Undo</span>
        </button>

        <button
          onClick={redo}
          disabled={!canRedo || isSimulationStarted}
          title={isSimulationStarted ? "Redo tidak tersedia saat simulasi berjalan" : "Redo"}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition shadow-sm text-sm font-medium shrink-0 ${canRedo && !isSimulationStarted ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        >
          <FaRedo className="text-xs" />
          <span className="hidden sm:inline">Redo</span>
        </button>

        <button
          onClick={reset}
          disabled={isSimulationStarted}
          title={isSimulationStarted ? "Reset tidak tersedia saat simulasi berjalan" : "Reset"}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition shadow-sm text-sm font-medium shrink-0 ${isSimulationStarted ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"}`}
        >
          <FaSyncAlt className="text-xs" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <div className="h-8 w-px bg-gray-300 mx-1 shrink-0" />

        <button
          onClick={zoomOut}
          title="Perkecil"
          className="w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition shrink-0"
        >
          <FaSearchMinus className="text-sm text-gray-700" />
        </button>

        <span className="w-10 sm:w-12 text-center text-xs sm:text-sm font-semibold text-gray-700 shrink-0">
          {(zoom * 100).toFixed(0)}%
        </span>

        <button
          onClick={zoomIn}
          title="Perbesar"
          className="w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition shrink-0"
        >
          <FaSearchPlus className="text-sm text-gray-700" />
        </button>

        <div className="h-8 w-px bg-gray-300 mx-1 shrink-0" />

        {isAssemblyComplete && (
          <button
            onClick={toggleSimulation}
            title={isSimulationStarted ? "Stop Simulasi" : "Start Simulasi"}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-white transition shadow-sm text-sm font-medium shrink-0 whitespace-nowrap ${isSimulationStarted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            <span>{isSimulationStarted ? "⏹" : "▶"}</span>
            <span className="hidden sm:inline">{isSimulationStarted ? "Stop Simulasi" : "Mulai Simulasi"}</span>
          </button>
        )}
      </div>
    </div>
  );
}