import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Image } from "@unpic/react";
import { DollarSignIcon, FlameIcon } from "lucide-react";
import { SubmitButton } from "~/components/Pressable";
import { Text } from "~/components/Text";
import { Product } from "~/types/Product";

type Props = {
  product: Product;
};

export function ProductDetail({ product }: Props) {
  const { i18n } = useLingui();
  const { calorie, description, image, name, price } = product;

  return (
    <article className="grid gap-y-4 lg:grid-cols-2 lg:gap-x-8">
      {/* Details */}
      <div className="flex flex-col gap-4 lg:max-w-lg lg:self-end">
        <Text variant="title-lg">{name}</Text>
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
              <DollarSignIcon className="size-4" />
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
      </div>

      {/* Image */}
      <figure className="lg:col-start-2 lg:row-span-2 lg:self-center">
        <Image
          alt={i18n._(msg`Image of ${name}`)}
          aspectRatio={1}
          breakpoints={[256, 304, 320, 327, 354, 382, 592]}
          className="aspect-square w-full rounded-xl object-cover"
          layout="fullWidth"
          priority
          src={image}
        />
      </figure>

      {/* Form */}
      <form className="mt-4 grid lg:col-start-1 lg:row-start-2 lg:mt-10 lg:max-w-lg lg:self-start">
        <SubmitButton disabled pending={false} variant="filled">
          <Trans>Add To Cart</Trans>
        </SubmitButton>
      </form>
    </article>
  );
}
