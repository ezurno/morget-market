import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { notFound, redirect } from "next/navigation";
import React from "react";

async function getUser() {
  const session = await getSession();
  console.log(`SESSSION >> `, session);
  if (session.id) {
    const user = await db.user.findUnique({ where: { id: session.id } });
    return user;
  }
  notFound();
}

async function Profile() {
  const user = await getUser();
  console.log(`USER >> `, user);
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };

  return (
    <div>
      <h1>Welcome! {user?.username}</h1>
      <form action={logOut}>
        <button>Logout</button>
      </form>
    </div>
  );
}

export default Profile;
