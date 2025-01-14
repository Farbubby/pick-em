"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "@/components/auth-context";

export default function Home({ room, item }: { room: string; item: string }) {
  const { userId } = useContext(AuthContext);

  const { data } = useQuery({
    queryKey: ["contribution", room, item],
    queryFn: async () => {
      const res = await fetch(`/api/contribution?room=${room}&item=${item}`);
      const data = (await res.json()) as {
        status: number;
        result: {
          data: {
            id: string;
            user_id: string;
            name: string;
            item: string;
            amount: string;
            room: string;
          }[];
        };
      };

      return data.result.data;
    },
  });

  if ((data?.length as number) <= 0) {
    return <div>No one so far</div>;
  }

  return (
    <>
      {data?.map((person, index) => {
        return (
          <div key={index}>
            <h1>
              {person.user_id === userId ? (
                <div className="text-green-500">
                  {person.name} - x{person.amount} (You)
                </div>
              ) : (
                <div className="text-red-600">
                  {person.name} - x{person.amount}
                </div>
              )}
            </h1>
          </div>
        );
      })}
    </>
  );
}
