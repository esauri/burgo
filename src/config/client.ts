import { ClientConfigSchema } from "./ClientConfigSchema";
import { env } from "./env";

const parsedEnv = ClientConfigSchema.safeParse(env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors,
  );

  throw new Error("Invalid environment variables");
}

export const config = parsedEnv.data;
