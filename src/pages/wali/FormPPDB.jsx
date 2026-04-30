import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../service/api";
import WaliLayout from "../../layouts/WaliLayout";

// KONSTANTA DROPDOWN
const OPSI_PENDIDIKAN = [
  "Tidak Sekolah",
  "SD / Sederajat",
  "SMP / Sederajat",
  "SMA / SMK / Sederajat",
  "D1",
  "D2",
  "D3",
  "D4 / S1",
  "S2",
  "S3",
];

const OPSI_PEKERJAAN = [
  "Tidak Bekerja",
  "Petani",
  "Nelayan",
  "Buruh",
  "Pedagang / Wiraswasta",
  "Karyawan Swasta",
  "PNS / ASN",
  "TNI / POLRI",
  "Guru / Dosen",
  "Dokter / Tenaga Medis",
  "Pengacara / Notaris",
  "Wirausaha",
  "Pensiunan",
  "Lainnya",
];

const OPSI_AGAMA = [
  "Islam",
  "Kristen Protestan",
  "Kristen Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
];

export default function FormPPDB() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // CEK PERIODE PPDB: 1 Juni - 31 Juli
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-based
  const currentDay = today.getDate();
  const isPpdbOpen =
    currentMonth === 4 ||
    (currentMonth === 7 && currentDay <= 31);

  // BATAS TANGGAL KALENDER
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, "0");
  const day = String(todayDate.getDate()).padStart(2, "0");
  const maxDateToday = `${year}-${month}-${day}`;
  // Batas minimal: 100 tahun kebelakang dari sekarang
  const minDateParent = `${year - 100}-${month}-${day}`;

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nama_panggilan: "",
    jenis_kelamin: "L",
    nik: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    umur: "",
    alamat_siswa: "",
    asal_sekolah: "",
    wali_utama: "Ibu",
    nama_ayah: "",
    tempat_lahir_ayah: "",
    tanggal_lahir_ayah: "",
    agama_ayah: "",
    pendidikan_ayah: "",
    pekerjaan_ayah: "",
    no_hp_ayah: "",
    nama_ibu: "",
    tempat_lahir_ibu: "",
    tanggal_lahir_ibu: "",
    agama_ibu: "",
    pendidikan_ibu: "",
    pekerjaan_ibu: "",
    no_hp_ibu: "",
    nama_wali: "",
    tempat_lahir_wali: "",
    tanggal_lahir_wali: "",
    pendidikan_wali: "",
    pekerjaan_wali: "",
    no_hp_wali: "",
  });

  const [fileData, setFileData] = useState({
    pas_foto: null,
    akta_kelahiran: null,
    kartu_keluarga: null,
    ktp_ortu: null,
    kartu_kip: null,
  });

  const hitungUmur = (tanggalLahir) => {
    if (!tanggalLahir) return "";
    const dob = new Date(tanggalLahir);
    const today = new Date();
    let yearDiff = today.getFullYear() - dob.getFullYear();
    let monthDiff = today.getMonth() - dob.getMonth();
    if (today.getDate() < dob.getDate()) monthDiff--;
    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }
    return `${yearDiff} Tahun ${monthDiff} Bulan`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["nik", "no_hp_ayah", "no_hp_ibu", "no_hp_wali"].includes(name)) {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      return;
    }
    let updatedData = { [name]: value };
    if (name === "tanggal_lahir") updatedData.umur = hitungUmur(value);
    setFormData((prev) => ({ ...prev, ...updatedData }));
  };

  // Logika Validasi File (Maksimal 5 MB)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const selectedFile = files[0];
      const maxFileSize = 5 * 1024 * 1024; // 5 MB dalam Bytes

      if (selectedFile.size > maxFileSize) {
        Swal.fire(
          "Ukuran File Terlalu Besar",
          "Maksimal ukuran dokumen adalah 5 MB. Silakan kompres file Anda terlebih dahulu.",
          "warning",
        );
        e.target.value = null;
        return;
      }

      setFileData((prev) => ({ ...prev, [name]: selectedFile }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "nama_lengkap",
      "nama_panggilan",
      "nik",
      "tempat_lahir",
      "tanggal_lahir",
      "alamat_siswa",
      "asal_sekolah",
      "nama_ayah",
      "tempat_lahir_ayah",
      "tanggal_lahir_ayah",
      "agama_ayah",
      "pendidikan_ayah",
      "pekerjaan_ayah",
      "no_hp_ayah",
      "nama_ibu",
      "tempat_lahir_ibu",
      "tanggal_lahir_ibu",
      "agama_ibu",
      "pendidikan_ibu",
      "pekerjaan_ibu",
      "no_hp_ibu",
    ];

    if (formData.wali_utama === "Wali") {
      requiredFields.push(
        "nama_wali",
        "tempat_lahir_wali",
        "tanggal_lahir_wali",
        "pendidikan_wali",
        "pekerjaan_wali",
        "no_hp_wali",
      );
    }

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return Swal.fire(
          "Data Belum Lengkap",
          "Mohon isi semua data Anak, Ayah, dan Ibu yang bertanda bintang (*).",
          "warning",
        );
      }
    }

    const requiredFiles = [
      "pas_foto",
      "akta_kelahiran",
      "kartu_keluarga",
      "ktp_ortu",
    ];
    for (const field of requiredFiles) {
      if (!fileData[field])
        return Swal.fire(
          "Dokumen Wajib",
          `Mohon unggah dokumen: ${field.replace("_", " ").toUpperCase()}`,
          "warning",
        );
    }

    if (formData.nik.length !== 16)
      return Swal.fire("NIK Tidak Valid", "NIK Anak harus 16 digit.", "error");
    if (formData.no_hp_ayah.length < 10)
      return Swal.fire(
        "No. HP Ayah Tidak Valid",
        "Minimal 10 digit angka.",
        "error",
      );
    if (formData.no_hp_ibu.length < 10)
      return Swal.fire(
        "No. HP Ibu Tidak Valid",
        "Minimal 10 digit angka.",
        "error",
      );
    if (formData.wali_utama === "Wali" && formData.no_hp_wali.length < 10)
      return Swal.fire(
        "No. HP Wali Tidak Valid",
        "Minimal 10 digit angka.",
        "error",
      );

    setIsLoading(true);
    try {
      // Field bertipe DATE — string kosong "" akan ditolak MySQL, harus dikirim kosong/tidak disertakan
      const dateFields = ["tanggal_lahir", "tanggal_lahir_ayah", "tanggal_lahir_ibu", "tanggal_lahir_wali"];

      const submitData = new FormData();
      for (const key in formData) {
        const value = formData[key];
        // Untuk field tanggal, skip jika kosong (biarkan backend/DB pakai NULL)
        if (dateFields.includes(key)) {
          if (value && value.trim() !== "") {
            submitData.append(key, value);
          }
          // Jika kosong, tidak di-append sama sekali → backend terima undefined → disimpan NULL
        } else {
          submitData.append(key, value);
        }
      }
      for (const key in fileData) {
        if (fileData[key]) submitData.append(key, fileData[key]);
      }

      await api.post("/wali/ppdb", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        title: "Berhasil!",
        text: "Pendaftaran beserta dokumen Anda telah kami terima.",
        icon: "success",
      });
      navigate("/wali");
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Terjadi kesalahan sistem. Silakan coba lagi.";
      Swal.fire("Gagal", errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // KOMPONEN FileUploadBox
  const FileUploadBox = ({ label, name, isRequired, accept }) => (
    <div
      className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden group ${fileData[name] ? "bg-emerald-50 border-emerald-400" : "bg-slate-50 border-dashed border-slate-300 hover:bg-slate-100"}`}>
      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
        <div className="flex flex-col items-center justify-center pt-2 pb-3">
          {fileData[name] ? (
            <svg
              className="w-10 h-10 text-emerald-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ) : (
            <svg
              className="w-10 h-10 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          )}
          <p className="text-sm font-bold text-center text-slate-700">
            {label} {isRequired && <span className="text-rose-500">*</span>}
          </p>
          <p className="text-[11px] font-semibold text-slate-500 text-center mt-1">
            {fileData[name] ? fileData[name].name : `Unggah (${accept})`}
          </p>
        </div>
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );

  // RENDER UTAMA
  return (
    <WaliLayout>
      <div className="mb-8 flex items-center gap-4 w-full">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Formulir PPDB
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Pendaftaran Peserta Didik Baru MI Muhammadiyah Troketon.
          </p>
        </div>
      </div>

      {/* BLOK: PPDB DITUTUP             */}
      {!isPpdbOpen ? (
        <div className="w-full bg-white/90 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8 lg:p-12 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-9V6m0 0V4m0 2h2M12 6H10m9.364 1.05A9 9 0 1 1 4.636 4.636 9 9 0 0 1 21.364 7.05z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Pendaftaran PPDB Belum Dibuka</h2>
            <p className="text-slate-500 font-medium max-w-md">
              Formulir pendaftaran hanya dapat diakses pada periode <span className="font-black text-blue-600">1 Juni – 31 Juli</span> setiap tahunnya. Silakan kembali pada periode tersebut.
            </p>
          </div>
          <button
            onClick={() => navigate("/wali")}
            className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors">
            Kembali ke Dashboard
          </button>
        </div>
      ) : (
        <div className="w-full bg-white/90 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            {/* A. Keterangan Calon Peserta Didik */}
            <div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-2.5 h-8 bg-blue-600 rounded-full"></div>
                <h3 className="text-xl font-black text-slate-800">
                  A. Keterangan Calon Peserta Didik
                </h3>
                <span className="text-xs text-rose-500 font-bold ml-auto">
                  * Wajib Diisi
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Nama Panggilan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_panggilan"
                    value={formData.nama_panggilan}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Jenis Kelamin <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label
                      className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 cursor-pointer ${formData.jenis_kelamin === "L" ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-slate-100 text-slate-400"}`}>
                      <input
                        type="radio"
                        name="jenis_kelamin"
                        value="L"
                        checked={formData.jenis_kelamin === "L"}
                        onChange={handleChange}
                        className="hidden"
                      />{" "}
                      Laki-Laki
                    </label>
                    <label
                      className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 cursor-pointer ${formData.jenis_kelamin === "P" ? "bg-amber-50 border-amber-500 text-amber-700" : "bg-white border-slate-100 text-slate-400"}`}>
                      <input
                        type="radio"
                        name="jenis_kelamin"
                        value="P"
                        checked={formData.jenis_kelamin === "P"}
                        onChange={handleChange}
                        className="hidden"
                      />{" "}
                      Perempuan
                    </label>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-bold text-slate-700">
                      NIK Anak <span className="text-rose-500">*</span>
                    </label>
                    <span
                      className={`text-xs font-black ${formData.nik.length === 16 ? "text-emerald-500" : "text-slate-400"}`}>
                      {formData.nik.length}/16 Digit
                    </span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    maxLength={16}
                    className={`w-full px-5 py-4 bg-slate-50/50 border ${formData.nik.length === 16 ? "border-emerald-400 bg-emerald-50/30" : "border-slate-200"} rounded-2xl outline-none font-bold tracking-widest`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Asal Sekolah Dasar/TK <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="asal_sekolah"
                    value={formData.asal_sekolah}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Tempat Lahir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tempat_lahir"
                    value={formData.tempat_lahir}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none font-semibold text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Tanggal Lahir <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggal_lahir"
                      max={maxDateToday}
                      value={formData.tanggal_lahir}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Umur <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="umur"
                      value={formData.umur}
                      readOnly
                      className="w-full px-5 py-4 bg-slate-100/70 border border-slate-200 rounded-2xl outline-none font-bold text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Alamat Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="alamat_siswa"
                    rows="2"
                    value={formData.alamat_siswa}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none font-semibold text-slate-800"></textarea>
                </div>
              </div>
            </div>

            {/* B. Data Orang Tua / Wali */}
            <div className="pt-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-8 bg-amber-500 rounded-full"></div>
                  <h3 className="text-xl font-black text-slate-800">
                    B. Data Orang Tua / Wali
                  </h3>
                </div>
              </div>

              <div className="mb-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <label className="block text-sm font-black text-blue-800 uppercase tracking-wider mb-1">
                    Kontak Utama
                  </label>
                  <p className="text-xs text-blue-600 font-medium">
                    Siapa wali utama yang akan dihubungi terkait akademik siswa?
                  </p>
                </div>
                <select
                  name="wali_utama"
                  value={formData.wali_utama}
                  onChange={handleChange}
                  className="w-full md:w-64 px-5 py-3.5 bg-white border border-blue-200 rounded-xl outline-none font-bold text-blue-700 cursor-pointer shadow-sm focus:ring-4 focus:ring-blue-500/10">
                  <option value="Ibu">IBU KANDUNG</option>
                  <option value="Ayah">AYAH KANDUNG</option>
                  <option value="Wali">WALI ASUH</option>
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profil Ayah */}
                <div
                  className={`bg-white p-6 rounded-3xl border transition-all ${formData.wali_utama === "Ayah" ? "border-blue-400 ring-4 ring-blue-50 shadow-md" : "border-slate-200 shadow-sm"}`}>
                  <h4 className="font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                      1
                    </span>{" "}
                    Profil Ayah
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama_ayah"
                        value={formData.nama_ayah}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Tempat Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tempat_lahir_ayah"
                        value={formData.tempat_lahir_ayah}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Tanggal Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggal_lahir_ayah"
                        min={minDateParent}
                        max={maxDateToday}
                        value={formData.tanggal_lahir_ayah}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Agama <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="agama_ayah"
                        value={formData.agama_ayah}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 cursor-pointer">
                        <option value="">-- Pilih Agama --</option>
                        {OPSI_AGAMA.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Pendidikan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="pendidikan_ayah"
                        value={formData.pendidikan_ayah}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 cursor-pointer">
                        <option value="">-- Pilih Pendidikan --</option>
                        {OPSI_PENDIDIKAN.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Pekerjaan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="pekerjaan_ayah"
                        value={formData.pekerjaan_ayah}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 cursor-pointer">
                        <option value="">-- Pilih Pekerjaan --</option>
                        {OPSI_PEKERJAAN.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        No. Handphone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="no_hp_ayah"
                        value={formData.no_hp_ayah}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold tracking-wider outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Profil Ibu */}
                <div
                  className={`bg-white p-6 rounded-3xl border transition-all ${formData.wali_utama === "Ibu" ? "border-amber-400 ring-4 ring-amber-50 shadow-md" : "border-slate-200 shadow-sm"}`}>
                  <h4 className="font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">
                      2
                    </span>{" "}
                    Profil Ibu
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama_ibu"
                        value={formData.nama_ibu}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Tempat Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tempat_lahir_ibu"
                        value={formData.tempat_lahir_ibu}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Tanggal Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggal_lahir_ibu"
                        min={minDateParent}
                        max={maxDateToday}
                        value={formData.tanggal_lahir_ibu}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Agama <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="agama_ibu"
                        value={formData.agama_ibu}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400 cursor-pointer">
                        <option value="">-- Pilih Agama --</option>
                        {OPSI_AGAMA.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Pendidikan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="pendidikan_ibu"
                        value={formData.pendidikan_ibu}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400 cursor-pointer">
                        <option value="">-- Pilih Pendidikan --</option>
                        {OPSI_PENDIDIKAN.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Pekerjaan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="pekerjaan_ibu"
                        value={formData.pekerjaan_ibu}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400 cursor-pointer">
                        <option value="">-- Pilih Pekerjaan --</option>
                        {OPSI_PEKERJAAN.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        No. Handphone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="no_hp_ibu"
                        value={formData.no_hp_ibu}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold tracking-wider outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Profil Wali (Buram jika tidak dipilih, Optional) */}
                <div
                  className={`bg-white p-6 rounded-3xl border transition-all ${formData.wali_utama === "Wali" ? "border-purple-400 ring-4 ring-purple-50 shadow-md" : "border-slate-100 shadow-sm opacity-50 hover:opacity-100"}`}>
                  <h4 className="font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                        3
                      </span>{" "}
                      Profil Wali
                    </div>
                    {formData.wali_utama !== "Wali" && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        Opsional
                      </span>
                    )}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Nama Lengkap{" "}
                        {formData.wali_utama === "Wali" && (
                          <span className="text-rose-500">*</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="nama_wali"
                        value={
                          formData.wali_utama !== "Wali" && !formData.nama_wali
                            ? ""
                            : formData.nama_wali
                        }
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400"
                        placeholder="Abaikan jika tidak ada"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Tempat Lahir{" "}
                        {formData.wali_utama === "Wali" && (
                          <span className="text-rose-500">*</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="tempat_lahir_wali"
                        value={formData.tempat_lahir_wali}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Tanggal Lahir{" "}
                        {formData.wali_utama === "Wali" && (
                          <span className="text-rose-500">*</span>
                        )}
                      </label>
                      <input
                        type="date"
                        name="tanggal_lahir_wali"
                        min={minDateParent}
                        max={maxDateToday}
                        value={formData.tanggal_lahir_wali}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Pendidikan{" "}
                        {formData.wali_utama === "Wali" && (
                          <span className="text-rose-500">*</span>
                        )}
                      </label>
                      <select
                        name="pendidikan_wali"
                        value={formData.pendidikan_wali}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 cursor-pointer">
                        <option value="">-- Pilih Pendidikan --</option>
                        {OPSI_PENDIDIKAN.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Pekerjaan{" "}
                        {formData.wali_utama === "Wali" && (
                          <span className="text-rose-500">*</span>
                        )}
                      </label>
                      <select
                        name="pekerjaan_wali"
                        value={formData.pekerjaan_wali}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 cursor-pointer">
                        <option value="">-- Pilih Pekerjaan --</option>
                        {OPSI_PEKERJAAN.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        No. Handphone{" "}
                        {formData.wali_utama === "Wali" && (
                          <span className="text-rose-500">*</span>
                        )}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="no_hp_wali"
                        value={formData.no_hp_wali}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold tracking-wider outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================== */}
            {/* C. Dokumen */}
            {/* ============================== */}
            <div className="pt-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-8 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-xl font-black text-slate-800">
                    C. Dokumen Persyaratan
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                  Maks. 5 MB
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <FileUploadBox
                  label="Pas Foto 3x4"
                  name="pas_foto"
                  isRequired={true}
                  accept=".jpg,.jpeg,.png"
                />
                <FileUploadBox
                  label="Akta Kelahiran"
                  name="akta_kelahiran"
                  isRequired={true}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <FileUploadBox
                  label="Kartu Keluarga"
                  name="kartu_keluarga"
                  isRequired={true}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <FileUploadBox
                  label="KTP Orang Tua / Wali"
                  name="ktp_ortu"
                  isRequired={true}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <FileUploadBox
                  label="Kartu KIP/PKH"
                  name="kartu_kip"
                  isRequired={false}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-slate-100 mt-10">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-2xl transition-colors uppercase tracking-wider text-sm">
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg transition-all uppercase tracking-wider text-sm ${isLoading ? "opacity-60" : "active:scale-95"}`}>
                {isLoading ? "Mengunggah..." : "Kirim Formulir Pendaftaran"}
              </button>
            </div>
          </form>
        </div>
      )}
    </WaliLayout>
  );
}