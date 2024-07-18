"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { record, z } from "zod";

const title = z.string();

export async function startStream(_: any, formData: FormData) {
  const session = await getSession();
  const results = title.safeParse(formData.get("title"));
  if (!results.success) {
    return results.error.flatten();
  }

  // 기존에 이미 방송이 있는지 확인
  const checker = await db.liveStream.findFirst({
    where: {
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });

  if (checker) return;

  // cloudflare 와 연결 streaming
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
      body: JSON.stringify({
        meta: {
          name: results.data,
        },
        recording: {
          mode: "automatic",
        },
      }),
    }
  );
  const data = await response.json();
  console.log(data);

  // db 에 저장하기
  const stream = await db.liveStream.create({
    data: {
      title: results.data,
      stream_id: data.result.uid,
      stream_key: data.result.rtmps.streamKey,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/live");
  redirect(`/streams/${stream.id}`);
}
