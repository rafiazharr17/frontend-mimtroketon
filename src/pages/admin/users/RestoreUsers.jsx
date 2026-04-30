import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";

export default function RestoreUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrashedUsers = () => {
    setIsLoading(true);
    api
      .get("/admin/users/trash")
      .then((res) => setUsers(res.data))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTrashedUsers();
  }, []);

  const handleAction = (id, action) => {
    const isRestore = action === "restore";
    Swal.fire({
      title: isRestore ? "Pulihkan Akun?" : "Hapus Permanen?",
      text: isRestore
        ? "Akun akan bisa login kembali."
        : "Data login ini akan musnah selamanya!",
      icon: isRestore ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isRestore ? "#10b981" : "#ef4444",
      confirmButtonText: isRestore ? "Ya, Pulihkan!" : "Musnahkan!",
      customClass: { popup: "rounded-3xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (isRestore) await api.put(`/admin/users/restore/${id}`);
          else await api.delete(`/admin/users/${id}`);

          Swal.fire({
            title: "Berhasil!",
            icon: "success",
            customClass: { popup: "rounded-3xl" },
          });
          fetchTrashedUsers();
        } catch (error) {
          Swal.fire("Gagal", "Terjadi kesalahan.", "error");
        }
      }
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 w-full">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/users"
            className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 border border-slate-100 text-slate-500 transition-all">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Recycle Bin: Akun
            </h1>
            <p className="text-red-500 mt-1 font-medium">
              Akun yang dinonaktifkan (akses masuk dicabut).
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-red-50 border-b border-red-100 text-red-600 text-sm uppercase tracking-wider">
                <th className="px-8 py-5 font-bold">Username</th>
                <th className="px-8 py-5 font-bold">Email</th>
                <th className="px-8 py-5 font-bold">Role</th>
                <th className="px-8 py-5 font-bold text-center">
                  Aksi Pemulihan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-8 py-10 text-center text-slate-400 animate-pulse font-medium">
                    Memuat data sampah...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-16 text-center text-slate-400 font-medium">
                    Recycle bin kosong.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-red-50/20 transition-colors group">
                    <td className="px-8 py-5 font-bold text-slate-600 line-through decoration-red-300">
                      {u.username}
                    </td>
                    <td className="px-8 py-5 text-slate-500 line-through decoration-red-300">
                      {u.email || "Belum ditambahkan"}
                    </td>
                    <td className="px-8 py-5 font-semibold text-slate-500 uppercase">
                      {u.role}
                    </td>
                    <td className="px-8 py-5 flex justify-center gap-3">
                      <button
                        onClick={() => handleAction(u.id, "restore")}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 font-bold rounded-xl transition-all shadow-sm">
                        Aktifkan Lagi
                      </button>

                      {/* HANYA TAMPILKAN HAPUS PERMANEN JIKA BUKAN ADMIN */}
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleAction(u.id, "delete")}
                          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 font-bold rounded-xl transition-all shadow-sm">
                          Musnahkan!
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
