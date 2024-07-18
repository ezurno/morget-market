"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { revalidateTag } from "next/cache";

/**
 * 주고 받았던 메세지를 chatroom 에 값으로 저장하기 위한 로직
 * @param payload 보내는 메세지
 */
export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: { id: true },
  });

  revalidateTag("chatroom-data");
}

export async function checkMessageAsRead(
  sessionId: number,
  chatRoomId: string
) {
  console.log(`SESSION >>`, sessionId);
  console.log(`CHATROOM >>`, chatRoomId);
  const updatedMessage = await db.message.updateMany({
    where: {
      userId: {
        not: sessionId,
      },
      chatRoomId: chatRoomId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  revalidateTag("chatroom-data");
  return updatedMessage;
}
