import Link from "next/link";
import { Input, Button } from "@nextui-org/react";
import React from "react";

function Nav() {
  return (
    <nav className="bg-zinc-700 border-b border-zinc-600 text-white py-2 px-4 dark sticky shadow-lg">
      <div className="mx-auto max-w-5xl flex gap-4 justify-between items-center">
        <div className="font-bold text-xl whitespace-nowrap">
          <Link href="/">COOL BLOG</Link>
        </div>
        <Input
          type="email"
          variant="bordered"
          placeholder="Search"
          labelPlacement="outside"
          startContent={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <Link href="authenticate">
          <Button color="primary">Log in</Button>
        </Link>
      </div>
    </nav>
  );
}

export default Nav;
