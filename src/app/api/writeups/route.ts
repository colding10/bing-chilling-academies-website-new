import { NextResponse } from "next/server"
import { getAllWriteups } from "@/lib/writeups"

export async function GET() {
  const writeups = getAllWriteups()
  return NextResponse.json(writeups)
}
