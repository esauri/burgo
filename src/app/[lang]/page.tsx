import { Trans } from "@lingui/react/macro";
import { z } from "zod";
import { MainContent } from "~/components/MainContent";
import { Link, PressableContainer } from "~/components/Pressable";
import { Text } from "~/components/Text";
import type { Language } from "~/types/Language";
import { Product } from "~/types/Product";
import { initializeI18n } from "~/usecases/i18n";
import { getProducts } from "~/usecases/products";
import { ProductCard } from "./_components/ProductCard";

const SearchParamsSchema = z
  .object({
    q: z.string().trim().toLowerCase().optional(),
  })
  .catch({
    q: undefined,
  });

type SearchParams = z.infer<typeof SearchParamsSchema>;

type Props = {
  params: Promise<{
    lang: Language;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductListingsPage(props: Props) {
  const [{ lang }, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const allProducts = await getProducts();
  initializeI18n(lang);

  const parsedParams = SearchParamsSchema.parse(searchParams);

  const products = getFilteredProducts(allProducts, parsedParams);

  return (
    <MainContent>
      <Text variant="title-lg">
        <Trans>Burgo Menu</Trans>
      </Text>
      {products.length > 0 ? (
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
      ) : (
        <>
          <Text variant="title-sm">
            <Trans>Products not found</Trans>
          </Text>

          {allProducts.length > 0 ? (
            <>
              <Text variant="body-lg">
                <Trans>
                  We were unable to find any products that matched your search.
                </Trans>
              </Text>
              <PressableContainer>
                <Link href={`/${lang}`} variant="filled">
                  <Trans>View all products</Trans>
                </Link>
              </PressableContainer>
            </>
          ) : (
            <Text variant="body-lg">
              <Trans>No products available</Trans>
            </Text>
          )}
        </>
      )}
    </MainContent>
  );
}

function getFilteredProducts(allProducts: Product[], { q }: SearchParams) {
  if (!q) {
    return allProducts;
  }

  return allProducts.filter((product) => {
    return (
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)
    );
  });
}
