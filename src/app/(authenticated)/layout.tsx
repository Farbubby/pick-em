import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import AuthComponent from "@/components/auth-context";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("user-token")?.value;

  if (!token) {
    redirect("/");
  }

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("token", token);

  if (error || !data) {
    redirect("/");
  }

  return (
    <>
      <AuthComponent userId={data[0].id}>{children}</AuthComponent>
    </>
  );
}
