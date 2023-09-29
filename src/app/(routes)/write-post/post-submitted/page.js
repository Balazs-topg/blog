"use client";
import React, { useEffect, useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Nav from "@/app/components/Nav";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return (
    <NextUIProvider>
      <Nav></Nav>
      <div className="flex flex-col gap-4 items-center dark mx-auto max-w-lg py-8 px-4">
        <h1 className="text-white text-2xl font-bold text-center">
          Your post was successfully submitted!
        </h1>
        <Button
          color="primary"
          variant="shadow"
          onClick={() => {
            router.push("/");
          }}
        >
          View home page
        </Button>
      </div>
      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}

export default Page;
