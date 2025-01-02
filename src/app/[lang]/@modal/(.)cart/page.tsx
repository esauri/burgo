import { Trans } from "@lingui/react/macro";
import { connection } from "next/server";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
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
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <DrawerTitle>
          <Trans>Shopping Cart</Trans>
        </DrawerTitle>
        <DrawerDescription>
          <Trans>Review your order before checkout</Trans>
        </DrawerDescription>
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
