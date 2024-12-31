"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, SubmitButton } from "~/components/Pressable";
import { Text } from "~/components/Text";
import { TextField } from "~/components/TextField";
import { ERROR_CODE } from "~/constants/errors";
import { FORM_STATE_STATUS } from "~/constants/formState";
import { getErrorMessageFromCode } from "~/helpers/errors";
import type { Language } from "~/types/Language";
import { Product } from "~/types/Product";
import { addToCartAction } from "../actions";

type Props = {
  lang: Language;
  productId: Product["id"];
  productName: Product["name"];
};

export function AddToCartForm({ lang, productId, productName }: Props) {
  const [addToCartState, addToCart, isAddToCartPending] = useActionState(
    addToCartAction,
    undefined,
  );
  const { t } = useLingui();
  const { push } = useRouter();

  useEffect(() => {
    if (addToCartState && addToCartState.status === FORM_STATE_STATUS.ERROR) {
      toast.error(t(getErrorMessageFromCode(addToCartState.errorCode)));
    } else if (
      addToCartState &&
      addToCartState.status === FORM_STATE_STATUS.SUCCESS
    ) {
      toast.success(t`Added ${productName} to cart`, {
        action: {
          label: t`View Cart`,
          onClick: () => push(`/${lang}/cart`),
        },
      });
    }
  }, [addToCartState, lang, productName, push, t]);

  return (
    <form action={addToCart}>
      <fieldset className="grid gap-3" disabled={isAddToCartPending}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <Text as="label" className="block" htmlFor="quantity" variant="label">
            <Trans>Quantity</Trans>
          </Text>
          <Counter
            key={
              addToCartState?.timestamp
                ? `counter:${addToCartState.timestamp}`
                : undefined
            }
            id="quantity"
            max={50}
            name="quantity"
          />
        </div>
        {addToCartState &&
          addToCartState.errorCode === ERROR_CODE.INVALID_QUANTITY && (
            <Text className="text-destructive" variant="body-sm">
              {t(getErrorMessageFromCode(addToCartState.errorCode))}
            </Text>
          )}
        <input name="productId" readOnly type="hidden" value={productId} />
        <SubmitButton pending={isAddToCartPending} variant="filled">
          <Trans>Add To Cart</Trans>
        </SubmitButton>
      </fieldset>
    </form>
  );
}

type CounterProps = {
  defaultValue?: number;
  id?: string;
  min?: number;
  max: number;
  name?: string;
};

function Counter({ defaultValue = 1, id, min = 0, max, name }: CounterProps) {
  const { t } = useLingui();
  const [count, setCount] = useState(defaultValue);

  const quantityAfterDecrement = Math.max(count - 1, 0);
  const quantityAfterIncrement = Math.min(count + 1, max);

  const handleSetCount = (value: number) => {
    setCount(Math.min(Math.max(value, min), max));
  };

  const handleTextInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const valueAsANumber = value ? parseInt(value, 10) : 0;

    if (!isNaN(valueAsANumber)) {
      handleSetCount(valueAsANumber);
    }
  };

  return (
    <div className="flex items-center justify-between overflow-hidden rounded-sm">
      <Button
        aria-label={t`Decrement quantity to ${quantityAfterDecrement}`}
        disabled={count === min}
        onClick={() => handleSetCount(count - 1)}
        title={t`Decrement quantity to ${quantityAfterDecrement}`}
        variant="icon"
      >
        <MinusIcon className="size-6" />
      </Button>
      <TextField
        className="bg-card text-card-foreground flex-1 rounded-none text-center"
        id={id}
        inputMode="numeric"
        placeholder={t`How many?`}
        name={name}
        onChange={handleTextInput}
        type="text"
        value={count}
      />
      <Button
        aria-label={t`Increment quantity to ${quantityAfterIncrement}`}
        disabled={count === max}
        onClick={() => handleSetCount(count + 1)}
        title={t`Increment quantity to ${quantityAfterIncrement}`}
        variant="icon"
      >
        <PlusIcon className="size-6" />
      </Button>
    </div>
  );
}
