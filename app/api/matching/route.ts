import { NextResponse } from "next/server"
import { getMatchesForUser } from "@/lib/services/matching"
import { ServiceError } from "@/lib/services/scholarships"

export async function GET() {
  try {
    return NextResponse.json({ items: await getMatchesForUser() })
  } catch (e) {
    if (e instanceof ServiceError)
      return NextResponse.json({ error: e.message }, { status: e.status })
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}