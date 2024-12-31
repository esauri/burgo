import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Card } from "~/components/Card";
import {
  PressableCardContainer,
  PressableCardLink,
} from "~/components/PressableCard";
import { Text } from "~/components/Text";
import { Language } from "~/types/Language";
import type { Product } from "~/types/Product";

type Props = {
  lang: Language;
  prioritizeThumbnail: boolean;
  product: Pick<
    Product,
    "description" | "id" | "image" | "name" | "price" | "slug"
  >;
};

export function ProductCard({ lang, prioritizeThumbnail, product }: Props) {
  const { i18n } = useLingui();
  const { description, id, image, name, price, slug } = product;
  const href = `/${lang}/products/${id}/${slug}`;

  return (
    <PressableCardContainer
      className="group/card cursor-pointer"
      href={href}
      title={name}
    >
      <Card.Thumbnail
        alt={i18n._(msg`Image of ${name}`)}
        className="transition-transform group-hover/card:scale-110"
        priority={prioritizeThumbnail}
        src={image}
      />
      <Card.Content>
        <Card.Title>
          <PressableCardLink
            className="group-hover/card:text-primary"
            href={href}
          >
            {name}
          </PressableCardLink>
        </Card.Title>
        <Text as="p" className="text-muted" variant="label">
          {i18n.number(price / 100, {
            currency: "USD",
            style: "currency",
          })}
        </Text>
        <Card.Description className="line-clamp-3">
          {description}
        </Card.Description>
      </Card.Content>
    </PressableCardContainer>
  );
}
