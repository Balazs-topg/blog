"use client";
import Link from "next/link";
import { Input, Button } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

import { NextUIProvider } from "@nextui-org/react";

import { useRouter } from "next/navigation";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

function Nav() {
  const [userInfo, setUserInfo] = useState(null); // Set initial state to null

  useEffect(() => {
    // Access localStorage only after the component has mounted
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(storedUserInfo);
  }, []);

  const router = useRouter();

  return (
    <nav className="bg-zinc-700 border-b border-zinc-600 text-white py-2 px-4 sticky top-0 z-50 shadow-lg dark">
      <div className="mx-auto max-w-5xl flex gap-4 justify-between items-center">
        <div className="font-bold text-xl whitespace-nowrap mr-auto">
          <Link href="/">COOL BLOG</Link>
        </div>
        {userInfo ? null : (
          <Link href="authenticate">
            <Button color="primary">Log in</Button>
          </Link>
        )}
        {userInfo ? (
          <>
            <Button
              color="primary"
              isIconOnly
              onClick={() => {
                router.push("/write-post");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button color="primary" isIconOnly>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="new"
                  onClick={() => {
                    router.push(`users/${userInfo.username}`);
                  }}
                >
                  View account
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  onClick={() => {
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("userInfo");
                    location.reload();
                  }}
                >
                  Sign out{" "}
                  <span className=" opacity-50 font-medium">
                    (logged in as {userInfo.username})
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Nav;
