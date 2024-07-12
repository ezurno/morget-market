import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { notFound } from "next/navigation";

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
  const chatsList = await getChatsList(session.id!);

  return (
    <h2>
      {chatsList.map((chat) => (
        <h2>{chat.product.title}</h2>
      ))}
    </h2>
  );
}
