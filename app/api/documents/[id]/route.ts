// app/api/documents/[id]/route.ts
import { NextResponse } from "next/server"
import { handleError } from "@/lib/api/respond"
import { getDocumentUrl, deleteDocument } from "@/lib/services/documents"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  try { return NextResponse.json(await getDocumentUrl((await params).id)) } catch (e) { return handleError(e) }
}
export async function DELETE(_: Request, { params }: Ctx) {
  try { return NextResponse.json(await deleteDocument((await params).id)) } catch (e) { return handleError(e) }
}