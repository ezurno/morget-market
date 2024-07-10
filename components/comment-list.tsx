"use client";
import { createComment } from "@/app/posts/[id]/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { Suspense, useOptimistic, useRef } from "react";
import Comments from "./comments";
import { AddComment } from "./add-comment";
import avatar from "@/public/goguma.png";

interface ICommentListProps {
  allComments: {
    user: {
      avatar: string | null;
      username: string;
    };
    id: number;
    payload: string;
    userId: number;
    postId: number;
    created_at: Date;
    updated_at: Date;
  }[];
  sessionId: number;
  postId: number;
  user: { avatar: string | null; username: string; id: number } | null;
}

export function CommentList({
  allComments,
  sessionId,
  postId,
  user,
}: ICommentListProps) {
  const commentEndRef = useRef<HTMLDivElement>(null);
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    allComments,
    (state: any[], newComment: any) => {
      return [...state, newComment];
    }
  );
  const handleSubmit = async (payload: string, postId: number) => {
    if (!user) return;
    addOptimisticComment({
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: optimisticComments.length + 1,
      payload,
      postId: postId,
      user: {
        name: user.username,
        avatar: user.avatar,
      },
    });
    if (commentEndRef.current)
      commentEndRef.current.scrollIntoView({ behavior: "smooth" });
    await createComment(payload, postId);
  };

  return (
    <div className="w-full mx-auto">
      <span className="font-medium">
        Comments ({optimisticComments.length})
      </span>
      <Suspense fallback={<div>loading...</div>}>
        {optimisticComments.map((comment) => (
          <Comments
            key={comment.id}
            id={comment.id}
            payload={comment.payload}
            sessionId={sessionId}
            user={comment.user}
            userId={comment.userId}
            createdAt={formatToTimeAgo(comment.created_at.toString())}
            avatar={comment.user.avatar ? comment.user.avatar : avatar}
          />
        ))}
      </Suspense>
      <AddComment postId={postId} handleSubmit={handleSubmit} user={user} />
    </div>
  );
}
