"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { revalidatePath } from "next/cache";

/**
 * 주고 받았던 메세지를 chatroom 에 값으로 저장하기 위한 로직
 * @param payload 보내는 메세지
 */
export async function saveChat(payload: string, liveStreamId: string) {
  const session = await getSession();

  await db.liveChat.create({
    data: {
      payload,
      liveStreamId,
      userId: session.id!,
    },
    select: { id: true },
  });

  revalidatePath("/live");
}
