"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { parse } from "path";
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

  const listElement = list.map((item, index) => (
    <Accordion
      key={index}
      type="single"
      collapsible
      className="bg-white shadow-md mx-60 px-4">
      <AccordionItem value="lol">
        <AccordionTrigger>
          <div className="font-bold text-xl flex flex-row justify-between w-full px-4">
            <div>{item.name}</div>
            {parseInt(item.amount) > 0 ? (
              <>
                <div>(x{item.amount})</div>
              </>
            ) : (
              <>EMPTY</>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="font-bold text-lg">Hi</AccordionContent>
      </AccordionItem>
    </Accordion>
  ));

  return (
    <>
      <div className="flex flex-col w-full">{listElement}</div>
    </>
  );
}
