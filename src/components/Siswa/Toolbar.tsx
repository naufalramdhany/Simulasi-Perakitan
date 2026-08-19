"use client";

import { useState } from "react";
import {
  FaUndo,
  FaRedo,
  FaSearchPlus,
  FaSearchMinus,
  FaSyncAlt,
  FaPlug,
  FaMicrochip,
  FaWaveSquare,
} from "react-icons/fa";

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
  setIsSimulationStarted: React.Dispatch<
    React.SetStateAction<boolean>
  >;
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
  const [showWireMenu, setShowWireMenu] = useState(false);

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };



  return (
    <div className="bg-white border-b shadow-sm px-3 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">

        {/* Undo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition shadow-sm text-sm font-medium ${
            canUndo
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaUndo className="text-xs" />
          <span>Undo</span>
        </button>

        {/* Redo */}
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition shadow-sm text-sm font-medium ${
            canRedo
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaRedo className="text-xs" />
          <span>Redo</span>
        </button>

        {/* Reset */}
        <button
          onClick={reset}
          title="Reset"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition shadow-sm text-sm font-medium"
        >
          <FaSyncAlt className="text-xs" />
          <span>Reset</span>
        </button>

        {/* Separator */}
        <div className="h-8 w-px bg-gray-300 mx-1" />

        {/* Zoom Out */}
        <button
          onClick={zoomOut}
          title="Perkecil"
          className="w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition"
        >
          <FaSearchMinus className="text-sm text-gray-700" />
        </button>

        {/* Zoom */}
        <span className="w-12 text-center text-sm font-semibold text-gray-700">
          {(zoom * 100).toFixed(0)}%
        </span>
{/* Zoom In */}
<button
  onClick={zoomIn}
  title="Perbesar"
  className="w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition"
>
  <FaSearchPlus className="text-sm text-gray-700" />
</button>

{/* Separator setelah Zoom */}
<div className="h-8 w-px bg-gray-300 mx-1" />

{/* Start Simulasi */}
{isAssemblyComplete && !isSimulationStarted && (
  <button
    onClick={() => setIsSimulationStarted(true)}
    title="Start Simulasi"
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white transition shadow-sm text-sm font-medium"
  >
    <span>▶</span>
    <span>Start Simulasi</span>
  </button>
)}
      </div>
    </div>
  );
}