import { Trans } from "@lingui/react/macro";
import { Link } from "~/components/Pressable";
import type { Language } from "~/types/Language";
import type { Product } from "~/types/Product";

type Props = {
  lang: Language;
  product: Pick<Product, "id" | "name" | "slug">;
};

export function Header({ lang, product }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="container pt-6">
      <ol className="flex items-center gap-x-2" role="list">
        <li className="flex items-center">
          <Link href={`/${lang}`} variant="link">
            <Trans>Products</Trans>
          </Link>
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="ml-2 size-5 shrink-0 opacity-60"
          >
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
          </svg>
        </li>
        <li className="flex items-center">
          <Link
            aria-current="page"
            href={`/${lang}/products/${product.id}/${product.slug}`}
            variant="link"
          >
            {product.name}
          </Link>
        </li>
      </ol>
    </nav>
  );
}
