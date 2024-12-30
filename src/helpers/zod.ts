import { z } from "zod";

export function getFieldErrorMessageFromZodError<
  T extends Record<string, unknown>,
>(error: z.ZodError<T>, fieldName: keyof T) {
  return error.formErrors.fieldErrors[fieldName]?.join(". ");
}

/**
 * Parses an array of items and removes any item that fail to parse
 *
 * Ej.
 *
 * ```ts
 * const parseNumbers = filterBySchema(z.number());
 * parseNumbers(["a", 1, "c", 3, false]); // [1, 3]
 * ```
 * @returns
 */
function filterBySchema<TData>(schema: z.ZodSchema<TData>) {
  return function (items: unknown[]) {
    return items.reduce((parsedItems: TData[], currentItem: unknown) => {
      const parsedItem = schema.safeParse(currentItem);

      if (parsedItem.success) {
        parsedItems.push(parsedItem.data);
      } else {
        console.log("Failed to parse item", currentItem, parsedItem.error);
      }

      return parsedItems;
    }, []);
  };
}

/**
 * Parses data as an array and removes any items that fail to parse
 *
 * Ej.
 *
 * ```ts
 * const parseNumbers = filterByArraySchema(z.number());
 * parseNumbers(["a", 1, "c", 3, false]); // [1, 3]
 * ```
 * @returns
 */
export function filterByArraySchema<TData>(schema: z.ZodSchema) {
  return function (data: unknown) {
    const parser = filterBySchema<TData>(schema);
    const UnknownArray = z.array(z.unknown()).transform(parser);
    const parsedUnknownArray = UnknownArray.safeParse(data);

    if (!parsedUnknownArray.success) return [];

    return parsedUnknownArray.data;
  };
}
