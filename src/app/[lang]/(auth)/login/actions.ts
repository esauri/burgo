"use server";

import { z } from "zod";
import { ERROR_CODE } from "~/constants/errors";
import { FORM_STATE_STATUS } from "~/constants/formState";
import { InternalError } from "~/helpers/errors";
import { redirectToLocalizedPath } from "~/helpers/i18n.server";
import { getFieldErrorMessageFromZodError } from "~/helpers/zod";
import type { ErrorCode } from "~/types/Error";
import type { FormStateStatus } from "~/types/FormState";
import { login } from "~/usecases/auth";

type LoginFormState = {
  errorCode: ErrorCode;
  fieldErrors:
    | {
        email: string | undefined;
        password: string | undefined;
      }
    | undefined;
  message: string;
  status: Extract<FormStateStatus, "ERROR">;
};

const FormDataSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least six characters long." }),
});

export async function loginAction(
  _formState: LoginFormState | undefined,
  formData: FormData,
) {
  const parsedFormData = FormDataSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedFormData.success) {
    console.warn("[login] error parsing form data %j", parsedFormData);

    return {
      errorCode: ERROR_CODE.INVALID_FORM_DATA,
      fieldErrors: {
        email: getFieldErrorMessageFromZodError(parsedFormData.error, "email"),
        password: getFieldErrorMessageFromZodError(
          parsedFormData.error,
          "password",
        ),
      },
      message: "Unable to log in",
      status: FORM_STATE_STATUS.ERROR,
    };
  }

  const { data } = parsedFormData;

  let redirectUrl: string | undefined;

  try {
    await login(data);

    redirectUrl = "/account";
  } catch (error) {
    console.error("[login] error logging in %j", error);

    const errorCode =
      error instanceof InternalError ? error.code : ERROR_CODE.LOGIN_ERROR;

    const message = error instanceof Error ? error.message : "Unable to log in";

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
