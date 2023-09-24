"use client";

import { useState, useEffect } from "react";

import Nav from "./components/Nav";

import Image from "next/image";
import Link from "next/link";

import { NextUIProvider, Spinner } from "@nextui-org/react";
import { Button, Input } from "@nextui-org/react";

import { formatDistanceToNow } from "date-fns";
import { el, tr } from "date-fns/locale";

import Card from "./components/Card";

export default function Home() {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
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

  const [isShowingLogInPrompt, setIsShowingLogInPrompt] = useState(false);

  useEffect(() => {
    console.log(isShowingLogInPrompt);
  }, [isShowingLogInPrompt]);

  return (
    <NextUIProvider>
      <Nav />
      {!userInfo ? (
        <LogInPrompt
          state={[isShowingLogInPrompt, setIsShowingLogInPrompt]}
        ></LogInPrompt>
      ) : null}
      <div className="mx-auto max-w-xl space-y-6 py-8">
        {posts.length == 0 && (
          <div className="flex justify-center">
            <Spinner size="xl" color="white" className=" mx-auto" />
          </div>
        )}
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
                setIsShowingLogInPrompt={setIsShowingLogInPrompt}
              ></Card>
            );
            // <Card title={postData.title} content="lorem bruh"></Card>;
          })}
      </div>
      <div className="w-full bg-zinc-800 h-screen fixed z-[-1] top-0 left-0"></div>
    </NextUIProvider>
  );
}
import React from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // Button,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

function LogInPrompt({ state }) {
  const router = useRouter();

  const [isShowingLogInPrompt, setIsShowingLogInPrompt] = state;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    isShowingLogInPrompt && onOpen();
  }, [isShowingLogInPrompt]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          setIsShowingLogInPrompt(false);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                You need to login inorder to preform this action
              </ModalHeader>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={() => {
                    router.push("/authenticate");
                  }}
                >
                  Log in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
