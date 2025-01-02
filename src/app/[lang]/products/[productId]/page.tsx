import { msg } from "@lingui/core/macro";
import { Image } from "@unpic/react";
import { notFound } from "next/navigation";
import { MainContent } from "~/components/MainContent";
import { Text } from "~/components/Text";
import { ProductNotFoundError } from "~/helpers/errors";
import type { Language } from "~/types/Language";
import { initializeI18n } from "~/usecases/i18n";
import { getProduct, getProducts } from "~/usecases/products";
import { AddToCartForm } from "./_components/AddToCartForm";
import { ProductInformation } from "./_components/ProductInformation";

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
    const i18n = initializeI18n(lang);
    const { calorie, description, image, name, price } = product;

    return (
      <MainContent>
        <article className="grid gap-y-4 lg:grid-cols-2 lg:gap-x-8">
          {/* Details */}
          <div className="flex flex-col gap-4 lg:max-w-lg lg:self-end">
            <Text variant="title-lg">{name}</Text>
            <ProductInformation
              calorie={calorie}
              description={description}
              price={price}
            />
          </div>

          {/* Image */}
          <figure className="lg:col-start-2 lg:row-span-2 lg:self-center">
            <Image
              alt={i18n._(msg`Image of ${name}`)}
              aspectRatio={1}
              breakpoints={[326, 592]}
              className="aspect-square w-full rounded-xl object-cover"
              layout="fullWidth"
              priority
              src={image}
            />
          </figure>

          {/* Form */}
          <aside className="mt-4 lg:col-start-1 lg:row-start-2 lg:mt-10 lg:max-w-lg lg:self-start">
            <AddToCartForm
              lang={lang}
              productId={product.id}
              productName={product.name}
            />
          </aside>
        </article>
      </MainContent>
    );
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return notFound();
    }

    throw error;
  }
}
