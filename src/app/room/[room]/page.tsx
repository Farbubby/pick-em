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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ContributionList from "@/components/contribution-list";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export default function Home({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const queryClient = useQueryClient();

  const [room, setRoom] = useState("");
  const [item, setItem] = useState("");
  const [item2, setItem2] = useState("");
  const [success1, setSuccess1] = useState("");
  const [error1, setError1] = useState("");
  const [success2, setSuccess2] = useState("");
  const [error2, setError2] = useState("");

  const listQuery = useQuery({
    queryKey: ["item-list", room],
    queryFn: async () => {
      const res = await fetch(`/api/item-list?room=${room}`);
      const data = (await res.json()) as {
        status: number;
        result: {
          data: {
            id: string;
            name: string;
            amount: string;
            room: string;
          }[];
        };
      };
      return data.result.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());
      data["room"] = room;
      const res = await fetch("/api/contribution", {
        method: "POST",
        body: JSON.stringify({
          data,
        }),
      });
      return (await res.json()) as {
        status: number;
        result: { error?: string; success?: string };
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contribution", room] });
      queryClient.invalidateQueries({ queryKey: ["item-list", room] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());
      data["room"] = room;
      const res = await fetch("/api/contribution", {
        method: "DELETE",
        body: JSON.stringify({
          data,
        }),
      });
      return (await res.json()) as {
        status: number;
        result: { error?: string; success?: string };
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contribution", room] });
      queryClient.invalidateQueries({ queryKey: ["item-list", room] });
    },
  });

  useEffect(() => {
    async function getRoom() {
      const room = (await params).room;
      setRoom(room);
    }
    getRoom();
  }, [params]);

  if (listQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (listQuery.data?.length === 0) {
    return <div>No items</div>;
  }

  const listElement = listQuery.data?.map((item, index) => (
    <Accordion
      key={index}
      type="single"
      collapsible
      className="bg-white shadow-md px-4">
      <AccordionItem value="lol">
        <AccordionTrigger>
          <div className="font-bold sm:text-xl text-base flex flex-row justify-between w-full px-4">
            <div>{item.name}</div>
            {parseInt(item.amount) > 0 ? (
              <>
                <div>x{item.amount} left</div>
              </>
            ) : (
              <>X</>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="font-bold text-base px-4 flex flex-col gap-2">
          <div className="italic border-b">People bringing it</div>
          <div className="sm:text-sm  text-xs grid grid-rows-3 grid-flow-col gap-2">
            <ContributionList room={room} item={item.name} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ));

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col w-full pt-20 px-10 gap-2">
          <div>{listElement}</div>
          <div className="sm:text-sm text-xs">
            Note: X means you{" "}
            <span className="font-bold underline">can&apos;t</span> further
            contribute to the item
          </div>
        </div>
        <div className="w-full flex flex-row justify-center gap-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] max-w-[325px]">
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
                  formData.append("item", item);
                  addMutation.mutate(formData);

                  if (addMutation.data?.result.error) {
                    setError1(addMutation.data.result.error);
                    setSuccess1("");
                    return;
                  }

                  if (addMutation.data?.result.success) {
                    setSuccess1("Success");
                  }

                  setError1("");
                }}>
                <div className="w-full flex flex-row gap-5">
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Item</Label>
                    <Select
                      onValueChange={(value) => {
                        setItem(value);
                      }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="border-b">Items</SelectLabel>
                          {listQuery.data?.map((item, index) => (
                            <>
                              {parseInt(item.amount) > 0 ? (
                                <SelectItem
                                  key={`option-add-${index}`}
                                  value={item.name}>
                                  {item.name}
                                </SelectItem>
                              ) : (
                                <></>
                              )}
                            </>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Amount</Label>
                    <Input
                      id={`amount`}
                      name={`amount`}
                      type="text"
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
            <DialogContent className="sm:max-w-[450px] max-w-[325px]">
              <DialogHeader>
                <DialogTitle>Don&apos;t want to bring it anymore?</DialogTitle>
                <DialogDescription>
                  Mention the item you don&apos;t want to bring anymore and add
                  your name.
                </DialogDescription>
              </DialogHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  formData.append("item", item2);
                  deleteMutation.mutate(formData);

                  if (deleteMutation.data?.result.error) {
                    setError2(deleteMutation.data.result.error);
                    setSuccess2("");
                    return;
                  }

                  if (deleteMutation.data?.result.success) {
                    setSuccess2(deleteMutation.data.result.success);
                  }

                  setError2("");
                }}>
                <div>
                  <div className="flex flex-col gap-2">
                    <Label>Item</Label>
                    <Select
                      onValueChange={(value) => {
                        setItem2(value);
                      }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="border-b">Items</SelectLabel>
                          {listQuery.data?.map((item, index) => (
                            <>
                              <SelectItem
                                key={`option-del-${index}`}
                                value={item.name}>
                                {item.name}
                              </SelectItem>
                            </>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
