"use client";

import { useEffect, useState } from "react";

export default function Home({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const [list, setList] = useState<
    {
      id: string;
      name: string;
      amount: string;
      room: string;
    }[]
  >([]);

  useEffect(() => {
    async function getId() {
      const room = (await params).room;

      const res = await fetch(`/api/item-list?room=${room}`);

      const response = (await res.json()) as {
        status: number;
        result: {
          error?: string;
          success?: string;
          data: {
            id: string;
            name: string;
            amount: string;
            room: string;
          }[];
        };
      };

      if (response.result.data) {
        setList(response.result.data);
      }
    }
    getId();
  }, [params]);

  if (list.length === 0) {
    return <div>Loading...</div>;
  }

  console.log(list, 1234);

  const listElement = list.map((item, index) => (
    <div key={index} className="flex flex-row gap-4">
      <div>{item.name}</div>
      <div>{item.amount}</div>
    </div>
  ));

  return <>{listElement}</>;
}
