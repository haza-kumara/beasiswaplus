export type Tone = "neutral" | "info" | "success" | "warning" | "danger"

export type ApplicationInfo = {
  label: string
  /** 0 Disiapkan, 1 Terkirim, 2 Ditinjau, 3 Keputusan */
  phase: 0 | 1 | 2 | 3
  tone: Tone
  withdrawable: boolean
}

// Mendukung dua kosakata: panduan tim (interested/preparing/ready/accepted)
// dan backend feat/be-application (draft/under_review/approved).
export function applicationInfo(status: string): ApplicationInfo {
  switch (status) {
    case "interested": return { label: "Diminati", phase: 0, tone: "neutral", withdrawable: true }
    case "draft": return { label: "Draf", phase: 0, tone: "neutral", withdrawable: true }
    case "preparing": return { label: "Disiapkan", phase: 0, tone: "neutral", withdrawable: true }
    case "ready": return { label: "Siap dikirim", phase: 0, tone: "info", withdrawable: true }
    case "submitted": return { label: "Terkirim", phase: 1, tone: "info", withdrawable: true }
    case "under_review": return { label: "Sedang ditinjau", phase: 2, tone: "warning", withdrawable: false }
    case "approved":
    case "accepted": return { label: "Diterima", phase: 3, tone: "success", withdrawable: false }
    case "rejected": return { label: "Ditolak", phase: 3, tone: "danger", withdrawable: false }
    default: return { label: status, phase: 0, tone: "neutral", withdrawable: false }
  }
}

export function emergencyInfo(status: string): { label: string; tone: Tone; open: boolean } {
  switch (status) {
    case "submitted": return { label: "Diajukan", tone: "info", open: true }
    case "in_review":
    case "under_review": return { label: "Sedang ditinjau", tone: "warning", open: true }
    case "approved": return { label: "Disetujui", tone: "success", open: false }
    case "disbursed": return { label: "Dana dicairkan", tone: "success", open: false }
    case "rejected": return { label: "Ditolak", tone: "danger", open: false }
    default: return { label: status, tone: "neutral", open: false }
  }
}

export function priorityLabel(p: string): string {
  return p === "high" ? "Prioritas tinggi" : "Prioritas biasa"
}
