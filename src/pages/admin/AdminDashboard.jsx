import { useState, useEffect } from 'react';
import { api } from '../../service/api';
import AdminLayout from '../../layouts/AdminLayout';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LabelList 
} from 'recharts';

const socket = io(import.meta.env.VITE_BACKEND_URL); 

export default function AdminDashboard() {
  const [stats, setStats] = useState({ siswa: 0, guru: 0, kelas: 0, ppdb: 0 });
  const [recentPpdb, setRecentPpdb] = useState([]);
  const [chartData, setChartData] = useState({ gender: [], ppdbStatus: [], fasilitas: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [resSiswa, resGuru, resKelas, resPpdb, resFasilitas] = await Promise.all([
        api.get('/admin/siswa'),
        api.get('/admin/guru'),
        api.get('/admin/kelas'),
        api.get('/admin/ppdb'),
        api.get('/admin/fasilitas')
      ]);

      const allSiswa = resSiswa.data || [];
      const allPpdb = resPpdb.data || [];
      const allFasilitas = resFasilitas.data || [];

      setStats({
        siswa: allSiswa.length,
        guru: resGuru.data?.length || 0,
        kelas: resKelas.data?.length || 0,
        ppdb: allPpdb.filter(p => p.status === 'Menunggu' || p.status === 'MENUNGGU').length
      });

      setRecentPpdb(allPpdb.slice(0, 5));

      const laki = allSiswa.filter(s => s.jenis_kelamin === 'L').length;
      const perempuan = allSiswa.filter(s => s.jenis_kelamin === 'P').length;
      
      setChartData({
        gender: [
          { name: 'Laki-Laki', value: laki },
          { name: 'Perempuan', value: perempuan }
        ],
        ppdbStatus: [
          { name: 'Diterima', total: allPpdb.filter(p => p.status === 'Diterima').length, color: '#10b981' },
          { name: 'Menunggu', total: allPpdb.filter(p => p.status?.toUpperCase() === 'MENUNGGU').length, color: '#f59e0b' },
          { name: 'Ditolak', total: allPpdb.filter(p => p.status === 'Ditolak').length, color: '#ef4444' }
        ],
        fasilitas: [
          { name: 'Baik', total: allFasilitas.filter(f => f.kondisi === 'Baik').length },
          { name: 'Rusak', total: allFasilitas.filter(f => f.kondisi?.toLowerCase().includes('rusak')).length }
        ]
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    socket.on('ppdb_baru', (data) => {
        const Toast = Swal.mixin({ 
            toast: true, 
            position: "top-end", 
            showConfirmButton: false, 
            timer: 4000, 
            timerProgressBar: true 
        });
        Toast.fire({ 
            icon: "info", 
            title: `Pendaftar Baru Masuk!`,
            text: `${data.nama_lengkap} (${data.no_pendaftaran})`
        });
        
        fetchDashboardData();
    });

    return () => {
        socket.off('ppdb_baru');
    };
  }, []);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold text-xs">
        {value > 0 ? value : ''}
      </text>
    );
  };

  const statCards = [
    { title: 'Siswa Aktif', count: stats.siswa, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'from-blue-500 to-indigo-500', bgIcon: 'bg-blue-50 text-blue-600' },
    { title: 'Total Guru', count: stats.guru, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'from-emerald-500 to-teal-500', bgIcon: 'bg-emerald-50 text-emerald-600' },
    { title: 'Jumlah Kelas', count: stats.kelas, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'from-purple-500 to-pink-500', bgIcon: 'bg-purple-50 text-purple-600' },
    { title: 'PPDB Pending', count: stats.ppdb, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'from-amber-500 to-orange-500', bgIcon: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1 font-medium">Monitoring aktivitas akademik secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {!isLoading && statCards.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl ${item.bgIcon}`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.title}</p>
                <p className={`text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r ${item.color}`}>{item.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Gender Siswa - Angka di Dalam */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Gender Siswa</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={chartData.gender} 
                  cx="50%" cy="50%" 
                  innerRadius={60} outerRadius={100} 
                  paddingAngle={2} dataKey="value" stroke="none"
                  labelLine={false} label={renderCustomizedLabel}
                >
                  {chartData.gender.map((e, i) => <Cell key={i} fill={['#3b82f6', '#ec4899'][i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status PPDB */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Status Pendaftaran PPDB</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData.ppdbStatus} margin={{ top: 25, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="total" radius={[12, 12, 12, 12]} barSize={55}>
                  {chartData.ppdbStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                  <LabelList dataKey="total" position="top" style={{ fill: '#475569', fontSize: '14px', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pendaftar Terbaru */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white">
           <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h3 className="text-sm font-bold text-slate-800">Review PPDB Terbaru</h3>
              <button onClick={() => window.location.href='/admin/ppdb'} className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Lihat Semua</button>
           </div>
           <div className="space-y-3">
              {recentPpdb.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-slate-300 border border-slate-100">{i+1}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{p.nama_lengkap}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{p.no_pendaftaran}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${p.status === 'Diterima' ? 'bg-emerald-100 text-emerald-600' : p.status?.toUpperCase() === 'MENUNGGU' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                    {p.status}
                  </span>
                </div>
              ))}
           </div>
        </div>

        {/* Inventaris - Versi Mobile Friendly (Horizontal) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Kondisi Inventaris</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
               <BarChart layout="vertical" data={chartData.fasilitas} margin={{ left: 20, right: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 'bold' }} />
                  <Tooltip />
                  <Bar dataKey="total" radius={[0, 10, 10, 0]} barSize={40}>
                    {chartData.fasilitas.map((e, i) => (
                      <Cell key={i} fill={e.name === 'Baik' ? '#10b981' : '#f87171'} />
                    ))}
                    <LabelList dataKey="total" position="right" style={{ fill: '#334155', fontSize: '14px', fontWeight: 'bold' }} />
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}