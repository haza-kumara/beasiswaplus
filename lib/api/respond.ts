import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { ServiceError } from "@/lib/services/scholarships"

export function handleError(e: unknown) {
  if (e instanceof ZodError) return NextResponse.json({ error: e.flatten() }, { status: 422 })
  if (e instanceof ServiceError) return NextResponse.json({ error: e.message }, { status: e.status })
  console.error(e)
  return NextResponse.json({ error: "Internal error" }, { status: 500 })
}
