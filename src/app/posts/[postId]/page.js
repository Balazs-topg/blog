"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/components/Nav";
import { NextUIProvider } from "@nextui-org/react";

export function Page({ params }) {
  const [pageInfo, setPageInfo] = useState({});

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
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-zinc-700 border border-zinc-600 rounded-2xl text-white p-4 space-y-2 shadow-lg text-white">
          <h1>{pageInfo.title}</h1>
          <p>{pageInfo.message}</p>
        </div>
      </div>
      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}

export default Page;
