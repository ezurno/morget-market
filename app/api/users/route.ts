import { NextRequest } from "next/server";

/**
 * 함수 명을 GET 으로 하면 알아서 GET Mapping 을 시도함
 * @param request NextRequest 는 ip cookie 등을 같이 반환해줌 (일반적인 request 는 X)
 * @returns 응답 값 반환
 */
export async function GET(request: NextRequest) {
  console.log(request);

  return Response.json({
    ok: true,
  });
}

/**
 * 자동으로 POST Mapping 이 됨
 * @param request
 * @returns 응답 값 body 에 담아서 반환
 */
export async function POST(request: NextRequest) {
  const data = await request.json(); // body

  return Response.json(data);
}
