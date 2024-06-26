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
export default function getSession() {
  return getIronSession<ISessionContent>(cookies(), {
    cookieName: "morget-cookie",
    password: process.env.COOKIE_PASSWORD!,
  });
}
