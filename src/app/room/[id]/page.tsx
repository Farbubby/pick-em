"use client";

import { useEffect, useState } from "react";

export default function Home({ params }: { params: Promise<{ id: string }> }) {
  const [list, setList] = useState<{
    id: string;
    items: { name: string; amount: string }[];
  } | null>(null);

  useEffect(() => {
    async function getId() {
      const id = (await params).id;

      const response = await fetch(`/api/item-list?id=${id}`);

      const val = (await response.json()) as {
        status: number;
        result: {
          error?: string;
          success?: string;
          data?: {
            id: string;
            items: { name: string; amount: string }[];
          };
        };
      };

      if (val.result.data) {
        setList(val.result.data);
      }
    }
    getId();
  }, [params]);

  const listElement = list?.items.map((item, index) => (
    <div key={index} className="flex flex-row gap-4">
      <div>{item.name}</div>
      <div>{item.amount}</div>
    </div>
  ));

  return <>{listElement}</>;
}
