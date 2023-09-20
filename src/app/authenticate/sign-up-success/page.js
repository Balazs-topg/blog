"use client";
import React, { useEffect, useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import Nav from "@/app/components/Nav";

function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const jwt = localStorage.getItem("jwt");
      console.log("getting user data... ");
      try {
        const response = await fetch("/api/get-user-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jwt }),
        });
        const data = await response.json();
        console.log("api responded with: ", data);
        setIsLoggedIn(data);
      } catch (error) {
        console.error("api failed: ", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <NextUIProvider>
      <Nav isLoggedIn={isLoggedIn}></Nav>
      <div className="flex flex-col items-center dark mx-auto max-w-lg py-8 px-4">
        <h1 className="text-white text-2xl font-bold mb-2">
          Welcome {isLoggedIn.username ? isLoggedIn.username : null}!
        </h1>
        <p className="text-white">you are now a member of COOL BLOG!</p>
      </div>
      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}

export default Page;
