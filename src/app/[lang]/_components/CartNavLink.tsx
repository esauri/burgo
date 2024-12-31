import { Trans } from "@lingui/react/macro";
import { ShoppingCartIcon } from "lucide-react";
import NextLink from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { cn } from "~/helpers/cn";
import type { CartItem } from "~/types/Cart";
import { Language } from "~/types/Language";
import { Tab } from "./Tab";

type Props = {
  cartPromise: Promise<CartItem[]>;
  lang: Language;
};

export function CartHeaderLink({ cartPromise }: Props) {
  return (
    <div className="relative flex active:scale-95">
      <NextLink
        className="focus-visible:ring-muted hover:bg-muted/20 rounded-full p-2 transition focus-visible:ring focus-visible:ring-offset-2 focus-visible:outline-none"
        href="/cart"
      >
        <span className="sr-only">
          <Trans>View Cart</Trans>
        </span>
        <ShoppingCartIcon className="size-6" />
      </NextLink>
      <Suspense>
        <CartIndicatior cartPromise={cartPromise} className="top-0 right-0" />
      </Suspense>
    </div>
  );
}

export function CartTab({ cartPromise }: Props) {
  return (
    <Tab href="/cart">
      <span className="sr-only">
        <Trans>Go to Cart</Trans>
      </span>
      <div className="relative flex active:scale-90">
        <ShoppingCartIcon className="size-6" />
        <Suspense>
          <CartIndicatior
            cartPromise={cartPromise}
            className="-top-2 -right-2"
          />
        </Suspense>
      </div>
    </Tab>
  );
}

type CartIndicatiorProps = Pick<Props, "cartPromise"> & { className: string };

async function CartIndicatior({ cartPromise, className }: CartIndicatiorProps) {
  await connection();

  try {
    const cart = await cartPromise;

    const count = cart.length;

    if (!count) return null;

    return (
      <span
        className={cn([
          "text-primary-foreground bg-primary absolute inline-flex size-4.5 items-center justify-center rounded-full text-xs leading-none",
          className,
        ])}
      >
        <span className="sr-only">
          <Trans>Items in cart:</Trans>
        </span>
        {Math.min(count, 99)}
      </span>
    );
  } catch {
    return null;
  }
}
