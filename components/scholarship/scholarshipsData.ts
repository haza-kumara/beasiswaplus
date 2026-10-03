export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  match: number;
  deadline: string;
  amount: string;
  tags: string[];
  color: "blue" | "lavender" | "mint" | "peach";
  category: string;
  description?: string;
  requirements?: { text: string; met: boolean }[];
  documents?: { name: string; status: "ready" | "missing" }[];
}

export const scholarships: Scholarship[] = [
  {
    id: "1",
    title: "Beasiswa Bank Indonesia 2026",
    provider: "Bank Indonesia",
    match: 95,
    deadline: "30 Nov 2026",
    amount: "Rp 12.000.000/tahun",
    tags: ["1st Gen", "Ekonomi Mikro"],
    color: "blue",
    category: "Need-Based",
    description: "Program beasiswa Bank Indonesia bagi mahasiswa berprestasi dari keluarga berpendapatan rendah guna mencetak calon pemimpin bangsa masa depan.",
    requirements: [
      { text: "IPK minimal 3.0", met: true },
      { text: "Mahasiswa aktif semester 3+", met: true },
      { text: "Pendapatan keluarga < Rp 3.000.000/bulan", met: true },
      { text: "Belum menerima beasiswa lain", met: true },
      { text: "Surat rekomendasi dosen", met: true },
    ],
    documents: [
      { name: "Kartu Keluarga", status: "ready" },
      { name: "SKTM", status: "ready" },
      { name: "Transkrip Nilai", status: "ready" },
      { name: "Surat Rekomendasi", status: "ready" },
    ],
  },
  {
    id: "2",
    title: "Beasiswa Tanoto Foundation",
    provider: "Tanoto Foundation",
    match: 88,
    deadline: "15 Des 2026",
    amount: "Rp 7.500.000/semester",
    tags: ["Daerah 3T", "IPK ≥ 3.0"],
    color: "lavender",
    category: "Need-Based",
    description: "Beasiswa TELADAN oleh Tanoto Foundation untuk mengembangkan calon pemimpin berkarakter unggul dengan dukungan biaya kuliah penuh dan pelatihan kepemimpinan.",
    requirements: [
      { text: "IPK minimal 3.0", met: true },
      { text: "Aktif dalam organisasi kampus", met: true },
      { text: "Berasal dari daerah prioritas / 3T", met: true },
      { text: "Menulis esai motivasi", met: false },
    ],
    documents: [
      { name: "Kartu Keluarga", status: "ready" },
      { name: "Transkrip Nilai", status: "ready" },
      { name: "Esai Motivasi", status: "missing" },
    ],
  },
  {
    id: "3",
    title: "CSR Telkom Scholarship",
    provider: "PT Telkom Indonesia",
    match: 82,
    deadline: "20 Jan 2027",
    amount: "Rp 5.000.000/semester",
    tags: ["STEM", "Ekonomi Lemah"],
    color: "mint",
    category: "Korporat",
    description: "Dukungan penuh program CSR Telkom untuk mahasiswa rumpun informatika, telekomunikasi, dan teknik elektro dari keluarga pra-sejahtera.",
    requirements: [
      { text: "Jurusan Informatika / Teknik Komputer / Elektro", met: true },
      { text: "IPK minimal 3.25", met: true },
      { text: "Keluarga pemegang kartu KIP/KPS", met: true },
    ],
    documents: [
      { name: "KTP & Kartu Mahasiswa", status: "ready" },
      { name: "Kartu KIP", status: "ready" },
      { name: "Transkrip Nilai", status: "ready" },
    ],
  },
  {
    id: "4",
    title: "Beasiswa Djarum Plus",
    provider: "Djarum Foundation",
    match: 76,
    deadline: "28 Feb 2027",
    amount: "Rp 10.000.000/tahun",
    tags: ["Prestasi", "Aktif Organisasi"],
    color: "peach",
    category: "Prestasi",
  },
  {
    id: "5",
    title: "Beasiswa LPDP Reguler",
    provider: "Kementerian Keuangan",
    match: 71,
    deadline: "30 Mar 2027",
    amount: "Full Funded",
    tags: ["S2/S3", "Penelitian"],
    color: "blue",
    category: "Riset",
  },
  {
    id: "6",
    title: "Beasiswa Unggulan Kemendikbud",
    provider: "Kemendikbudristek",
    match: 68,
    deadline: "15 Apr 2027",
    amount: "Rp 8.000.000/semester",
    tags: ["Prestasi Akademik"],
    color: "lavender",
    category: "Prestasi",
  },
  {
    id: "7",
    title: "Beasiswa Yayasan Cinta Anak Bangsa",
    provider: "YCAB Foundation",
    match: 84,
    deadline: "10 Nov 2026",
    amount: "Rp 6.000.000/tahun",
    tags: ["1st Gen", "Yatim/Piatu"],
    color: "mint",
    category: "1st Gen",
  },
  {
    id: "8",
    title: "Beasiswa Kaltim Cemerlang",
    provider: "Pemprov Kaltim",
    match: 73,
    deadline: "05 Des 2026",
    amount: "Rp 4.000.000/semester",
    tags: ["Daerah 3T", "Domisili Kaltim"],
    color: "peach",
    category: "Daerah 3T",
  },
];
