export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string }

// Backend mengembalikan { error: string } atau { error: zod.flatten() }.
function extractError(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback
  const err = (body as { error?: unknown }).error
  if (typeof err === "string") return err
  if (err && typeof err === "object") {
    const e = err as { formErrors?: string[]; fieldErrors?: Record<string, string[] | undefined> }
    const msgs = [
      ...(e.formErrors ?? []),
      ...Object.values(e.fieldErrors ?? {}).flatMap((v) => v ?? []),
    ]
    if (msgs.length > 0) return msgs.join(". ")
  }
  return fallback
}

export async function apiRequest<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, init)
    const body = await res.json().catch(() => null)
    if (!res.ok) return { ok: false, error: extractError(body, "Permintaan gagal. Coba lagi.") }
    return { ok: true, data: body as T }
  } catch {
    return { ok: false, error: "Tidak bisa terhubung ke server. Periksa koneksimu." }
  }
}

export function jsonInit(method: string, body: unknown): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
}
