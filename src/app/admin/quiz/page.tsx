"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import Header from "../../../components/Admin/Header";
import Sidebar from "../../../components/Admin/Sidebar";
import { supabase } from "../../../lib/supabase";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

type Soal = {
  id: number;
  pertanyaan: string;
  opsi: string[];
  jawabanBenar: number;
};

const letters = ["A", "B", "C", "D"];

export default function SoalPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [soal, setSoal] = useState<Soal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const emptyForm: Soal = {
    id: 0,
    pertanyaan: "",
    opsi: ["", "", "", ""],
    jawabanBenar: 0,
  };

  const [formData, setFormData] = useState(emptyForm);

  const getSoal = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("soal")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      const hasil: Soal[] = data.map((item) => ({
        id: item.id,
        pertanyaan: item.pertanyaan,
        opsi: [item.opsi_a, item.opsi_b, item.opsi_c, item.opsi_d],
        jawabanBenar: item.jawaban,
      }));

      setSoal(hasil);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data soal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSoal();
  }, []);

  const openTambah = () => {
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (item: Soal) => {
    setFormData(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePertanyaanChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      pertanyaan: e.target.value,
    });
  };

  const handleOpsiChange = (index: number, value: string) => {
    const newOpsi = [...formData.opsi];
    newOpsi[index] = value;
    setFormData({
      ...formData,
      opsi: newOpsi,
    });
  };

  const handleJawabanBenarChange = (index: number) => {
    setFormData({
      ...formData,
      jawabanBenar: index,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.pertanyaan.trim() === "" || formData.opsi.some((item) => item.trim() === "")) {
      toast.error("Semua field wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      if (formData.id === 0) {
        const { error } = await supabase
          .from("soal")
          .insert({
            pertanyaan: formData.pertanyaan,
            opsi_a: formData.opsi[0],
            opsi_b: formData.opsi[1],
            opsi_c: formData.opsi[2],
            opsi_d: formData.opsi[3],
            jawaban: formData.jawabanBenar,
          });

        if (error) throw error;

        toast.success("Soal berhasil ditambahkan.");
      } else {
        const { error } = await supabase
          .from("soal")
          .update({
            pertanyaan: formData.pertanyaan,
            opsi_a: formData.opsi[0],
            opsi_b: formData.opsi[1],
            opsi_c: formData.opsi[2],
            opsi_d: formData.opsi[3],
            jawaban: formData.jawabanBenar,
          })
          .eq("id", formData.id);

        if (error) throw error;

        toast.success("Soal berhasil diperbarui.");
      }

      await getSoal();

      setFormData(emptyForm);
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data soal.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Soal?",
      text: "Soal yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      width: "350px",
      padding: "1.2em",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("soal")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await getSoal();

      toast.success("Soal berhasil dihapus.");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus soal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="md:ml-64 flex flex-col min-h-screen">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <div className="p-4 md:p-8 text-black text-sm">
          <div className="bg-white rounded-xl shadow">
            <div className="flex justify-between items-center p-6">
              <h2 className="text-base font-bold">Daftar Soal Quiz</h2>
              <button onClick={openTambah} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-5 md:py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm">
                <FaPlus />
                Tambah Soal
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[750px] w-full text-xs border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-semibold w-10">No</th>
                    <th className="p-4 text-left font-semibold">Pertanyaan</th>
                    <th className="p-4 text-left font-semibold">Opsi Jawaban</th>
                    <th className="p-4 text-left font-semibold">Jawaban Benar</th>
                    <th className="p-4 text-center font-semibold w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-500 text-sm">Memuat data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : soal.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-500">
                        Belum ada soal.
                      </td>
                    </tr>
                  ) : (
                    soal.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition align-top">
                        <td className="p-4 font-semibold">{index + 1}</td>
                        <td className="p-4 max-w-sm">
                          <p className="line-clamp-3">{item.pertanyaan}</p>
                        </td>
                        <td className="p-4 text-gray-600">
                          <ul className="space-y-1">
                            {item.opsi.map((opsi, idx) => (
                              <li key={idx}>
                                <span className="font-semibold">{letters[idx]}.</span> {opsi}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-semibold">
                            {letters[item.jawabanBenar]}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openEdit(item)} disabled={loading} className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                              <FaEdit size={13} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} disabled={loading} className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                              <FaTrash size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                  <h2 className="text-xl font-bold">{formData.id === 0 ? "Tambah Soal" : "Edit Soal"}</h2>
                  <button onClick={closeModal} className="text-gray-500 hover:text-black">
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Pertanyaan</label>
                    <textarea value={formData.pertanyaan} onChange={handlePertanyaanChange} required rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">Opsi Jawaban</label>
                    <div className="space-y-2.5">
                      {formData.opsi.map((opsi, idx) => (
                        <div key={idx} className={`flex items-center gap-3 border rounded-lg px-3 py-2 transition ${formData.jawabanBenar === idx ? "border-green-400 bg-green-50" : "border-gray-300"}`}>
                          <button type="button" onClick={() => handleJawabanBenarChange(idx)} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition ${formData.jawabanBenar === idx ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {letters[idx]}
                          </button>
                          <input type="text" value={opsi} onChange={(e) => handleOpsiChange(idx, e.target.value)} required placeholder={`Opsi ${letters[idx]}`} className="flex-1 text-xs focus:outline-none" />
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2">Klik huruf di samping opsi untuk menandai jawaban yang benar.</p>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={closeModal} disabled={saving} className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                      Batal
                    </button>
                    <button type="submit" disabled={saving} className={`px-5 py-2 rounded-lg text-white transition ${saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V4l3 3-3 3V8a6 6 0 00-6 6H4z" />
                          </svg>
                          Menyimpan...
                        </span>
                      ) : (
                        "Simpan"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}