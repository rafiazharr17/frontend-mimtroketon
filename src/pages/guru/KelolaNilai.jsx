import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { api } from "../../service/api";
import GuruLayout from "../../layouts/GuruLayout";

export default function KelolaNilai() {
  // === LOGIKA TAHUN AJARAN OTOMATIS ===
  const currentYear = new Date().getFullYear();
  const optionTahun1 = `${currentYear - 1}/${currentYear}`;
  const optionTahun2 = `${currentYear}/${currentYear + 1}`;

  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({
    kombinasi: "",
    semester: "Ganjil",
    tahun_ajaran: optionTahun1, // Tambahan State Tahun Ajaran
  });

  const [siswaList, setSiswaList] = useState([]);
  const [activeKonteks, setActiveKonteks] = useState(null);

  const [bobot, setBobot] = useState({ tugas: 30, uts: 30, uas: 40 });

  const [isLoadingFilter, setIsLoadingFilter] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await api.get("/guru/kelas-mapel");
        setFilterOptions(response.data);
        if (response.data.length > 0) {
          setSelectedFilter((prev) => ({
            ...prev,
            kombinasi: JSON.stringify({
              id_kelas: response.data[0].id_kelas,
              id_mapel: response.data[0].id_mapel,
              nama_kelas: response.data[0].nama_kelas,
              nama_pelajaran: response.data[0].nama_pelajaran,
            }),
          }));
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Filter",
          text: "Terjadi kesalahan saat memuat data kelas dan mata pelajaran.",
        });
      } finally {
        setIsLoadingFilter(false);
      }
    };

    fetchFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ini adalah baris perbaikan untuk menghilangkan warning di console kuning Anda

  const hitungNilaiAkhir = (tugas, uts, uas, bobotAktif) => {
    const valTugas = tugas === "" || tugas === null ? 0 : Number(tugas);
    const valUts = uts === "" || uts === null ? 0 : Number(uts);
    const valUas = uas === "" || uas === null ? 0 : Number(uas);

    const hasil =
      valTugas * (Number(bobotAktif.tugas) / 100) +
      valUts * (Number(bobotAktif.uts) / 100) +
      valUas * (Number(bobotAktif.uas) / 100);

    return Math.min(Math.round(hasil), 100);
  };

  const handleTampilkan = async () => {
    if (!selectedFilter.kombinasi) return;

    setIsLoadingData(true);
    const parsedKombinasi = JSON.parse(selectedFilter.kombinasi);

    try {
      const response = await api.get("/guru/siswa-nilai", {
        params: {
          id_kelas: parsedKombinasi.id_kelas,
          id_mapel: parsedKombinasi.id_mapel,
          semester: selectedFilter.semester,
          tahun_ajaran: selectedFilter.tahun_ajaran, // Kirim parameter Tahun Ajaran ke backend
        },
      });

      const dataSiswa = response.data.map((siswa) => ({
        ...siswa,
        nilai_akhir: hitungNilaiAkhir(
          siswa.nilai_tugas,
          siswa.nilai_uts,
          siswa.nilai_uas,
          bobot,
        ),
      }));

      setSiswaList(dataSiswa);
      setActiveKonteks({
        ...parsedKombinasi,
        semester: selectedFilter.semester,
        tahun_ajaran: selectedFilter.tahun_ajaran, // Simpan tahun ajaran ke konteks aktif
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengambil data siswa",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleBobotChange = (field, value) => {
    let val = value === "" ? "" : Number(value);

    if (val !== "" && val < 0) val = 0;

    const currentTugas = field === "tugas" ? 0 : Number(bobot.tugas);
    const currentUts = field === "uts" ? 0 : Number(bobot.uts);
    const currentUas = field === "uas" ? 0 : Number(bobot.uas);
    const totalLainnya = currentTugas + currentUts + currentUas;

    if (val !== "" && totalLainnya + val > 100) {
      val = 100 - totalLainnya;
    }

    const newBobot = { ...bobot, [field]: val };
    setBobot(newBobot);

    setSiswaList((prevList) =>
      prevList.map((siswa) => ({
        ...siswa,
        nilai_akhir: hitungNilaiAkhir(
          siswa.nilai_tugas,
          siswa.nilai_uts,
          siswa.nilai_uas,
          newBobot,
        ),
      })),
    );
  };

  const handleNilaiChange = (id, field, value) => {
    let val = value === "" ? "" : Number(value);

    if (val !== "" && val < 0) val = 0;
    if (val !== "" && val > 100) val = 100;

    setSiswaList((prev) =>
      prev.map((siswa) => {
        if (siswa.id === id) {
          const updatedSiswa = { ...siswa, [field]: val };
          updatedSiswa.nilai_akhir = hitungNilaiAkhir(
            updatedSiswa.nilai_tugas,
            updatedSiswa.nilai_uts,
            updatedSiswa.nilai_uas,
            bobot,
          );
          return updatedSiswa;
        }
        return siswa;
      }),
    );
  };

  const handleSimpanSemua = async () => {
    const totalBobot =
      Number(bobot.tugas) + Number(bobot.uts) + Number(bobot.uas);
    if (totalBobot !== 100) {
      Swal.fire({
        icon: "warning",
        title: "Persentase Belum 100%",
        text: `Total bobot persentase saat ini adalah ${totalBobot}%. Pastikan total Tugas, UTS, dan UAS tepat 100% sebelum menyimpan.`,
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id_kelas: activeKonteks.id_kelas,
        id_mapel: activeKonteks.id_mapel,
        semester: activeKonteks.semester,
        tahun_ajaran: activeKonteks.tahun_ajaran, // Kirim Tahun Ajaran saat proses simpan
        data: siswaList.map((s) => ({
          id_siswa: s.id,
          nilai_tugas: s.nilai_tugas,
          nilai_uts: s.nilai_uts,
          nilai_uas: s.nilai_uas,
          nilai_akhir: s.nilai_akhir,
        })),
      };

      await api.post("/guru/nilai-bulk", payload);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Seluruh nilai telah disimpan",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: error.response?.data?.error || error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getGrade = (nilai) => {
    if (nilai === "" || nilai === null || isNaN(nilai)) return "-";
    if (nilai >= 90) return "A";
    if (nilai >= 80) return "B";
    if (nilai >= 70) return "C";
    if (nilai >= 60) return "D";
    return "E";
  };

  const getStatus = (nilai) => {
    if (nilai === "" || nilai === null || isNaN(nilai)) return "-";
    return nilai >= 70 ? "Lulus" : "Tidak Lulus";
  };

  return (
    <GuruLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Kelola Nilai Siswa
          </h1>
          <p className="text-slate-500 mt-2">
            Masukan nilai komponen dan kelola bobot persentase secara otomatis.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Pilih Kelas & Mapel
            </label>
            <select
              value={selectedFilter.kombinasi}
              onChange={(e) =>
                setSelectedFilter({
                  ...selectedFilter,
                  kombinasi: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 focus:bg-white"
              disabled={isLoadingFilter}>
              {isLoadingFilter ? (
                <option value="">Memuat data...</option>
              ) : (
                filterOptions.map((opt, idx) => (
                  <option
                    key={idx}
                    value={JSON.stringify({
                      id_kelas: opt.id_kelas,
                      id_mapel: opt.id_mapel,
                      nama_kelas: opt.nama_kelas,
                      nama_pelajaran: opt.nama_pelajaran,
                    })}>
                    Kelas {opt.nama_kelas} - {opt.nama_pelajaran}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* === TAMBAHAN DROPDOWN TAHUN AJARAN === */}
          <div className="w-full md:w-48 flex-none">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tahun Ajaran
            </label>
            <select
              value={selectedFilter.tahun_ajaran}
              onChange={(e) =>
                setSelectedFilter({
                  ...selectedFilter,
                  tahun_ajaran: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 focus:bg-white">
              <option value={optionTahun1}>{optionTahun1}</option>
              <option value={optionTahun2}>{optionTahun2}</option>
            </select>
          </div>

          <div className="w-full md:w-48 flex-none">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Semester
            </label>
            <select
              value={selectedFilter.semester}
              onChange={(e) =>
                setSelectedFilter({
                  ...selectedFilter,
                  semester: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 focus:bg-white">
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>

          <button
            onClick={handleTampilkan}
            disabled={isLoadingData || !selectedFilter.kombinasi}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 w-full md:w-auto flex justify-center">
            {isLoadingData ? "Memuat..." : "Tampilkan"}
          </button>
        </div>

        {siswaList.length > 0 && activeKonteks && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="mb-6 pb-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Kelas {activeKonteks.nama_kelas}
                </h2>
                <p className="text-slate-500 mt-1">
                  Mata Pelajaran:{" "}
                  <span className="font-semibold text-slate-700">
                    {activeKonteks.nama_pelajaran}
                  </span>{" "}
                  — Semester {activeKonteks.semester} (
                  {activeKonteks.tahun_ajaran})
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="py-4 px-4 text-slate-400 font-medium text-sm w-12 text-center">
                      No
                    </th>
                    <th className="py-4 px-4 text-slate-400 font-medium text-sm min-w-[150px]">
                      Nama Siswa
                    </th>
                    <th className="py-4 px-4 text-slate-400 font-medium text-sm w-32">
                      NIS
                    </th>

                    {/* Header Nilai Tugas + Persentase */}
                    <th className="py-4 px-2 text-slate-400 font-medium text-sm text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span>Nilai Tugas</span>
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
                          <input
                            type="number"
                            value={bobot.tugas}
                            onChange={(e) =>
                              handleBobotChange("tugas", e.target.value)
                            }
                            className="w-10 text-center text-xs bg-transparent outline-none font-bold text-indigo-600"
                          />
                          <span className="text-xs font-bold text-slate-400">
                            %
                          </span>
                        </div>
                      </div>
                    </th>

                    {/* Header Nilai UTS + Persentase */}
                    <th className="py-4 px-2 text-slate-400 font-medium text-sm text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span>Nilai UTS</span>
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
                          <input
                            type="number"
                            value={bobot.uts}
                            onChange={(e) =>
                              handleBobotChange("uts", e.target.value)
                            }
                            className="w-10 text-center text-xs bg-transparent outline-none font-bold text-indigo-600"
                          />
                          <span className="text-xs font-bold text-slate-400">
                            %
                          </span>
                        </div>
                      </div>
                    </th>

                    {/* Header Nilai UAS + Persentase */}
                    <th className="py-4 px-2 text-slate-400 font-medium text-sm text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span>Nilai UAS</span>
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
                          <input
                            type="number"
                            value={bobot.uas}
                            onChange={(e) =>
                              handleBobotChange("uas", e.target.value)
                            }
                            className="w-10 text-center text-xs bg-transparent outline-none font-bold text-indigo-600"
                          />
                          <span className="text-xs font-bold text-slate-400">
                            %
                          </span>
                        </div>
                      </div>
                    </th>

                    <th className="py-4 px-4 text-indigo-600 font-bold text-sm text-center w-28">
                      Nilai Akhir
                    </th>
                    <th className="py-4 px-4 text-slate-400 font-medium text-sm text-center w-24">
                      Grade
                    </th>
                    <th className="py-4 px-4 text-slate-400 font-medium text-sm text-center w-32">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {siswaList.map((siswa, index) => {
                    const grade = getGrade(siswa.nilai_akhir);
                    const status = getStatus(siswa.nilai_akhir);

                    return (
                      <tr
                        key={siswa.id}
                        className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-4 text-sm text-slate-500 text-center">
                          {index + 1}
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-800">
                          {siswa.nama}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-500">
                          {siswa.nis || "-"}
                        </td>

                        <td className="py-4 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={siswa.nilai_tugas}
                            onChange={(e) =>
                              handleNilaiChange(
                                siswa.id,
                                "nilai_tugas",
                                e.target.value,
                              )
                            }
                            className="w-16 h-10 text-center rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-bold text-slate-700 bg-white group-hover:bg-white"
                          />
                        </td>

                        <td className="py-4 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={siswa.nilai_uts}
                            onChange={(e) =>
                              handleNilaiChange(
                                siswa.id,
                                "nilai_uts",
                                e.target.value,
                              )
                            }
                            className="w-16 h-10 text-center rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-bold text-slate-700 bg-white group-hover:bg-white"
                          />
                        </td>

                        <td className="py-4 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={siswa.nilai_uas}
                            onChange={(e) =>
                              handleNilaiChange(
                                siswa.id,
                                "nilai_uas",
                                e.target.value,
                              )
                            }
                            className="w-16 h-10 text-center rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-bold text-slate-700 bg-white group-hover:bg-white"
                          />
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="w-16 h-10 mx-auto flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-black border border-indigo-100">
                            {siswa.nilai_akhir === "" ||
                            isNaN(siswa.nilai_akhir)
                              ? "-"
                              : siswa.nilai_akhir}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm
                            ${
                              grade === "A"
                                ? "bg-emerald-100 text-emerald-700"
                                : grade === "B"
                                  ? "bg-blue-100 text-blue-700"
                                  : grade === "C"
                                    ? "bg-amber-100 text-amber-700"
                                    : grade === "-"
                                      ? "bg-slate-100 text-slate-400"
                                      : "bg-red-100 text-red-700"
                            }`}>
                            {grade}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-lg font-bold text-xs tracking-wide uppercase
                            ${
                              status === "Lulus"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : status === "Tidak Lulus"
                                  ? "bg-red-50 text-red-600 border border-red-200"
                                  : "bg-slate-50 text-slate-400 border border-slate-200"
                            }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-8 flex justify-end pt-6 border-t border-slate-100">
                <button
                  onClick={handleSimpanSemua}
                  disabled={isSaving}
                  className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl shadow-xl shadow-slate-800/20 transition-all duration-300 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50">
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      Simpan Semua Nilai
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GuruLayout>
  );
}
