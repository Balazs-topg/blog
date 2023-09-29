"use client";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import { useRouter } from "next/navigation";

import Nav from "@/app/components/Nav";

function Page({ params }) {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );

  console.log(params);

  const [fetchedInfo, setFetchedInfo] = useState();
  const fetchAccount = async () => {
    const response = await fetch(`/api/accounts/${params.username}/info`);
  };
  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <>
      <Nav />
      <h1 className=" flex justify-center text-white bg-zinc-900 p-4 text-2xl font-semibold">
        {String(params.username)}
      </h1>
      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </>
  );
}

export default Page;
