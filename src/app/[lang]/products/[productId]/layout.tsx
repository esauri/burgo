import type { ReactNode } from "react";
import { DEFAULT_LOCALE, LOCALES } from "~/constants/i18n";
import type { Language } from "~/types/Language";
import { initializeI18n } from "~/usecases/i18n";
import { getProduct } from "~/usecases/products";
import { Header } from "./_components/Header";

type Props = Readonly<{
  children: ReactNode;
  params: Promise<{
    lang: Language;
    productId: string;
  }>;
}>;

export async function generateMetadata(props: Props) {
  const [{ productId }] = await Promise.all([props.params]);
  const product = await getProduct(productId);

  return {
    alternates: {
      canonical: `/${DEFAULT_LOCALE}/products/${product.id}`,
      languages: Object.fromEntries(
        LOCALES.filter((lang) => lang !== DEFAULT_LOCALE).map((lang) => [
          lang,
          `/${lang}/products/${product.id}`,
        ]),
      ),
    },
    description: product.description,
    title: product.name,
    openGraph: {
      images: product.image,
      siteName: "Burgo",
    },
  };
}

export default async function ProductDetailLayout(props: Props) {
  const [{ lang, productId }] = await Promise.all([props.params]);
  const product = await getProduct(productId);
  initializeI18n(lang);
  const { children } = props;

  return (
    <>
      <Header lang={lang} product={product} />
      {children}
    </>
  );
}
