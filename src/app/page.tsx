"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const signUp = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());
      const res = await fetch("/api/sign-up", {
        method: "POST",
        body: JSON.stringify({
          data,
        }),
      });
      return (await res.json()) as {
        status: number;
        result: {
          error?: {
            fieldError?: { email?: string; password?: string };
          };
          success?: string;
        };
      };
    },
  });

  const signIn = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());
      const res = await fetch("/api/sign-in", {
        method: "POST",
        body: JSON.stringify({
          data,
        }),
      });
      return (await res.json()) as {
        status: number;
        result: {
          error?: {
            fieldError?: { email?: string; password?: string };
            server?: string;
          };
          success?: string;
        };
      };
    },
  });

  if (signUp.data?.result.success) {
    console.log("Sign up successful");
  }

  if (signIn.data?.result.success) {
    console.log("Sign in successful");
  }

  return (
    <>
      <div className="h-screen flex flex-row items-center justify-center gap-10">
        <Dialog>
          <DialogTrigger>
            <div className="bg-white px-4 py-2 rounded-lg font-bold hover:bg-accent shadow-lg">
              Sign up
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign up</DialogTitle>
              <DialogDescription>
                Create a new account to get started.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                signUp.mutate(new FormData(e.target as HTMLFormElement));
              }}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="text" />
                {signUp.data?.result.error?.fieldError?.email && (
                  <div className="text-sm text-red-500">
                    {signUp.data.result.error.fieldError.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="text" />
                {signUp.data?.result.error?.fieldError?.password && (
                  <div className="text-sm text-red-500">
                    {signUp.data.result.error.fieldError.password}
                  </div>
                )}
              </div>
              {signUp.data?.result.success && (
                <div className="text-sm text-green-500">
                  {signUp.data.result.success}
                </div>
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signUp.isPending}>
                  {signUp.isPending ? "Signing up..." : "Sign Up"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <div className="bg-white px-4 py-2 rounded-lg font-bold hover:bg-accent shadow-lg">
              Sign in
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign in</DialogTitle>
              <DialogDescription>
                Sign in to your account to continue.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                signIn.mutate(new FormData(e.target as HTMLFormElement));
              }}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
                {signIn.data?.result.error?.fieldError?.email && (
                  <div className="text-sm text-red-500">
                    {signIn.data.result.error.fieldError.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" />
                {signIn.data?.result.error?.fieldError?.password && (
                  <div className="text-sm text-red-500">
                    {signIn.data.result.error.fieldError.password}
                  </div>
                )}
              </div>
              {signIn.data?.result.error?.server && (
                <div className="text-sm text-red-500">
                  {signIn.data.result.error.server}
                </div>
              )}
              {signIn.data?.result.success && (
                <div className="text-sm text-green-500">
                  {signIn.data.result.success}
                </div>
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signIn.isPending}>
                  {signUp.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
