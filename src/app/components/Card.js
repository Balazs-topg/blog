"use client";
import React, { useState, useEffect, useReducer } from "react";

import { formatDistanceToNow } from "date-fns";

import { Button } from "@nextui-org/react";

const SVGs = {
  like: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
    </svg>
  ),
  dislike: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
    </svg>
  ),
};

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

const talkToBackendApi = async (postId, action) => {
  await fetch(`api/posts/${postId}/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify({
      postId: postId,
    }),
  });
};

function likeDislikeReducer(state, action) {
  if (action.onMount) {
    action.type === "like" && state.likeDislikeDiff--;
    action.type === "dislike" && state.likeDislikeDiff++;
  }
  switch (action.type) {
    case "like":
      //on un-like
      if (state.isLiked) {
        talkToBackendApi(state.postId, "un-like");
        return {
          ...state,
          isDisliked: false,
          isLiked: false,
          display: state.likeDislikeDiff,
        };
      } //on like
      else {
        !action.onLoad && talkToBackendApi(state.postId, "like");
        return {
          ...state,
          isDisliked: false,
          isLiked: true,
          display: state.likeDislikeDiff + 1,
        };
      }
    case "dislike":
      //on un-dislike
      if (state.isDisliked) {
        talkToBackendApi(state.postId, "un-dislike");
        return {
          ...state,
          isDisliked: false,
          isLiked: false,
          display: state.likeDislikeDiff,
        };
      } //on dislike
      else {
        !action.onLoad && talkToBackendApi(state.postId, "dislike");
        return {
          ...state,
          isDisliked: true,
          isLiked: false,
          display: state.likeDislikeDiff - 1,
        };
      }
    default:
      throw new Error("Unexpected action");
  }
}

function LikeDislike({
  isLiked = false,
  isDisliked = false,
  likeDislikeDiff,
  postId,
}) {
  const initialState = {
    isLiked: false,
    isDisliked: false,
    postId,
    display: likeDislikeDiff,
    likeDislikeDiff,
  };
  const [state, dispatch] = useReducer(likeDislikeReducer, initialState);

  const isLikedOnMount = isLiked;
  const isDislikedOnMount = isDisliked;

  //deal with off-by-one on mount
  useEffect(() => {
    if (isLikedOnMount) {
      dispatch({ type: "like", onMount: true });
    }
    if (isDislikedOnMount) {
      dispatch({ type: "dislike", onMount: true });
    }
  }, []);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Access localStorage only after the component has mounted
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(storedUserInfo);
  }, []);

  return (
    <>
      <Button
        isIconOnly
        color="primary"
        aria-label="Like"
        isDisabled={userInfo ? false : true}
        variant={state.isLiked ? "shadow" : ""}
        className={state.isLiked ? "-translate-y-0.5" : ""}
        onClick={() => {
          dispatch({ type: "like" });
        }}
      >
        {SVGs.like}
      </Button>
      <Button
        isIconOnly
        color="danger"
        aria-label="Dislike"
        isDisabled={userInfo ? false : true}
        variant={state.isDisliked ? "shadow" : ""}
        className={state.isDisliked ? "-translate-y-0.5" : ""}
        onClick={() => {
          dispatch({ type: "dislike" });
        }}
      >
        {SVGs.dislike}
      </Button>
      <div
        className={
          state.display >= 0
            ? "font-bold text-blue-400"
            : "font-bold text-red-400"
        }
      >
        {state.display >= 0 ? "+" : null}
        {state.display}
      </div>
    </>
  );
}

function Card({
  title,
  author,
  time,
  content,
  id,
  numberOfLikes,
  numberOfDislikes,
  isLiked,
  isDisliked,
  setIsShowingLogInPrompt,
  router,
}) {
  const [userInfo, setUserInfo] = useState(null); // Set initial state to null

  useEffect(() => {
    // Access localStorage only after the component has mounted
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(storedUserInfo);
  }, []);

  function limitString(string = "", limit = 0) {
    return string.substring(0, limit);
  }

  return (
    <div className="bg-zinc-700 border border-zinc-600 rounded-2xl text-white p-4 space-y-2 shadow-lg overflow-hidden">
      <div className=" font-semibold">
        {title}{" "}
        <span className=" opacity-60">
          {" "}
          - <span className=" font-medium">posted by: </span>
          {author}
        </span>{" "}
        <DateComponent dateObj={new Date(time)}></DateComponent>
      </div>
      <p className="relative">
        {content.length >= 200 ? (
          <>
            {limitString(content, 200)}...{" "}
            <div className="bg-gradient-to-t from-zinc-700 to-sky-[#FFFFFF00] w-full h-1/2 absolute bottom-0 left-0"></div>
          </>
        ) : (
          limitString(content, 200)
        )}
      </p>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-3"
          onClick={() => {
            !userInfo && setIsShowingLogInPrompt(true);
          }}
        >
          <LikeDislike
            likeDislikeDiff={numberOfLikes - numberOfDislikes}
            postId={id}
            isLiked={isLiked}
            isDisliked={isDisliked}
          ></LikeDislike>
        </div>
        <Button
          className="ml-auto"
          onClick={() => {
            router.push(`/posts/${id}`);
          }}
        >
          <div className="flex items-center gap-2">
            Read
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default Card;
