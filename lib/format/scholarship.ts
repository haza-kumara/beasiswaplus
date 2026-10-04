import type { ScholarshipRequirement } from "@/types/scholarship"

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "Tanpa batas waktu"
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  )
}

/** Selisih hari ke deadline. Negatif = sudah lewat. null = tanpa deadline. */
export function daysLeft(iso: string | null | undefined): number | null {
  if (!iso) return null
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
}

const OP: Record<string, string> = {
  "<": "di bawah",
  "<=": "maksimal",
  ">": "di atas",
  ">=": "minimal",
  "=": "tepat",
  "!=": "bukan",
}

/** Ubah satu baris scholarship_requirements menjadi kalimat yang mudah dibaca. */
export function describeRequirement(r: ScholarshipRequirement): string {
  const { requirement_type: type, operator: op, value } = r
  const opText = OP[op] ?? op

  switch (type) {
    case "first_generation": {
      const yes = (value === "true") === (op !== "!=")
      return yes ? "Mahasiswa first-generation" : "Bukan mahasiswa first-generation"
    }
    case "orphan_status": {
      const yes = (value === "true") === (op !== "!=")
      return yes ? "Yatim atau piatu" : "Bukan yatim atau piatu"
    }
    case "household_income": {
      const n = Number(value)
      return `Pendapatan keluarga ${opText} ${Number.isNaN(n) ? value : formatRupiah(n)} per bulan`
    }
    case "gpa":
      return `IPK ${opText} ${value}`
    case "semester":
      return `Semester ${opText} ${value}`
    case "study_program":
      return op === "!=" ? `Bukan program studi ${value}` : `Program studi: ${value}`
    case "university":
      return op === "!=" ? `Bukan dari universitas ${value}` : `Universitas: ${value}`
    case "required_document":
      return `Dokumen ${value.toUpperCase()}`
    default:
      return `${type} ${op} ${value}`
  }
}
