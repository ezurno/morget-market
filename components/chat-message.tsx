import db from "@/lib/db";
import Image from "next/image";
import defaultProfile from "@/public/potato.png";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
/**
 *  읽지 않은 메세지 수를 확인 하는 logic
 * @param id session-id
 */
async function countUnreadMessages(id: number, roomId: string) {
  const unreadCount = await db.message.count({
    where: {
      userId: {
        not: id,
      },
      chatRoomId: roomId,
      isRead: false,
    },
  });

  return unreadCount;
}

const cachedCountUnreadMessages = nextCache(
  countUnreadMessages,
  ["count-messages"],
  {
    tags: ["count-messages"],
  }
);

export default async function ChatMessage({
  chat,
  id,
  roomId,
}: {
  chat: any;
  id: number;
  roomId: string;
}) {
  console.log(chat);
  const unReadCount = await cachedCountUnreadMessages(id!, roomId!);

  return (
    <div className="flex gap-2.5 odd:bg-neutral-800 p-2 overflow-hidden rounded-md">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image
          fill
          src={`${chat.product.photo}/public`}
          alt={chat.product.title}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-around gap-2 *:text-white w-full">
        <span className="text-xl">{chat.product.title}</span>
        {chat.users[0] ? (
          <div className="flex flex-row justify-start items-center gap-4">
            <Image
              width={28}
              height={28}
              className="size-7 rounded-full"
              src={
                chat.users[0]?.avatar ? chat.users[0].avatar : defaultProfile
              }
              alt={"상대방 프로필 이미지"}
            />
            <span>{chat.users[0].username}</span>
          </div>
        ) : (
          <p>없음</p>
        )}
        {/* <span className="text-lg font-semibold">{chat}</span> */}
        <div className="flex w-full justify-between gap-2">
          <p>{chat.messages[0] && chat.messages[0].payload}</p>
          <p>
            {chat.messages[0] && chat.messages[0].created_at.toDateString()}
          </p>
          {unReadCount === 0 ? null : (
            <span className="badge size-8 flex justify-center  items-center rounded-full bg-orange-400 text-white">{`+${unReadCount}`}</span>
          )}
        </div>
      </div>
    </div>
  );
}
