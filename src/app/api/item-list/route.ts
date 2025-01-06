import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const schema = z.record(z.string().min(1, "One of the fields is empty"));

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    data: { [key: string]: FormDataEntryValue };
  };

  const { data } = body;

  const input = schema.safeParse(data);

  if (!input.success) {
    const error = input.error.flatten();
    console.log(error);

    return NextResponse.json({
      status: 400,
      result: {
        error: "One of the fields is empty",
      },
    });
  }

  const token = crypto.getRandomValues(new Uint8Array(16)).join("");
  const link = `http://localhost:3000/room/${token}`;

  return NextResponse.json({
    status: 200,
    result: {
      success: "Success",
      link,
    },
  });
}
