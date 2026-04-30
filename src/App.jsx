import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import Auth from "./pages/AuthPage";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomeSiswa from "./pages/admin/siswa/HomeSiswa";
import AddSiswa from "./pages/admin/siswa/AddSiswa";
import DetailSiswa from "./pages/admin/siswa/DetailSiswa";
import UpdateSiswa from "./pages/admin/siswa/UpdateSiswa";
import RestoreSiswa from "./pages/admin/siswa/RestoreSiswa";
import KenaikanKelas from './pages/admin/siswa/KenaikanKelas';
import HomeGuru from "./pages/admin/guru/HomeGuru";
import AddGuru from "./pages/admin/guru/AddGuru";
import DetailGuru from "./pages/admin/guru/DetailGuru";
import UpdateGuru from "./pages/admin/guru/UpdateGuru";
import RestoreGuru from "./pages/admin/guru/RestoreGuru";
import HomeKelas from "./pages/admin/kelas/HomeKelas";
import AddKelas from "./pages/admin/kelas/AddKelas";
import DetailKelas from "./pages/admin/kelas/DetailKelas";
import UpdateKelas from "./pages/admin/kelas/UpdateKelas";
import RestoreKelas from "./pages/admin/kelas/RestoreKelas";
import HomeMapel from "./pages/admin/mapel/HomeMapel";
import AddMapel from "./pages/admin/mapel/AddMapel";
import DetailMapel from "./pages/admin/mapel/DetailMapel";
import UpdateMapel from "./pages/admin/mapel/UpdateMapel";
import RestoreMapel from "./pages/admin/mapel/RestoreMapel";
import HomeJadwal from "./pages/admin/jadwal/HomeJadwal";
import HomeUsers from "./pages/admin/users/HomeUsers";
import AddUsers from "./pages/admin/users/AddUsers";
import DetailUsers from "./pages/admin/users/DetailUsers";
import UpdateUsers from "./pages/admin/users/UpdateUsers";
import RestoreUsers from "./pages/admin/users/RestoreUsers";
import HomeFasilitas from "./pages/admin/fasilitas/HomeFasilitas";
import AddFasilitas from "./pages/admin/fasilitas/AddFasilitas";
import DetailFasilitas from "./pages/admin/fasilitas/DetailFasilitas";
import UpdateFasilitas from "./pages/admin/fasilitas/UpdateFasilitas";
import RestoreFasilitas from "./pages/admin/fasilitas/RestoreFasilitas";
import HomePPDB from "./pages/admin/ppdb/HomePPDB";
import DetailPPDB from "./pages/admin/ppdb/DetailPPDB";

// Guru
import GuruDashboard from "./pages/guru/GuruDashboard";
import JadwalMengajar from "./pages/guru/JadwalMengajar";
import KelolaNilai from "./pages/guru/KelolaNilai";

// Wali Murid
import WaliDashboard from "./pages/wali/WaliDashboard";
import FormPPDB from "./pages/wali/FormPPDB";
import NilaiAnak from "./pages/wali/NilaiAnak";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik (Bisa diakses siapa saja) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rute Terlindungi Khusus Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/siswa"
          element={
            <ProtectedRoute allowedRole="admin">
              <HomeSiswa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/siswa/add"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddSiswa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/siswa/detail/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <DetailSiswa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/siswa/update/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <UpdateSiswa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/siswa/restore"
          element={
            <ProtectedRoute allowedRole="admin">
              <RestoreSiswa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/siswa/naik-kelas"
          element={
            <ProtectedRoute allowedRole="admin">
              <KenaikanKelas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/guru"
          element={
            <ProtectedRoute allowedRole="admin">
              <HomeGuru />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/guru/add"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddGuru />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/guru/detail/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <DetailGuru />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/guru/update/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <UpdateGuru />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/guru/restore"
          element={
            <ProtectedRoute allowedRole="admin">
              <RestoreGuru />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/kelas"
          element={
            <ProtectedRoute allowedRole="admin">
              <HomeKelas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kelas/add"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddKelas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kelas/detail/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <DetailKelas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kelas/update/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <UpdateKelas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kelas/restore"
          element={
            <ProtectedRoute allowedRole="admin">
              <RestoreKelas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/mapel"
          element={
            <ProtectedRoute allowedRole="admin">
              <HomeMapel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mapel/add"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddMapel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mapel/detail/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <DetailMapel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mapel/update/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <UpdateMapel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mapel/restore"
          element={
            <ProtectedRoute allowedRole="admin">
              <RestoreMapel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jadwal"
          element={
            <ProtectedRoute allowedRole="admin">
              <HomeJadwal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRole="admin">
              <HomeUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/add"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/detail/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <DetailUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/update/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <UpdateUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/restore"
          element={
            <ProtectedRoute allowedRole="admin">
              <RestoreUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fasilitas"
          element={
            <ProtectedRoute allowedRole="admin">
              <HomeFasilitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fasilitas/add"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddFasilitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fasilitas/detail/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <DetailFasilitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fasilitas/update/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <UpdateFasilitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fasilitas/restore"
          element={
            <ProtectedRoute allowedRole="admin">
              <RestoreFasilitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ppdb"
          element={
            <ProtectedRoute allowedRole="admin">
              <HomePPDB />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ppdb/detail/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <DetailPPDB />
            </ProtectedRoute>
          }
        />

        {/* Rute Terlindungi Khusus Guru */}
        <Route
          path="/guru"
          element={
            <ProtectedRoute allowedRole="guru">
              <GuruDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guru/jadwal"
          element={
            <ProtectedRoute allowedRole="guru">
              <JadwalMengajar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guru/nilai"
          element={
            <ProtectedRoute allowedRole="guru">
              <KelolaNilai />
            </ProtectedRoute>
          }
        />

        {/* Rute Terlindungi Khusus Wali Murid */}
        <Route
          path="/wali"
          element={
            <ProtectedRoute allowedRole="wali_murid">
              <WaliDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wali/ppdb"
          element={
            <ProtectedRoute allowedRole="wali_murid">
              <FormPPDB />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wali/nilai"
          element={
            <ProtectedRoute allowedRole="wali_murid">
              <NilaiAnak />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
