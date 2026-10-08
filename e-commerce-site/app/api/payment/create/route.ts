import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  console.log("Payment create request:", body);

  return NextResponse.json({
    message: "Payment create route working",
  });
}