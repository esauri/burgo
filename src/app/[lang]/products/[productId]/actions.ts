"use server";

import { ERROR_CODE } from "~/constants/errors";
import { FORM_STATE_STATUS } from "~/constants/formState";
import { InternalError } from "~/helpers/errors";
import { getFieldErrorMessageFromZodError } from "~/helpers/zod";
import { CartItemSchema } from "~/types/Cart";
import type { ErrorCode } from "~/types/Error";
import type { FormStateStatus } from "~/types/FormState";
import { getCart, setCart } from "~/usecases/cart";

type AddToCartFormState =
  | {
      status: Extract<FormStateStatus, "INITIAL">;
    }
  | {
      errorCode: ErrorCode;
      message: string;
      status: Extract<FormStateStatus, "ERROR">;
    }
  | {
      message: string;
      status: Extract<FormStateStatus, "SUCCESS">;
      timestamp: number;
    };

export async function addToCartAction(
  _formState: AddToCartFormState | undefined,
  formData: FormData,
) {
  const parsedFormData = CartItemSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
  });

  if (!parsedFormData.success) {
    console.warn(
      "[addToCartAction] error parsing form data %j",
      parsedFormData,
    );

    const quantityError = getFieldErrorMessageFromZodError(
      parsedFormData.error,
      "quantity",
    );

    return {
      errorCode: quantityError
        ? ERROR_CODE.INVALID_QUANTITY
        : ERROR_CODE.INVALID_FORM_DATA,
      message: "Unable to add to cart",
      status: FORM_STATE_STATUS.ERROR,
    };
  }

  const item = parsedFormData.data;

  try {
    const existingCart = await getCart();

    const existingCartMap = new Map(
      existingCart.map((item) => [item.productId, item]),
    );

    const existingCartItem = existingCartMap.get(item.productId);

    if (existingCartItem) {
      existingCartItem.quantity += item.quantity;
    } else {
      existingCartMap.set(item.productId, item);
    }

    await setCart(Array.from(existingCartMap.values()));

    return {
      message: "Added to cart!",
      status: FORM_STATE_STATUS.SUCCESS,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("[addToCart] error adding to cart %j", error);

    const errorCode =
      error instanceof InternalError ? error.code : ERROR_CODE.SET_CART_ERROR;

    const message =
      error instanceof Error ? error.message : "Unable to add to cart";

    return {
      errorCode,
      message,
      status: FORM_STATE_STATUS.ERROR,
    };
  }
}
