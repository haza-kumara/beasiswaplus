import { NextResponse } from "next/server"
import { handleError } from "@/lib/api/respond"
import { getEmergencyRequestById, updateEmergencyStatus } from "@/lib/services/emergency"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  try { return NextResponse.json(await getEmergencyRequestById((await params).id)) } catch (e) { return handleError(e) }
}
export async function PATCH(req: Request, { params }: Ctx) {
  try { return NextResponse.json(await updateEmergencyStatus((await params).id, await req.json())) }
  catch (e) { return handleError(e) }
}