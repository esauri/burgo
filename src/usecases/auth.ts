import "server-only";
import { cache } from "react";
import {
  AccountAlreadyExistsError,
  AuthenticationError,
  InvalidUserError,
  LoginError,
  LogoutError,
} from "~/helpers/errors";
import { createClient } from "~/helpers/supabase.server";
import { UserSchema } from "~/types/User";

async function uncached_getUser() {
  const client = await createClient();
  const response = await client.auth.getUser();

  if (response.error) {
    throw new AuthenticationError(response.error.message);
  }

  const parsedUser = UserSchema.safeParse(response.data.user);

  if (!parsedUser.success) {
    console.warn("[getUser] error parsing user %j", parsedUser.error);

    throw new InvalidUserError(parsedUser.error.message);
  }

  return parsedUser.data;
}

/**
 * Returns the currently authenticated user
 */
export const getUser = cache(uncached_getUser);

type CreateAccountPayload = LoginPayload & { displayName: string };

export async function createAccount({
  displayName,
  email,
  password,
}: CreateAccountPayload) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName,
      },
    },
  });

  if (error) {
    throw new AccountAlreadyExistsError(error.message);
  }

  return true;
}

type LoginPayload = {
  email: string;
  password: string;
};

export async function login({ email, password }: LoginPayload) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new LoginError(error.message);
  }

  return true;
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new LogoutError(error.message);
  }

  return true;
}
