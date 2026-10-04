import { NextResponse } from "next/server"
import { handleError } from "@/lib/api/respond"
import { getApplicationById, withdrawApplication, updateApplicationStatus } from "@/lib/services/applications"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  try { return NextResponse.json(await getApplicationById((await params).id)) } catch (e) { return handleError(e) }
}
export async function PATCH(req: Request, { params }: Ctx) {
  try { return NextResponse.json(await updateApplicationStatus((await params).id, await req.json())) }
  catch (e) { return handleError(e) }
}
export async function DELETE(_: Request, { params }: Ctx) {
  try { return NextResponse.json(await withdrawApplication((await params).id)) } catch (e) { return handleError(e) }
}