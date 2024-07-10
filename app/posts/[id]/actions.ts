"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { revalidateTag } from "next/cache";

export const likePost = async (postId: number) => {
  try {
    const session = await getSession();
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });

    revalidateTag(`like-status-${postId}`);
  } catch (error) {}
};

/**
 * 하지만 해당 방법으로 설계를 하면 사용감 개선이 전혀 되지 않음
 * 서버에서 실행하는 동안 사용자는 요청이 된 건지 요청이 진행 중인 건지 알 수가 없음
 */
export const dislikePost = async (postId: number) => {
  try {
    const session = await getSession();

    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (error) {}
};
