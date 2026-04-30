import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";

export default function DetailPPDB() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    api
      .get(`/admin/ppdb/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleUpdateStatus = (newStatus) => {
    const isDiterima = newStatus === "Diterima";
    Swal.fire({
      title: isDiterima ? "Terima Siswa Ini?" : "Tolak Pendaftar?",
      text: isDiterima
        ? "Data anak ini akan otomatis masuk ke tabel Siswa dan akun Wali Murid akan dibuat."
        : "Status akan diubah menjadi ditolak.",
      icon: isDiterima ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: isDiterima ? "#10b981" : "#ef4444",
      confirmButtonText: isDiterima ? "Ya, Terima" : "Ya, Tolak",
      customClass: { popup: "rounded-3xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsProcessing(true);
        Swal.fire({
          title: "Sistem Sedang Bekerja...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
        try {
          const res = await api.put(`/admin/ppdb/${id}/status`, {
            status: newStatus,
          });
          Swal.fire({
            title: "Berhasil!",
            text: res.data.message,
            icon: "success",
            customClass: { popup: "rounded-3xl" },
          });
          navigate("/admin/ppdb");
        } catch (error) {
          Swal.fire("Gagal", "Terjadi kesalahan.", "error");
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  if (!data)
    return (
      <AdminLayout>
        <div className="p-8 text-center text-slate-500 font-bold animate-pulse">
          Memuat formulir...
        </div>
      </AdminLayout>
    );

  const DocumentCard = ({ title, filePath }) => {
    if (!filePath)
      return (
        <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex items-center justify-between opacity-60">
          <span className="text-sm font-semibold text-slate-500">{title}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-200 px-3 py-1.5 rounded-lg">
            Tidak Ada
          </span>
        </div>
      );
    const fullUrl = `${BACKEND_URL}${filePath}`;
    return (
      <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col sm:flex-row gap-3 sm:items-center justify-between hover:border-blue-300 transition-all group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-700">{title}</span>
        </div>
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all uppercase tracking-wider">
          Lihat
        </a>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center gap-4 w-full">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500">
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
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Review Berkas PPDB
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-500 font-medium">No. Daftar:</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-sm font-bold tracking-wider">
              {data.no_pendaftaran}
            </span>
          </div>
          {data.updated_at && (
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              Update: {new Date(data.updated_at).toLocaleString("id-ID")} WIB
            </p>
          )}
        </div>
      </div>

      <div className="w-full bg-white/90 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden">
        <div className="border-b-4 border-slate-800 pb-6 mb-8 text-center relative z-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-widest uppercase">
            Formulir Penerimaan Peserta Didik Baru
          </h2>
          <h3 className="text-xl font-bold text-slate-600 mt-1">
            MI MUHAMMADIYAH TROKETON
          </h3>
        </div>

        <div className="space-y-12 relative z-10">
          <div>
            <h4 className="text-lg font-black text-blue-800 mb-5 flex items-center gap-3 border-b border-blue-100 pb-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                A
              </span>{" "}
              Keterangan Calon Peserta Didik
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="flex border-b border-slate-100 pb-2">
                <span className="w-1/3 text-slate-500 font-bold">
                  Nama Lengkap
                </span>
                <span className="w-2/3 text-slate-800 font-semibold uppercase">
                  : {data.nama_lengkap}
                </span>
              </div>
              <div className="flex border-b border-slate-100 pb-2">
                <span className="w-1/3 text-slate-500 font-bold">
                  Jenis Kelamin
                </span>
                <span className="w-2/3 text-slate-800 font-semibold">
                  : {data.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
              <div className="flex border-b border-slate-100 pb-2">
                <span className="w-1/3 text-slate-500 font-bold">NIK</span>
                <span className="w-2/3 text-slate-800 font-semibold tracking-widest">
                  : {data.nik}
                </span>
              </div>
              <div className="flex border-b border-slate-100 pb-2">
                <span className="w-1/3 text-slate-500 font-bold">TTL</span>
                <span className="w-2/3 text-slate-800 font-semibold">
                  : {data.tempat_lahir},{" "}
                  {new Date(data.tanggal_lahir).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex border-b border-slate-100 pb-2 md:col-span-2">
                <span className="w-1/6 text-slate-500 font-bold">Alamat</span>
                <span className="w-5/6 text-slate-800 font-semibold">
                  : {data.alamat_siswa}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-100 pb-3 mb-5">
              <h4 className="text-lg font-black text-amber-700 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">
                  B
                </span>{" "}
                Data Orang Tua / Wali
              </h4>
              <span className="mt-2 sm:mt-0 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                Kontak Utama:{" "}
                <span className="text-amber-600">{data.wali_utama}</span>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`p-6 rounded-2xl border text-sm ${data.wali_utama === "Ayah" ? "bg-blue-50 border-blue-200 shadow-md" : "bg-slate-50 border-slate-100"}`}>
                <p className="font-black text-slate-800 border-b pb-2 mb-3">
                  1. Data Ayah
                </p>
                <div className="flex mb-2">
                  <span className="w-1/3 text-slate-500 font-bold">Nama</span>
                  <span className="w-2/3 font-semibold uppercase">
                    : {data.nama_ayah || "-"}
                  </span>
                </div>
                <div className="flex mb-2">
                  <span className="w-1/3 text-slate-500 font-bold">Kerja</span>
                  <span className="w-2/3 font-semibold">
                    : {data.pekerjaan_ayah || "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-1/3 text-slate-500 font-bold">No. HP</span>
                  <span className="w-2/3 font-semibold tracking-wider">
                    : {data.no_hp_ayah || "-"}
                  </span>
                </div>
              </div>
              <div
                className={`p-6 rounded-2xl border text-sm ${data.wali_utama === "Ibu" ? "bg-amber-50 border-amber-200 shadow-md" : "bg-slate-50 border-slate-100"}`}>
                <p className="font-black text-slate-800 border-b pb-2 mb-3">
                  2. Data Ibu
                </p>
                <div className="flex mb-2">
                  <span className="w-1/3 text-slate-500 font-bold">Nama</span>
                  <span className="w-2/3 font-semibold uppercase">
                    : {data.nama_ibu || "-"}
                  </span>
                </div>
                <div className="flex mb-2">
                  <span className="w-1/3 text-slate-500 font-bold">Kerja</span>
                  <span className="w-2/3 font-semibold">
                    : {data.pekerjaan_ibu || "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-1/3 text-slate-500 font-bold">No. HP</span>
                  <span className="w-2/3 font-semibold tracking-wider">
                    : {data.no_hp_ibu || "-"}
                  </span>
                </div>
              </div>
              <div
                className={`p-6 rounded-2xl border text-sm ${data.wali_utama === "Wali" ? "bg-purple-50 border-purple-200 shadow-md" : "bg-slate-50 border-slate-100"}`}>
                <p className="font-black text-slate-800 border-b pb-2 mb-3">
                  3. Data Wali Asuh
                </p>
                <div className="flex mb-2">
                  <span className="w-1/3 text-slate-500 font-bold">Nama</span>
                  <span className="w-2/3 font-semibold uppercase">
                    : {data.nama_wali || "-"}
                  </span>
                </div>
                <div className="flex mb-2">
                  <span className="w-1/3 text-slate-500 font-bold">Kerja</span>
                  <span className="w-2/3 font-semibold">
                    : {data.pekerjaan_wali || "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-1/3 text-slate-500 font-bold">No. HP</span>
                  <span className="w-2/3 font-semibold tracking-wider">
                    : {data.no_hp_wali || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black text-emerald-700 mb-5 flex items-center gap-3 border-b border-emerald-100 pb-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">
                C
              </span>{" "}
              Dokumen Persyaratan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <DocumentCard title="Pas Foto 3x4" filePath={data.pas_foto} />
              <DocumentCard
                title="Akta Kelahiran"
                filePath={data.akta_kelahiran}
              />
              <DocumentCard
                title="Kartu Keluarga"
                filePath={data.kartu_keluarga}
              />
              <DocumentCard title="KTP Ortu / Wali" filePath={data.ktp_ortu} />
              <DocumentCard title="Kartu KIP/PKH" filePath={data.kartu_kip} />
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-200 bg-slate-50/80 -mx-8 lg:-mx-12 -mb-8 lg:-mb-12 p-8 flex flex-col items-center justify-center relative z-20">
          {data.is_processed === 1 ? (
            <div className="text-center">
              <span className="inline-block px-8 py-3 bg-emerald-100 text-emerald-700 font-black rounded-full text-lg mb-3 shadow-inner">
                ✅ SISWA DITERIMA
              </span>
              <p className="text-sm text-slate-500 font-bold">
                Data anak ini telah ditransfer ke sistem akademik utama.
              </p>
            </div>
          ) : data.status === "Ditolak" ? (
            <div className="text-center">
              <span className="inline-block px-8 py-3 bg-red-100 text-red-700 font-black rounded-full text-lg mb-2 shadow-inner">
                ❌ PENDAFTARAN DITOLAK
              </span>
            </div>
          ) : (
            <>
              <p className="text-sm font-black text-slate-400 mb-5 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                Keputusan Panitia PPDB
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => handleUpdateStatus("Ditolak")}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-red-500 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all">
                  Tolak Pendaftar
                </button>
                <button
                  onClick={() => handleUpdateStatus("Diterima")}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-2xl shadow-xl hover:-translate-y-1 transition-all">
                  Terima Pendaftar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
