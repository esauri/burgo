"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { MinusIcon, PlusIcon } from "lucide-react";
import { type ChangeEvent, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { SubmitButton } from "~/components/Pressable";
import { Text } from "~/components/Text";
import { TextField } from "~/components/TextField";
import { ERROR_CODE } from "~/constants/errors";
import { FORM_STATE_STATUS } from "~/constants/formState";
import { getErrorMessageFromCode } from "~/helpers/errors";
import { Product } from "~/types/Product";
import { addToCartAction } from "../actions";

type Props = {
  productId: Product["id"];
  productName: Product["name"];
};

export function AddToCartForm({ productId, productName }: Props) {
  const [addToCartState, addToCart, isAddToCartPending] = useActionState(
    addToCartAction,
    undefined,
  );
  const { t } = useLingui();

  useEffect(() => {
    if (addToCartState && addToCartState.status === FORM_STATE_STATUS.ERROR) {
      toast.error(t(getErrorMessageFromCode(addToCartState.errorCode)));
    } else if (
      addToCartState &&
      addToCartState.status === FORM_STATE_STATUS.SUCCESS
    ) {
      toast.success(t`Added ${productName} to cart`);
    }
  }, [addToCartState, productName, t]);

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
    <div className="flex items-center justify-between">
      <button
        aria-label={t`Decrease quantity by 1`}
        className="bg-primary disabled:text-disabled-foreground text-primary-foreground disabled:bg-disabled rounded-l-sm p-3 hover:opacity-80 active:scale-95"
        disabled={count === min}
        onClick={() => handleSetCount(count - 1)}
        type="button"
      >
        <MinusIcon className="size-6" />
      </button>
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
      <button
        aria-label={t`Increase quantity by 1`}
        className="bg-primary text-primary-foreground disabled:text-disabled-foreground disabled:bg-disabled rounded-r-sm p-3 hover:opacity-80 active:scale-95"
        disabled={count === max}
        onClick={() => handleSetCount(count + 1)}
        type="button"
      >
        <PlusIcon className="size-6" />
      </button>
    </div>
  );
}
