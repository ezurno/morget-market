import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true },
      },
    },
  });

  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) {
      // 볼 수 있는 권한 이 없으면 . . .
      return null;
    }
  }

  console.log(room);
  return room;
}

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
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

export type initialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) return notFound();

  const session = await getSession();
  const messages = await getMessages(params.id);
  const user = await getUserProfile();
  if (!user) return notFound();
  console.log(`messages`, messages);
  return (
    <ChatMessagesList
      initialMessages={messages}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar!}
      chatRoomId={params.id}
    />
  );
}
