import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const { searchParams } = url;

  let link = searchParams.get("link");
  link = `${process.env.NEXT_PUBLIC_URL}${link}`;

  const { data } = await supabase.from("link").select("*").eq("url", link);

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
