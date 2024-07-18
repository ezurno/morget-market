"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from "next/cache";

//모든 채팅방 가져오기
export async function getChatsList(id: number) {
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

export async function countUnreadMessages(sessionId: number) {
  const unreadCount = await db.message.count({
    where: {
      userId: {
        not: sessionId,
      },
      isRead: false,
    },
  });

  return unreadCount;
}

export const getAllChatRoomCache = nextCache(getChatsList, ["chatroom-all"], {
  tags: ["chatroom-all", "chatroom-data"],
});

export const getCountUnreadMessagesCache = nextCache(
  countUnreadMessages,
  ["unread-message"],
  {
    tags: ["unread-message", "chatroom-data"],
  }
);
