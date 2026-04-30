import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";

export default function UpdateUsers() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  const [listUsers, setListUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => {
        setListUsers(res.data);
        const user = res.data.find((u) => u.id.toString() === id);
        if (user) {
          setFormData({
            username: user.username,
            email: user.email || "",
            role: user.role,
            password: "",
          });
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. VALIDASI USERNAME (Ditambah Optional Chaining '?.' pada u.username)
    if (!formData.username.trim()) {
      validationErrors.username = "Username wajib diisi.";
    } else if (/\s/.test(formData.username)) {
      validationErrors.username = "Username tidak boleh mengandung spasi.";
    } else if (formData.username.trim().length < 3) {
      validationErrors.username = "Username minimal 3 karakter.";
    } else if (
      listUsers.some(
        (u) =>
          u.username?.toLowerCase() === formData.username.toLowerCase() &&
          u.id.toString() !== id,
      )
    ) {
      validationErrors.username =
        "Username ini sudah digunakan oleh pengguna lain.";
    }

    // 2. VALIDASI EMAIL (Ditambah Optional Chaining '?.' pada u.email)
    if (!formData.email.trim()) {
      validationErrors.email = "Email wajib diisi.";
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email =
        "Format email tidak valid (contoh: email@gmail.com).";
    } else if (
      listUsers.some(
        (u) =>
          u.email?.toLowerCase() === formData.email.toLowerCase() &&
          u.id.toString() !== id,
      )
    ) {
      validationErrors.email =
        "Alamat email ini sudah terdaftar pada pengguna lain.";
    }

    // 3. VALIDASI PASSWORD
    if (formData.password && formData.password.length < 6) {
      validationErrors.password =
        "Jika ingin diubah, password minimal terdiri dari 6 karakter.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({
        icon: "warning",
        title: "Formulir Belum Sempurna",
        text: "Silakan periksa kembali kolom yang berwarna merah.",
        confirmButtonColor: "#4f46e5",
        customClass: { popup: "rounded-3xl" },
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/admin/users/${id}`, formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kredensial akun berhasil diupdate.",
        customClass: { popup: "rounded-3xl" },
      });
      navigate(`/admin/users`);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Terjadi kesalahan sistem";
      if (
        errorMsg.toLowerCase().includes("username") ||
        errorMsg.includes("ER_DUP_ENTRY")
      ) {
        Swal.fire(
          "Gagal",
          "Username atau Email sudah terdaftar di database.",
          "error",
        );
      } else {
        Swal.fire("Gagal", errorMsg, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center gap-4 w-full">
        <button
          onClick={() => navigate(-1)}
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
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Perbarui Akun Pengguna
          </h1>
          <p className="text-slate-500 mt-1">
            Ganti username, email, role, atau reset password.
          </p>
        </div>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60"></div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* USERNAME */}
            <div>
              <label
                className={`block text-sm font-bold mb-2 ${errors.username ? "text-red-500" : "text-slate-700"}`}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-5 py-4 bg-white/50 border rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder-slate-400 focus:ring-4 ${errors.username ? "border-red-500 focus:ring-red-500/10 focus:border-red-500 bg-red-50/50" : "border-slate-200 focus:ring-slate-500/10 focus:border-slate-500"}`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {errors.username}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label
                className={`block text-sm font-bold mb-2 ${errors.email ? "text-red-500" : "text-slate-700"}`}>
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-5 py-4 bg-white/50 border rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder-slate-400 focus:ring-4 ${errors.email ? "border-red-500 focus:ring-red-500/10 focus:border-red-500 bg-red-50/50" : "border-slate-200 focus:ring-slate-500/10 focus:border-slate-500"}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Hak Akses (Role)
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={formData.role === "admin"}
                className={`w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none transition-all font-medium text-slate-700 cursor-pointer ${formData.role === "admin" ? "bg-slate-100 cursor-not-allowed opacity-70" : "bg-white/50"}`}>
                {formData.role === "admin" ? (
                  <option value="admin">Administrator</option>
                ) : (
                  <>
                    <option value="guru">Guru</option>
                    <option value="wali_murid">Wali Murid</option>
                  </>
                )}
              </select>
              {formData.role === "admin" && (
                <p className="text-[10px] text-amber-600 font-bold mt-2 uppercase tracking-wider italic">
                  * Role Administrator utama tidak dapat diubah.
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label
                className={`block text-sm font-bold mb-2 ${errors.password ? "text-red-500" : "text-slate-700"}`}>
                Reset Password (Opsional)
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className={`w-full px-5 py-4 bg-white/50 border rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder-slate-400 focus:ring-4 ${errors.password ? "border-red-500 focus:ring-red-500/10 focus:border-red-500 bg-red-50/50" : "border-slate-200 focus:ring-slate-500/10 focus:border-slate-500"}`}
                placeholder="Kosongkan jika tak diubah"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-10 py-3.5 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 transition-transform transform hover:-translate-y-0.5 ${isLoading ? "opacity-70" : ""}`}>
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
