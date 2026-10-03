// app/api/scholarships/route.ts
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { getScholarships, createScholarship, ServiceError } from "@/lib/services/scholarships"

function handle(e: unknown) {
  if (e instanceof ZodError) return NextResponse.json({ error: e.flatten() }, { status: 422 })
  if (e instanceof ServiceError) return NextResponse.json({ error: e.message }, { status: e.status })
  return NextResponse.json({ error: "Internal error" }, { status: 500 })
}

export async function GET(req: Request) {
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams)
    return NextResponse.json(await getScholarships(params))
  } catch (e) { return handle(e) }
}

export async function POST(req: Request) {
  try {
    return NextResponse.json(await createScholarship(await req.json()), { status: 201 })
  } catch (e) { return handle(e) }
}