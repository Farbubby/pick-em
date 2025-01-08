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
  const [itemCount, setItemCount] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/item-list", {
      method: "POST",
      body: JSON.stringify({
        data,
      }),
    });

    const response = (await res.json()) as {
      status: number;
      result: { error?: string; link?: string; success?: string };
    };

    if (response.result.error) {
      setFormError(response.result.error);
      setLink("");
      return;
    }

    if (response.result.link) {
      setLink(response.result.link);
    }

    setFormError("");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl font-bold">
          How many items do you want to bring?
        </div>
        <form
          className="flex flex-row gap-4 w-full justify-center items-center"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();

            if (!itemCount || isNaN(parseInt(itemCount))) {
              setError("Please enter a valid number.");
              setSubmitted(false);
              return;
            }

            if (parseInt(itemCount) <= 0 || parseInt(itemCount) > 100) {
              setError(
                "Please enter a valid number greater than 0 and less than 100."
              );
              setSubmitted(false);
              return;
            }

            setError("");
            setSubmitted(true);
          }}>
          <input
            type="number"
            name="itemCount"
            id="itemCount"
            className="rounded-lg p-2 border border-gray-300 drop-shadow-lg w-1/2"
            onChange={(e) => {
              setItemCount(e.target.value);
              setSubmitted(false);
              setError("");
              setFormError("");
              setLink("");
            }}
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
        {error && <div className="text-red-400 font-bold">{error}</div>}
        {submitted && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="drop-shadow-lg">
                List your items
              </Button>
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
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handleSubmit(formData);
                }}>
                {Array.from({ length: parseInt(itemCount) }, (_, i) => (
                  <div key={i} className="flex flex-row gap-10 items-center">
                    <div className="font-bold">{i + 1}.</div>
                    <div className="w-full flex flex-row gap-5">
                      <div className="flex flex-col gap-2">
                        <Label>Item</Label>
                        <Input
                          id={`item-${i}`}
                          name={`item-${i}`}
                          type="text"
                          placeholder="Name"
                          onChange={() => {
                            setFormError("");
                            setLink("");
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Amount</Label>
                        <Input
                          id={`amount-${i}`}
                          name={`amount-${i}`}
                          type="text"
                          placeholder="10"
                          onChange={() => {
                            setFormError("");
                            setLink("");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {formError && (
                  <div className="text-red-400 font-bold text-center">
                    {formError}
                  </div>
                )}
                {link && (
                  <>
                    <div className="font-bold text-center">
                      Click this{" "}
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-400">
                        {"link"}
                      </a>
                      <div className="text-black font-bold text-center">
                        Share this link with your friends!
                      </div>
                    </div>
                  </>
                )}
                <DialogFooter>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
