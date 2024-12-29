import { notFound } from "next/navigation";
import { MainContent } from "~/components/MainContent";
import { ProductNotFoundError } from "~/helpers/errors";
import type { Language } from "~/types/Language";
import { initializeI18n } from "~/usecases/i18n";
import { getProduct, getProducts } from "~/usecases/products";
import { ProductDetail } from "./_components/ProductDetail";

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    productId: product.id,
  }));
}

type Props = {
  params: Promise<{
    lang: Language;
    productId: string;
  }>;
};

export default async function ProductDetailPage(props: Props) {
  try {
    const [{ lang, productId }] = await Promise.all([props.params]);
    const product = await getProduct(productId);
    initializeI18n(lang);

    return (
      <MainContent>
        <ProductDetail product={product} />
      </MainContent>
    );
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return notFound();
    }

    throw error;
  }
}
