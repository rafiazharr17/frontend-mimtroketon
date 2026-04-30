import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==========================================
// EKSPOR STANDAR (Untuk Data Siswa, Guru, dll)
// ==========================================
export const exportToExcel = (data, filename, title, tahunAjaran, semester) => {
  if (!data || data.length === 0) return;
  
  // Buat Kop Surat
  const aoa = [
    [title],
    [`Tahun Ajaran: ${tahunAjaran}   |   Semester: ${semester}`],
    Object.keys(data[0]) // Ambil nama kolom otomatis dari objek data
  ];

  // Masukkan baris data
  data.forEach(row => {
    aoa.push(Object.values(row));
  });

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  // Merge Cells untuk Judul Kop
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(data[0]).length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: Object.keys(data[0]).length - 1 } }
  ];

  // Lebar kolom otomatis
  const colWidths = Object.keys(data[0]).map(() => ({ wch: 25 }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Laporan");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (headers, data, filename, title, orientation = 'p', tahunAjaran, semester) => {
  const doc = new jsPDF(orientation, 'pt', 'a4'); 
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(16); 
  doc.setFont("helvetica", "bold"); 
  doc.text(title, pageWidth / 2, 40, { align: 'center' });
  
  doc.setFontSize(10); 
  doc.setFont("helvetica", "normal"); 
  doc.setTextColor(100);
  doc.text(`Tahun Ajaran: ${tahunAjaran} | Semester: ${semester}`, pageWidth / 2, 55, { align: 'center' });

  autoTable(doc, {
    head: [headers], body: data, startY: 70, theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5, font: 'helvetica', valign: 'middle', lineColor: [180, 180, 180], lineWidth: 0.5 },
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], halign: 'center' },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });
  doc.save(`${filename}.pdf`);
};

// ==========================================
// EKSPOR KHUSUS JADWAL (Matriks Kotak-Kotak)
// ==========================================
export const exportJadwalSekolahExcel = (dataRows, merges, filename, tahunAjaran, semester) => {
  const aoa = [
    ["JADWAL PELAJARAN MI MUHAMMADIYAH TROKETON"],
    [`Tahun Ajaran: ${tahunAjaran}   |   Semester: ${semester}`],
    ["Kelas", "Jam Ke-", "Waktu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"]
  ];

  dataRows.forEach(r => {
    aoa.push([
      r.isFirst ? r.kelas : "", r.jamKe, r.waktu,
      r.Senin.replace(/\n/g, ' '), r.Selasa.replace(/\n/g, ' '), r.Rabu.replace(/\n/g, ' '),
      r.Kamis.replace(/\n/g, ' '), r.Jumat.replace(/\n/g, ' '), r.Sabtu.replace(/\n/g, ' ')
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  const adjustedMerges = merges.map(m => ({ s: { r: m.s.r + 2, c: m.s.c }, e: { r: m.e.r + 2, c: m.e.c } }));
  adjustedMerges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } });
  adjustedMerges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 8 } });
  worksheet['!merges'] = adjustedMerges;

  worksheet['!cols'] = [{ wch: 12 }, { wch: 8 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Jadwal Induk");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportJadwalSekolahPDF = (dataRows, filename, title, tahunAjaran, semester) => {
  const doc = new jsPDF('l', 'pt', 'a4');
  doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text(title, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(100);
  doc.text(`Tahun Ajaran: ${tahunAjaran} | Semester: ${semester}`, doc.internal.pageSize.getWidth() / 2, 55, { align: 'center' });

  const headers = [["Kelas", "Jam", "Waktu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"]];
  const body = dataRows.map(r => {
    const row = [];
    if (r.isFirst) row.push({ content: r.kelas, rowSpan: r.rowSpan, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [236, 253, 245], textColor: [4, 120, 87] } });
    row.push({ content: r.jamKe, styles: { halign: 'center' } }, { content: r.waktu, styles: { halign: 'center' } }, r.Senin, r.Selasa, r.Rabu, r.Kamis, r.Jumat, r.Sabtu);
    return row;
  });

  autoTable(doc, { head: headers, body: body, startY: 70, theme: 'grid', styles: { fontSize: 8, cellPadding: 4, halign: 'center', valign: 'middle', lineColor: [150, 150, 150], lineWidth: 0.5 }, headStyles: { fillColor: [5, 150, 105], textColor: 255 }, columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 30 }, 2: { cellWidth: 65 } } });
  doc.save(`${filename}.pdf`);
};