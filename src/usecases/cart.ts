import "server-only";
import { cookies } from "next/headers";
import { config } from "~/config/server";
import { SetCartError } from "~/helpers/errors";
import { filterByArraySchema } from "~/helpers/zod";
import { type CartItem, CartItemSchema, type CartProduct } from "~/types/Cart";
import { getProducts } from "./products";

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

    const maxAge = cart.length > 0 ? 86400 * 7 : 0;

    cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
      domain: COOKIE_STORAGE_DOMAIN,
      httpOnly: true,
      maxAge,
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

export async function getCartProducts() {
  const [cartResponse, productsResponse] = await Promise.allSettled([
    getCart(),
    getProducts(),
  ]);

  const cart = cartResponse.status === "fulfilled" ? cartResponse.value : [];
  const products =
    productsResponse.status === "fulfilled" ? productsResponse.value : [];

  const productMap = new Map(products.map((product) => [product.id, product]));

  return cart.reduce((acc: CartProduct[], item) => {
    const product = productMap.get(item.productId);

    if (product) {
      acc.push({
        image: product.image,
        name: product.name,
        price: product.price,
        slug: product.slug,
        ...item,
      });
    }

    return acc;
  }, []);
}
