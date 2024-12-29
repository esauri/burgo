"use server";

import { z } from "zod";
import { ERROR_CODE } from "~/constants/errors";
import { FORM_STATE_STATUS } from "~/constants/formState";
import { InternalError } from "~/helpers/errors";
import { redirectToLocalizedPath } from "~/helpers/i18n.server";
import { getFieldErrorMessageFromZodError } from "~/helpers/zod";
import type { ErrorCode } from "~/types/Error";
import type { FormStateStatus } from "~/types/FormState";
import { createAccount } from "~/usecases/auth";

type CreateAccountFormState = {
  errorCode: ErrorCode;
  fieldErrors:
    | {
        email: string | undefined;
        name: string | undefined;
        password: string | undefined;
      }
    | undefined;
  message: string;
  status: Extract<FormStateStatus, "ERROR">;
};

const FormDataSchema = z.object({
  email: z.string().email().toLowerCase(),
  name: z.string().min(2, { message: "Please enter your name" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least six characters long." }),
});

export async function createAccountAction(
  _formState: CreateAccountFormState | undefined,
  formData: FormData,
) {
  const parsedFormData = FormDataSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!parsedFormData.success) {
    console.warn("[createAccount] error parsing form data %j", parsedFormData);

    return {
      errorCode: ERROR_CODE.INVALID_FORM_DATA,
      fieldErrors: {
        email: getFieldErrorMessageFromZodError(parsedFormData.error, "email"),
        name: getFieldErrorMessageFromZodError(parsedFormData.error, "name"),
        password: getFieldErrorMessageFromZodError(
          parsedFormData.error,
          "password",
        ),
      },
      message: "Unable to create account",
      status: FORM_STATE_STATUS.ERROR,
    };
  }

  const { data } = parsedFormData;
  const { email, name, password } = data;

  let redirectUrl: string | undefined;

  try {
    await createAccount({
      displayName: name,
      email,
      password,
    });

    redirectUrl = "/account";
  } catch (error) {
    console.error("[createAccount] error creating account %j", error);

    const errorCode =
      error instanceof InternalError
        ? error.code
        : ERROR_CODE.CREATE_ACCOUNT_ERROR;

    const message =
      error instanceof Error ? error.message : "Unable to create account";

    return {
      errorCode,
      fieldErrors: undefined,
      message,
      status: FORM_STATE_STATUS.ERROR,
    };
  } finally {
    if (redirectUrl) {
      await redirectToLocalizedPath(redirectUrl, "replace");
    }
  }
}
