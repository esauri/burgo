import { Trans } from "@lingui/react/macro";
import { connection } from "next/server";
import { MainContent } from "~/components/MainContent";
import { Text } from "~/components/Text";
import type { Language } from "~/types/Language";
import { getCartProducts } from "~/usecases/cart";
import { initializeI18n } from "~/usecases/i18n";
import { CartForm } from "./_components/CartForm";

type Props = {
  params: Promise<{ lang: Language }>;
};

export default async function CartPage(props: Props) {
  const [{ lang }, cartProducts] = await Promise.all([
    props.params,
    getCartProducts(),
    connection(),
  ]);

  initializeI18n(lang);

  return (
    <MainContent>
      <Text variant="title-lg">
        <Trans>Shopping Cart</Trans>
      </Text>
      <CartForm cartProducts={cartProducts} lang={lang} />
    </MainContent>
  );
}
