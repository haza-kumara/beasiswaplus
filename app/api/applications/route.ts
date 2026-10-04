import { NextResponse } from "next/server"
import { handleError } from "@/lib/api/respond"
import { createApplication, listMyApplications } from "@/lib/services/applications"

export async function GET() {
  try { return NextResponse.json(await listMyApplications()) } catch (e) { return handleError(e) }
}
export async function POST(req: Request) {
  try { return NextResponse.json(await createApplication(await req.json()), { status: 201 }) }
  catch (e) { return handleError(e) }
}