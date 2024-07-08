import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import { getProduct } from "./actions";
import { getSession } from "@/lib/sessions/session";
import EditForm from "@/components/edit-form";

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

export default async function EditProduct({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const product = await getCachedProduct(id);
  if (!product) return notFound();
  const session = await getSession();
  const isOwner = session.id === product.userId;

  return (
    <div>
      <EditForm id={id} product={product} isOwner={isOwner} />
    </div>
  );
}
