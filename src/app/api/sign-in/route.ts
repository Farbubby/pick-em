import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import argon2 from "argon2";

const schema = z.object({
  email: z.string().email().min(1, "This field is empty"),
  password: z.string().min(1, "This field is empty"),
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
        error: {
          fieldError: {
            email: error.fieldErrors.email?.[0],
            password: error.fieldErrors.password?.[0],
          },
        },
      },
    });
  }

  const { email, password } = data;

  const user = await supabase.from("user").select("*").eq("email", email);

  if (user.data?.length === 0) {
    return NextResponse.json({
      status: 400,
      result: {
        error: {
          server: "Email or password is incorrect",
        },
      },
    });
  }

  const samePassword = await argon2.verify(user.data?.[0].password, password);

  if (!samePassword) {
    return NextResponse.json({
      status: 400,
      result: {
        error: {
          server: "Email or password is incorrect",
        },
      },
    });
  }

  const token = crypto.getRandomValues(new Uint8Array(16)).join("");

  await supabase
    .from("user")
    .update({
      token,
    })
    .eq("email", email);

  (await cookies()).set("user-token", token);

  return NextResponse.json({
    status: 200,
    result: {
      success: "Sign in successful",
    },
  });
}
