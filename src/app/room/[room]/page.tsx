"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ContributionList from "@/components/contribution-list";

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
  const [room, setRoom] = useState("");
  const [success1, setSuccess1] = useState("");
  const [error1, setError1] = useState("");
  const [success2, setSuccess2] = useState("");
  const [error2, setError2] = useState("");

  const handleAdd = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    data["room"] = room;

    const res = await fetch("/api/contribution", {
      method: "POST",
      body: JSON.stringify({
        data,
      }),
    });

    const response = (await res.json()) as {
      status: number;
      result: { error?: string; success?: string };
    };

    if (response.result.error) {
      setError1(response.result.error);
      setSuccess1("");
      console.log(response.result.error);
      return;
    }

    if (response.result.success) {
      setSuccess1(response.result.success);
      console.log(response.result.success);
    }

    setError1("");
  };

  const handleDelete = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    data["room"] = room;

    const res = await fetch("/api/contribution", {
      method: "DELETE",
      body: JSON.stringify({
        data,
      }),
    });

    const response = (await res.json()) as {
      status: number;
      result: { error?: string; success?: string };
    };

    if (response.result.error) {
      setError2(response.result.error);
      setSuccess2("");
      console.log(response.result.error);
      return;
    }

    if (response.result.success) {
      setSuccess2(response.result.success);
      console.log(response.result.success);
    }

    setError2("");
  };

  useEffect(() => {
    async function getId() {
      const room = (await params).room;
      setRoom(room);

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
        <AccordionContent className="font-bold text-base px-4 flex flex-col gap-2">
          <div className="italic border-b">People bringing it</div>
          <div className="text-sm grid grid-rows-3 grid-flow-col gap-2">
            <ContributionList room={room} item={item.name} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ));

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col w-full mt-20">{listElement}</div>
        <div className="w-full flex flex-row justify-center gap-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Want to bring something?</DialogTitle>
                <DialogDescription>
                  Add how much of the item you want to bring and add your name.
                </DialogDescription>
              </DialogHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handleAdd(formData);
                }}>
                <div className="w-full flex flex-row gap-5">
                  <div className="flex flex-col gap-2">
                    <Label>Item</Label>
                    <Input
                      id={`item`}
                      name={`item`}
                      type="text"
                      placeholder="Potato"
                      onChange={() => {
                        setError1("");
                        setSuccess1("");
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Amount</Label>
                    <Input
                      id={`amount`}
                      name={`amount`}
                      type="number"
                      placeholder="10"
                      onChange={() => {
                        setError1("");
                        setSuccess1("");
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex flex-col gap-2">
                    <Label>Name</Label>
                    <Input
                      id={`name`}
                      name={`name`}
                      type="text"
                      placeholder="Person"
                      onChange={() => {
                        setError1("");
                        setSuccess1("");
                      }}
                    />
                  </div>
                </div>
                {error1 && (
                  <div className="text-red-400 font-bold text-center">
                    {error1}
                  </div>
                )}
                {success1 && (
                  <div className="text-green-400 font-bold text-center">
                    {success1}
                  </div>
                )}
                <DialogFooter>
                  <Button type="submit">Add it</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Remove</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Don't want to bring it anymore?</DialogTitle>
                <DialogDescription>
                  Mention the item you don't want to bring anymore and add your
                  name.
                </DialogDescription>
              </DialogHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handleDelete(formData);
                }}>
                <div>
                  <div className="flex flex-col gap-2">
                    <Label>Item</Label>
                    <Input
                      id={`item`}
                      name={`item`}
                      type="text"
                      placeholder="Potato"
                      onChange={() => {
                        setError2("");
                        setSuccess2("");
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex flex-col gap-2">
                    <Label>Name</Label>
                    <Input
                      id={`name`}
                      name={`name`}
                      type="text"
                      placeholder="Person"
                      onChange={() => {
                        setError2("");
                        setSuccess2("");
                      }}
                    />
                  </div>
                </div>
                {error2 && (
                  <div className="text-red-400 font-bold text-center">
                    {error2}
                  </div>
                )}
                {success2 && (
                  <div className="text-green-400 font-bold text-center">
                    {success2}
                  </div>
                )}
                <DialogFooter>
                  <Button type="submit">Remove it</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
