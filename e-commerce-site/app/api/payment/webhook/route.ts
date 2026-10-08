import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  console.log("Safepay webhook received:", body);

  return NextResponse.json({
    received: true,
  });
}