import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });

    if (user) return user;
  }
  notFound(); // session-id 가 없다면 page 404
}

export default async function Profile() {
  const user = await getUser();
  const logout = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };

  return (
    <div>
      <form action={logout}>
        <button>로그아웃</button>
      </form>
      <h2>어서오세요 {user?.username}</h2>
    </div>
  );
}
