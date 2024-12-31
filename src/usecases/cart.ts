import "server-only";
import { cookies } from "next/headers";
import { config } from "~/config/server";
import { SetCartError } from "~/helpers/errors";
import { filterByArraySchema } from "~/helpers/zod";
import { type CartItem, CartItemSchema } from "~/types/Cart";

const { COOKIE_STORAGE_DOMAIN } = config;
const CART_COOKIE_NAME = "_burgo_cart";

const parseCartItems = filterByArraySchema<CartItem>(CartItemSchema);

export async function getCart() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cookie) {
    return [];
  }

  const data = JSON.parse(cookie);

  return parseCartItems(data);
}

export async function setCart(cart: CartItem[]) {
  try {
    const cookieStore = await cookies();
    const cookie = JSON.stringify(cart);

    cookieStore.set(CART_COOKIE_NAME, cookie, {
      domain: COOKIE_STORAGE_DOMAIN,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return true;
  } catch (error) {
    console.warn("[setCart] Error setting cart %j", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    throw new SetCartError(message);
  }
}
