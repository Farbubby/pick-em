import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  item: z.string().min(1, "One of the fields is empty"),
  amount: z.string().min(1, "One of the fields is empty"),
  name: z.string().min(1, "One of the fields is empty"),
  room: z.string(),
});

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

  const item = await supabase
    .from("item")
    .select("*")
    .eq("room", data.room)
    .eq("name", data.item);

  if ((item.data?.length as number) <= 0) {
    return NextResponse.json({
      status: 400,
      result: {
        error: "Item not found",
      },
    });
  }

  await supabase.from("person").insert([
    {
      name: data.name,
      item: data.item,
      amount: data.amount,
      room: data.room,
    },
  ]);

  return NextResponse.json({
    status: 200,
    result: {
      success: "Success",
    },
  });
}
