"use client";

import { initialChatMessages } from "@/app/chats/[id]/page";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { formatToTimeAgo } from "@/lib/utils";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import defaultAvatar from "@/public/goguma.png";
import { saveMessage } from "@/app/chats/[id]/action";

interface ChatMessagesListProps {
  initialMessages: initialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
}

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjYWF1cWhzeHJncWRtZXlpb2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3NTMwNTIsImV4cCI6MjAzNjMyOTA1Mn0.Img5NaD47FdKLVyZEFDDJg_LjsbLqzdvuIkckoIbQjk";

const SUPABASE_URL = "https://gcaauqhsxrgqdmeyioap.supabase.co";

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState<string>("");
  // 채팅 입력 시 채널의 ref 로 접근하기 위해 useRef 사용
  const channelRef = useRef<RealtimeChannel>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // alert(message);

    // fake-message 만들기
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        isRead: false,
        user: {
          username: "string",
          avatar: `xxx`,
        },
      },
    ]);
    // supabase 공식 문서 참고
    channelRef.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        isRead: false,
        user: {
          username,
          avatar: avatar ? avatar : defaultAvatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };

  useEffect(() => {
    // 처음 chat-room 에 접근 시 supabase 에 접근해서
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    // channel 을 등록해야 됨
    channelRef.current = client.channel(`room-${chatRoomId}`);
    channelRef.current
      .on("broadcast", { event: "message" }, (payload) => {
        // console.log(payload);
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId ? "justify-end" : ""
          }`}
        >
          {message.userId === userId ? null : (
            <Image
              src={message.user.avatar ? message.user.avatar : ""}
              alt={message.user.username}
              width={50}
              height={50}
              className="size-8 rounded-full"
            />
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? "items-end" : ""
            }`}
          >
            <span
              className={`${
                message.userId === userId ? "bg-neutral-500" : "bg-emerald-500"
              } p-2.5 rounded-md`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-emerald-500 transition-colors hover:text-emerald-300" />
        </button>
      </form>
    </div>
  );
}
