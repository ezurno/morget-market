import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/sessions/session";

interface IRoutes {
  [key: string]: boolean;
}

const publicOnlyUrls: IRoutes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  console.log("middleware!");
  const session = await getSession();
  const isPublicPath = publicOnlyUrls[request.nextUrl.pathname];

  if (!session.id) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (isPublicPath) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
