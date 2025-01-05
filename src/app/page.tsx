"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  const formList = Array.from({ length: itemCount }, (_, i) => (
    <div key={i} className="flex flex-row gap-10 items-center">
      <div className="font-bold">{i + 1}.</div>
      <div className="w-full flex flex-row gap-5">
        <div className="flex flex-col gap-2">
          <Label>Item</Label>
          <Input type="text" placeholder="Name" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Amount</Label>
          <Input type="number" placeholder="10" />
        </div>
      </div>
    </div>
  ));

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl font-bold">
          How many items do you want to bring?
        </div>
        <form
          className="flex flex-row gap-4 w-full justify-center items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}>
          <input
            type="number"
            name="itemCount"
            id="itemCount"
            className="rounded-lg p-2 border border-gray-300 drop-shadow-lg w-1/2"
            onChange={(e) => setItemCount(parseInt(e.target.value))}
          />
          <button
            type="submit"
            className="rounded-lg bg-white hover:bg-black duration-150">
            <svg
              className="h-8 fill-black hover:fill-white p-1 duration-150"
              clipRule="evenodd"
              fillRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="m2.25 12.321 7.27 6.491c.143.127.321.19.499.19.206 0 .41-.084.559-.249l11.23-12.501c.129-.143.192-.321.192-.5 0-.419-.338-.75-.749-.75-.206 0-.411.084-.559.249l-10.731 11.945-6.711-5.994c-.144-.127-.322-.19-.5-.19-.417 0-.75.336-.75.749 0 .206.084.412.25.56"
                fillRule="nonzero"
              />
            </svg>
          </button>
        </form>
        {submitted && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">List your items</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Items</DialogTitle>
                <DialogDescription>
                  Provide the name and quantity for each item you want to bring.
                </DialogDescription>
              </DialogHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                }}>
                {formList}
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
