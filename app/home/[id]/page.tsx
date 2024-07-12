"use server";

import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import {
  unstable_cache as nextCashe,
  revalidateTag,
  revalidatePath,
} from "next/cache";
import { getIsOwner, getProduct } from "./actions";
import { getSession } from "@/lib/sessions/session";

async function getProductTitle(id: number) {
  console.log("title");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });

  return product;
}

const getCashedProduct = nextCashe(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

const getCashedProductTitle = nextCashe(getProductTitle, ["product-title"], {
  tags: ["product-title", "product-detail"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCashedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({ id: product.id + "" }));
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    // 아이디 값이 아닌 string 으로 접근했을 시
    return notFound();
  }
  const product = await getCashedProduct(id);
  if (!product) {
    // product 가 null 일 경우
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  revalidateTag("product-detail");
  revalidateTag("product-title");

  const onDelete = async () => {
    "use server";
    if (!isOwner) return;
    revalidateTag("product-detail");
    revalidateTag("product-title");
  };

  const createChatRoom = async () => {
    "use server";
    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          // 사용자 유저들을 모아올 것이기 때문
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });

    redirect(`/chats/${room.id}`);
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={`${product.photo}/public`}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full overflow-hidden">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)} 원
        </span>
        {isOwner ? (
          <div>
            <form action={onDelete}>
              <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                Delete product
              </button>
            </form>
            {/* <form action={revalidate}>
              <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                Revalidate title cache
              </button>
            </form> */}
          </div>
        ) : null}
        <form action={createChatRoom}>
          <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
            채팅하기
          </button>
        </form>
        {isOwner ? (
          <Link
            href={`/home/${id}/edit`}
            className="flex items-center justify-center px-5 py-2.5 bg-blue-500 rounded-md text-white font-semibold"
          >
            편집
          </Link>
        ) : null}
      </div>
    </div>
  );
}
