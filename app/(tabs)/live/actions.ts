"use server";

import db from "@/lib/db";

export async function getLiveList() {
  const liveList = await db.liveStream.findMany({
    select: {
      title: true,
      id: true,
      stream_id: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return liveList;
}

export async function getLiveData(streamId: string) {
  const data = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/02352da6090bc5de74ad50590aa41a46/stream/videos/83bdbf3d6ee4a650b1f53b85e4677977/thumbnail`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );

  return data;
}
