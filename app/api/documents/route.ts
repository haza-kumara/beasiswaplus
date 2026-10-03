import { NextResponse } from "next/server"
import { handleError } from "@/lib/api/respond"
import { listDocuments, uploadDocument } from "@/lib/services/documents"

export async function GET() {
  try { return NextResponse.json(await listDocuments()) } catch (e) { return handleError(e) }
}
export async function POST(req: Request) {
  try { return NextResponse.json(await uploadDocument(await req.formData()), { status: 201 }) }
  catch (e) { return handleError(e) }
}