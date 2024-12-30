import "server-only";
import { cache } from "react";
import { z } from "zod";
import { config } from "~/config/server";
import { ProductNotFoundError } from "~/helpers/errors";
import { filterByArraySchema } from "~/helpers/zod";
import { type Product, ProductSchema } from "~/types/Product";

const { PRODUCTS_API_URL } = config;

const parseProducts = filterByArraySchema<Product>(ProductSchema);

const ProductsRequestSchema = z.object({
  products: z
    .array(z.unknown())
    .transform((products) => parseProducts(products)),
});

async function uncached_getProducts() {
  const response = await fetch(PRODUCTS_API_URL, { cache: "force-cache" });

  if (!response.ok) {
    console.warn("[getProducts] Error requesting products %j", response.status);

    return [];
  }

  const data = await response.json();

  const parsedData = ProductsRequestSchema.safeParse(data);

  if (!parsedData.success) {
    console.warn(
      "[getProducts] Error parsing products %j",
      parsedData.error.message,
    );

    return [];
  }

  return parsedData.data.products;
}

export const getProducts = cache(uncached_getProducts);

async function uncached_getProduct(productId: string): Promise<Product> {
  const products = await getProducts();

  const product = products.find((product) => product.id === productId);

  if (!product) {
    console.warn("[getProduct] Product not found %j", productId);

    throw new ProductNotFoundError();
  }

  return product;
}

export const getProduct = cache(uncached_getProduct);
