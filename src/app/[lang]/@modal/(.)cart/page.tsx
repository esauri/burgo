import { Trans } from "@lingui/react/macro";
import { connection } from "next/server";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/Drawer";
import { Button } from "~/components/Pressable";
import type { Language } from "~/types/Language";
import { getCartProducts } from "~/usecases/cart";
import { initializeI18n } from "~/usecases/i18n";
import { CartForm } from "../../cart/_components/CartForm";

type Props = {
  params: Promise<{ lang: Language }>;
};

export default async function CartModal(props: Props) {
  const [{ lang }, cartProducts] = await Promise.all([
    props.params,
    getCartProducts(),
    connection(),
  ]);

  initializeI18n(lang);

  return (
    <DrawerContent className="max-md:h-[80%] md:inset-x-auto md:right-0 md:bottom-0 md:h-svh md:w-100 md:rounded-l-xl md:rounded-tr-none lg:w-200">
      <DrawerHeader>
        <DrawerTitle>
          <Trans>Shopping Cart</Trans>
        </DrawerTitle>
        <DrawerDescription>
          <Trans>Review your order before checkout</Trans>
        </DrawerDescription>
      </DrawerHeader>
      <div className="flex-1 overflow-y-auto px-4">
        <CartForm cartProducts={cartProducts} lang={lang} />
      </div>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="outline">
            <Trans>Close</Trans>
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
}
