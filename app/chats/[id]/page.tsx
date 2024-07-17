import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { checkMessageAsRead } from "./action";

// 현재 채팅방 정보 가져오기
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
      isRead: true,
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

  // 동시에 안읽은 메세지는 채팅방 들어가면서 읽음으로 수정
  // db 작업도 다시 해야 함
  const setReadMessages = messages.map((message) => ({
    ...message,
    isRead: true,
  }));

  if (!session.id) return notFound();

  const url = process.env.SUPABASE_URL;
  if (!url) return notFound();
  const public_key = process.env.SUPABASE_PUBLIC_KEY;
  if (!public_key) return notFound();

  await checkMessageAsRead(session.id, params.id);
  return (
    <ChatMessagesList
      initialMessages={setReadMessages}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar!}
      chatRoomId={params.id}
      url={url}
      public_key={public_key}
    />
  );
}
