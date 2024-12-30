import { getProducts } from "~/usecases/products";

export { default } from "../page";

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    productId: product.id,
    productSlug: product.slug,
  }));
}
