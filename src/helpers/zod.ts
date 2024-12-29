import { z } from "zod";

export function getFieldErrorMessageFromZodError<
  T extends Record<string, unknown>,
>(error: z.ZodError<T>, fieldName: keyof T) {
  return error.formErrors.fieldErrors[fieldName]?.join(". ");
}
