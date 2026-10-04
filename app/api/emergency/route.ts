import { NextResponse } from "next/server"
import { handleError } from "@/lib/api/respond"
import { createEmergencyRequest, listMyEmergencyRequests, listEmergencyQueue } from "@/lib/services/emergency"

export async function GET(req: Request) {
  try {
    const queue = new URL(req.url).searchParams.get("queue") === "1"
    return NextResponse.json(queue ? await listEmergencyQueue() : await listMyEmergencyRequests())
  } catch (e) { return handleError(e) }
}
export async function POST(req: Request) {
  try { return NextResponse.json(await createEmergencyRequest(await req.json()), { status: 201 }) }
  catch (e) { return handleError(e) }
}