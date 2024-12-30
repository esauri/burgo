import { z } from "zod";

export const ProductSchema = z.object({
  calorie: z.number(),
  description: z.string(),
  id: z.string(),
  image: z.string(),
  name: z.string(),
  price: z.number(),
  slug: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;
