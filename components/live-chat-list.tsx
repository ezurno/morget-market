"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { formatToTimeAgo } from "@/lib/utils";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import defaultAvatar from "@/public/goguma.png";
import { saveChat } from "@/app/streams/[id]/actions";

interface ChatMessagesListProps {
  initialMessages: any;
  userId: number;
  liveStreamId: string;
  username: string;
  avatar: string;
  url: string;
  public_key: string;
}

export default function LiveChatList({
  initialMessages,
  userId,
  liveStreamId,
  username,
  avatar,
  url,
  public_key,
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
    setMessages((prev: any) => [
      ...prev,
      {
        payload: message,
        created_at: new Date(),
        liveStreamId,
        userId,
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
        payload: message,
        created_at: new Date(),
        liveStreamId,
        userId,
        user: {
          username,
          avatar: avatar ? avatar : defaultAvatar,
        },
      },
    });
    await saveChat(message, liveStreamId);
    setMessage("");
  };

  useEffect(() => {
    // 처음 chat-room 에 접근 시 supabase 에 접근해서
    const client = createClient(url, public_key);
    // channel 을 등록해야 됨
    channelRef.current = client.channel(`room-${liveStreamId}`);
    channelRef.current
      .on("broadcast", { event: "message" }, (payload) => {
        // console.log(payload);
        setMessages((prev: any) => [...prev, payload.payload]);
      })
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [liveStreamId]);

  return (
    <div className="p-5 flex flex-col gap-5 max-h-[50vh] overflow-y-hidden justify-end">
      {messages.map((message: any) => (
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
