import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";

async function getUser() {
  const session = await getSession();
  console.log(`SESSSION >> `, session);
  if (session.id) {
    const user = await db.user.findUnique({ where: { id: session.id } });
    return user;
  }
  notFound();
}

async function Username() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const user = await getUser();
  return <h1>Welcome! {user?.username}</h1>;
}

export default async function Profile() {
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };

  return (
    <div>
      <Suspense fallback={"HELLO"}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button>Logout</button>
      </form>
    </div>
  );
}
