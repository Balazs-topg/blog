"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/components/Nav";
import { NextUIProvider, Spinner } from "@nextui-org/react";
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
    <div className="bg-zinc-800 p-4 rounded-2xl">
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
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const commentInputRef = useRef();

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
  useEffect(() => {
    fetchPageInfo();
  }, []);

  async function sendCommentHandler(e) {
    e.preventDefault();
    setIsSubmittingComment(true);
    const response = await fetch(`/api/posts/${params.postId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ message: commentInputRef.current.value }),
    });
    const data = await response.json();
    console.log(data);
    setIsSubmittingComment(false);
    commentInputRef.current.value = "";
    fetchPageInfo();
  }

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
          <form onSubmit={sendCommentHandler} className="mb-4 w-full">
            <textarea
              ref={commentInputRef}
              name="message"
              id=""
              cols="30"
              rows="5"
              className="bg-zinc-800 rounded-xl w-full p-2 border-2 border-opacity-0 outline-none border-zinc-500 hover:border-opacity-100 transition-all"
              placeholder="Type comment here"
            ></textarea>
            <Button
              fullWidth
              type="submit"
              variant="solid"
              color="primary"
              isDisabled={isSubmittingComment ? true : false}
            >
              {isSubmittingComment && (
                <Spinner size="sm" color="current" className=" mr-1" />
              )}
              Send Comment
            </Button>
          </form>
          {pageInfo &&
            pageInfo.comments.map((comment) => {
              return (
                <Comment
                  key={comment.timeOfComment}
                  authorUsername={comment.authorUsername}
                  timeOfComment={new Date(comment.timeOfComment)}
                >
                  {comment.message}
                </Comment>
              );
            })}
        </div>
      </div>
      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}

export default Page;
