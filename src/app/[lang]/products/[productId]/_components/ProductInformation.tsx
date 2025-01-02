import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { FlameIcon } from "lucide-react";
import { Text } from "~/components/Text";
import { Product } from "~/types/Product";

type Props = Pick<Product, "calorie" | "description" | "price">;

export function ProductInformation({ calorie, description, price }: Props) {
  const { i18n } = useLingui();

  return (
    <section
      aria-labelledby="product-information-heading"
      className="flex flex-col gap-4"
    >
      <Text
        className="sr-only"
        id="product-information-heading"
        variant="title"
      >
        <Trans>Product information</Trans>
      </Text>

      <dl className="flex gap-x-6">
        <Text as="dt" className="sr-only" variant="body">
          <Trans>Price</Trans>
        </Text>

        <dd className="text-primary flex items-center gap-1">
          <Text as="span" variant="label">
            {i18n.number(price / 100, {
              currency: "USD",
              style: "currency",
            })}
          </Text>
        </dd>

        <Text as="dt" className="sr-only" variant="body">
          <Trans>Nutrition</Trans>
        </Text>
        <dd className="flex items-center gap-1">
          <FlameIcon className="size-4" />
          <Text as="span" variant="label">
            <Trans>{calorie} Calories</Trans>
          </Text>
        </dd>
      </dl>

      <Text variant="body-lg">{description}</Text>
    </section>
  );
}
