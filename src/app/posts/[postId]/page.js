"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/components/Nav";
import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

import { formatDistanceToNow } from "date-fns";

function DateComponent({ dateObj }) {
  const [timeAgo, setTimeAgo] = useState(formatDistanceToNow(dateObj));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(dateObj));
    }, 30000); // Update every minute

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [timeAgo]);

  return <span className="opacity-60 font-medium">({timeAgo} ago)</span>;
}

function Comment({ children, author, authorUsername, timeOfComment }) {
  return (
    <div className="bg-zinc-800 p-4 rounded-lg">
      <div className="flex gap-1 mb-2">
        <div className=" font-bold text-xs opacity-70">
          commented by: {authorUsername}
        </div>
        <div className="text-xs font-bold">
          <DateComponent dateObj={timeOfComment} />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export function Page({ params }) {
  const [pageInfo, setPageInfo] = useState(null);

  useEffect(() => {
    const fetchPageInfo = async () => {
      console.log("fetching: ", `/api/posts/${params.postId}/info`);
      const response = await fetch(`/api/posts/${params.postId}/info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const data = await response.json();
      setPageInfo(data);
    };
    fetchPageInfo();
  }, []);

  return (
    <NextUIProvider>
      <Nav></Nav>
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-4 dark">
        <div className="bg-zinc-700 border border-zinc-600 rounded-2xl text-white p-4 space-y-2 shadow-lg text-white">
          <h2 className="  m-0 p-0 text-xs font-bold opacity-70">
            {pageInfo && `posted by: ${pageInfo.authorUsername} `}
            {pageInfo ? (
              <DateComponent
                dateObj={new Date(pageInfo.timeOfPost)}
              ></DateComponent>
            ) : null}
          </h2>
          {pageInfo && <h1 className=" font-semibold">{pageInfo.title}</h1>}
          {pageInfo && <p>{pageInfo.message}</p>}
        </div>
        <div className="bg-zinc-700 border border-zinc-600 rounded-2xl text-white p-4 space-y-4 shadow-lg text-white">
          <form onSubmit={() => {}} className="mb-4 w-full">
            <textarea
              name="message"
              id=""
              cols="30"
              rows="5"
              className="bg-zinc-800 rounded-xl w-full p-2 border-2 border-opacity-0 outline-none border-zinc-500 hover:border-opacity-100 transition-all"
              placeholder="Type comment here"
            ></textarea>
            <Button variant="solid" color="primary" fullWidth type="submit">
              send comment
            </Button>
          </form>
          <Comment authorUsername={"balazs"} timeOfComment={new Date()}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa
            veritatis, reiciendis numquam nihil rem possimus itaque vitae,
            quidem ab similique inventore, voluptatum totam cum aliquid
            accusantium hic provident amet maxime!
          </Comment>
          <Comment authorUsername={"balazs"} timeOfComment={new Date()}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa
            veritatis, reiciendis numquam nihil rem possimus itaque vitae,
            quidem ab similique inventore, voluptatum totam cum aliquid
            accusantium hic provident amet maxime!
          </Comment>
          <Comment authorUsername={"balazs"} timeOfComment={new Date()}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa
            veritatis, reiciendis numquam nihil rem possimus itaque vitae,
            quidem ab similique inventore, voluptatum totam cum aliquid
            accusantium hic provident amet maxime!
          </Comment>
          <Comment authorUsername={"balazs"} timeOfComment={new Date()}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa
            veritatis, reiciendis numquam nihil rem possimus itaque vitae,
            quidem ab similique inventore, voluptatum totam cum aliquid
            accusantium hic provident amet maxime!
          </Comment>
        </div>
      </div>
      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}

export default Page;
