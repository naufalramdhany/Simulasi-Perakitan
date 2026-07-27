"use client";

import { useEffect, useState } from "react";
import Header from "../components/Siswa/Header";
import Sidebar from "../components/Siswa/Sidebar";
import { supabase } from "../lib/supabase";
type Komponen = {
  id: number;
  nama: string;
  gambar: string;
  deskripsi: string;
};
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);
  const [komponen, setKomponen] =
    useState<Komponen[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [selectedKomponen, setSelectedKomponen] =
    useState<Komponen | null>(null);
  useEffect(() => {
    fetchKomponen();
  }, []);
  const fetchKomponen = async () => {
    setLoading(true);
    const { data, error } =
      await supabase
        .from("komponen")
        .select("*")
        .order("id", {
          ascending: false,
        });
    if (error) {
      console.log(
        "Gagal mengambil data:",
        error.message
      );
    } else {
      setKomponen(data || []);
    }
    setLoading(false);
  };
  const openModal = (
    item: Komponen
  ) => {
    setSelectedKomponen(item);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedKomponen(null);
  };
    return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="md:ml-64 flex flex-col min-h-screen">
        <Header
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 px-8 py-4">
          <h1 className="text-lg font-bold text-gray-800 mb-4">
            Komponen Komputer
          </h1>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div
                className="
                  w-10 h-10
                  border-4
                  border-blue-600
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
              ></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {komponen.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Belum ada materi komponen.
                </div>
              ) : (
                komponen.map((item) => (
                  <div
                    key={item.id}
                    className="
                      bg-white
                      rounded-lg
                      shadow
                      hover:shadow-md
                      transition
                      duration-300
                      overflow-hidden
                      flex
                      flex-col
                    "
                  >
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      className="
                        w-full
                        h-32
                        object-cover
                      "
                    />
                    <div className="p-3 flex flex-col flex-1">
                      <h2 className="text-sm font-semibold text-gray-800">
                        {item.nama}
                      </h2>
                      <p className="
                        text-xs
                        text-gray-600
                        mt-2
                        leading-5
                        flex-1
                        line-clamp-3
                      ">
                        {item.deskripsi}
                      </p>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => openModal(item)}
                          className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            text-xs
                            font-semibold
                            px-4
                            py-2
                            rounded-lg
                            transition
                          "
                        >
                          Pilih
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {isModalOpen && selectedKomponen && (
            <div
              className="
                fixed
                inset-0
                bg-black/50
                backdrop-blur-sm
                flex
                items-center
                justify-center
                z-50
                p-4
              "
            >
              <div
                className="
                  bg-white
                  rounded-xl
                  shadow-xl
                  w-full
                  max-w-4xl
                  overflow-hidden
                "
              >
                {/* Header Modal */}
                <div
                  className="
                    flex
                    justify-between
                    items-center
                    border-b
                    px-6
                    py-3
                  "
                >
                  <h2 className="
                    text-base
                    font-semibold
                    text-gray-800
                  ">
                    Detail Komponen
                  </h2>
                  <button
                    onClick={closeModal}
                    className="
                      text-3xl
                      text-gray-500
                      hover:text-red-500
                      transition
                    "
                  >
                    ×
                  </button>
                </div>
                {/* Body Modal */}
                <div className="p-6">
                  <div className="
                    flex
                    flex-col
                    md:flex-row
                    gap-6
                  ">
                    {/* Gambar */}
                    <div className="
                      md:w-1/3
                      flex
                      justify-center
                      items-start
                    ">
                      <img
                        src={selectedKomponen.gambar}
                        alt={selectedKomponen.nama}
                        className="
                          w-60
                          h-60
                          object-cover
                          rounded-lg
                          border
                          shadow
                        "
                      />
                    </div>
                    {/* Informasi */}
                    <div className="md:w-2/3">
                      <h3 className="
                        text-base
                        font-semibold
                        text-gray-800
                        mb-2
                      ">
                        {selectedKomponen.nama}
                      </h3>
                      <p className="
                        text-sm
                        text-gray-600
                        leading-6
                        text-justify
                      ">
                        {selectedKomponen.deskripsi}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}