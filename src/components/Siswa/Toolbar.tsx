"use client";

import {
  FaUndo,
  FaRedo,
  FaSearchPlus,
  FaSearchMinus,
  FaSyncAlt,
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
  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  /* =========================
     START / STOP SIMULASI
  ========================= */

  const toggleSimulation = () => {
    setIsSimulationStarted((prev) => !prev);
  };

  return (
    <div
      className="
        bg-white
        border-b
        shadow-sm
        px-2
        sm:px-3
        py-2
        w-full
      "
    >
      {/*
        Baris toolbar bisa di-scroll horizontal di layar sempit
        (hp/tablet) alih-alih memaksa tombol menyempit atau
        terpotong. Scrollbar disembunyikan lintas browser.
      */}
      <div
        className="
          flex
          items-center
          gap-1.5
          sm:gap-2
          overflow-x-auto
          flex-nowrap
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >

        {/* =========================
            UNDO
        ========================= */}

        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
          className={`
            flex
            items-center
            gap-1.5
            px-2.5
            sm:px-3
            py-1.5
            rounded-lg
            transition
            shadow-sm
            text-sm
            font-medium
            shrink-0

            ${
              canUndo
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          <FaUndo className="text-xs" />
          <span className="hidden sm:inline">Undo</span>
        </button>

        {/* =========================
            REDO
        ========================= */}

        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
          className={`
            flex
            items-center
            gap-1.5
            px-2.5
            sm:px-3
            py-1.5
            rounded-lg
            transition
            shadow-sm
            text-sm
            font-medium
            shrink-0

            ${
              canRedo
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          <FaRedo className="text-xs" />
          <span className="hidden sm:inline">Redo</span>
        </button>

        {/* =========================
            RESET
        ========================= */}

        <button
          onClick={reset}
          title="Reset"
          className="
            flex
            items-center
            gap-1.5
            px-2.5
            sm:px-3
            py-1.5
            rounded-lg
            bg-red-500
            hover:bg-red-600
            text-white
            transition
            shadow-sm
            text-sm
            font-medium
            shrink-0
          "
        >
          <FaSyncAlt className="text-xs" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* SEPARATOR */}

        <div className="h-8 w-px bg-gray-300 mx-1 shrink-0" />

        {/* =========================
            ZOOM OUT
        ========================= */}

        <button
          onClick={zoomOut}
          title="Perkecil"
          className="
            w-8
            h-8
            rounded-full
            bg-white
            border
            border-gray-300
            hover:bg-gray-100
            flex
            items-center
            justify-center
            transition
            shrink-0
          "
        >
          <FaSearchMinus className="text-sm text-gray-700" />
        </button>

        {/* =========================
            ZOOM
        ========================= */}

        <span className="
          w-10
          sm:w-12
          text-center
          text-xs
          sm:text-sm
          font-semibold
          text-gray-700
          shrink-0
        ">
          {(zoom * 100).toFixed(0)}%
        </span>

        {/* =========================
            ZOOM IN
        ========================= */}

        <button
          onClick={zoomIn}
          title="Perbesar"
          className="
            w-8
            h-8
            rounded-full
            bg-white
            border
            border-gray-300
            hover:bg-gray-100
            flex
            items-center
            justify-center
            transition
            shrink-0
          "
        >
          <FaSearchPlus className="text-sm text-gray-700" />
        </button>

        {/* SEPARATOR */}

        <div className="h-8 w-px bg-gray-300 mx-1 shrink-0" />

        {/* =========================
            START / STOP SIMULASI
        ========================= */}

        {isAssemblyComplete && (
          <button
            onClick={toggleSimulation}
            title={
              isSimulationStarted
                ? "Stop Simulasi"
                : "Start Simulasi"
            }
            className={`
              flex
              items-center
              gap-1.5
              px-2.5
              sm:px-3
              py-1.5
              rounded-lg
              text-white
              transition
              shadow-sm
              text-sm
              font-medium
              shrink-0
              whitespace-nowrap

              ${
                isSimulationStarted
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }
            `}
          >
            <span>
              {isSimulationStarted ? "⏹" : "▶"}
            </span>

            <span className="hidden sm:inline">
              {isSimulationStarted
                ? "Stop Simulasi"
                : "Start Simulasi"}
            </span>
          </button>
        )}

      </div>
    </div>
  );
}
