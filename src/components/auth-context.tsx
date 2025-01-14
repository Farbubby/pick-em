"use client";

import { createContext } from "react";

export const AuthContext = createContext({ userId: "" });

export default function AuthComponent({
  children,
  userId,
}: Readonly<{
  children: React.ReactNode;
  userId: string;
}>) {
  return (
    <AuthContext.Provider value={{ userId }}>{children}</AuthContext.Provider>
  );
}
