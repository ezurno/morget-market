import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import ChatMessage from "@/components/chat-message";

//모든 채팅방 가져오기
async function getChatsList(id: number) {
  const rooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: {
            in: [id!],
          },
        },
      },
    },
    include: {
      users: {
        where: {
          NOT: {
            id,
          },
        },
      },
      product: {
        select: {
          title: true,
          photo: true,
        },
      },
      messages: {
        select: {
          payload: true,
          id: true,
          created_at: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  return rooms;
}

export default async function Chat() {
  const session = await getSession();
  if (!session.id) return notFound();
  const id = session.id;
  const chatsList = await getChatsList(session.id!);

  // console.log(chatsList);

  return (
    <div className="flex flex-col gap-5 p-5">
      {chatsList.map((chat) => (
        <Link
          key={chat.id}
          href={`/chats/${chat.id}`}
          className="cursor-pointer"
        >
          <ChatMessage chat={chat} id={id} roomId={chat.id} />
        </Link>
      ))}
    </div>
  );
}
