import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";

export async function getIsOwner(userId: number) {
  // const session = await getSession();
  // //해당 session 에 id 값이 존재 할 경우
  // if (session.id) {
  //   return session.id === userId;
  //   // 해당 id 와 제품의 id 가 일치하는지 확인 후 return
  // }

  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export async function getProduct(id: number) {
  console.log("PRODUCT >>");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    // 해당 하는 데이터에 추가 한다는 의미
    // user 로 username, avatar 를 추가로 가져옴
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  // fetch("https://naver.com", {
  //   next: {
  //     // revalidate: 60,
  //     tags: ["test"],
  //   },
  // });

  console.log(product);

  return product;
}
