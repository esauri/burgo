import { msg } from "@lingui/core/macro";
import { ERROR_CODE } from "~/constants/errors";
import type { ErrorCode } from "~/types/Error";

export function getErrorMessageFromCode(code: ErrorCode) {
  switch (code) {
    case ERROR_CODE.ACCOUNT_ALREADY_EXISTS:
      return msg`An account with this email already exists`;
    case ERROR_CODE.CHANGE_LOCALE_ERROR:
      return msg`Failed to change locale`;
    case ERROR_CODE.CREATE_ACCOUNT_ERROR:
      return msg`Failed to create account`;
    case ERROR_CODE.INVALID_FORM_DATA:
      return msg`Invalid form data`;
    case ERROR_CODE.INVALID_QUANTITY:
      return msg`Please select a valid quantity`;
    case ERROR_CODE.INVALID_USER:
      return msg`User has invalid data`;
    case ERROR_CODE.LOCALE_NOT_SUPPORTED:
      return msg`Locale not supported`;
    case ERROR_CODE.LOGIN_ERROR:
      return msg`Invalid email or password`;
    case ERROR_CODE.LOGOUT_ERROR:
      return msg`Failed to log out`;
    case ERROR_CODE.NOT_AUTHENTICATED:
      return msg`You must be logged in to access this content`;
    case ERROR_CODE.PRODUCT_NOT_FOUND:
      return msg`Product not found`;
    case ERROR_CODE.SET_CART_ERROR:
      return msg`Unable to update cart`;
  }
}

export class InternalError extends Error {
  code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);

    this.code = code;
  }
}

export class AccountAlreadyExistsError extends InternalError {
  constructor(message = "An account with this email already exists") {
    super(message, ERROR_CODE.ACCOUNT_ALREADY_EXISTS);
  }
}

export class AuthenticationError extends InternalError {
  constructor(message = "You must be logged in to access this content") {
    super(message, ERROR_CODE.NOT_AUTHENTICATED);
  }
}

export class InvalidFormDataError extends InternalError {
  constructor(message = "Invalid form data") {
    super(message, ERROR_CODE.INVALID_FORM_DATA);
  }
}

export class InvalidQuantityError extends InternalError {
  constructor(message = "Please select a valid quantity") {
    super(message, ERROR_CODE.INVALID_QUANTITY);
  }
}

export class InvalidUserError extends InternalError {
  constructor(message = "User has invalid data") {
    super(message, ERROR_CODE.INVALID_USER);
  }
}

export class LoginError extends InternalError {
  constructor(message = "Invalid email or password") {
    super(message, ERROR_CODE.LOGIN_ERROR);
  }
}

export class LogoutError extends InternalError {
  constructor(message = "Failed to log out") {
    super(message, ERROR_CODE.LOGOUT_ERROR);
  }
}

export class ProductNotFoundError extends InternalError {
  constructor(message = "Product not found") {
    super(message, ERROR_CODE.PRODUCT_NOT_FOUND);
  }
}

export class SetCartError extends InternalError {
  constructor(message = "Unable to update cart") {
    super(message, ERROR_CODE.SET_CART_ERROR);
  }
}
