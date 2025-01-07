"use client";

import { useQuery } from "@tanstack/react-query";

export default function Home({ room, item }: { room: string; item: string }) {
  const { data } = useQuery({
    queryKey: ["contribution", room, item],
    queryFn: async () => {
      const res = await fetch(`/api/contribution?room=${room}&item=${item}`);
      const data = (await res.json()) as {
        status: number;
        result: {
          data: {
            id: string;
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
      {data?.map((item, index) => {
        return (
          <div key={index}>
            <h1>
              {item.name}{" "}
              <span className="text-blue-500">(x{item.amount})</span>
            </h1>
          </div>
        );
      })}
    </>
  );
}
