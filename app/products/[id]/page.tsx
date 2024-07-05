import db from "@/lib/db";
import { getSession } from "@/lib/sessions/session";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import {
  unstable_cache as nextCashe,
  revalidateTag,
  revalidatePath,
} from "next/cache";

async function getIsOwner(userId: number) {
  // const session = await getSession();
  // //해당 session 에 id 값이 존재 할 경우
  // if (session.id) {
  //   return session.id === userId;
  //   // 해당 id 와 제품의 id 가 일치하는지 확인 후 return
  // }

  return false;
}

async function getProduct(id: number) {
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
  tags: ["product-detail", "xxxx"],
});

const getCashedProductTitle = nextCashe(getProductTitle, ["product-title"], {
  tags: ["product-title", "xxxx"],
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
  const revalidate = async () => {
    "use server";
    // xxxx tag 를 갖는 data fetching
    revalidateTag("xxxx");
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
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Delete product
            </button>
            <form action={revalidate}>
              <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                Revalidate title cache
              </button>
            </form>
          </div>
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
