import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";

async function getIsOwner(userId: number) {
  const session = await getSession();
  //해당 session 에 id 값이 존재 할 경우
  if (session.id) {
    return session.id === userId;
    // 해당 id 와 제품의 id 가 일치하는지 확인 후 return
  }

  return false;
}

async function getProduct(id: number) {
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

  console.log(product);

  return product;
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
  const product = await getProduct(id);
  if (!product) {
    // product 가 null 일 경우
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
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
          <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
            Delete product
          </button>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
