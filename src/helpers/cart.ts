import { z } from "zod";
import { UPDATE_CART_INTENT } from "~/constants/cart";
import type { CartItem } from "~/types/Cart";

export const UpdateCartActionSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal(UPDATE_CART_INTENT.CLEAR),
  }),
  z.object({
    intent: z.literal(UPDATE_CART_INTENT.DECREMENT),
    productId: z.string(),
  }),
  z.object({
    intent: z.literal(UPDATE_CART_INTENT.INCREMENT),
    productId: z.string(),
  }),
  z.object({
    intent: z.literal(UPDATE_CART_INTENT.REMOVE),
    productId: z.string(),
  }),
]);

type Action = z.infer<typeof UpdateCartActionSchema>;

export function updateCartReducer(cart: CartItem[], action: Action) {
  switch (action.intent) {
    case UPDATE_CART_INTENT.CLEAR:
      return [];
    case UPDATE_CART_INTENT.DECREMENT:
      return cart.reduce((acc: CartItem[], item) => {
        if (item.productId === action.productId) {
          const updatedCartItem = {
            ...item,
            quantity: Math.max(item.quantity - 1, 0),
          };

          if (updatedCartItem.quantity > 0) {
            acc.push(updatedCartItem);
          }
        } else {
          acc.push(item);
        }

        return acc;
      }, []);
    case UPDATE_CART_INTENT.INCREMENT:
      return cart.map((item) => {
        if (item.productId !== action.productId) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      });
    case UPDATE_CART_INTENT.REMOVE:
      return cart.filter((item) => item.productId !== action.productId);
    default:
      return cart;
  }
}
