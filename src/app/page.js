"use client";

import { useState, useEffect } from "react";

import Nav from "./components/Nav";

import Image from "next/image";
import Link from "next/link";

import { NextUIProvider, Spinner } from "@nextui-org/react";
import { Button, Input } from "@nextui-org/react";

import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";

import Card from "./components/Card";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts/front-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <NextUIProvider>
      <Nav />
      <div className="mx-auto max-w-xl space-y-6 py-8">
        {posts.length == 0 && <Spinner></Spinner>}
        {posts.length > 0 &&
          posts.map((postData) => {
            return (
              <Card
                key={postData.id}
                id={postData._id}
                title={postData.title}
                content={postData.message}
                author={postData.author}
                time={postData.timeOfPost}
                numberOfLikes={postData.numberOfLikes}
                numberOfDislikes={postData.numberOfDislikes}
                isLiked={postData.liked}
                isDisliked={postData.disliked}
              ></Card>
            );
            // <Card title={postData.title} content="lorem bruh"></Card>;
          })}
      </div>
      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}
