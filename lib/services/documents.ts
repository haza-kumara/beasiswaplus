// lib/services/documents.ts
import { getSessionUser } from "@/lib/services/session"
import { ServiceError } from "@/lib/services/scholarships"
import { uploadSchema, READINESS_BASELINE } from "@/lib/validations/document"

const BUCKET = "documents"
const EXT: Record<string, string> = {
  "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png",
}

// MIME dari browser bisa dipalsukan, jadi cek juga byte awal file.
async function matchesSignature(file: File) {
  const h = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  const starts = (...b: number[]) => b.every((v, i) => h[i] === v)
  if (file.type === "application/pdf") return starts(0x25, 0x50, 0x44, 0x46)
  if (file.type === "image/png") return starts(0x89, 0x50, 0x4e, 0x47)
  if (file.type === "image/jpeg") return starts(0xff, 0xd8, 0xff)
  return false
}

export function computeReadiness(owned: string[]) {
  const have = READINESS_BASELINE.filter((t) => owned.includes(t))
  return {
    percent: Math.round((have.length / READINESS_BASELINE.length) * 100),
    missing: READINESS_BASELINE.filter((t) => !owned.includes(t)),
  }
}

export async function listDocuments() {
  const { supabase, user } = await getSessionUser()
  const { data, error } = await supabase
    .from("documents").select("*").eq("user_id", user.id)
    .order("created_at", { ascending: false })
  if (error) throw new ServiceError(500, error.message)
  const items = data ?? []
  return { items, readiness: computeReadiness(items.map((d) => d.document_type)) }
}

export async function uploadDocument(form: FormData) {
  const { type, file } = uploadSchema.parse({ type: form.get("type"), file: form.get("file") })
  if (!(await matchesSignature(file))) throw new ServiceError(422, "Isi file tidak sesuai formatnya")

  const { supabase, user } = await getSessionUser()
  const path = `${user.id}/${type}/${crypto.randomUUID()}.${EXT[file.type]}`

  const { data: old } = await supabase.from("documents")
    .select("id, file_path").eq("user_id", user.id).eq("document_type", type).maybeSingle()

  const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type })
  if (up.error) throw new ServiceError(500, up.error.message)

  const row = {
    user_id: user.id, document_type: type, file_name: file.name.slice(0, 200),
    file_path: path, mime_type: file.type, file_size: file.size,
  }
  const { data, error } = old
    ? await supabase.from("documents").update(row).eq("id", old.id).select().single()
    : await supabase.from("documents").insert(row).select().single()

  if (error) {
    await supabase.storage.from(BUCKET).remove([path])   // rollback file
    throw new ServiceError(400, error.message)
  }
  if (old) await supabase.storage.from(BUCKET).remove([old.file_path])   // buang file lama
  return data
}

export async function getDocumentUrl(id: string) {
  const { supabase } = await getSessionUser()
  const { data: doc } = await supabase.from("documents").select("file_path").eq("id", id).maybeSingle()
  if (!doc) throw new ServiceError(404, "Dokumen tidak ditemukan")
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(doc.file_path, 60)
  if (error) throw new ServiceError(500, error.message)
  return { url: data.signedUrl, expiresIn: 60 }
}

export async function deleteDocument(id: string) {
  const { supabase } = await getSessionUser()
  const { data: doc, error } = await supabase.from("documents")
    .delete().eq("id", id).select("file_path").maybeSingle()
  if (error) throw new ServiceError(400, error.message)
  if (!doc) throw new ServiceError(404, "Dokumen tidak ditemukan")
  await supabase.storage.from(BUCKET).remove([doc.file_path])
  return { id }
}