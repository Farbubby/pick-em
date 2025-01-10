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

  const token = crypto.getRandomValues(new Uint8Array(16)).join("");
  const hashedPassword = await argon2.hash(password);

  await supabase.from("user").insert([
    {
      email,
      password: hashedPassword,
      token,
    },
  ]);

  (await cookies()).set("user-token", token);

  return NextResponse.json({
    status: 200,
    result: {
      success: "Sign up successful",
    },
  });
}
