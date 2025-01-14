import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const addSchema = z.object({
  item: z.string().min(1, "One of the fields is empty"),
  amount: z.string().min(1, "One of the fields is empty"),
  room: z.string(),
});

const deleteSchema = z.object({
  item: z.string().min(1, "One of the fields is empty"),
  room: z.string(),
});

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    data: { [key: string]: string };
  };

  const { data } = body;

  const input = addSchema.safeParse(data);

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

  const { item, amount, room } = data;

  const existingItem = await supabase
    .from("item")
    .select("*")
    .eq("name", item)
    .eq("room", room);

  if ((existingItem.data?.length as number) > 0) {
    return NextResponse.json({
      status: 400,
      result: {
        error: "Item already exists",
      },
    });
  }

  if (isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
    return NextResponse.json({
      status: 400,
      result: {
        error: "Amount is invalid or less than 0",
      },
    });
  }

  await supabase.from("item").insert([{ name: item, amount, room }]);

  return NextResponse.json({
    status: 200,
    result: {
      success: "Item added",
    },
  });
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as {
    data: { [key: string]: string };
  };

  const { data } = body;

  const input = deleteSchema.safeParse(data);

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

  const { item, room } = data;

  const existingItem = await supabase
    .from("item")
    .select("*")
    .eq("name", item)
    .eq("room", room);

  if ((existingItem.data?.length as number) <= 0) {
    return NextResponse.json({
      status: 400,
      result: {
        error: "Item not found",
      },
    });
  }

  await supabase.from("item").delete().eq("name", item).eq("room", room);

  return NextResponse.json({
    status: 200,
    result: {
      success: "Item deleted",
    },
  });
}
