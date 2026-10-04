export const DOC_TYPES = ["ktm", "kk", "sktm", "ktp", "transcript"] as const
export type DocTypeKey = (typeof DOC_TYPES)[number]

export const DOC_LABEL: Record<string, string> = {
  ktm: "KTM",
  kk: "Kartu Keluarga (KK)",
  sktm: "SKTM",
  ktp: "KTP",
  transcript: "Transkrip nilai",
}

export const DOC_SHORT: Record<string, string> = {
  ktm: "KTM",
  kk: "KK",
  sktm: "SKTM",
  ktp: "KTP",
  transcript: "Transkrip",
}

export const DOC_HINT: Record<string, string> = {
  ktm: "Kartu tanda mahasiswa yang masih berlaku.",
  kk: "Dipakai untuk memverifikasi jumlah anggota keluarga.",
  sktm: "Surat keterangan tidak mampu dari kelurahan atau desa.",
  ktp: "Kartu tanda penduduk.",
  transcript: "Transkrip nilai terbaru.",
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}
