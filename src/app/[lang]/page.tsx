import { Trans } from "@lingui/react/macro";
import { MainContent } from "~/components/MainContent";
import { Text } from "~/components/Text";
import type { Language } from "~/types/Language";
import { initializeI18n } from "~/usecases/i18n";
import { getProducts } from "~/usecases/products";
import { ProductCard } from "./_components/ProductCard";

type Props = {
  params: Promise<{
    lang: Language;
  }>;
};

export default async function ProductListingsPage(props: Props) {
  const [{ lang }] = await Promise.all([props.params]);
  const products = await getProducts();
  initializeI18n(lang);

  return (
    <MainContent>
      <Text variant="title-lg">
        <Trans>Burgo Menu</Trans>
      </Text>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={`products:${product.id}`}
            lang={lang}
            prioritizeThumbnail={3 > index}
            product={product}
          />
        ))}
      </section>
    </MainContent>
  );
}
