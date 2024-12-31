import { z } from "zod";
import type { Product } from "./Product";

export const CartItemSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1, { message: "Please select a valid product" }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Please enter a valid quantity" }),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export type CartProduct = CartItem &
  Pick<Product, "image" | "name" | "price" | "slug">;
