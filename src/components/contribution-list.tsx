"use client";

import { useEffect, useState } from "react";

export default function Home({ room, item }: { room: string; item: string }) {
  const [list, setList] = useState<
    { id: string; name: string; item: string; amount: string; room: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
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

      if (data.result.data) {
        setList(data.result.data);
      }
    };

    fetchData();
  }, [room, item]);

  if (list.length <= 0) {
    return <div>No one so far</div>;
  }

  return (
    <>
      {list.map((item, index) => {
        return (
          <div key={index}>
            <h1>{item.name}</h1>
          </div>
        );
      })}
    </>
  );
}
