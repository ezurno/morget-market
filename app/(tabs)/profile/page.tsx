import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";
import defaultAvatar from "@/public/goguma.png";
import { formatToTimeAgo } from "@/lib/utils";
import { VideoCameraIcon as SolidVideoCameraIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { logout, modification } from "./actions";

async function getUser() {
  const session = await getSession();
  console.log(`SESSSION >> `, session);
  if (session.id) {
    const user = await db.user.findUnique({
      where: { id: session.id },
      include: {
        streams: {
          select: {
            id: true,
            title: true,
            updated_at: true,
            stream_id: true,
          },
        },
      },
    });

    return user;
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  if (!user) return notFound();

  return (
    <div>
      <Suspense fallback={"조금만 기다려주세요.."}>
        <div className="flex flex-col gap-4 my-4">
          <Image
            src={user?.avatar ? user.avatar : defaultAvatar}
            alt={String(user.id)}
            width={96}
            height={96}
            className="rounded-full"
          />
          {/* 인삿말 + 유저 명 */}
          <div className="flex flex-col justify-center items-start">
            <h1>어서오세요!</h1>
            <div className="flex flex-row justify-between items-center">
              <span className="font-bold text-2xl">{user.username}</span>
            </div>
          </div>
          {/* <p>{formatToTimeAgo(user?.update_at.toString()!)}</p> */}
          <hr />
          <h2 className="font-semibold text-2xl">내 라이브 방송</h2>
          <Link href={`/streams/${user.streams[0].id}`}>
            <div className="bg-yellow-200 text-black p-5 rounded-md hover:scale-105 transition-transform cursor-pointer">
              <SolidVideoCameraIcon className="w-7 h-7" />
              <h2 className="font-bold text-xl">{user.streams[0].title}</h2>
              <h2>
                마지막 방송일
                {formatToTimeAgo(user.streams[0].updated_at.toString())}
              </h2>
            </div>
          </Link>
        </div>
        <div className="flex flex-row justify-start items-center gap-5">
          <form action={modification}>
            <button className="w-40 h-12 bg-emerald-500 rounded-md">
              수정하기
            </button>
          </form>
          <form action={logout}>
            <button className="w-40 h-12 bg-red-500 rounded-md">
              로그아웃
            </button>
          </form>
        </div>
      </Suspense>
    </div>
  );
}
