import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";

export default function DetailUsers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    api.get("/admin/users").then((res) => {
      const user = res.data.find((u) => u.id.toString() === id);
      setDetail(user);
    });
  }, [id]);

  const handleSoftDelete = () => {
    Swal.fire({
      title: "Hapus Akun?",
      text: "Akun ini akan dipindahkan ke Recycle Bin dan dilarang login.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Hapus!",
      customClass: { popup: "rounded-3xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/users/soft/${id}`);
          Swal.fire({
            title: "Berhasil!", text: "Akun dihapus.", icon: "success", customClass: { popup: "rounded-3xl" },
          });
          navigate("/admin/users");
        } catch (error) {
          Swal.fire("Gagal", "Terjadi kesalahan.", "error");
        }
      }
    });
  };

  if (!detail)
    return (
      <AdminLayout>
        <div className="p-8 text-center animate-pulse text-slate-500 font-medium">Memuat detail akun...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center gap-4 w-full">
        <button onClick={() => navigate("/admin/users")} className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 border border-slate-100 text-slate-500 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail Akun Pengguna</h1>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-10 lg:p-14">
        <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white text-5xl md:text-6xl font-black shrink-0 uppercase">
            {detail.username.charAt(0)}
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">{detail.username}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 mt-6">
              
              {/* KOTAK EMAIL BARU */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Alamat Email</p>
                <p className="text-lg font-bold text-slate-700 truncate" title={detail.email || "Belum ditambahkan"}>
                  {detail.email || "Belum ditambahkan"}
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Hak Akses Sistem</p>
                <p className="text-xl font-bold text-indigo-600 uppercase">{detail.role}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status Akun</p>
                <p className="text-xl font-bold text-emerald-600">Terverifikasi & Aktif</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-end w-full">
          {detail.role !== "admin" && (
            <button onClick={handleSoftDelete} className="px-8 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors border border-red-100">
              Hapus
            </button>
          )}
          <Link to={`/admin/users/update/${detail.id}`} className="px-10 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 text-center">
            Edit / Ganti Password
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}