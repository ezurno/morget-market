"use server";

import LiveChatList from "@/components/live-chat-list";
import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getStream(id: string) {
  const stream = await db.liveStream.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      stream_key: true,
      stream_id: true,
      userId: true,
      liveChats: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  console.log(stream);
  return stream;
}

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });

  return user;
}

export default async function StreamDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = String(params.id);
  if (!id) return notFound();
  const stream = await getStream(id);
  if (!stream) return notFound();

  const user = await getUserProfile();
  if (!user) return notFound();
  const session = await getSession();

  const url = process.env.SUPABASE_URL;
  if (!url) return notFound();
  const public_key = process.env.SUPABASE_PUBLIC_KEY;
  if (!public_key) return notFound();

  return (
    <div className="p-10">
      <div className="relative aspect-video">
        <iframe
          src={`https://${process.env.CLOUDFLARE_DOMAIN}/${stream.stream_id}/iframe`}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          className="w-full h-full rounded-md"
        ></iframe>
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {stream.user.avatar !== null ? (
            <Image
              src={stream.user.avatar}
              alt={stream.user.username}
              width={40}
              height={40}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{stream.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{stream.title}</h1>
      </div>
      {stream.userId === session.id! ? (
        <div className="bg-yellow-200 text-black p-5 rounded-md">
          <div className="flex gap-2">
            <span className="font-semibold">Stream URL:</span>
            <span>rtmps://live.cloudflare.com:443/live/</span>
          </div>
          <div className="flex  flex-wrap">
            <span className="font-semibold">Secret Key:</span>
            <span>{stream.stream_key}</span>
          </div>
        </div>
      ) : null}
      <LiveChatList
        initialMessages={stream.liveChats}
        userId={session.id!}
        liveStreamId={stream.id}
        username={user.username}
        avatar={user.avatar!}
        url={url}
        public_key={public_key}
      />
    </div>
  );
}
