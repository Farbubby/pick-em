import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const addSchema = z.object({
  item: z.string().min(1, "One of the fields is empty"),
  amount: z.string().min(1, "One of the fields is empty"),
  name: z.string().min(1, "One of the fields is empty"),
  room: z.string(),
  user_id: z.string(),
});

const deleteSchema = z.object({
  item: z.string().min(1, "One of the fields is empty"),
  name: z.string().min(1, "One of the fields is empty"),
  room: z.string(),
  user_id: z.string(),
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

  if (isNaN(parseInt(data.amount)) || parseInt(data.amount) <= 0) {
    return NextResponse.json({
      status: 400,
      result: {
        error: "Amount is invalid or less than 0",
      },
    });
  }

  const diff = parseInt(item.data?.[0].amount) - parseInt(data.amount);

  if (diff < 0) {
    return NextResponse.json({
      status: 400,
      result: {
        error: "Can't contribute more than the item amount currently",
      },
    });
  }

  const person = await supabase
    .from("contributor")
    .select("*")
    .eq("name", data.name)
    .eq("room", data.room)
    .eq("item", data.item);

  if ((person.data?.length as number) > 0) {
    return NextResponse.json({
      status: 400,
      result: {
        error: "Person already exists. Pick a different name",
      },
    });
  }

  await supabase.from("contributor").insert([
    {
      user_id: data.user_id,
      name: data.name,
      item: data.item,
      amount: data.amount,
      room: data.room,
    },
  ]);

  await supabase
    .from("item")
    .update({ amount: diff })
    .eq("name", data.item)
    .eq("room", data.room);

  return NextResponse.json({
    status: 200,
    result: {
      success: "Success",
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

  const item = await supabase
    .from("item")
    .select("*")
    .eq("room", data.room)
    .eq("name", data.item);

  if ((item.data?.length as number) <= 0) {
    return NextResponse.json({
      status: 400,
      result: {
        error: "Item or person not found",
      },
    });
  }

  const person = await supabase
    .from("contributor")
    .select("*")
    .eq("user_id", data.user_id)
    .eq("room", data.room)
    .eq("name", data.name)
    .eq("item", data.item);

  if ((person.data?.length as number) <= 0) {
    return NextResponse.json({
      status: 400,
      result: {
        error: "Item or person not found",
      },
    });
  }

  const total =
    parseInt(item.data?.[0].amount) + parseInt(person.data?.[0].amount);

  await supabase
    .from("item")
    .update({ amount: total })
    .eq("name", data.item)
    .eq("room", data.room);

  await supabase
    .from("contributor")
    .delete()
    .eq("user_id", data.user_id)
    .eq("room", data.room)
    .eq("name", data.name)
    .eq("item", data.item);

  return NextResponse.json({
    status: 200,
    result: {
      success: "Success",
    },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const { searchParams } = url;

  const item = searchParams.get("item");
  const room = searchParams.get("room");
  const user_id = searchParams.get("user_id");

  if (user_id) {
    const { data } = await supabase
      .from("contributor")
      .select("*")
      .eq("user_id", user_id)
      .eq("room", room)
      .eq("item", item);

    console.log(data);

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

  const { data } = await supabase
    .from("contributor")
    .select("*")
    .eq("item", item)
    .eq("room", room);

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
