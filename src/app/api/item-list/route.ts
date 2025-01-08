import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

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
  const link = `${process.env.NEXT_PUBLIC_URL}/room/${token}`;

  const num = Object.keys(data).length / 2;
  const items = [];

  for (let i = 0; i < num; i++) {
    if (
      isNaN(parseInt(data[`amount-${i}`])) ||
      parseInt(data[`amount-${i}`]) <= 0
    ) {
      return NextResponse.json({
        status: 400,
        result: {
          error: "Some of the inputs are invalid or less than 0",
        },
      });
    }

    items[i] = {
      name: data[`item-${i}`],
      amount: data[`amount-${i}`],
      room: token,
    };
  }

  await supabase.from("item").insert([...items]);

  return NextResponse.json({
    status: 200,
    result: {
      success: "Success",
      link,
    },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const { searchParams } = url;

  const room = searchParams.get("room");

  const { data } = await supabase.from("item").select("*").eq("room", room);

  if (!data) {
    return NextResponse.json({
      status: 404,
      result: {
        error: "Not found",
      },
    });
  }

  return NextResponse.json({
    status: 200,
    result: {
      success: "Success",
      data,
    },
  });
}
