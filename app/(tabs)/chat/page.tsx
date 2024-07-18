import { getSession } from "@/lib/sessions/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import ChatMessage from "@/components/chat-message";
import { getAllChatRoomCache, getCountUnreadMessagesCache } from "./actions";

export default async function Chat() {
  const session = await getSession();
  if (!session.id) return notFound();
  const id = session.id;
  const chatsList = await getAllChatRoomCache(id);
  const unReadCount = await getCountUnreadMessagesCache(id);

  return (
    <div className="flex flex-col gap-5 p-5">
      {chatsList.map((chat) => (
        <Link
          key={chat.id}
          href={`/chats/${chat.id}`}
          className="cursor-pointer"
        >
          <ChatMessage
            chat={chat}
            id={id}
            roomId={chat.id}
            unReadCount={unReadCount}
          />
        </Link>
      ))}
    </div>
  );
}
