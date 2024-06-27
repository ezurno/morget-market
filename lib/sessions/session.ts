import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

// 로그인 한 사용자만 id 를 갖고 있으므로 ? 처리
interface ISessionContent {
  id?: number;
}

/**
 *
 * @returns session 을 한 번에 관리하기 위함
 */
export function getSession() {
  return getIronSession<ISessionContent>(cookies(), {
    cookieName: "morget-cookie",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function updateSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}
