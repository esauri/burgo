"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { Image } from "@unpic/react";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
} from "react";
import { toast } from "sonner";
import { Button, Link, PressableContainer } from "~/components/Pressable";
import { Text } from "~/components/Text";
import { UPDATE_CART_INTENT } from "~/constants/cart";
import { ERROR_CODE } from "~/constants/errors";
import { FORM_STATE_STATUS } from "~/constants/formState";
import { UpdateCartActionSchema, updateCartReducer } from "~/helpers/cart";
import { getErrorMessageFromCode } from "~/helpers/errors";
import type { CartProduct } from "~/types/Cart";
import type { Language } from "~/types/Language";
import { type UpdateCartFormState, updateCartAction } from "../actions";

const INITIAL_CART_STATE: UpdateCartFormState = {
  cart: [],
  status: FORM_STATE_STATUS.INITIAL,
};

type Props = {
  cartProducts: CartProduct[];
  lang: Language;
};

export function CartForm({ cartProducts: _cartProducts, lang }: Props) {
  const { i18n, t } = useLingui();
  const [updateCartState, updateCart] = useActionState(updateCartAction, {
    ...INITIAL_CART_STATE,
    cart: _cartProducts.map(({ productId, quantity }) => ({
      productId,
      quantity,
    })),
  });

  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    updateCartState.cart,
    updateCartReducer,
  );

  const cartProducts = useMemo(() => {
    const cartProductMap = new Map(
      _cartProducts.map((cartProduct) => [cartProduct.productId, cartProduct]),
    );

    return optimisticCart.reduce((acc: CartProduct[], item) => {
      const cartProduct = cartProductMap.get(item.productId);

      if (cartProduct) {
        acc.push({
          ...cartProduct,
          quantity: item.quantity,
        });
      }

      return acc;
    }, []);
  }, [_cartProducts, optimisticCart]);

  const totalPrice = cartProducts.reduce((acc: number, item) => {
    return item.price * item.quantity + acc;
  }, 0);

  const formAction = useCallback(
    (formData: FormData) => {
      const parsedFormData = UpdateCartActionSchema.safeParse({
        intent: formData.get("intent"),
        productId: formData.get("productId"),
      });

      if (!parsedFormData.success) {
        console.warn("[formAction] error parsing form data %j", parsedFormData);

        toast.error(t(getErrorMessageFromCode(ERROR_CODE.SET_CART_ERROR)));

        return;
      }

      const action = parsedFormData.data;

      updateOptimisticCart(action);

      updateCart(formData);
    },
    [t, updateCart, updateOptimisticCart],
  );

  useEffect(() => {
    if (updateCartState.status === FORM_STATE_STATUS.ERROR) {
      toast.error(t(getErrorMessageFromCode(updateCartState.errorCode)));
    }
  }, [updateCartState, t]);

  if (cartProducts.length === 0) {
    return <EmptyState lang={lang} />;
  }

  return (
    <section className="@container flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Text variant="title-sm">
          <Trans>Your items</Trans>
        </Text>
        <form action={formAction}>
          <Button
            name="intent"
            value={UPDATE_CART_INTENT.CLEAR}
            variant="destructive"
            type="submit"
          >
            <Trans>Clear Cart</Trans>
          </Button>
        </form>
      </div>
      <ul className="flex flex-col gap-4">
        {cartProducts.map((cartProduct) => (
          <li key={`cart-products:${cartProduct.productId}`}>
            <ProductItem {...cartProduct} formAction={formAction} />
          </li>
        ))}
        <li className="flex items-center justify-between py-4">
          <Text as="label" variant="title-sm">
            <Trans>Total:</Trans>{" "}
          </Text>
          <Text as="span" className="text-primary" variant="title-sm">
            {i18n.number(totalPrice / 100, {
              currency: "USD",
              style: "currency",
            })}
          </Text>
        </li>
      </ul>
    </section>
  );
}

type ProductForm = CartProduct & {
  formAction: (formData: FormData) => void;
};

function ProductItem({
  formAction,
  image,
  name,
  productId,
  price,
  quantity,
}: ProductForm) {
  const { i18n, t } = useLingui();
  const quantityAfterDecrement = Math.max(quantity - 1, 0);
  const quantityAfterIncrement = quantity + 1;
  const totalPrice = price * quantity;

  return (
    <section className="flex flex-col justify-between gap-3 @lg:flex-row">
      <div className="flex items-center gap-3">
        <Image
          alt={t`Image of ${name}`}
          aspectRatio={1}
          className="rounded-full"
          layout="fixed"
          height={56}
          priority
          src={image}
          width={56}
        />
        <Text as="p" className="col-span-2" variant="title-sm">
          {name}
        </Text>
      </div>
      <div className="flex items-center justify-between gap-x-6">
        <Text as="p" variant="label">
          {i18n.number(totalPrice / 100, {
            currency: "USD",
            style: "currency",
          })}
        </Text>
        <form action={formAction} className="flex items-center gap-3">
          <input name="productId" readOnly type="hidden" value={productId} />
          <div className="flex items-center justify-between overflow-hidden rounded-sm">
            <Button
              aria-label={t`Decrement quantity of ${name} to ${quantityAfterDecrement}`}
              disabled={quantity === 1}
              name="intent"
              title={t`Decrement quantity of ${name} to ${quantityAfterDecrement}`}
              type="submit"
              value={UPDATE_CART_INTENT.DECREMENT}
              variant="icon"
            >
              <MinusIcon className="size-6" />
            </Button>
            <span className="bg-card text-card-foreground w-16 flex-1 py-3 text-center md:w-24">
              <span className="sr-only">
                <Trans>Quantity:</Trans>
              </span>
              {quantity}
            </span>
            <Button
              aria-label={t`Increment quantity of ${name} to ${quantityAfterIncrement}`}
              name="intent"
              title={t`Increment quantity of ${name} to ${quantityAfterIncrement}`}
              type="submit"
              value={UPDATE_CART_INTENT.INCREMENT}
              variant="icon"
            >
              <PlusIcon className="size-6" />
            </Button>
          </div>
          <Button
            name="intent"
            type="submit"
            value={UPDATE_CART_INTENT.REMOVE}
            variant="destructive"
            title={t`Remove ${name}`}
          >
            <Trash2Icon className="size-4" />
            <span className="sr-only">
              <Trans>Remove {name}</Trans>
            </span>
          </Button>
        </form>
      </div>
    </section>
  );
}

function EmptyState({ lang }: Pick<Props, "lang">) {
  return (
    <section className="flex flex-col gap-3">
      <Text variant="body-lg">
        <Trans>Your cart is empty</Trans>
      </Text>
      <PressableContainer>
        <Link href={`/${lang}`} variant="filled">
          <Trans>Continue Shopping</Trans>
        </Link>
      </PressableContainer>
    </section>
  );
}
