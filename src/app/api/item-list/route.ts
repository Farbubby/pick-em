import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { addItems } from "@/lib/operations";

const schema = z.record(z.string().min(1, "One of the fields is empty"));

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    data: { [key: string]: string };
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

  const num = Object.keys(data).length / 2;
  const items = [];

  for (let i = 0; i < num; i++) {
    items[i] = {
      name: data[`item-${i}`],
      amount: data[`amount-${i}`],
    };
  }

  await addItems({ id: token, items });

  return NextResponse.json({
    status: 200,
    result: {
      success: "Success",
      link,
    },
  });
}
