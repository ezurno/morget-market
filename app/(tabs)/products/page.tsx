import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/db";

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
      created_at: "asc",
    },
  });

  return products;
}

export default async function Products() {
  const initialProducts = await getInitialProducts();
  return <ProductList initialProducts={initialProducts} />;
}
