import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * 해당 상품의 등록자인지 여부를 판단 해 상품을 삭제하는 로직
 * @param id 상품 id
 * @param isOwner 등록자 여부
 */
export const onDelete = async (id: number, isOwner: boolean) => {
  if (!isOwner) return;
  const product = await db.product.delete({
    where: {
      id,
    },
    select: {
      photo: true,
    },
  });

  const photoId = product.photo.split(`${process.env.IMAGEDELIVERY_URL}`)[1];
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1${photoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  revalidatePath("/home");
  revalidateTag("product-detail");
};

export async function getProduct(id: number) {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  return db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
}

export async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}
