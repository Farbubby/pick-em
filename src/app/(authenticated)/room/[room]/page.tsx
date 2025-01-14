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
import { AuthContext } from "@/components/auth-context";
import { useContext } from "react";

export default function Home({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const queryClient = useQueryClient();

  const [room, setRoom] = useState("");
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");
  const [item3, setItem3] = useState("");
  const [name, setName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const { userId } = useContext(AuthContext);

  const contributionQuery = useQuery({
    queryKey: ["contribution", room, item2],
    queryFn: async () => {
      const res = await fetch(
        `/api/contribution?room=${room}&item=${item2}&user_id=${userId}`
      );
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
      data["user_id"] = userId;
      data["item"] = item1;
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
      setItem1("");
      queryClient.invalidateQueries({ queryKey: ["contribution"] });
      queryClient.invalidateQueries({ queryKey: ["item-list"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());
      data["room"] = room;
      data["user_id"] = userId;
      data["name"] = name;
      data["item"] = item2;
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
      setItem2("");
      setName("");
      queryClient.invalidateQueries({ queryKey: ["contribution"] });
      queryClient.invalidateQueries({ queryKey: ["item-list"] });
    },
  });

  const addAdminMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());
      data["room"] = room;
      const res = await fetch("/api/admin", {
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
      queryClient.invalidateQueries({ queryKey: ["item-list"] });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());
      data["room"] = room;
      data["item"] = item3;
      const res = await fetch("/api/admin", {
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
      setItem3("");
      queryClient.invalidateQueries({ queryKey: ["item-list"] });
    },
  });

  useEffect(() => {
    async function getRoom() {
      const room = (await params).room;
      setRoom(room);
    }

    async function checkOwner() {
      const link = `${window.location.pathname}`;
      const res = await fetch(`/api/owner?link=${link}`);

      const user = (await res.json()) as {
        status: number;
        result: { data: { id: string; user_id: string }[] };
      };

      setIsOwner(user.result.data[0].user_id === userId);
    }
    getRoom();
    checkOwner();
  }, [params, userId, room]);

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
        <div className="w-4/5 sm:w-3/5 grid sm:grid-cols-2  grid-cols-1 gap-5 mx-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Bring something</Button>
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
                  addMutation.mutate(new FormData(e.target as HTMLFormElement));
                }}>
                <div className="w-full flex flex-row gap-5">
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Item</Label>
                    <Select
                      name="item1"
                      value={item1}
                      onValueChange={(value) => setItem1(value)}>
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
                    />
                  </div>
                </div>
                {addMutation.data?.result.error && (
                  <div className="text-red-400 font-bold text-center">
                    {addMutation.data.result.error}
                  </div>
                )}
                {addMutation.data?.result.success && (
                  <div className="text-green-400 font-bold text-center">
                    {addMutation.data.result.success}
                  </div>
                )}
                <DialogFooter>
                  <Button type="submit">Bring it</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Remove something</Button>
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
                  deleteMutation.mutate(
                    new FormData(e.target as HTMLFormElement)
                  );
                }}>
                <div>
                  <div className="flex flex-col gap-2">
                    <Label>Item</Label>
                    <Select
                      name="item2"
                      value={item2}
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
                    <Select
                      name="name"
                      value={name}
                      onValueChange={(value) => setName(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="border-b">Person</SelectLabel>
                          {contributionQuery.data?.map((item, index) => (
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
                {deleteMutation.data?.result.error && (
                  <div className="text-red-400 font-bold text-center">
                    {deleteMutation.data.result.error}
                  </div>
                )}
                {deleteMutation.data?.result.success && (
                  <div className="text-green-400 font-bold text-center">
                    {deleteMutation.data.result.success}
                  </div>
                )}
                <DialogFooter>
                  <Button type="submit">Remove it</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {isOwner && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add Item</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] max-w-[325px]">
                <DialogHeader>
                  <DialogTitle>Want to add an item?</DialogTitle>
                  <DialogDescription>
                    Mention the item you want to add and the amount of it.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addAdminMutation.mutate(
                      new FormData(e.target as HTMLFormElement)
                    );
                  }}>
                  <div>
                    <div className="flex flex-col gap-2">
                      <Label>Item</Label>
                      <Input
                        id={`item`}
                        name={`item`}
                        type="text"
                        placeholder="Item"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col gap-2">
                      <Label>Amount</Label>
                      <Input
                        id={`amount`}
                        name={`amount`}
                        type="text"
                        placeholder="10"
                      />
                    </div>
                  </div>
                  {addAdminMutation.data?.result.error && (
                    <div className="text-red-400 font-bold text-center">
                      {addAdminMutation.data.result.error}
                    </div>
                  )}
                  {addAdminMutation.data?.result.success && (
                    <div className="text-green-400 font-bold text-center">
                      {addAdminMutation.data.result.success}
                    </div>
                  )}
                  <DialogFooter>
                    <Button type="submit">Add it</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          {isOwner && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Remove Item</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] max-w-[325px]">
                <DialogHeader>
                  <DialogTitle>Want to remove an item?</DialogTitle>
                  <DialogDescription>
                    Mention the item you want to remove.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    deleteAdminMutation.mutate(
                      new FormData(e.target as HTMLFormElement)
                    );
                  }}>
                  <div>
                    <div className="flex flex-col gap-2">
                      <Label>Item</Label>
                      <Select
                        name="item3"
                        value={item3}
                        onValueChange={(value) => {
                          setItem3(value);
                        }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className="border-b">
                              Items
                            </SelectLabel>
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
                  {deleteAdminMutation.data?.result.error && (
                    <div className="text-red-400 font-bold text-center">
                      {deleteAdminMutation.data.result.error}
                    </div>
                  )}
                  {deleteAdminMutation.data?.result.success && (
                    <div className="text-green-400 font-bold text-center">
                      {deleteAdminMutation.data.result.success}
                    </div>
                  )}
                  <DialogFooter>
                    <Button type="submit">Remove it</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
}
