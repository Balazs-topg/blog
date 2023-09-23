"use client";
import React, { useRef, useState } from "react";
import {
  NextUIProvider,
  Input,
  Textarea,
  Button,
  Spinner,
} from "@nextui-org/react";
import Nav from "../components/Nav";

import { useRouter } from "next/navigation";

function Page() {
  const titleRef = useRef(null);
  const messageRef = useRef(null);
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(false);

    const title = titleRef.current.value;
    const message = messageRef.current.value;

    const token = localStorage.getItem("jwt");

    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message }),
      });

      if (response.ok) {
        console.log("Data submitted successfully");
        router.push("/write-post/post-submitted");
      } else {
        setSubmissionError(true);
      }
    } catch (error) {
      console.error("There was an error:", error);
      setSubmissionError(true);
    }

    setIsSubmitting(false);
  };

  return (
    <NextUIProvider>
      <Nav></Nav>
      <div className="flex flex-col dark mx-auto max-w-lg py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-700 border border-zinc-600 p-4 rounded-2xl text-white space-y-2"
        >
          <Input label="Title" isRequired variant="faded" ref={titleRef} />
          <Textarea
            label="Message"
            isRequired
            variant="faded"
            ref={messageRef}
          ></Textarea>
          <Button
            color="primary"
            fullWidth
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner size="sm" color="current" className=" mr-1" />
            ) : null}{" "}
            Post
          </Button>
          {submissionError && (
            <p className="text-red-500 mt-2">
              Error submitting post. Please try again.
            </p>
          )}
        </form>
      </div>
      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}

export default Page;
