import { z } from "zod";

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
