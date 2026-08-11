"use client";
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import Header from "../../../components/Admin/Header";
import Sidebar from "../../../components/Admin/Sidebar";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
type Komponen = {
  id: number;
  nama: string;
  gambar: string;
  deskripsi: string;
  created_at?: string;
};
export default function MateriPage() {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);
  const [komponen, setKomponen] =
    useState<Komponen[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [imageFile, setImageFile] =
    useState<File | null>(null);
      const [formData, setFormData] =
    useState<Komponen>({
      id: 0,
      nama: "",
      gambar: "",
      deskripsi: "",
    });
  useEffect(() => {
    fetchKomponen();
  }, []);
  const fetchKomponen = async () => {
    setLoading(true);
    const { data, error } = await supabase
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
  const openTambah = () => {
    setFormData({
      id: 0,
      nama: "",
      gambar: "",
      deskripsi: "",
    });
    setImageFile(null);
    setIsModalOpen(true);
  };
    const openEdit = (item: Komponen) => {
    setFormData(item);
    setImageFile(null);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setImageFile(null);
  };
  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      e.target.files &&
      e.target.files.length > 0
    ) {
      setImageFile(e.target.files[0]);
    }
  };
  const uploadImage = async () => {
    if (!imageFile) return formData.gambar;
    const fileName = `${Date.now()}-${
      imageFile.name
    }`;
        const { error } = await supabase.storage
      .from("komponen")
      .upload(fileName, imageFile);
    if (error) {
      console.log(
        "Upload gagal:",
        error.message
      );
      return "";
    }
    const { data } = supabase.storage
      .from("komponen")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setSaving(true);
    let gambar = formData.gambar;

if (imageFile) {
  gambar = await uploadImage();
} else if (!gambar) {
  gambar = "/images/dummy.webp";
}
    if (formData.id === 0) {
            const { error } = await supabase
        .from("komponen")
        .insert([
          {
            nama: formData.nama,
            gambar: gambar,
            deskripsi: formData.deskripsi,
          },
        ]);
if (error) {
  console.log(error.message);
  toast.error("Gagal menambahkan data.");
} else {
  toast.success("Data berhasil ditambahkan.");
}
    } else {
      const { error } = await supabase
        .from("komponen")
        .update({
          nama: formData.nama,
          gambar: gambar,
          deskripsi: formData.deskripsi,
        })
        .eq("id", formData.id);
if (error) {
  console.log(error.message);
  toast.error("Gagal mengubah data.");
} else {
  toast.success("Data berhasil diperbarui.");
}
    }
    await fetchKomponen();
    setSaving(false);
    closeModal();
  };
const handleDelete = async (id: number) => {
  const result = await Swal.fire({
    title: "Hapus Komponen?",
    text: "Data yang dihapus tidak dapat dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
  });

  if (!result.isConfirmed) {
    return;
  }

  setDeletingId(id);

  const { error } = await supabase
    .from("komponen")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error.message);
    toast.error("Gagal menghapus data.");
  } else {
    toast.success("Data berhasil dihapus.");
    await fetchKomponen();
  }

  setDeletingId(null);
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
                <div className="p-4 md:p-8 text-black text-sm">
          <div className="bg-white rounded-xl shadow">
            <div className="flex justify-between items-center p-6">
              <h2 className="text-base font-bold">
                Daftar Komponen
              </h2>
              <button
              onClick={openTambah}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-5 md:py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm">
                <FaPlus />
                Tambah Komponen
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[750px] w-full text-xs border-collapse">
                                    <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left font-semibold whitespace-nowrap">
                        Gambar
                      </th>
                      <th className="p-4 text-left font-semibold whitespace-nowrap">
                        Nama Komponen
                      </th>
                      <th className="p-4 text-left font-semibold whitespace-nowrap">
                        Deskripsi
                      </th>
                      <th className="p-4 text-center font-semibold whitespace-nowrap w-32">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {komponen.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-10 text-gray-500"
                        >
                          Belum ada data komponen.
                        </td>
                      </tr>
                    ) : (
                      komponen.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition"
                        >
                                                    <td className="p-4">
                            <img
                              src={item.gambar}
                              alt={item.nama}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          </td>
                          <td className="p-4 font-semibold whitespace-nowrap">
                            {item.nama}
                          </td>
                          <td className="p-4 text-gray-600 max-w-sm">
                            <p className="line-clamp-3">
                              {item.deskripsi}
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                              onClick={() => openEdit(item)} 
                              className="w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center">
                                <FaEdit size={13} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(item.id)
                                }
                                className="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center disabled:opacity-50"
                                disabled={
                                  deletingId === item.id
                                }
                              >
                                {deletingId === item.id ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FaTrash size={13} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="flex justify-between items-center p-5">
                  <h2 className="text-xl font-bold">
                    {formData.id === 0
                      ? "Tambah Komponen"
                      : "Edit Komponen"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-black"
                  >
                    <FaTimes />
                  </button>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="p-5 space-y-4"
                >
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Nama Komponen
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInput}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Deskripsi
                    </label>
                    <textarea
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInput}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                    <div>
                    <label className="block mb-2 text-sm font-medium">
                      Gambar Komponen
                    </label>
                    <div className="flex items-center gap-4">
{imageFile ? (
  <div className="w-20 h-20 rounded-xl overflow-hidden border bg-gray-100">
    <img
      src={URL.createObjectURL(imageFile)}
      alt="Preview"
      className="w-full h-full object-cover"
    />
  </div>
) : formData.gambar ? (
  <div className="w-20 h-20 rounded-xl overflow-hidden border bg-gray-100">
    <img
      src={formData.gambar}
      alt="Preview"
      className="w-full h-full object-cover"
    />
  </div>
) : null}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"/>
                        <p className="text-xs text-gray-500 mt-2">
                          Format: JPG, JPEG, PNG
                        </p>
                      </div>
                    </div>
                  </div>
                    <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={saving}
                      className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 flex items-center gap-2">
                      {saving && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {saving
                        ? "Menyimpan..."
                        : "Simpan"}
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