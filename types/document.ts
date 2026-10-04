export type DocumentType = "ktm" | "kk" | "sktm" | "ktp" | "transcript"
export type UserDocument = {
  id: string; user_id: string; document_type: DocumentType
  file_name: string; file_path: string; mime_type: string; file_size: number
  created_at: string; updated_at: string
}
export type DocumentListResponse = {
  items: UserDocument[]
  readiness: { percent: number; missing: DocumentType[] }
}
