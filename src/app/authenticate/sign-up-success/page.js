"use client";
import React, { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import Nav from "@/app/components/Nav";

function Page() {
  // const [userName, setUserName] = useState(undefined);

  return (
    <NextUIProvider>
      <Nav></Nav>
      <div className="flex flex-col items-center dark mx-auto max-w-lg py-8 px-4">
        <h1 className="text-white text-2xl font-bold mb-2">Welcome!</h1>
        <p className="text-white">you are now a member of COOL BLOG!</p>
      </div>
      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}

export default Page;
