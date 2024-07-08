import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { unstable_cache as nextCashe } from "next/cache";
/**
 * nextCashe 의 첫 args
 * 1. 비용이 많이 드는 계산, 데이터베이스 query 를 가동시키는 함수
 * 2. 함수가 리턴하는 데이터를 cashe 안에서 식별할 수 있게 해줌
 * 3. 동작 시 'home-products' 에 대한 데이터를 찾으려 함
 */
const getCashedProducts = nextCashe(getInitialProducts, ["home-products"], {
  // 60 초 마다 함수를 재실행 (재 검증)
  revalidate: 60,
});

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}

// page 를 강제로 dynamic 으로 변경
// export const dynamic = "force-dynamic";

// page 를 60초 마다 갱신
// export const revalidate = 60;

export default async function Products() {
  const initialProducts = await getCashedProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
