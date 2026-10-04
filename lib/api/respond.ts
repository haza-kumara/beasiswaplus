import { NextResponse } from "next/server";

export function handleError(error: any) {
  console.error("API Error:", error);
  const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server";
  return NextResponse.json({ error: message }, { status: 500 });
}