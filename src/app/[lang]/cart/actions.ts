"use server";

import { ERROR_CODE } from "~/constants/errors";
import { FORM_STATE_STATUS } from "~/constants/formState";
import { UpdateCartActionSchema, updateCartReducer } from "~/helpers/cart";
import { InternalError } from "~/helpers/errors";
import { type CartItem } from "~/types/Cart";
import type { ErrorCode } from "~/types/Error";
import type { FormStateStatus } from "~/types/FormState";
import { getCart, setCart } from "~/usecases/cart";

export type UpdateCartFormState =
  | {
      cart: CartItem[];
      status: Extract<FormStateStatus, "INITIAL">;
    }
  | {
      cart: CartItem[];
      errorCode: ErrorCode;
      message: string;
      status: Extract<FormStateStatus, "ERROR">;
    }
  | {
      cart: CartItem[];
      message: string;
      status: Extract<FormStateStatus, "SUCCESS">;
      timestamp: number;
    };

export async function updateCartAction(
  _formState: UpdateCartFormState | undefined,
  formData: FormData,
) {
  const cart = await getCart();

  const parsedFormData = UpdateCartActionSchema.safeParse({
    intent: formData.get("intent"),
    productId: formData.get("productId"),
  });

  if (!parsedFormData.success) {
    console.warn("[updateCart] error parsing form data %j", parsedFormData);

    return {
      cart,
      errorCode: ERROR_CODE.SET_CART_ERROR,
      message: "Unable to update cart",
      status: FORM_STATE_STATUS.ERROR,
    };
  }

  const action = parsedFormData.data;

  try {
    const updatedCart = updateCartReducer(cart, action);

    await setCart(updatedCart);

    return {
      cart: updatedCart,
      message: "Cart updated",
      status: FORM_STATE_STATUS.SUCCESS,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("[updateCart] error updating cart %j", error);

    const errorCode =
      error instanceof InternalError ? error.code : ERROR_CODE.SET_CART_ERROR;

    const message =
      error instanceof Error ? error.message : "Unable to update cart";

    return {
      cart,
      errorCode,
      message,
      status: FORM_STATE_STATUS.ERROR,
    };
  }
}
